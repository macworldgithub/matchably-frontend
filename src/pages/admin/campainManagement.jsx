import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import { useCompaign } from "../../state/atoms";
import AddCampaign from "../../components/addCampaign/addCampaign2";
import config from "../../config";
import axios from "axios";
import EditAdminGiftedCampaign from "../../components/addCampaign/editAdminGiftedCampaign";
import EditAdminPaidCampaign from "../../components/addCampaign/editAdminPaidCampaign";

import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AiOutlineEye } from "react-icons/ai"
import CampaignFormWizard from "../../components/addCampaign/addPaidCampaign";

export default function CampaignManagement() {
  const { Campaigns, DeleteCampaign, SetCompaigns, setToEmpty } = useCompaign();
  const [page, setPage] = useState(1);
  const [] = useState(false);
  const [editGiftedModel, setEditGiftedModel] = useState(false);
  const [editPaidModel, setEditPaidModel] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showEditCampaignData, setShowEditCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(new Map());
  const [loadMore, setLoadMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("brandName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [catchBrands, setCatchBrands] = useState([]);
  const [showGiftedModal, setShowGiftedModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);

  // New state for toggle functionality
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('campaignManagementTab') || 'gifted';
  });
  const [expandedBrands, setExpandedBrands] = useState(new Set());
  // Get unique brands for filter dropdown
  const uniqueBrands = catchBrands;

  useEffect(() => {
    async function getBrands() {
      try {
        const token = await Cookie.get("AdminToken");
        const res = await axios.get(
          `${config.BACKEND_URL}/admin/campaigns/brands`,
          {
            headers: {
              authorization: token,
            },
          }
        );
        if (res.data.status === "success") {
          setCatchBrands(res.data.brands);
        }
      } catch {
        //we can handle error here
      }
    }
    getBrands();
  }, []);

  const handleDelete = async (id) => {
    const newMap = new Map(deleteLoading);
    newMap.set(id, true);
    setDeleteLoading(newMap);
    const index = await Campaigns.findIndex((camp) => camp.id === id);

    try {
      const token = Cookie.get("AdminToken");
      const res = await axios.delete(
        `${config.BACKEND_URL}/admin/campaigns/${Campaigns[index].id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (res.data.status === "success") {
        await DeleteCampaign(index);
        toast.success("Campaign deleted successfully", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch {
      toast.error("Failed to delete campaign", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      const newMap = new Map(deleteLoading);
      newMap.delete(index);
      setDeleteLoading(newMap);
    }
  };



  const getCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/admin/campaigns?page=${page}`
      );
      if (res.data.status === "success") {
        SetCompaigns(res.data.campaigns);
        setLoadMore(!res.data.isLastPage);
        if (!res.data.isLastPage) {
          setPage((prev) => prev + 1);
        }
      }
    } catch {
      toast.error("Failed to fetch campaigns", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save tab selection to localStorage
  useEffect(() => {
    localStorage.setItem('campaignManagementTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    setToEmpty();
    getCampaigns();
  }, []);

  const filteredCampaigns = Campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand
      ? campaign.brandName === filterBrand
      : true;
    const matchesDeadline = filterDeadline
      ? {
          active: new Date(campaign.deadline) >= new Date(),
          expired: new Date(campaign.deadline) < new Date(),
        }[filterDeadline]
      : true;
    const matchesStatus = filterStatus
      ? campaign.status === filterStatus
      : true;

    // Filter by campaign type based on active tab
    const matchesType = campaign.campaignType === activeTab;

    return matchesSearch && matchesBrand && matchesDeadline && matchesStatus && matchesType;
  });

  // Group campaigns by brand
  const groupedCampaigns = filteredCampaigns.reduce((groups, campaign) => {
    const brandName = campaign.brandName;
    if (!groups[brandName]) {
      groups[brandName] = [];
    }
    groups[brandName].push(campaign);
    return groups;
  }, {});

  // Sort campaigns within each brand
  Object.keys(groupedCampaigns).forEach(brandName => {
    groupedCampaigns[brandName].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'deadline':
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case 'applicants':
          aValue = a.applicantsCount || 0;
          bValue = b.applicantsCount || 0;
          break;
        case 'campaignTitle':
          aValue = a.campaignTitle.toLowerCase();
          bValue = b.campaignTitle.toLowerCase();
          break;
        default: // brandName
          aValue = a.brandName.toLowerCase();
          bValue = b.brandName.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  });

  // Sort brands alphabetically and get brand names
  const sortedBrandNames = Object.keys(groupedCampaigns).sort((a, b) => {
    if (sortBy === 'brandName') {
      return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }
    return a.localeCompare(b); // Default alphabetical for brand names
  });

  // Helper functions for brand accordion
  const toggleBrandExpansion = (brandName) => {
    setExpandedBrands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(brandName)) {
        newSet.delete(brandName);
      } else {
        newSet.add(brandName);
      }
      return newSet;
    });
  };

  const isBrandExpanded = (brandName) => {
    return expandedBrands.has(brandName);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterBrand("");
    setFilterDeadline("");
    setFilterStatus("");
    setSortBy("brandName");
    setSortOrder("asc");
  };



  // Tab Button Component
  const TabButton = ({ tab, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
        isActive
          ? 'bg-[#2a2a2a] text-white border-b-2 border-lime-400'
          : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const Button = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className='flex justify-center items-center bg-gradient-to-l from-[#7d71ff] to-[#5b25ff] hover:bg-blue-800 text-white px-4 py-2 rounded-lg gap-2 FontLato transition shadow-md'
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#121212] text-gray-200 overflow-x-hidden">
      <Helmet>
        <title>My Account</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <div className="flex gap-2">
            <button
              className="flex items-center px-4 py-2 bg-[#484848] hover:bg-[#5a5a5a] text-white font-medium rounded-lg transition-all duration-200"
              onClick={() => {
                if (activeTab === 'gifted') {
                  setShowGiftedModal(true);
                } else {
                  setShowPaidModal(true);
                }
                setEditIndex(null);
              }}
            >
              Add {activeTab === 'gifted' ? 'Gifted' : 'Paid'} Campaign
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex border-b border-gray-700">
            <TabButton
              tab="gifted"
              label="Gifted Campaigns"
              isActive={activeTab === 'gifted'}
              onClick={() => setActiveTab('gifted')}
            />
            <TabButton
              tab="paid"
              label="Paid Campaigns"
              isActive={activeTab === 'paid'}
              onClick={() => setActiveTab('paid')}
            />
          </div>
        </div>

        <div className="mb-6 bg-[#202020] p-4 rounded-lg border border-[#333]">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search campaigns..."
              className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#555]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Brand Filter */}
            <select
              className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#555]"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#555]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>

            {/* Deadline Filter */}
            <select
              className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#555]"
              value={filterDeadline}
              onChange={(e) => setFilterDeadline(e.target.value)}
            >
              <option value="">All Deadlines</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>

            {/* Sort By */}
            <select
              className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#555]"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <option value="brandName-asc">Brand A-Z</option>
              <option value="brandName-desc">Brand Z-A</option>
              <option value="deadline-asc">Deadline (Soonest)</option>
              <option value="deadline-desc">Deadline (Latest)</option>
              <option value="applicants-desc">Most Applicants</option>
              <option value="applicants-asc">Least Applicants</option>
              <option value="campaignTitle-asc">Campaign A-Z</option>
              <option value="campaignTitle-desc">Campaign Z-A</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="bg-[#484848] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Brand Accordion Structure */}
        <div className="space-y-4">
          {sortedBrandNames.length === 0 ? (
            <div className="bg-[#202020] rounded-lg border border-[#333] p-8 text-center text-gray-400">
              {loading
                ? "Loading campaigns..."
                : `No ${activeTab} campaigns match your filters`}
            </div>
          ) : (
            sortedBrandNames.map((brandName) => {
              const brandCampaigns = groupedCampaigns[brandName];
              const campaignCount = brandCampaigns.length;
              const isExpanded = isBrandExpanded(brandName);

              return (
                <div key={brandName} className="bg-[#202020] rounded-lg border border-[#333] overflow-hidden">
                  {/* Brand Header */}
                  <button
                    onClick={() => toggleBrandExpansion(brandName)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-white">
                        {isExpanded ? '▼' : '▶'} {brandName}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({campaignCount} campaign{campaignCount !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </button>

                  {/* Brand Campaigns */}
                  {isExpanded && (
                    <div className="border-t border-[#333]">
                      {brandCampaigns.map((campaign, index) => (
                        <div key={campaign.id} className={`px-6 py-4 ${index !== brandCampaigns.length - 1 ? 'border-b border-[#333]' : ''} hover:bg-[#2a2a2a] transition-colors`}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Campaign Info */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                  <Link
                                    to={`/admin/applicants/${campaign.id}`}
                                    className="font-medium text-white hover:text-lime-400 transition-colors"
                                  >
                                    {campaign.campaignTitle}
                                  </Link>
                                  <div className="text-sm text-gray-400 mt-1">
                                    Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-300">
                                  <span className="font-medium">{campaign.applicantsCount || 0}</span> applicants
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/admin/applicants/${campaign.id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                <AiOutlineEye className="inline mr-1" />
                                View
                              </Link>
                              <button
                                onClick={() => {
                                  setEditIndex(campaign.id);
                                  setShowEditCampaignData(campaign);
                                  {campaign.campaignType == "gifted" ? setEditGiftedModel(true) : setEditPaidModel(true);}
                               
                                }}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                <FaEdit className="inline mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(campaign.id)}
                                disabled={deleteLoading.get(campaign.id)}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                {deleteLoading.get(campaign.id) ? (
                                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <>
                                    <FaTrashAlt className="inline mr-1" />
                                    Delete
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* Load More Button */}
        {!loading && loadMore && (
          <div className="text-center mt-6">
            <button
              onClick={getCampaigns}
              className="bg-[#484848] hover:bg-[#5a5a5a] text-white py-2 px-6 rounded-lg transition-all duration-200"
            >
              Load More Campaigns
            </button>
          </div>
        )}
      </div>

      {showGiftedModal && <AddCampaign setShowModal={setShowGiftedModal} />}
      {showPaidModal &&  <CampaignFormWizard setShowModal={setShowPaidModal} />}
      {editGiftedModel && (
        <EditAdminGiftedCampaign setShowModal={setEditGiftedModel} campaignData={showEditCampaignData} index={editIndex}  />
      )}
      {editPaidModel && (
        <EditAdminPaidCampaign setShowModal={setEditPaidModel} campaignData={showEditCampaignData}  index={editIndex} />
      )}
    </div>
  );
}
   