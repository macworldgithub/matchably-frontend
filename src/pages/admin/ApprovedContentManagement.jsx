import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import {
  FaSearch,
  FaEdit,
  FaSave,
  FaTimes,
  FaStar,
  FaGift,
  FaUsers,
  FaHistory,
} from "react-icons/fa";
import config from "../../config";

const ApprovedContentManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(
        `${config.BACKEND_URL}/api/admin/users/approved-content?page=${currentPage}&search=${searchTerm}&limit=20`,
        {
          headers: { Authorization: token },
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        toast.error(data.message || "Failed to load users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(
        `${config.BACKEND_URL}/api/admin/stats/approved-content`,
        {
          headers: { Authorization: token },
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const calculateRewardStatus = (approvedCount, referralCount) => {
    const totalCount = approvedCount + referralCount;

    if (totalCount >= 10)
      return { status: "✅ Eligible for $110+", tier: 10, eligible: true };
    if (totalCount >= 5)
      return { status: "✅ Eligible for $55", tier: 5, eligible: true };
    if (totalCount >= 3)
      return { status: "✅ Eligible for $25", tier: 3, eligible: true };
    if (totalCount >= 1)
      return { status: "✅ Eligible for $10", tier: 1, eligible: true };

    const needed = 1 - totalCount;
    return {
      status: `⏳ ${needed} more to unlock $10`,
      tier: 0,
      eligible: false,
    };
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditValue(user.approvedContent.toString());
  };

  const handleSave = async (userId) => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const newCount = parseInt(editValue);

      if (isNaN(newCount) || newCount < 0) {
        toast.error("Please enter a valid number");
        return;
      }

      const res = await fetch(
        `${config.BACKEND_URL}/api/admin/users/${userId}/approved-content`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approvedContent: newCount }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Approved content count updated successfully");
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to update count");
      }
    } catch (err) {
      console.error("Error updating count:", err);
      toast.error("Error updating approved content count");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditValue("");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Approved Content Management - Admin</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            📊 Approved Content Management
          </h1>
          <p className="text-gray-400">
            Manage user approved content counts and reward eligibility
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-600/20 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-2">
                <FaUsers className="text-blue-400 text-2xl" />
                <h3 className="text-lg font-semibold">Total Users</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {stats.totalUsers}
              </p>
            </div>

            <div className="bg-green-600/20 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center gap-3 mb-2">
                <FaStar className="text-green-400 text-2xl" />
                <h3 className="text-lg font-semibold">Total Approvals</h3>
              </div>
              <p className="text-3xl font-bold text-green-400">
                {stats.totalApprovals}
              </p>
            </div>

            <div className="bg-yellow-600/20 rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <FaGift className="text-yellow-400 text-2xl" />
                <h3 className="text-lg font-semibold">Reward Eligible</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-400">
                {stats.rewardEligible}
              </p>
            </div>

            <div className="bg-purple-600/20 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-2">
                <FaHistory className="text-purple-400 text-2xl" />
                <h3 className="text-lg font-semibold">Pending Payouts</h3>
              </div>
              <p className="text-3xl font-bold text-purple-400">
                ${stats.pendingPayouts}
              </p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-4 font-semibold">User</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-center p-4 font-semibold">
                    Approved Content
                  </th>
                  <th className="text-center p-4 font-semibold">
                    Referral Bonus
                  </th>
                  <th className="text-center p-4 font-semibold">Total Count</th>
                  <th className="text-left p-4 font-semibold">Reward Status</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const rewardStatus = calculateRewardStatus(
                    user.approvedContent || 0,
                    user.referralApprovedCount || 0
                  );
                  const totalCount =
                    (user.approvedContent || 0) +
                    (user.referralApprovedCount || 0);

                  return (
                    <tr
                      key={user._id}
                      className="border-t border-gray-700 hover:bg-gray-700/50"
                    >
                      <td className="p-4">
                        <div className="font-semibold">{user.name}</div>
                      </td>
                      <td className="p-4 text-gray-400">{user.email}</td>
                      <td className="p-4 text-center">
                        {editingUser === user._id ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 bg-gray-600 text-white px-2 py-1 rounded text-center"
                            min="0"
                          />
                        ) : (
                          <span className="font-bold text-lg">
                            {user.approvedContent || 0}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-purple-400 font-semibold">
                          +{user.referralApprovedCount || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-xl text-yellow-400">
                          {totalCount}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            rewardStatus.eligible
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                          }`}
                        >
                          {rewardStatus.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {editingUser === user._id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleSave(user._id)}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center gap-1"
                            >
                              <FaSave className="text-sm" />
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors flex items-center gap-1"
                            >
                              <FaTimes className="text-sm" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(user)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1 mx-auto"
                          >
                            <FaEdit className="text-sm" />
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">💡 Reward Structure (2025)</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">
                Approval Tiers:
              </h4>
              <ul className="space-y-1 text-gray-300">
                <li>• 1 approval = $10 total</li>
                <li>• 3 approvals = $25 total (+$15 bonus)</li>
                <li>• 5 approvals = $55 total (+$30 bonus)</li>
                <li>• 10 approvals = $110 total (+$55 bonus)</li>
                <li>• 11+ approvals = +$5 per additional post</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">
                Special Cases:
              </h4>
              <ul className="space-y-1 text-gray-300">
                <li>
                  • <strong>Courtney (beautifullycourt@gmail.com)</strong>: Set
                  to show $25 eligible
                </li>
                <li>• Referral bonuses add +1 to approval count</li>
                <li>
                  • Manual adjustments by admin override system calculations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedContentManagement;

