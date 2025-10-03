import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../config";
import { Helmet } from "react-helmet";
import { FaLock, FaUnlock, FaTrashAlt, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import countryList from "react-select-country-list";
import Pagination from "../../components/Pagination";
// =========================
// User Details Modal
// =========================
const getFlagEmoji = (countryName) => {
  if (!countryName) return "";
  const code = countryName.toUpperCase().slice(0, 2);
  return code.replace(/./g, (char) =>
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  );
};

const UserDetailsModal = ({ isOpen, onClose, userDetails, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202020] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading user details...</p>
            </div>
          ) : userDetails ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  1. Basic Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <strong className="text-white">Name:</strong>{" "}
                    {userDetails.name}
                  </div>
                  <div>
                    <strong className="text-white">Email:</strong>{" "}
                    {userDetails.email}
                  </div>
                  <div>
                    <strong className="text-white">Signup Date:</strong>{" "}
                    {userDetails.signupDate}
                  </div>
                  <div>
                    <strong className="text-white">Approved:</strong>{" "}
                    {userDetails.approved ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong className="text-white">Locked:</strong>{" "}
                    {userDetails.locked ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong className="text-white">Verified Email:</strong>{" "}
                    {userDetails.verifiedEmail ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong className="text-white">Blocked:</strong>{" "}
                    {userDetails.blocked ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong className="text-white">Country:</strong>{" "}
                    {userDetails.country &&
                    userDetails.country !== "Not Provided"
                      ? `${userDetails.country}`
                      : "Not Provided"}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  2. Social Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <strong className="text-white">Instagram ID:</strong>{" "}
                    {userDetails.instagramId}
                  </div>
                  <div>
                    <strong className="text-white">TikTok ID:</strong>{" "}
                    {userDetails.tiktokId}
                  </div>
                </div>
              </div>

              {/* Contact & Address */}
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  3. Contact & Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <strong className="text-white">Phone:</strong>{" "}
                    {userDetails.phone}
                  </div>
                  <div>
                    <strong className="text-white">Address:</strong>{" "}
                    {userDetails.address}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Failed to load user details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Assume UserDetailsModal component is defined elsewhere
export default function ViewApplicants() {
  const [applications, setApplications] = useState([]);
  const [totalUsers, setTotalUsers] = useState(844); // Hardcoded as requested
  const [filteredCount, setFilteredCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const token = Cookies.get("AdminToken");

  const usersPerPage = 20;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const countryFilter =
        selectedCountries.length > 0 &&
        !selectedCountries.find((c) => c.value === "all_countries")
          ? `&country=${selectedCountries.map((c) => c.value).join(",")}`
          : "";

      const res = await axios.get(
        `${config.BACKEND_URL}/admin/users?page=${page}&limit=${usersPerPage}${
          searchTerm ? `&search=${searchTerm}` : ""
        }${countryFilter}`,
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        setApplications(res.data.registered);
        setFilteredCount(res.data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchTerm, selectedCountries]);

  // Export
  const handleExport = async () => {
    const countryFilter =
      selectedCountries.length > 0 &&
      !selectedCountries.find((c) => c.value === "all_countries")
        ? `&country=${selectedCountries.map((c) => c.value).join(",")}`
        : "";

    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/admin/users?page=1&limit=${totalUsers}${
          searchTerm ? `&search=${searchTerm}` : ""
        }${countryFilter}`,
        { headers: { authorization: token } }
      );

      if (res.data.status !== "success") {
        toast.error("Failed to fetch users for export", {
          theme: "dark",
        });
        return;
      }

      const exportData = res.data.registered.map((u) => ({
        Name: u.name,
        Email: u.email,
        Phone: u.phone || "",
        Country: u.country || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registered");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, `Registered_Users_${new Date().toLocaleDateString()}.xlsx`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export users", { theme: "dark" });
    }
  };

  // Get comprehensive country list from react-select-country-list (same as signup)
  const allWorldCountries = useMemo(() => countryList().getData(), []);

  // Country dropdown options - single comprehensive list
  const countryOptions = useMemo(() => {
    return [
      { label: "All Countries", value: "all_countries" },
      ...allWorldCountries.map((country) => ({
        label: country.label,
        value: country.label,
      })),
    ];
  }, [allWorldCountries]);

  const handleViewDetails = async (id) => {
    setIsModalOpen(true); // Open modal
    setModalLoading(true); // Show loader
    setUserDetails(null); // Reset previous data

    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/admin/users/${id}/details`,
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        setUserDetails(res.data.user); // Set data to modal
      } else {
        toast.error("Failed to load user details", { theme: "dark" });
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      toast.error("Failed to load user details", { theme: "dark" });
    } finally {
      setModalLoading(false); // Hide loader
    }
  };
  const handleVerifyChange = async (userId, value) => {
    try {
      const res = await axios.patch(
        `${config.BACKEND_URL}/admin/users/${userId}/verify`,
        { isVerified: value === "yes" },
        { headers: { authorization: token } }
      );
      if (res.data.status === "success") {
        setApplications((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isVerified: value === "yes" } : u
          )
        );
        toast.success("Verification status updated successfully.", {
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Error updating verification status:", err);
      toast.error("Failed to update verification status.", {
        theme: "dark",
      });
    }
  };
  // Toggle blocked status
  const handleToggleBlock = async (userId) => {
    try {
      const res = await axios.patch(
        `${config.BACKEND_URL}/admin/users/${userId}/block`,
        {},
        { headers: { authorization: token } }
      );
      if (res.data.status === "success") {
        setApplications((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, blocked: !u.blocked } : u
          )
        );
        toast.success("Block status updated successfully.", {
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Error toggling block:", err);
      alert("Failed to update block status.");
    }
  };

  // Delete user function
  const handleDelete = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await axios.delete(
        `${config.BACKEND_URL}/admin/users/${userId}`,
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        setApplications((prev) => prev.filter((u) => u._id !== userId));
        setTotalUsers((prev) => prev - 1);
        toast.success("User deleted successfully.", { theme: "dark" });
      } else {
        toast.error("Failed to delete user.", { theme: "dark" });
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.", { theme: "dark" });
    }
  };

  // Generate filter summary text
  const getFilterSummary = () => {
    const hasCountryFilter =
      selectedCountries.length > 0 &&
      !selectedCountries.find((c) => c.value === "all_countries");
    const hasSearchFilter = searchTerm.trim() !== "";

    if (!hasCountryFilter && !hasSearchFilter) {
      return "Showing all users";
    }

    let summary = `Showing ${filteredCount} users`;

    if (hasCountryFilter) {
      if (selectedCountries.length === 1) {
        summary += ` from ${selectedCountries[0].label}`;
      } else {
        summary += ` from ${selectedCountries.length} countries`;
      }
    }

    if (hasSearchFilter) {
      summary += ` matching "${searchTerm}"`;
    }

    return summary;
  };

  return (
    <div className="p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]">
      <Helmet>
        <title>Users Management</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold text-white">
          {/* Registered Users – {totalUsers} total | {getFilterSummary()} */}
          Registered Users – 1256 total | {getFilterSummary()}
        </h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Select
            isMulti
            options={countryOptions}
            value={selectedCountries}
            onChange={setSelectedCountries}
            className="min-w-[200px] text-black"
            placeholder="Filter by Country"
            isSearchable={true}
            maxMenuHeight={300}
          />
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition"
          >
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-800">
        <table className="min-w-full text-sm text-gray-200">
          {/* Sticky Header */}
          <thead className="bg-gray-900  top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Joined</th>
              <th className="px-6 py-3 text-center font-semibold">Blocked</th>
              <th className="px-6 py-3 text-center font-semibold">
                Google User
              </th>
              <th className="px-6 py-3 text-left font-semibold">
                Verified Email
              </th>
              <th className="px-6 py-3 text-center font-semibold">Details</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {applications.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-800/60 transition-colors duration-200"
              >
                {/* Name */}
                <td className="px-6 py-3 font-medium text-white">
                  {user.name || "—"}
                </td>

                {/* Joined Date */}
                <td className="px-6 py-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* Blocked */}
                <td className="px-6 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      user.blocked
                        ? "bg-red-600/20 text-red-400 border border-red-600/30"
                        : "bg-green-600/20 text-green-400 border border-green-600/30"
                    }`}
                  >
                    {user.blocked ? "Yes" : "No"}
                  </span>
                </td>

                {/* Google User */}
                <td className="px-6 py-3 text-center">
                  {user.isGoogleUser ? (
                    <span className="text-green-400 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>

                {/* Verified Email */}
                <td className="px-6 py-3">
                  <select
                    value={user.isVerified ? "yes" : "no"}
                    onChange={(e) =>
                      handleVerifyChange(user._id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-md font-semibold text-white text-sm cursor-pointer
                ${
                  user.isVerified
                    ? "bg-green-700 border border-green-600"
                    : "bg-red-700 border border-red-600"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <option value="yes" className="text-black">
                      Yes
                    </option>
                    <option value="no" className="text-black">
                      No
                    </option>
                  </select>
                </td>

                {/* Details Button */}
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleViewDetails(user._id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
                  >
                    <FaEye />
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleToggleBlock(user._id)}
                    className={`p-2 rounded-lg text-white shadow transition ${
                      user.blocked
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.blocked ? <FaUnlock /> : <FaLock />}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow transition"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}

            {/* Loader Row */}
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userDetails={userDetails}
        loading={modalLoading}
      />
    </div>
  );
}
