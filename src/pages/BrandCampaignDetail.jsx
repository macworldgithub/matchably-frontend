import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from '../config';

export default function BrandCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const token = localStorage.getItem('BRAND_TOKEN');
      const res = await fetch(`${config.BACKEND_URL}/api/brand/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setCampaign(data.campaign);
        }
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      // Mock data for development
      const mockCampaign = {
        id: parseInt(id),
        title: 'Glow Serum Campaign',
        status: id === '3' ? 'draft' : 'active',
        description: 'Promote our new vitamin C glow serum to skincare enthusiasts',
        deadline: '2024-01-15',
        budget: 5000,
        targetAudience: 'Skincare enthusiasts, ages 18-35',
        requirements: 'Must have 10K+ followers, skincare niche',
        applicants: 12,
        submissions: 8,
        approved: 6,
        pending: 2,
        rejected: 0,
        submissionRate: 67,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      };
      setCampaign(mockCampaign);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('BRAND_TOKEN');
      const res = await fetch(`${config.BACKEND_URL}/api/brand/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        navigate('/brand/dashboard');
      } else {
        console.error('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'draft': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'draft': return '📝';
      case 'completed': return '✅';
      default: return '⚪';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-lime-400 text-xl FontNoto">Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl FontNoto font-bold text-[#E0FFFA] mb-2">Campaign Not Found</h2>
          <p className="text-gray-400 FontNoto mb-6">The campaign you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/brand/dashboard')}
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-lg FontNoto font-semibold
              transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilDeadline(campaign.deadline);

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <Helmet>
        <title>{campaign.title} | Brand Dashboard | Matchably</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/brand/dashboard')}
              className="text-gray-400 hover:text-lime-400 transition-colors duration-200"
            >
              ← Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl FontNoto font-bold text-[#E0FFFA] mb-2">
                {campaign.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm FontNoto font-semibold border ${getStatusColor(campaign.status)}`}>
                  <span>{getStatusIcon(campaign.status)}</span>
                  <span className="capitalize">{campaign.status}</span>
                </div>
                {campaign.status === 'active' && (
                  <div className="text-gray-400 FontNoto text-sm">
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                     daysLeft === 0 ? 'Due today' :
                     `${daysLeft} days left`}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {campaign.status === 'draft' && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg FontNoto
                  border border-red-400/30 hover:border-red-400/50 transition-all duration-200 flex items-center gap-2"
              >
                🗑 Delete
              </button>
            )}
            <button
              onClick={() => navigate(`/brand/campaigns/${id}/edit`)}
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-lg FontNoto font-semibold
                transition-colors duration-200"
            >
              Edit Campaign
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'applicants', label: 'Applicants', icon: '👥' },
            { id: 'submissions', label: 'Submissions', icon: '📝' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md FontNoto font-medium transition-all duration-200 flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-lime-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl FontNoto font-bold text-[#E0FFFA] mb-4">Campaign Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 FontNoto text-sm">Description</label>
                    <p className="text-gray-200 FontNoto mt-1">{campaign.description}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 FontNoto text-sm">Target Audience</label>
                    <p className="text-gray-200 FontNoto mt-1">{campaign.targetAudience}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 FontNoto text-sm">Requirements</label>
                    <p className="text-gray-200 FontNoto mt-1">{campaign.requirements}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 FontNoto text-sm">Budget</label>
                      <p className="text-lime-400 FontNoto font-semibold mt-1">${campaign.budget?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 FontNoto text-sm">Deadline</label>
                      <p className="text-gray-200 FontNoto mt-1">{formatDate(campaign.deadline)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg FontNoto font-bold text-[#E0FFFA] mb-4">Campaign Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 FontNoto">Applicants</span>
                    <span className="text-lime-400 FontNoto font-semibold">{campaign.applicants}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 FontNoto">Submissions</span>
                    <span className="text-lime-400 FontNoto font-semibold">{campaign.submissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 FontNoto">Approved</span>
                    <span className="text-green-400 FontNoto font-semibold">{campaign.approved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 FontNoto">Pending</span>
                    <span className="text-yellow-400 FontNoto font-semibold">{campaign.pending}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 FontNoto">Submission Rate</span>
                      <span className="text-lime-400 FontNoto font-semibold">{campaign.submissionRate}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-lime-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${campaign.submissionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tab content would go here */}
        {activeTab !== 'overview' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl FontNoto font-bold text-[#E0FFFA] mb-2">Coming Soon</h3>
            <p className="text-gray-400 FontNoto">
              The {activeTab} section is under development.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl FontNoto font-bold text-[#E0FFFA] mb-2">
                Delete Campaign
              </h3>
              <p className="text-gray-400 FontNoto mb-6">
                Are you sure you want to delete "{campaign.title}"? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg FontNoto
                    transition-colors duration-200 border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCampaign}
                  disabled={deleting}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg FontNoto
                    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Campaign'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
