/** @format */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import config from "../../config";

const ExclusionsWhitelist = () => {
  const [tab, setTab] = useState("excluded");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [reason, setReason] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [excluded, setExcluded] = useState([]);
  const [whitelisted, setWhitelisted] = useState([]);
  const [loading, setLoading] = useState(true);

const [selectedIds, setSelectedIds] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${config.BACKEND_URL}/admin/recommendations/exclusions-whitelist?page=1&limit=25`
        );

        if (res.data?.status === "success") {
          const allData = res.data.data;

          const excludedData = allData.filter(
            (item) => item.type === "excluded"
          );
          const whitelistedData = allData.filter(
            (item) => item.type === "whitelisted" || item.type === "whitelist"
          );

          setExcluded(excludedData);
          setWhitelisted(whitelistedData);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Tab data
  const data = tab === "excluded" ? excluded : whitelisted;

  // ✅ Filtering
  const filteredData = data.filter((c) => {
    const matchesSearch = search
      ? (c.reason || "").toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesPlatform = platform
      ? (c.platform || "").toLowerCase() === platform.toLowerCase()
      : true;
    const matchesReason = reason
      ? (c.reason || "").toLowerCase() === reason.toLowerCase()
      : true;

    return matchesSearch && matchesPlatform && matchesReason;
  });

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("❌ Invalid ID");
      return;
    }

    // ✅ Show custom confirmation toast
    toast.info(
      <div className="flex flex-col">
        <span>Are you sure you want to remove this record?</span>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
            onClick={async () => {
              toast.dismiss(); // close confirmation toast
              try {
                const token = Cookie.get("AdminToken");
                const res = await axios.delete(
                  `${config.BACKEND_URL}/admin/recommendations/exclusions-whitelist/${id}`,
                  {
                    headers: {
                      Authorization: token?.startsWith("Bearer ")
                        ? token
                        : `Bearer ${token}`,
                    },
                  }
                );

                if (res.data?.status === "success") {
                  toast.success(" Successfully removed.");

                  // ✅ Update UI
                  if (tab === "excluded") {
                    setExcluded((prev) => prev.filter((item) => item._id !== id));
                  } else {
                    setWhitelisted((prev) => prev.filter((item) => item._id !== id));
                  }
                } else {
                  toast.error(res.data?.message || "Failed to remove item.");
                }
              } catch (error) {
                console.error("Error removing item:", error);
                toast.error("Server error: Failed to remove item.");
              }
            }}
          >
            Yes
          </button>

          <button
            className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded text-sm"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

const handleBulkRemove = () => {
  if (selectedIds.length === 0) {
    toast.info("Please select at least one record to remove.");
    return;
  }

  // Show custom confirmation popup using toast
  toast.info(
    <div className="flex flex-col">
      <span>Are you sure you want to remove selected records?</span>
      <div className="flex justify-end gap-2 mt-2">
        <button
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
          onClick={async () => {
            toast.dismiss();
            try {
              const token = Cookie.get("AdminToken");
              const res = await axios.post(
                `${config.BACKEND_URL}/admin/recommendations/exclusions-whitelist/bulk-remove`,
                { ids: selectedIds },
                {
                  headers: {
                    Authorization: token?.startsWith("Bearer ")
                      ? token
                      : `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (res.data?.status === "success") {
                toast.success("✅ Selected records removed successfully!");

                // Update UI after successful removal
                if (tab === "excluded") {
                  setExcluded((prev) =>
                    prev.filter((item) => !selectedIds.includes(item._id))
                  );
                } else {
                  setWhitelisted((prev) =>
                    prev.filter((item) => !selectedIds.includes(item._id))
                  );
                }

                setSelectedIds([]); // clear selection
              } else {
                toast.error(res.data?.message || "Failed to remove records.");
              }
            } catch (error) {
              console.error("Error in bulk remove:", error);
              toast.error("Server error: Failed to remove records.");
            }
          }}
        >
          Yes
        </button>

        <button
          className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded text-sm"
          onClick={() => toast.dismiss()}
        >
          Cancel
        </button>
      </div>
    </div>,
    { autoClose: false, closeOnClick: false }
  );
};

  
  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Exclusions & Whitelist
        </h1>
        <p className="text-gray-400 text-sm">
          Manage creators who are either excluded from or force-included in
          recommendations.
        </p>
      </div>

      {/* Tabs */}
      {/* Header with Tabs and Bulk Remove Button */}
      <div className="flex items-center justify-between mb-4">
        {/* Tabs */}
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${tab === "excluded"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => setTab("excluded")}
          >
            Excluded
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${tab === "whitelist"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            onClick={() => setTab("whitelist")}
          >
            Whitelisted
          </button>
        </div>

        {/* Bulk Remove Button (changes by tab) */}
        <button onClick={handleBulkRemove}
          className={`px-8 py-2 rounded-lg font-medium text-white shadow-md transition-colors duration-200 ${tab === "excluded"
            ? "bg-green-600 hover:bg-green-500"
            : "bg-red-600 hover:bg-red-500"
            }`}
        >
          Bulk Remove
        </button>
      </div>


      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-[#1f1f1f] p-4 rounded-lg justify-between">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="text-md text-gray-400">
              Search handle, Creator ID or Tag
            </label>
            <input
              placeholder="Search handle or Creator ID"
              className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-1">
            <label className="text-md text-gray-400">Platform</label>
            <select
              className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Platform</option>
              <option>TikTok</option>
              <option>Instagram</option>
            </select>
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1">
            <label className="text-md text-gray-400">Reason</label>
            <select
              className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Reason</option>
              <option>Spam</option>
              <option>Inappropriate Content</option>
              <option>Low Quality</option>
              <option>Other</option>
            </select>
          </div>

          {/* Registration Date */}
          <div className="flex flex-col gap-1">
            <label className="text-md text-gray-400">Registration date</label>
            <input
              type="text"
              placeholder="Apr range"
              className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
            />
          </div>

          <button
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white"
            onClick={() => {
              setSearch("");
              setPlatform("");
              setReason("");
              setRegistrationDate("");
            }}
          >
            Reset
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading...</div>
      ) : (
        <div className="overflow-auto rounded-lg border border-gray-700">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-[#1f1f1f] text-gray-400">
              <tr>
                <th className="px-4 py-2">Creator Name</th>
                <th className="px-4 py-2">
                  {tab === "excluded" ? "Reason" : "Tag"}
                </th>
                {/* ✅ Changed from "Added By" to "Platform" */}
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Date Added</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((c) => {
                const creatorMongoId =
                  (c.creator && c.creator._id) || c.creatorId || c._id;
                const isExcludedTab = tab === "excluded";

                return (
                  <tr
                    key={c._id}
                    className="border-t border-gray-700 hover:bg-[#2a2a2a]"
                  >
                    {/* ✅ Show creator name or fallback */}
                    <td className="px-4 py-2">
                      {c.creator?.name || c.creator?.username || "Unknown creator"}
                    </td>
                    <td className="px-4 py-2">{c.reason || "-"}</td>
                    <td className="px-4 py-2">{c.platform || "—"}</td>
                    <td className="px-4 py-2">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium text-white transition-colors duration-200
              ${isExcludedTab
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-red-600 hover:bg-red-500"
                          }`}
                        onClick={() => handleDelete(c._id)}
                      >
                        {isExcludedTab
                          ? "Remove from Exclusion"
                          : "Remove from Whitelist"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No records found for {tab}.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default ExclusionsWhitelist;
