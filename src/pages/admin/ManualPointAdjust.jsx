/** @format */

import React, { useEffect, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import Pagination from "../../components/Pagination";

const ManualApprovedAdjust = () => {
  const [users, setUsers] = useState([]);
  const [editedCounts, setEditedCounts] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  // Fetch users with pagination
  const fetchUsers = async (page = 1, searchTerm = "") => {
    try {
      const res = await fetch(
        `${
          config.BACKEND_URL
        }/admin/rewards/approved-count/users?page=${page}&limit=50&search=${encodeURIComponent(
          searchTerm
        )}`,
        { headers: { authorization: token } }
      );
      const data = await res.json();
      if (data.status === "success") {
        setUsers(data.users);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalUsers(data.totalUsers);
      } else toast.error("Failed to load users");
    } catch {
      toast.error("Server error while fetching users");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage]);

  // Reward calculation based on approved count
  const calculateReward = (user) => {
    let count = editedCounts[user._id] ?? user.totalApprovedCount;

    // Exception handling for specific user
    if (user.email === "beautifullycourt@gmail.com") {
      count = Math.max(count, 3);
    }

    let rewardTotal = 0;
    if (count >= 1) rewardTotal += 10;
    if (count >= 3) rewardTotal += 15;
    if (count >= 5) rewardTotal += 30;
    if (count >= 10) rewardTotal += 55;
    if (count > 10) rewardTotal += (count - 10) * 5;

    let status = "Locked";
    if (count >= 3) {
      status = "Eligible";
    } else if (count >= 1) {
      status = `${3 - count} more to unlock $25`;
    }

    return {
      reward: count >= 3 ? `$${rewardTotal}` : "-",
      status: status,
    };
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1); // reset to page 1 on new search
    fetchUsers(1, value);
  };
  const handleSave = async (userId) => {
    const newCount = editedCounts[userId];
    if (newCount === undefined) return;

    try {
      const res = await fetch(
        `${config.BACKEND_URL}/admin/rewards/approved-count/user/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            approvedContent: Number(newCount),
            note: "Manual approved content adjustment via admin table",
          }),
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        toast.success("Approved Count updated");
        setEditedCounts((prev) => ({ ...prev, [userId]: undefined }));
        fetchUsers(currentPage);
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to update approved count");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Manual Approved Content Adjustment ({totalUsers})
      </h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={handleSearch}
        className="bg-gray-800 p-2 rounded w-full mb-4 text-white"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-900 text-left">
              <th className="p-2 border-b border-gray-700">Name</th>
              <th className="p-2 border-b border-gray-700">Email</th>
              <th className="p-2 border-b border-gray-700">Approved Posts</th>
              <th className="p-2 border-b border-gray-700">Reward Status</th>
              <th className="p-2 border-b border-gray-700">Reward</th>
              <th className="p-2 border-b border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  No matching users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const { reward, status } = calculateReward(user);
                return (
                  <tr key={user._id} className="border-t border-gray-800">
                    <td className="p-2">{user.name || "Unnamed"}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={
                          editedCounts[user._id] ?? user.totalApprovedCount
                        }
                        onChange={(e) =>
                          setEditedCounts((prev) => ({
                            ...prev,
                            [user._id]: e.target.value,
                          }))
                        }
                        className="bg-gray-700 p-1 rounded w-20 text-white"
                      />
                    </td>
                    <td className="p-2">{user.rewardStatus || status}</td>
                    <td className="p-2">
                      {user.reward ? `$${user.reward}` : reward}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleSave(user._id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    </div>
  );
};

export default ManualApprovedAdjust;
