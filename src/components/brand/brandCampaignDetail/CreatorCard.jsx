"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { handleTrackingSave } from "../../../utils/trackingHandler";

import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaCheck,
  FaTimes,
  FaClock,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaLink,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import config from "../../../config";

const getRandomGradient = () => {
  const gradients = [
    "from-blue-300 to-green-300",
    "from-yellow-300 to-orange-300",
    "from-purple-300 to-pink-300",
    "from-indigo-300 to-violet-300",
    "from-teal-300 to-cyan-300",
    "from-pink-300 to-red-300",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const platformIcon = {
  Instagram: <FaInstagram className="text-pink-400 text-sm" />,
  YouTube: <FaYoutube className="text-red-400 text-sm" />,
  TikTok: <FaTiktok className="text-white text-sm" />,
};

const statusIconMap = {
  Approved: {
    icon: <FaCheck className="text-green-300 w-3 h-3" />,
    bg: "bg-green-800",
  },
  Rejected: {
    icon: <FaTimes className="text-red-300 w-3 h-3" />,
    bg: "bg-red-800",
  },
  Pending: {
    icon: <FaClock className="text-yellow-300 w-3 h-3" />,
    bg: "bg-yellow-800",
  },
};

const InfoField = ({ label, value }) => (
  <div className="text-sm text-white">
    <span className="text-neutral-500 font-semibold">{label}:</span>{" "}
    <span className="text-neutral-300 text-xs">{value || "N/A"}</span>
  </div>
);

const BLOCK_MODAL_KEY = (brandId) => `blockModalShown_${brandId}`;

const CreatorCard = ({
  creator = {},
  brandId,
  onHandleApproveOrReject,
  onViewContent,
  onRefresh,
  isLocked,
}) => {
  const {
    id,
    name = "",
    socialId = "",
    blocked = false,
    avatar,
    platform,
    participationStatus = "Pending",
    shippingInfo = {},
    tracking,
    tracking_info,
    deliveryStatus,
    deliveredAt,
    contentStatus,
    contentUrls = {},
    campaignId,
    bid,
    email,
    userid,
    profileUrl,
  } = creator;

  const [trackingInput, setTrackingInput] = useState(tracking || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(blocked || false);

  const isPending = participationStatus === "Pending";
  const isApproved = participationStatus === "Approved";
  const gradient = useMemo(getRandomGradient, []);
  const initials = getInitials(name);
  const status = statusIconMap[participationStatus] || {};

  const contentDeadline = deliveredAt
    ? new Date(new Date(deliveredAt).getTime() + 10 * 86400000).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not Set";

  const statusMap = {
    NotFound: "🔍 Not Found",
    InfoReceived: "📥 Info Received",
    InTransit: "🚚 In Transit",
    Expired: "⚠️ Expired",
    AvailableForPickup: "📦 Available for Pickup",
    OutForDelivery: "🚛 Out for Delivery",
    DeliveryFailure: "❌ Delivery Failed",
    Delivered: "✅ Delivered",
    Exception: "❗ Exception",
  };

  const handleSaveTracking = async () => {
    setLoading(true);
    try {
      const response = await handleTrackingSave(id, trackingInput);
      if (response.success) {
        setLoading(false);
        setIsEditing(false);
        onRefresh(true);
        toast.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
        const token = localStorage.getItem('BRAND_TOKEN');
      const res = await axios.post(`${config.BACKEND_URL}/brand/creators/block-creator`, {creatorId: userid }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status == "success") {
        setIsBlocked(true);
        localStorage.setItem(BLOCK_MODAL_KEY(brandId), "true");
        toast(
          <div>
            🚫 Creator has been blocked.{" "}
            <button
              className="underline text-blue-400"
              onClick={(e) => {
                e.stopPropagation();
                handleUnblock();
              }}
            >
              Undo
            </button>
          </div>
        );
        onRefresh(true);
      } else {
        throw new Error(res.data.message || "Failed to block");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to block creator");
    }
    setIsBlocking(false);
  };

  const handleUnblock = async () => {
    setIsBlocking(true);
    try {
       const token = localStorage.getItem('BRAND_TOKEN');
      const res = await axios.post(`${config.BACKEND_URL}/brand/creators/unblock-creator`, {creatorId: userid }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status == "success") {
        setIsBlocked(false);
        toast.success(res.data.message || "Creator unblocked successfully");
        onRefresh(true);
      } else {
        throw new Error(res.data.message || "Failed to unblock");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to unblock creator");
    }
    setIsBlocking(false);
  };

  return (
    <div
      className={`relative flex flex-col h-full rounded-xl border p-5 transition-all duration-300 space-y-4 shadow-xl ${
        isLocked || isBlocked
          ? "bg-neutral-800/50 text-neutral-400 border-neutral-700 blur-[1px]"
          : "bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-800"
      }`}
    >
      {/* Lock / Block Overlay */}
      {(isLocked || isBlocked) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 text-gray-400 text-sm font-semibold rounded-xl">
          <FaLock className="text-xl mb-1" />
          <span>{isBlocked ? "Creator Blocked" : "Unlock to view"}</span>
          {!isBlocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert("Upgrade to unlock full access.");
              }}
              className="mt-2 text-xs bg-black hover:bg-neutral-600 text-white px-3 py-1 rounded-full font-medium"
            >
              🔓 Unlock
            </button>
          )}
        </div>
      )}

      {/* Status Icon + Block Button */}
      <div className="absolute top-8 right-12 flex items-center space-x-2">
        <div
          className={`text-xs flex items-center justify-center rounded-full p-1 ${status.bg}`}
          data-tooltip-id={`status-tooltip-${socialId}`}
          data-tooltip-content={participationStatus}
        >
          {status.icon}
          <Tooltip id={`status-tooltip-${socialId}`} />
        </div>

        {isApproved && !isLocked && !isBlocked && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (!localStorage.getItem(BLOCK_MODAL_KEY(brandId))) {
                setIsBlockModalOpen(true);
              } else {
                await handleBlock();
              }
            }}
            className="text-red-500 cursor-pointer hover:text-red-600 text-xs font-semibold rounded px-2 py-1 bg-red-100/20"
            title="Block this Creator"
            disabled={isBlocking}
          >
            {isBlocking ? "Blocking..." : "🚫 Block"}
          </button>
        )}
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3">
          {avatar && !isLocked && !isBlocked ? (
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-neutral-800 font-bold text-sm uppercase bg-gradient-to-br ${gradient}`}
            >
              {isLocked || isBlocked ? "🔒" : initials}
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-neutral-200">
              {isLocked || isBlocked ? "Locked User" : name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              {platformIcon[platform]}
              <span>
                {isLocked || isBlocked ? (
                  "@******"
                ) : (
                  <div className="text-sm text-white">
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-300 hover:underline hover:text-primary-600 text-xs"
                    >
                      @{socialId || "N/A"}
                    </a>
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

        {!isLocked && !isBlocked && (
          <div className="text-neutral-400">
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
      </div>

      {/* Payment Info for Paid Campaigns */}
      {campaignId?.campaignType === "paid" && (
        <>
          {campaignId?.pricingModel === "fixed" && (
            <div className="flex justify-center items-center">
              <InfoField label="Payment Offered" value={"$" + campaignId?.price || "N/A"} />
            </div>
          )}
          {campaignId?.pricingModel === "bidding" && (
            <div className="flex justify-center items-center">
              <InfoField label="Creator Bid" value={"$" + bid || "N/A"} />
            </div>
          )}
        </>
      )}

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && isApproved && !isLocked && !isBlocked && (
          <motion.div
            className="flex flex-col gap-2 pt-4 border-t border-neutral-800"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <InfoField label="Participation Status" value="Approved" />
            <InfoField label="Name" value={name} />
            <div className="text-sm text-white">
              <span className="text-neutral-500 font-semibold">Social Id:</span>{" "}
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:underline hover:text-primary-600 text-xs"
              >
                @{socialId || "N/A"}
              </a>
            </div>
            {campaignId?.campaignType === "paid" && <InfoField label="Email" value={email} />}
            <InfoField label="Phone Number" value={shippingInfo.phone} />
            <InfoField label="Address" value={shippingInfo.address} />

            {campaignId?.campaignType === "paid" && campaignId?.pricingModel === "bidding" && (
              <div className="flex">
                <InfoField label="Payment" value={"$" + bid || "N/A"} />
              </div>
            )}

            {/* Tracking */}
            <div className="flex flex-col gap-2">
              <span className="text-sm text-neutral-500 font-semibold">Tracking Number:</span>
              {tracking && !isEditing ? (
                <div className="flex items-center justify-between gap-2 text-sm text-neutral-300">
                  <a
                    href={tracking_info?.tracking_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 hover:underline"
                  >
                    {tracking} <FaLink className="text-blue-400 hover:text-blue-500" />
                  </a>
                  {tracking && tracking_info?.delivery_status !== "Delivered" && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-400 hover:text-blue-500 text-xs"
                    >
                      <FaEdit className="inline" /> Edit
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-600 text-white text-sm"
                  />
                  <button
                    onClick={handleSaveTracking}
                    disabled={loading}
                    className="w-full self-start px-0 py-2 bg-green-600 hover:bg-green-700 text-sm rounded-md font-medium"
                  >
                    {loading ? "Updating" : tracking ? "Update" : "Save"}
                  </button>
                </div>
              )}
            </div>

            <InfoField
              label="Delivery Status"
              value={
                tracking
                  ? statusMap[tracking_info?.delivery_status] + " (" + tracking_info?.courier + ")" || "N/A"
                  : "N/A"
              }
            />
            <InfoField label="Content Deadline" value={contentDeadline} />
            <InfoField label="Content Status" value={contentStatus || "Not Submitted"} />

            {/* View Content */}
            {contentStatus !== "Not Submitted" && (
              <button
                onClick={() => onViewContent(creator)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md py-2 px-4 text-center font-medium w-fit"
              >
                View Content
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Buttons */}
      {isPending && !isLocked && !isBlocked && (
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHandleApproveOrReject?.(id, "approve");
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-full py-2 font-semibold"
          >
            <FaCheck className="inline-block mr-1" />
            Approve
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHandleApproveOrReject?.(id, "reject");
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full py-2 font-semibold"
          >
            <FaTimes className="inline-block mr-1" />
            Reject
          </button>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-neutral-900 p-6 rounded-lg max-w-sm text-white">
            <p>This creator will no longer be able to participate in your campaigns. Continue?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleBlock();
                  setIsBlockModalOpen(false);
                }}
                disabled={isBlocking}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
              >
                {isBlocking ? "Blocking..." : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorCard;
