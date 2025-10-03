import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaSearch, FaSort, FaTrash, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import config from '../../config';

export default function BrandCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const campaignsPerPage = 10;

  // Campaigns will be populated from API

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('BRAND_TOKEN');

      // Fetch campaigns from API
      const res = await axios.get(`${config.BACKEND_URL}/api/brand/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === 'success' && res.data.campaigns) {
        // Transform API data to match frontend expectations
        const transformedCampaigns = res.data.campaigns.map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          status: campaign.status,
          createdAt: campaign.createdAt,
          deadline: campaign.deadline,
          endedAt: campaign.endedAt,
          creators: campaign.applicants || 0,
          approvedCreators: campaign.approved || 0,
          submittedCreators: campaign.submissions || 0,
          productName: campaign.title,
          description: campaign.description,
          budget: campaign.budget,
          targetAudience: campaign.targetAudience,
          requirements: campaign.requirements,
          approvalStatus: campaign?.status,
          submissionRate: campaign.submissionRate || 0
        }));

        setCampaigns(transformedCampaigns);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };



  // Calculate submission rate according to specification
  const calculateSubmissionRate = (campaign) => {
    if (campaign.approvedCreators === 0) return null;
    return Math.round((campaign.submittedCreators / campaign.approvedCreators) * 100);
  };

  // Delete campaign functionality
  const handleDeleteClick = (e, campaign) => {
    e.stopPropagation(); // Prevent card click
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('BRAND_TOKEN');

      // Determine which API to use based on campaign ID type
      let deleteUrl;
      if (typeof campaignToDelete.id === 'number' || (typeof campaignToDelete.id === 'string' && campaignToDelete.id.length < 24)) {
        // Mock campaign - use mock API
        deleteUrl = `${config.BACKEND_URL}/api/brand/campaigns/${campaignToDelete.id}`;
      } else {
        // Real campaign - use real API
        deleteUrl = `${config.BACKEND_URL}/brand/campaign-request/request/${campaignToDelete.id}`;
      }

      const res = await axios.delete(deleteUrl, {
        headers: { authorization: `Bearer ${token}` },
      });

      if (res.data.status === 'success') {
        // Optimistic UI update
        setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id));
        setShowDeleteModal(false);
        setCampaignToDelete(null);
        alert('Campaign deleted successfully');
      } else {
        alert(res.data.message || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    } finally {
      setDeleting(false);
    }
  };

  // Filter and search logic
  const filteredCampaigns = campaigns
    .filter(campaign => {
      if (filterStatus === 'All') return true;
      return campaign.status.toLowerCase() === filterStatus.toLowerCase();
    })
    .filter(campaign => {
      if (!searchTerm) return true;
      return campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (campaign.productName && campaign.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'deadline') {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return (new Date(a.deadline) - new Date(b.deadline)) * multiplier;
      }

      if (sortBy === 'submissionRate') {
        const aRate = calculateSubmissionRate(a) || 0;
        const bRate = calculateSubmissionRate(b) || 0;
        return (aRate - bRate) * multiplier;
      }

      if (sortBy === 'createdAt') {
        return (new Date(a.createdAt) - new Date(b.createdAt)) * multiplier;
      }

      return 0;
    });

  // Pagination
  const indexOfLast = currentPage * campaignsPerPage;
  const indexOfFirst = indexOfLast - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'draft': return '📝';
      case 'completed': return '✅';
      default: return '⚪';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'draft': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const handleCampaignClick = (campaignId) => {
    // Always navigate to the same route as tasks dashboard
      navigate(`/brand/campaigns/${campaignId}`);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-6">
      <Helmet>
        <title>My Campaigns | Matchably</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E0FFFA] mb-2 FontNoto">
            My Campaigns
          </h1>
          <p className="text-gray-400 FontNoto">
            Manage all your registered campaigns
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Active', 'Draft', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 FontNoto ${
                    filterStatus === status
                      ? 'bg-lime-500 text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 FontNoto w-full sm:w-64"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500 FontNoto"
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="createdAt">Sort by Creation Date</option>
                  <option value="submissionRate">Sort by Submission Rate</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <FaSort />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
          </div>
        ) : currentCampaigns.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 FontNoto mb-4">
              {filterStatus === 'All' ? 'No campaigns found' : `No ${filterStatus.toLowerCase()} campaigns found`}
            </p>
            {searchTerm && (
              <p className="text-gray-500 FontNoto">
                Try adjusting your search terms or filters
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentCampaigns.map(campaign => (
                <div
                  key={campaign.id}
                  onClick={() => handleCampaignClick(campaign.id)}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-lime-400/30 transition-all duration-200 cursor-pointer group"
                >
                  {/* Status and Title */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(campaign.status)}</span>
                        <span className={`font-semibold capitalize FontNoto ${getStatusColor(campaign.status)}`}>
                          [{campaign.status}]
                        </span>
                      </div>
                      {/* Delete button for draft campaigns */}
                      {campaign.status === 'draft' && (
                        <button
                          onClick={(e) => handleDeleteClick(e, campaign)}
                          className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/20 rounded transition-colors"
                          title="Delete draft campaign"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#E0FFFA] group-hover:text-lime-400 transition-colors duration-200 FontNoto">
                      {campaign.title}
                    </h3>
                  </div>

                  {/* Dates */}
                  <div className="mb-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 FontNoto">📆 Created:</span>
                      <span className="text-gray-300 FontNoto">{campaign.createdAt}</span>
                      {campaign.deadline && (
                        <>
                          <span className="text-gray-400 FontNoto">| Deadline:</span>
                          <span className="text-gray-300 FontNoto">{campaign.deadline}</span>
                        </>
                      )}
                    </div>
                    {campaign.endedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 FontNoto">🏁 Ended:</span>
                        <span className="text-gray-300 FontNoto">{campaign.endedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-gray-400 FontNoto">👥</span>
                      <span className="text-lime-400 font-semibold FontNoto">{campaign.creators} Creators</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 FontNoto">📈 Submission Rate:</span>
                      <span className="text-lime-400 font-semibold FontNoto">
                        {calculateSubmissionRate(campaign) ? `${calculateSubmissionRate(campaign)}%` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 font-medium py-2 rounded-lg transition-all duration-200 FontNoto border border-lime-500/30 hover:border-lime-500/50">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 FontNoto ${
                      currentPage === index + 1
                        ? 'bg-lime-500 text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1f1f1f] rounded-2xl p-6 w-full max-w-md border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-red-400 FontNoto">
                  Delete Campaign
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-white"
                  disabled={deleting}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 FontNoto mb-4">
                  Are you sure you want to delete the campaign "{campaignToDelete?.title}"?
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm FontNoto">
                    ⚠️ This action cannot be undone. All campaign data will be permanently deleted.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg FontNoto font-medium transition-colors duration-200"
                >
                  {deleting ? 'Deleting...' : 'Delete Campaign'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg FontNoto transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
