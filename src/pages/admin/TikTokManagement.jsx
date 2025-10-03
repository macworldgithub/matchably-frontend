import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaTiktok,
  FaUsers,
  FaChartLine,
  FaSearch,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import config from "../../config";
import Cookies from "js-cookie";

const TikTokManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [oauthStats, setOauthStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [disconnectModal, setDisconnectModal] = useState({
    show: false,
    user: null,
  });
  const [disconnectReason, setDisconnectReason] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkActionModal, setBulkActionModal] = useState({
    show: false,
    action: null,
  });
  const [bulkActionReason, setBulkActionReason] = useState("");

  const token = Cookies.get("AdminToken");

  useEffect(() => {
    if (activeTab === "overview") {
      fetchAnalytics();
      fetchOAuthStats();
    } else if (activeTab === "users") {
      fetchConnectedUsers(currentPage, searchTerm);
    }
  }, [activeTab, currentPage, searchTerm]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.BACKEND_URL}/admin/tiktok/analytics`,
        {
          headers: { Authorization: token },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setAnalytics(data.analytics);
      } else {
        toast.error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchOAuthStats = async () => {
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/admin/tiktok/oauth-stats?timeframe=30`,
        {
          headers: { Authorization: token },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setOauthStats(data.oauthStats);
      }
    } catch (error) {
      console.error("OAuth stats fetch error:", error);
    }
  };

  const fetchConnectedUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await fetch(
        `${config.BACKEND_URL}/admin/tiktok/connected-users?page=${page}&limit=20${searchParam}`,
        { headers: { Authorization: token } }
      );
      const data = await response.json();

      if (data.status === "success") {
        setConnectedUsers(data.data.users);
        setPagination(data.data.pagination);
      } else {
        toast.error("Failed to fetch connected users");
      }
    } catch (error) {
      console.error("Connected users fetch error:", error);
      toast.error("Failed to fetch connected users");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectUser = async () => {
    if (!disconnectModal.user || !disconnectReason.trim()) {
      toast.error("Please provide a reason for disconnection");
      return;
    }

    try {
      setActionLoading({ ...actionLoading, [disconnectModal.user.id]: true });

      const response = await fetch(
        `${config.BACKEND_URL}/admin/tiktok/disconnect-user/${disconnectModal.user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: disconnectReason }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("User TikTok account disconnected successfully");
        setDisconnectModal({ show: false, user: null });
        setDisconnectReason("");
        fetchConnectedUsers(currentPage, searchTerm);
        fetchAnalytics(); // Refresh analytics
      } else {
        toast.error(data.message || "Failed to disconnect user");
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect user");
    } finally {
      setActionLoading({ ...actionLoading, [disconnectModal.user.id]: false });
    }
  };

  const handleBulkAction = async () => {
    if (!bulkActionModal.action || selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }

    if (bulkActionModal.action === "disconnect" && !bulkActionReason.trim()) {
      toast.error("Please provide a reason for bulk disconnection");
      return;
    }

    try {
      setActionLoading({ ...actionLoading, bulk: true });

      const response = await fetch(
        `${config.BACKEND_URL}/admin/tiktok/bulk-actions`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: bulkActionModal.action,
            userIds: selectedUsers,
            reason: bulkActionReason,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success(
          `Bulk ${bulkActionModal.action} completed: ${data.results.success} success, ${data.results.failed} failed`
        );
        setBulkActionModal({ show: false, action: null });
        setBulkActionReason("");
        setSelectedUsers([]);
        fetchConnectedUsers(currentPage, searchTerm);
        fetchAnalytics();
      } else {
        toast.error(
          data.message || `Failed to perform bulk ${bulkActionModal.action}`
        );
      }
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error(`Failed to perform bulk ${bulkActionModal.action}`);
    } finally {
      setActionLoading({ ...actionLoading, bulk: false });
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === connectedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(connectedUsers.map((user) => user.id));
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toLocaleString() || "0";
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total TikTok Users</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.overview?.totalTikTokUsers || 0}
              </p>
            </div>
            <FaTiktok className="text-pink-500 text-3xl" />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {analytics?.overview?.connectionRate || 0}% of all users
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Reach</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.overview?.totalFollowersReach || "0"}
              </p>
            </div>
            <FaUsers className="text-blue-500 text-3xl" />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Avg: {formatNumber(analytics?.overview?.averageFollowers || 0)}{" "}
            followers
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Applications</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.overview?.totalTikTokApplications || 0}
              </p>
            </div>
            <FaChartLine className="text-green-500 text-3xl" />
          </div>
          <p className="text-sm text-gray-400 mt-2">Via TikTok accounts</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Verified Creators</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.overview?.verifiedCreators || 0}
              </p>
            </div>
            <FaCheckCircle className="text-yellow-500 text-3xl" />
          </div>
          <p className="text-sm text-gray-400 mt-2">TikTok verified accounts</p>
        </div>
      </div>

      {/* Follower Distribution */}
      {analytics?.followerDistribution && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Follower Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(analytics.followerDistribution).map(
              ([range, count]) => (
                <div key={range} className="text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-lg font-bold text-white">{count}</p>
                    <p className="text-sm text-gray-400">{range}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* OAuth Statistics */}
      {oauthStats && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            OAuth Statistics (Last 30 Days)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {oauthStats.totalConnections}
              </p>
              <p className="text-sm text-gray-400">Successful Connections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {oauthStats.successRate}%
              </p>
              <p className="text-sm text-gray-400">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {oauthStats.estimatedAttempts}
              </p>
              <p className="text-sm text-gray-400">Total Attempts</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Campaigns */}
      {analytics?.topCampaigns && analytics.topCampaigns.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Top TikTok Campaigns
          </h3>
          <div className="space-y-3">
            {analytics.topCampaigns.map((campaign, index) => (
              <div
                key={campaign.campaignId}
                className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">
                      {campaign.campaignTitle}
                    </p>
                    <p className="text-sm text-gray-400">
                      {campaign.brandName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-pink-400">
                    {campaign.tiktokApplications}
                  </p>
                  <p className="text-sm text-gray-400">TikTok Applications</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchConnectedUsers(currentPage, searchTerm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              // Export functionality can be added here
              toast.info("Export functionality coming soon");
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FaDownload /> Export
          </button>
          {selectedUsers.length > 0 && (
            <button
              onClick={() =>
                setBulkActionModal({ show: true, action: "disconnect" })
              }
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FaTrash /> Disconnect Selected ({selectedUsers.length})
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        connectedUsers.length > 0 &&
                        selectedUsers.length === connectedUsers.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-600 bg-gray-700 text-pink-600 focus:ring-pink-500"
                    />
                    <span>User</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  TikTok Profile
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Stats
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Connected
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : connectedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No TikTok connected users found
                  </td>
                </tr>
              ) : (
                connectedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-600 bg-gray-700 text-pink-600 focus:ring-pink-500"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.country}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.tiktokData.profilePicture && (
                          <img
                            src={user.tiktokData.profilePicture}
                            alt={user.tiktokData.username}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-white">
                              @{user.tiktokData.username}
                            </p>
                            {user.tiktokData.isVerified && (
                              <FaCheckCircle className="text-blue-500 text-sm" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-white">
                          <strong>
                            {formatNumber(user.tiktokData.followerCount)}
                          </strong>{" "}
                          followers
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatNumber(user.tiktokData.likesCount)} likes
                        </p>
                        <p className="text-sm text-gray-400">
                          {user.tiktokData.videoCount} videos
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">
                        {new Date(user.connectedAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (user.tiktokData.profileLink) {
                              window.open(
                                user.tiktokData.profileLink,
                                "_blank"
                              );
                            } else {
                              window.open(
                                `https://tiktok.com/@${user.tiktokData.username}`,
                                "_blank"
                              );
                            }
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="View TikTok Profile"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            setDisconnectModal({ show: true, user })
                          }
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          title="Disconnect TikTok"
                          disabled={actionLoading[user.id]}
                        >
                          {actionLoading[user.id] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-700 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing page {pagination.currentPage} of {pagination.totalPages}(
              {pagination.totalUsers} total users)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Helmet>
        <title>TikTok Management - Admin</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaTiktok className="text-pink-500 text-3xl" />
          <h1 className="text-3xl font-bold text-white">TikTok Management</h1>
        </div>
        <p className="text-gray-400">
          Manage TikTok integrations, monitor user connections, and view
          analytics
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === "overview"
                ? "bg-pink-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === "users"
                ? "bg-pink-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            Connected Users
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? <OverviewTab /> : <UsersTab />}

      {/* Disconnect Modal */}
      {disconnectModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Disconnect TikTok Account
            </h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to disconnect{" "}
              <strong>{disconnectModal.user?.name}</strong>'s TikTok account?
            </p>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Reason for disconnection:
              </label>
              <textarea
                value={disconnectReason}
                onChange={(e) => setDisconnectReason(e.target.value)}
                placeholder="Please provide a reason..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white resize-none"
                rows="3"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDisconnectModal({ show: false, user: null });
                  setDisconnectReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnectUser}
                disabled={!disconnectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {bulkActionModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Bulk{" "}
              {bulkActionModal.action === "disconnect"
                ? "Disconnect"
                : "Action"}
            </h3>
            <p className="text-gray-400 mb-4">
              Are you sure you want to {bulkActionModal.action}{" "}
              <strong>{selectedUsers.length}</strong> selected user(s)?
            </p>
            {bulkActionModal.action === "disconnect" && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Reason for bulk disconnection:
                </label>
                <textarea
                  value={bulkActionReason}
                  onChange={(e) => setBulkActionReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white resize-none"
                  rows="3"
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setBulkActionModal({ show: false, action: null });
                  setBulkActionReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAction}
                disabled={
                  bulkActionModal.action === "disconnect" &&
                  !bulkActionReason.trim()
                }
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {actionLoading.bulk
                  ? "Processing..."
                  : `${
                      bulkActionModal.action === "disconnect"
                        ? "Disconnect"
                        : "Execute"
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokManagement;
