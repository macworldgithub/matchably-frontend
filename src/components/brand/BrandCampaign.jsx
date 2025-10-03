import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import AddCampaign from "../../components/brand/addCampaign/addCampaign";
import AddPaidCampaign from "../../components/brand/addCampaign/addPaidCampaign";
import AddFreeTrailCampaign from "../../components/brand/addCampaign/addFreeTrailCampaign";
import EditCampaign from "../../components/brand/addCampaign/editCampaign";
import config from "../../config";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import useAuthStore from "../../state/atoms";

const BrandCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [showFreeTrailModal, setShowFreeTrailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(new Map());
  const [subscription, setSubscription] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const brand = useAuthStore((state) => state.brand);

  // Campaign type tabs
  const [activeTab, setActiveTab] = useState("all");

  // New filters/search/sort/pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 16; // Changed from 6 to 10

  const approvalStatusMap = {
    approved: {
      label: " Approved",
      color: "bg-green-600 text-white",
    },
    pending: {
      label: "⏳ Pending Review",
      color: "bg-purple-600 text-white",
    },
    draft: {
      label: "📝 Draft",
      color: "bg-yellow-600 text-white",
    },
  };

  const getCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const res = await axios.get(
        `${config.BACKEND_URL}/brand/campaign-request/my-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = Array.isArray(res.data.requests) ? res.data.requests : [];
      if (res.data.status === "success") {
        setCampaigns(data);
      } else {
        toast.info("No campaigns found", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Campaign fetch error:", err);
      toast.error("Failed to fetch campaigns", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const res = await axios.get(
        `${config.BACKEND_URL}/brand/package/subscription`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data.subscription);
      if (res.data.subscription) setSubscription(res.data.subscription);
    } catch (err) {
      console.error("Subscription fetch error:", err);
    } finally {
      // setLoadingSub(false); // This line was removed as loadingSub is no longer defined
    }
  };

  useEffect(() => {
    getCampaigns();
    fetchSubscription();
  }, []);

  // Helper: Calculate submission rate
  const calculateSubmissionRate = (campaign) => {
    // For BrandCampaignRequest, we don't have direct access to approved/submitted counts
    // We'll show a placeholder or calculate from other available data
    if (!campaign.creatorCount || campaign.creatorCount === 0) {
      return "—";
    }

    // If we have submission rate from backend, use it
    if (campaign.submissionRate !== undefined) {
      return `${campaign.submissionRate}%`;
    }

    // For now, show a placeholder since we don't have the actual calculation
    // In a real implementation, this would be calculated from appliedCampaigns and campaignSubmission collections
    return "—";
  };

  const handleEdit = (id) => {
    setCampaign(campaigns.find((c) => c._id === id));
    setEditModal(true);
  };

  const handleDeleteClick = (id) => {
    const campaign = campaigns.find((c) => c._id === id);
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    const index = campaigns.findIndex((c) => c._id === id);
    const newMap = new Map(deleteLoading);
    newMap.set(id, true);
    setDeleteLoading(newMap);

    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const res = await axios.delete(
        `${config.BACKEND_URL}/brand/campaign-request/request/${id}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "success") {
        const updatedList = [...campaigns];
        updatedList.splice(index, 1);
        setCampaigns(updatedList);

        toast.success("Campaign deleted successfully", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "dark",
        });
      } else throw new Error("Delete failed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
    } finally {
      const newMap = new Map(deleteLoading);
      newMap.delete(id);
      setDeleteLoading(newMap);
      setShowDeleteModal(false);
      setCampaignToDelete(null);
    }
  };

  // ─── Count base + add-ons ─────────────────────────────────
  const totalCampaignsAllowed =
    (subscription?.plan?.campaignsAllowed || 0) +
    (subscription?.extraCampaignsAllowed || 0);
  const isLimitReached =
    (subscription?.campaignsUsed || 0) >= totalCampaignsAllowed;

  // ─── Centralized "Add Campaign" click logic ────────────────────
  const handleAddClick = () => {
    if (isLimitReached) {
      toast.warn(
        `You've reached your campaign limit of ${totalCampaignsAllowed}. Consider purchasing an add-on.`,
        { position: "bottom-right", autoClose: 3000 }
      );
    } else {
      setShowModal(true);
    }
  };

  const handleAddPaidClick = () => {
    if (isLimitReached) {
      toast.warn(
        `You've reached your campaign limit of ${totalCampaignsAllowed}. Consider purchasing an add-on.`,
        { position: "bottom-right", autoClose: 3000 }
      );
    } else {
      setShowPaidModal(true);
    }
  };
  const handleAddFreeTrailClick = () => {
    if (isLimitReached) {
      toast.warn(
        `You've reached your campaign limit of ${totalCampaignsAllowed}. Consider purchasing an add-on.`,
        { position: "bottom-right", autoClose: 3000 }
      );
    } else {
      setShowFreeTrailModal(true);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilterStatus("All");
  };

  // Get campaigns count by type
  const giftCampaigns = campaigns.filter(
    (camp) => camp.campaignType === "gifted" || !camp.campaignType
  );
  const paidCampaigns = campaigns.filter(
    (camp) => camp.campaignType === "paid"
  );

  // Filter, search, sort, and paginate based on active tab
  const getFilteredCampaigns = () => {
    let baseCampaigns = campaigns;

    // Filter by campaign type based on active tab
    if (activeTab === "gifted") {
      baseCampaigns = giftCampaigns;
    } else if (activeTab === "paid") {
      baseCampaigns = paidCampaigns;
    }

    return baseCampaigns
      .filter((camp) => {
        const now = new Date();
        const deadline = camp.deadline ? new Date(camp.deadline) : null;
        const status = camp.referenceId?.approvalStatus?.toLowerCase();

        switch (filterStatus) {
          case "Active":
            return status === "approved" && deadline && deadline >= now;
          case "Completed":
            return status === "approved" && deadline && deadline < now;
          case "Draft":
            return status === "draft";
          case "Pending Review":
            return status === "pending";
          case "All":
          default:
            return true;
        }
      })
      .filter((camp) =>
        camp.campaignTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "deadline")
          return new Date(a.deadline) - new Date(b.deadline);
        if (sortBy === "submissionRate")
          return (b.submissionRate || 0) - (a.submissionRate || 0);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  };

  const filteredCampaigns = getFilteredCampaigns();
  const indexOfLast = currentPage * campaignsPerPage;
  const indexOfFirst = indexOfLast - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#121212] text-gray-100 overflow-x-hidden">
      <Helmet>
        <title>My Campaigns</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-8xl mx-auto ">
        <div className="flex  flex-col md:flex-row md:justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-semibold mb-4 md:mb-0">
              Your Campaigns
            </h1>
            {/* Campaign Type Tabs */}
            <div className="flex flex-wrap items-center gap-2 my-6  pb-4">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                }`}
                onClick={() => handleTabChange("all")}
              >
                All Campaigns ({campaigns.length})
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "gifted"
                    ? "bg-green-600 text-white"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                }`}
                onClick={() => handleTabChange("gifted")}
              >
                🎁 Gifted Campaigns ({giftCampaigns.length})
              </button>
              {brand && !brand?.planDetails?.isFreeTrial && (
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "paid"
                      ? "bg-blue-600 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                  }`}
                  onClick={() => handleTabChange("paid")}
                >
                  💰 Paid Campaigns ({paidCampaigns.length})
                </button>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start md:items-end">
              <div className="flex space-x-3">
                {!isLimitReached && (
                  <>
                    {brand && brand?.planDetails?.isFreeTrial && (
                      <button
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isLimitReached
                            ? "bg-gray-600 text-gray-400"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        onClick={handleAddFreeTrailClick}
                      >
                        <FaPlus className="mr-2" />
                        {isLimitReached
                          ? "Limit Reached"
                          : "Create Free Trial Campaign"}
                      </button>
                    )}

                    {brand && !brand?.planDetails?.isFreeTrial && (
                      <>
                        <button
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isLimitReached
                              ? "bg-gray-600 text-gray-400"
                              : "bg-[#3f3f3f] hover:bg-[#4f4f4f] text-white"
                          }`}
                          onClick={handleAddClick}
                        >
                          <FaPlus className="mr-2" />
                          {isLimitReached
                            ? "Limit Reached"
                            : "Add Gifted Campaign"}
                        </button>
                        <button
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isLimitReached
                              ? "bg-gray-600 text-gray-400"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                          onClick={handleAddPaidClick}
                        >
                          <FaPlus className="mr-2" />
                          {isLimitReached
                            ? "Limit Reached"
                            : "Add Paid Campaign"}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {isLimitReached && (
                <div className="w-full mt-4 p-4 bg-yellow-900 text-yellow-300 border border-yellow-700 rounded-lg shadow">
                  <p className="text-sm font-medium flex items-center gap-2">
                    ⚠️{" "}
                    <span>
                      You've reached the campaign limit for your current plan.
                    </span>
                  </p>
                  <p className="mt-1 text-sm">
                    To launch more campaigns, please upgrade your plan.
                  </p>
                  <Link
                    to="/brand/pricing"
                    className="mt-2 inline-block px-4 py-1 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 transition"
                  >
                    Upgrade Plan
                  </Link>
                </div>
              )}
            </div>
            {/* 🚨 Static banner for campaign product limit */}
            <div className="my-2 p-3 bg-gray-400 text-black text-xs rounded-md shadow-sm max-w-md">
              🚨 <strong>Each campaign is limited to one product only.</strong>
              <br />
              To promote multiple products, please create separate campaigns.
            </div>
          </div>
        </div>

        {/* Filter, Search, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-t border-[#333]">
          <div className="flex gap-2">
            {["All", "Active", "Draft", "Completed", "Pending Review"].map(
              (status) => (
                <button
                  key={status}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterStatus === status
                      ? "bg-indigo-600 text-white"
                      : "bg-[#2a2a2a] text-gray-300"
                  }`}
                  onClick={() => {
                    setFilterStatus(status);
                    setCurrentPage(1);
                  }}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <div className="flex gap-5">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-full bg-[#2a2a2a] text-gray-300 focus:outline-none text-white border border-[#333] focus:outline-none"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#2a2a2a] text-gray-300 px-5 py-2 rounded-lg border border-[#333] focus:outline-none"
            >
              <option value="createdAt">Sort by Created</option>
              <option value="deadline">Sort by Deadline</option>
              <option value="submissionRate">Sort by Submission Rate</option>
            </select>
          </div>
        </div>

        <div className="">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading campaigns...
            </div>
          ) : currentCampaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <p className="text-lg font-semibold mb-2">
                {activeTab === "all" &&
                  filterStatus === "All" &&
                  "You haven't created any campaigns yet."}
                {activeTab === "gifted" &&
                  filterStatus === "All" &&
                  "You haven't created any gifted campaigns yet."}
                {activeTab === "paid" &&
                  filterStatus === "All" &&
                  "You haven't created any paid campaigns yet."}
                {filterStatus === "Active" &&
                  `No active ${
                    activeTab === "all" ? "" : activeTab
                  } campaigns at the moment.`}
                {filterStatus === "Completed" &&
                  `No ${
                    activeTab === "all" ? "" : activeTab
                  } campaigns have been completed yet.`}
                {filterStatus === "Draft" &&
                  `You haven't saved any ${
                    activeTab === "all" ? "" : activeTab
                  } drafts yet.`}
                {filterStatus === "Pending Review" &&
                  `No ${
                    activeTab === "all" ? "" : activeTab
                  } campaigns are under review.`}
              </p>

              <p className="mb-4">
                {(filterStatus === "All" || filterStatus === "Draft") &&
                  "Click Create Campaign to get started and connect with creators."}
              </p>

              {(filterStatus === "All" || filterStatus === "Draft") && (
                <div className="flex gap-4 justify-center">
                  {brand && brand?.planDetails?.isFreeTrial && (
                    <button
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isLimitReached
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      onClick={handleAddFreeTrailClick}
                      disabled={isLimitReached}
                    >
                      <FaPlus className="mr-2" />
                      {isLimitReached
                        ? "Limit Reached"
                        : "Create Free Trial Campaign"}
                    </button>
                  )}
                  {brand && !brand?.planDetails?.isFreeTrial && (
                    <>
                      <button
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isLimitReached
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-[#3f3f3f] hover:bg-[#4f4f4f] text-white"
                        }`}
                        onClick={handleAddClick}
                        disabled={isLimitReached}
                      >
                        <FaPlus className="mr-2" />
                        {isLimitReached
                          ? "Limit Reached"
                          : "Create gift Campaign"}
                      </button>
                      <button
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isLimitReached
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        onClick={handleAddPaidClick}
                        disabled={isLimitReached}
                      >
                        <FaPlus className="mr-2" />
                        {isLimitReached
                          ? "Limit Reached"
                          : "Create Paid Campaign"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCampaigns.map((camp, index) => (
                <div
                  key={index}
                  className="bg-[#2c2c2c] rounded-xl border border-[#3c3c3c] p-5 hover:bg-[#333] transition-all duration-200 hover:shadow-lg"
                >
                  {/* Status Badge and Campaign Type */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            camp.referenceId?.approvalStatus === "Active"
                              ? "bg-green-500"
                              : camp.referenceId?.approvalStatus === "Completed"
                              ? "bg-blue-500"
                              : camp.referenceId?.approvalStatus === "Draft"
                              ? "bg-yellow-500"
                              : camp.referenceId?.approvalStatus ===
                                "Pending Review"
                              ? "bg-orange-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        <span className="text-green-400 text-sm font-medium">
                          [
                          {approvalStatusMap[camp.referenceId?.approvalStatus]
                            ?.label || camp.referenceId?.approvalStatus}
                          ]
                        </span>
                      </div>

                      {/* Campaign Type Badge */}
                      {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        camp.campaignType === 'paid' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {camp.campaignType === 'paid' ? '💰 Paid' : '🎁 gifted'}
                      </span> */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(camp._id)}
                        disabled={deleteLoading.get(camp._id)}
                        className="p-1.5 text-yellow-400 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-md transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(camp._id)}
                        disabled={deleteLoading.get(camp._id)}
                        className="p-1.5 text-red-400 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-md transition-colors"
                        title="Delete"
                      >
                        {deleteLoading.get(camp._id) ? (
                          <svg
                            className="animate-spin h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        ) : (
                          <FaTrashAlt className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Campaign Title */}
                  <h3 className="text-green-400 font-bold text-lg mb-4 line-clamp-2">
                    {camp.campaignTitle}
                  </h3>

                  {/* Campaign Details */}
                  <div className="space-y-3 mb-6">
                    {/* Created & Deadline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-300">
                        <div className="w-4 h-4 bg-gray-500 rounded mr-2 flex items-center justify-center">
                          <span className="text-xs">📅</span>
                        </div>
                        <span>Created:</span>
                      </div>
                      <span className="text-gray-300">
                        {camp?.createdAt
                          ? new Date(camp.createdAt).toLocaleDateString("en-CA")
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-300">
                        <div className="w-4 h-4 bg-gray-500 rounded mr-2 flex items-center justify-center">
                          <span className="text-xs">⏰</span>
                        </div>
                        <span>Deadline:</span>
                      </div>
                      <span
                        className={`font-medium ${
                          new Date(camp.deadline) < new Date()
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {camp.deadline?.split("T")[0]}
                      </span>
                    </div>

                    {/* Creators Count */}
                    <div className="flex items-center text-sm">
                      <div className="flex items-center text-green-400">
                        <div className="w-4 h-4 bg-green-600 rounded mr-2 flex items-center justify-center">
                          <span className="text-xs">👥</span>
                        </div>
                        <span className="font-medium">
                          {camp.approvedCount || 0} out{" "}
                          {camp?.recruiting == -1
                            ? "Unlimited"
                            : camp.creatorCount || 0}{" "}
                          Creators
                        </span>
                      </div>
                    </div>

                    {/* Submission Rate */}
                    <div className="flex items-center text-sm">
                      <div className="flex items-center text-gray-300">
                        <div className="w-4 h-4 bg-gray-500 rounded mr-2 flex items-center justify-center">
                          <span className="text-xs">📊</span>
                        </div>
                        <span>Submission Rate:</span>
                      </div>
                      <span className="text-green-400 font-bold ml-2">
                        {calculateSubmissionRate(camp)}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/brand/campaigns/${camp._id}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <AiOutlineEye className="mr-2" />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-[#2c2c2c] text-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddCampaign
          setShowModal={setShowModal}
          onCampaignAdded={getCampaigns}
        />
      )}
      {showPaidModal && (
        <AddPaidCampaign
          setShowModal={setShowPaidModal}
          onCampaignAdded={getCampaigns}
        />
      )}
      {showFreeTrailModal && (
        <AddFreeTrailCampaign
          setShowModal={setShowFreeTrailModal}
          onCampaignAdded={getCampaigns}
        />
      )}
      {editModal && campaign && (
        <EditCampaign setShowModal={setEditModal} campaignData={campaign} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#232323] p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">
              Delete Campaign
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete "{campaignToDelete.campaignTitle}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCampaignToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold"
                onClick={() => handleDelete(campaignToDelete._id)}
                disabled={deleteLoading.get(campaignToDelete._id)}
              >
                {deleteLoading.get(campaignToDelete._id)
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandCampaign;
