"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import config from "../../config";

const BlockedCreators = () => {
  const [blockedCreators, setBlockedCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unblockingId, setUnblockingId] = useState(null);

  const fetchBlockedCreators = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.BACKEND_URL}/brand/creators/blocked-creators`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("BRAND_TOKEN")}`,
        },
      });
      if (res.data.status === "success") {
        setBlockedCreators(res.data.data);
      } else {
        toast.error("Failed to fetch blocked creators.");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching blocked creators.");
    }
    setLoading(false);
  };

  const handleUnblock = async (creatorId) => {
    if (!window.confirm("Are you sure you want to unblock this creator?")) return;

    setUnblockingId(creatorId);
    try {
      const res = await axios.post(
        `${config.BACKEND_URL}/brand/creators/unblock-creator`,
        { creatorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("BRAND_TOKEN")}`,
          },
        }
      );
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setBlockedCreators((prev) => prev.filter((c) => c.creatorId !== creatorId));
      } else {
        toast.error(res.data.message || "Failed to unblock creator.");
      }
    } catch (err) {
      toast.error(err.message || "Error unblocking creator.");
    }
    setUnblockingId(null);
  };

  useEffect(() => {
    fetchBlockedCreators();
  }, []);

  if (loading) return <div className="text-center py-10 text-white">Loading blocked creators...</div>;

  if (blockedCreators.length === 0)
    return <div className="text-center py-10 text-neutral-400">No blocked creators found.</div>;

  return (
    <div className="p-6 bg-neutral-900 rounded-md shadow-md text-white max-w-6xl mx-auto mt-15">
      <h2 className="text-3xl font-semibold mb-8 text-center">Blocked Creators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blockedCreators.map(({ creatorId, name, email, instagramId, tiktokId }) => (
          <div
            key={creatorId}
            className="bg-neutral-800 rounded-lg shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold truncate">{name || "Unnamed Creator"}</h3>
              <p className="text-xs text-neutral-400 truncate mt-1">{email || "No email available"}</p>
              <div className="flex space-x-4 mt-3 text-sm text-neutral-400">
                {instagramId && (
                  <a
                    href={`https://instagram.com/${instagramId.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                )}
                {tiktokId && (
                  <a
                    href={`https://tiktok.com/@${tiktokId.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    TikTok
                  </a>
                )}
              </div>
            </div>
            <button
              disabled={unblockingId === creatorId}
              onClick={() => handleUnblock(creatorId)}
              className={`mt-6 self-start flex items-center gap-2 text-xs rounded px-3 py-1 font-semibold transition ${
                unblockingId === creatorId
                  ? "bg-red-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              title="Unblock Creator"
            >
              {unblockingId === creatorId ? "Unblocking..." : <><FaTimes /> Unblock</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedCreators;
