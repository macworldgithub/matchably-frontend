import React, { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../../config";

const RecommendedCard = ({ creator, campaignId }) => {
  const [expanded, setExpanded] = useState(false);
  const [inviting, setInviting] = useState(false);
  const whyRecommended = creator?.whyRecommended || [];

  // Social URLs
  const tiktokUrl = creator?.tiktokId
    ? `https://www.tiktok.com/@${creator.tiktokId.replace("@", "")}`
    : null;
  const instagramUrl = creator?.instagramId
    ? `https://www.instagram.com/${creator.instagramId.replace("@", "")}`
    : null;

  const handleInvite = async () => {
    if (!campaignId) return;
    try {

      const token = localStorage.getItem("BRAND_TOKEN");
      setInviting(true);
      const res = await axios.post(`${config.BACKEND_URL}/brand/campaigns/invite/${campaignId}`, {
        creatorId: creator.creatorId
      },
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
      if (res.data.success) {
        toast.success(`Invite sent to ${creator.name}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to send invite.");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border p-5 space-y-4 shadow-lg bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-800 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
          {creator?.profilePic ? (
            <img
              src={creator.profilePic}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          ) : (
            creator?.name ? creator.name[0].toUpperCase() : "A"
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-gray-200 font-medium">{creator?.name || "Unknown"}</p>
            <span className="text-xs bg-purple-700 text-white px-2 py-0.5 rounded-md">
              🧠 AI Recommended
            </span>
          </div>
          <p className="text-gray-400 text-xs">{creator?.socialId || "@socialId"}</p>
          <div className="flex gap-3 mt-1">
            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-pink-400 text-xs hover:underline gap-1"
              >
                <FaTiktok /> TikTok
              </a>
            )}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-pink-400 text-xs hover:underline gap-1"
              >
                <FaInstagram /> Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-700" />

      {/* Creator Info */}
      <div className="space-y-1 text-sm text-gray-400">
        <p>
          {creator?.platform || "-"} /{" "}
          {creator?.followers ? `${creator.followers.toLocaleString()} followers` : "-"}
        </p>
        <p>Engagement: {creator?.engagement || "-"}%</p>
        {creator?.tags?.length > 0 && <p>📝 Tags: {creator.tags.join(", ")}</p>}
        {creator?.description && <p className="text-gray-300 italic">💬 {creator.description}</p>}
      </div>

      {/* Why Recommended */}
      {whyRecommended.length > 0 && (
        <div>
          <h4 className="text-yellow-400 font-medium mb-1">📊 Why Recommended</h4>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {(expanded ? whyRecommended : whyRecommended.slice(0, 3)).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          {whyRecommended.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-400 text-sm mt-1 hover:underline"
            >
              {expanded ? "View Less" : "View More"}
            </button>
          )}
        </div>
      )}

      {/* Invite Button */}
      <button
        onClick={handleInvite}
        disabled={inviting}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition ${
          inviting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        📩 {inviting ? "Inviting..." : "Invite to Campaign"}
      </button>
    </div>
  );
};

export default RecommendedCard;
