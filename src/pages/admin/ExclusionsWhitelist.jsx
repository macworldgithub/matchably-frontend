/** @format */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
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
  const [pendingAddIds, setPendingAddIds] = useState(new Set());

  // ✅ Fetch data on mount
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

  // ✅ Add Whitelist (aligned with backend)
  const handleAddWhitelist = async ({
    creatorMongoId,
    brandId = null,
    campaignId = null,
    tags = [],
  }) => {
    try {
      if (!creatorMongoId || typeof creatorMongoId !== "string") {
        alert("Invalid creator id");
        return;
      }
      // Prevent multiple concurrent requests for same creator
      if (pendingAddIds.has(creatorMongoId)) return;
      setPendingAddIds((prev) => {
        const next = new Set(prev);
        next.add(creatorMongoId);
        return next;
      });

      // Build payload exactly as backend expects
      const payload = {
        creatorId: creatorMongoId,
        adminId: "68e619f740042456e84c9c75",
        brandId: "6704d7f517b4b2a46f06f9a9", // ✅ Hardcoded brandId
        campaignId: "6704d80617b4b2a46f06f9b1", // ✅ Hardcoded campaignId
        ...(Array.isArray(tags) && tags.length ? { tags } : {}),
      };

      const token = Cookie.get("AdminToken");
      const res = await axios.post(
        `${config.BACKEND_URL}/admin/recommendations/whitelist/add`,
        payload,
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
        const created = {
          _id: creatorMongoId,
          creatorId: creatorMongoId,
          reason: "Whitelisted by admin",
          createdAt: new Date().toISOString(),
          platform: "Instagram", // ✅ set platform for display
          type: "whitelisted",
        };
        setWhitelisted((prev) => {
          const seen = new Set();
          const normalized = [created, ...prev].filter((item) => {
            const id = item.creatorId || item._id;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });
          return normalized;
        });
      } else {
        alert(res.data?.message || "Failed to add whitelist. Try again.");
      }
    } catch (error) {
      console.error("❌ Error adding whitelist:", error);
      alert("Failed to add whitelist. Please try again.");
    } finally {
      setPendingAddIds((prev) => {
        const next = new Set(prev);
        next.delete(creatorMongoId);
        return next;
      });
    }
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
      <div className="flex gap-4 mb-4 border-b border-gray-700">
        <button
          className={`px-4 py-2 rounded-t font-medium ${
            tab === "excluded"
              ? "bg-[#1f1f1f] text-red-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setTab("excluded")}
        >
          Exclusion
        </button>
        <button
          className={`px-4 py-2 rounded-t font-medium ${
            tab === "whitelist"
              ? "bg-[#1f1f1f] text-green-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setTab("whitelist")}
        >
          Whitelisted
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
                // const creatorId = c.creatorId || c._id;
                return (
                  <tr
                    key={c._id}
                    className="border-t border-gray-700 hover:bg-[#2a2a2a]"
                  >
                    <td className="px-4 py-2">{c.creator?.name || c.creator?.username || "Unknown creator"}</td>
                    <td className="px-4 py-2">{c.reason || "-"}</td>
                    {/* ✅ Show platform instead of addedBy */}
                    <td className="px-4 py-2">{c.platform || "—"}</td>
                    <td className="px-4 py-2">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {(() => {
                        const creatorMongoId =
                          (c.creator && c.creator._id) || c.creatorId || c._id;
                        return (
                          <button
                            className="px-2 py-1 rounded text-sm bg-green-600 hover:bg-green-500 text-white"
                            disabled={pendingAddIds.has(creatorMongoId)}
                            onClick={() =>
                              handleAddWhitelist({
                                creatorMongoId,
                                tags: Array.isArray(c.tags) ? c.tags : [],
                              })
                            }
                          >
                            {pendingAddIds.has(creatorMongoId)
                              ? "Adding..."
                              : "Add Whitelist"}
                          </button>
                        );
                      })()}
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
