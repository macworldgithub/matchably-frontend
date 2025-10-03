import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";
import {
  FaGift,
  FaDollarSign,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
  FaEye,
  FaEdit,
  FaChartBar,
  FaHistory,
} from "react-icons/fa";
import config from "../../config";

const NewRewardSystem = () => {
  const [activeTab, setActiveTab] = useState("payouts");
  const [payouts, setPayouts] = useState([]);
  const [approvalEvents, setApprovalEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const token = Cookies.get("AdminToken") || localStorage.getItem("token");

      const [payoutsRes, eventsRes, statsRes] = await Promise.all([
        fetch(`${config.BACKEND_URL}/admin/rewards/payouts`, {
          headers: { Authorization: token },
        }),
        fetch(`${config.BACKEND_URL}/admin/rewards/approval-events`, {
          headers: { Authorization: token },
        }),
        fetch(`${config.BACKEND_URL}/admin/rewards/stats`, {
          headers: { Authorization: token },
        }),
      ]);

      const [payoutsData, eventsData, statsData] = await Promise.all([
        payoutsRes.json(),
        eventsRes.json(),
        statsRes.json(),
      ]);

      if (payoutsData.status === "success") setPayouts(payoutsData.payouts);
      if (eventsData.status === "success") setApprovalEvents(eventsData.events);
      if (statsData.status === "success") setStats(statsData.stats);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reward system data", { theme: "dark" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updatePayoutStatus = async () => {
    if (!selectedPayout || !newStatus || updating) return;

    try {
      setUpdating(true);
      const token = Cookies.get("AdminToken") || localStorage.getItem("token");
      const response = await fetch(
        `${config.BACKEND_URL}/admin/rewards/payouts/${selectedPayout.id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            failureReason: newStatus === "failed" ? failureReason : undefined,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success(`Payout status updated to ${newStatus}`, {
          theme: "dark",
        });
        setStatusModal(false);
        setSelectedPayout(null);
        setNewStatus("");
        setFailureReason("");
        fetchData(true); // Refresh data
      } else {
        toast.error(data.message || "Failed to update payout status", {
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error updating payout:", error);
      toast.error("Failed to update payout status", { theme: "dark" });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-400" />;
      case "processing":
        return <FaClock className="text-yellow-400" />;
      case "failed":
        return <FaExclamationTriangle className="text-red-400" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium border";
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-600/20 text-green-400 border-green-600/30`;
      case "processing":
        return `${baseClasses} bg-yellow-600/20 text-yellow-400 border-yellow-600/30`;
      case "failed":
        return `${baseClasses} bg-red-600/20 text-red-400 border-red-600/30`;
      default:
        return `${baseClasses} bg-gray-600/20 text-gray-400 border-gray-600/30`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reward system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]">
      <Helmet>
        <title>New Reward System</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            New Reward System
          </h2>
          <p className="text-gray-400">
            Manage approval-based rewards and Amazon e-Gift Card payouts
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing || loading}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            refreshing || loading
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {refreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Refreshing...
            </>
          ) : (
            "Refresh Data"
          )}
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 mr-3">
                <FaUsers size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Total Users
                </p>
                <p className="text-lg font-semibold text-white">
                  {stats.users.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-600/20 text-green-400 mr-3">
                <FaCheckCircle size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Users with Approvals
                </p>
                <p className="text-lg font-semibold text-white">
                  {stats.users.usersWithApprovals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-600/20 text-yellow-400 mr-3">
                <FaDollarSign size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Total Payouts
                </p>
                <p className="text-lg font-semibold text-white">
                  $
                  {stats.payouts.reduce(
                    (sum, p) => sum + (p.totalAmount || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 mr-3">
                <FaGift size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Approved Content
                </p>
                <p className="text-lg font-semibold text-white">
                  {stats.users.totalApprovedContent}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-800 mb-6">
        <div className="border-b border-gray-800">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "payouts", label: "Payouts", icon: FaDollarSign },
              { id: "events", label: "Approval Events", icon: FaHistory },
              { id: "analytics", label: "Analytics", icon: FaChartBar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "payouts" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Reward Payouts
                </h3>
                <div className="flex gap-2">
                  {["pending", "processing", "completed", "failed"].map(
                    (status) => (
                      <span key={status} className={getStatusBadge(status)}>
                        {payouts.filter((p) => p.status === status).length}{" "}
                        {status}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-200">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">
                        User
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Approved Content
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Requested
                      </th>
                      <th className="px-6 py-3 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {payouts.map((payout) => (
                      <tr
                        key={payout.id}
                        className="hover:bg-gray-800/60 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <div>
                            <div className="font-medium text-white">
                              {payout.user}
                            </div>
                            <div className="text-xs text-gray-400">
                              {payout.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-white">
                            <span className="font-medium">
                              {payout.totalApprovedCount}
                            </span>{" "}
                            total
                          </div>
                          <div className="text-xs text-gray-400">
                            {payout.approvedContent} own +{" "}
                            {payout.referralApprovedCount} referral
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-white">
                            ${payout.amount}
                          </div>
                          <div className="text-xs text-gray-400">
                            {payout.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center gap-1 ${getStatusBadge(
                              payout.status
                            )}`}
                          >
                            {getStatusIcon(payout.status)}
                            {payout.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-400">
                          {new Date(payout.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedPayout(payout);
                                setStatusModal(true);
                                setNewStatus(payout.status);
                              }}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded transition-colors"
                              title="Edit Status"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-600/20 rounded transition-colors"
                              title="View Details"
                            >
                              <FaEye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Approval Events
              </h3>
              <div className="space-y-4">
                {approvalEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800/40 rounded-lg p-4 border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white">
                            {event.user}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-400">
                            {event.email}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-1">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Campaign: {event.campaign}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          +${event.rewardAmount}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Reward Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payout Status Distribution */}
                <div className="bg-gray-800/40 rounded-lg p-6">
                  <h4 className="text-base font-medium text-white mb-4">
                    Payout Status Distribution
                  </h4>
                  {stats?.payouts.map((stat) => (
                    <div
                      key={stat._id}
                      className="flex justify-between py-2 border-b border-gray-700 last:border-b-0"
                    >
                      <span className="capitalize text-gray-300">
                        {stat._id || "pending"}:
                      </span>
                      <span className="font-medium text-white">
                        {stat.count} (${stat.totalAmount || 0})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Event Type Distribution */}
                <div className="bg-gray-800/40 rounded-lg p-6">
                  <h4 className="text-base font-medium text-white mb-4">
                    Event Type Distribution
                  </h4>
                  {stats?.events.map((stat) => (
                    <div
                      key={stat._id}
                      className="flex justify-between py-2 border-b border-gray-700 last:border-b-0"
                    >
                      <span className="capitalize text-gray-300">
                        {stat._id.replace("_", " ")}:
                      </span>
                      <span className="font-medium text-white">
                        {stat.count} (${stat.totalReward || 0})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Update Payout Status
                </h3>
                <button
                  onClick={() => setStatusModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-3">
                  User: {selectedPayout.user} (${selectedPayout.amount})
                </p>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={updating}
                  className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    updating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {newStatus === "failed" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Failure Reason
                  </label>
                  <textarea
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    disabled={updating}
                    className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      updating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    rows="3"
                    placeholder="Enter reason for failure..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={updatePayoutStatus}
                  disabled={updating}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
                    updating
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>
                <button
                  onClick={() => setStatusModal(false)}
                  disabled={updating}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    updating
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRewardSystem;
