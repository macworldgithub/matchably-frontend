import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Clock,
  Gift,
  DollarSign,
  ArrowRight,
  X,
  CheckCircle2,
  BadgePercent,
} from "lucide-react";
import Cookie from "js-cookie";
import config from "../config";

const fmtCurrency = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n)
    : "";

const relTime = (iso) => {
  const now = new Date();
  const t = new Date(iso);
  const diff = t.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  if (mins < 60) return diff < 0 ? `${mins}m ago` : `in ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return diff < 0 ? `${hours}h ago` : `in ${hours}h`;
  const days = Math.round(hours / 24);
  return diff < 0 ? `${days}d ago` : `in ${days}d`;
};

const deadlineLabel = (iso) => {
  const d = new Date(iso);
  const rel = relTime(iso);
  return { text: `${d.toLocaleDateString()} (${rel})`, full: d.toString() };
};

function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-gray-900 text-gray-100 p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-sm text-gray-300">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InvitationCard({ invite, onAccept, onDecline }) {
  const [showPayout, setShowPayout] = useState(false);
  const deadline = deadlineLabel(invite.deadlineISO);
  const isBidding = invite.type === "Bidding";
  const isFixed = invite.type === "Fixed";
  const isGifted = invite.type === "Gifted";

  return (
    <motion.div
      layout
      className="rounded-2xl bg-neutral-900 p-5 shadow-lg ring-1 ring-neutral-700 hover:ring-blue-500 transition"
    >
      {invite.status === "Accepted" && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-green-900/40 px-3 py-2 text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">You joined this campaign!</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Campaign Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={invite.campaignThumbnail || invite.brandLogo}
            alt={`${invite.campaignName || 'Campaign'} thumbnail`}
            className="h-16 w-16 rounded-xl object-cover ring-1 ring-gray-700"
            onError={(e) => {
              // Fallback to brand logo if campaign thumbnail fails
              if (e.target.src !== invite.brandLogo) {
                e.target.src = invite.brandLogo;
              }
            }}
          />
          {/* Brand Logo Overlay */}
          <img
            src={invite.brandLogo}
            alt={`${invite.brandName} logo`}
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full object-cover ring-2 ring-neutral-900 bg-neutral-900"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {invite.campaignName}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                by <span className="font-medium text-gray-300">{invite.brandName}</span>
              </p>
            </div>
            
            {/* Status Badge */}
            {invite.status === "Pending" && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-300">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                Invited
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span title={deadline.full}>
                <span className="font-medium">Deadline:</span> {deadline.text}
              </span>
            </div>
            
            {/* Platform Icons */}
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.055 1.219-5.055s-.284-.592-.284-1.461c0-1.368.795-2.391 1.785-2.391.842 0 1.249.632 1.249 1.389 0 .846-.538 2.112-.816 3.281-.232.983.492 1.785 1.461 1.785 1.751 0 3.096-1.847 3.096-4.513 0-2.361-1.696-4.011-4.119-4.011-2.806 0-4.455 2.103-4.455 4.274 0 .847.326 1.754.732 2.246.08.098.092.184.068.284-.075.314-.24.971-.273 1.107-.042.177-.137.215-.316.129-1.217-.566-1.979-2.343-1.979-3.768 0-3.07 2.231-5.891 6.436-5.891 3.378 0 6.005 2.408 6.005 5.626 0 3.358-2.118 6.061-5.059 6.061-.987 0-1.917-.514-2.235-1.126l-.608 2.316c-.22.852-.815 1.918-1.213 2.57A11.943 11.943 0 0 0 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              <span>/</span>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-2.08v5.73a2.82 2.82 0 1 1-2.08-2.73V2.69a4.83 4.83 0 0 0 0 9.65 4.84 4.84 0 0 0 2.08-.46V9.4a2.82 2.82 0 1 1 0-5.64 2.82 2.82 0 0 1 2.08 2.73V2h2.08v4.25a4.83 4.83 0 0 1 3.77-4.25v2.08a2.82 2.82 0 1 1-2.08 2.61z"/>
              </svg>
              <span className="text-gray-500">TikTok/IG</span>
            </div>
          </div>
          
          <div className="rounded-xl bg-neutral-800 p-3 text-sm">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <DollarSign className="h-4 w-4" /> 
              <span>Reward</span>
              {isBidding && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-yellow-800/50 px-2 py-0.5 text-xs font-semibold text-yellow-300 border border-yellow-700">
                  <BadgePercent className="h-3 w-3" /> 
                  BIDDING
                </span>
              )}
              {isGifted && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-green-800/50 px-2 py-0.5 text-xs font-semibold text-green-300 border border-green-700">
                  <Gift className="h-3 w-3" /> 
                  GIFTED
                </span>
              )}
            </div>
            {isFixed && (
              <div className="text-gray-300">
                Product +
                <button
                  className="ml-1 underline decoration-dotted underline-offset-2 hover:text-blue-400 font-medium"
                  onClick={() => setShowPayout(true)}
                >
                  {fmtCurrency(invite.rewardUsd)}
                </button>
              </div>
            )}
            {isBidding && (
              <div className="text-gray-300">
                Product + <span className="text-yellow-400 font-medium">Bidding Amount</span>
                <span className="text-gray-500 text-xs block">(Price will be revealed upon acceptance)</span>
              </div>
            )}
            {isGifted && (
              <div className="text-gray-300">
                <span className="font-medium">Product</span>
                {invite.shippingIncluded && (
                  <span className="text-green-400"> + Free Shipping</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {invite.status === "Pending" && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row items-center justify-between">
          <button
            onClick={() => onAccept(invite.id)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
          >
            <CheckCircle2 className="h-5 w-5" /> Accept
          </button>
          <button
            onClick={() => onDecline(invite.id)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-900/40 px-5 py-2.5 font-semibold text-red-300 hover:bg-red-900"
          >
            <X className="h-5 w-5" /> Decline
          </button>
        </div>
      )}

      <Modal
        open={showPayout}
        onClose={() => setShowPayout(false)}
        title="Payout Details"
      >
        <p className="mb-3">
          You will receive <strong>{fmtCurrency(invite.rewardUsd)}</strong> upon
          completion per campaign terms.
        </p>
        <ul className="list-disc pl-5 text-gray-300">
          <li>Payment method: Bank transfer</li>
          <li>Typical processing: 5–7 business days</li>
          <li>Taxes may apply based on your location</li>
        </ul>
      </Modal>
    </motion.div>
  );
}

export default function InvitationsPage() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookie.get("token");
  // Fetch invites from backend
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await fetch(`${config.BACKEND_URL}/invitations`, {
          headers: {
            Authorization:token,
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setInvites(
            data.data.map((inv) => ({
              id: inv._id,
              brandLogo: inv.campaign.brand.logo,
              brandName: inv.campaign.brand.name,
              campaignName: inv.campaign.name,
              deadlineISO: inv.campaign.deadline,
              type: inv.campaign.type,
              rewardUsd: inv.campaign.reward,
              shippingIncluded: inv.campaign.shippingIncluded,
              status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1), // pending → Pending
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load invites", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  const visibleInvites = useMemo(
    () => invites.filter((i) => i.status !== "Declined" && i.status !== "Expired"),
    [invites]
  );
  const pendingCount = visibleInvites.filter((i) => i.status === "Pending").length;

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/invitations/${id}/accept`, {
        method: "PATCH",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (data.status === "success") {
        setInvites((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: "Accepted" } : i))
        );
      }
    } catch (err) {
      console.error("Accept error", err);
    }
  };

  const handleDecline = async (id) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/invitations/${id}/decline`, {
        method: "PATCH",
        headers: { Authorization:token},
      });
      const data = await res.json();
      if (data.status === "success") {
        setInvites((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: "Declined" } : i))
        );
      }
    } catch (err) {
      console.error("Decline error", err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 min-h-screen text-gray-400 text-center">
        Loading invitations...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 min-h-screen text-gray-100">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invitations</h1>
          <p className="mt-1 text-sm text-gray-400">
            These campaigns were sent to you by brands who want to work with you.
          </p>
        </div>
        <div className="rounded-full bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-300 ring-1 ring-neutral-800">
          Invitations ({pendingCount})
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {visibleInvites.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full rounded-2xl border border-dashed border-gray-700 bg-gray-800 p-10 text-center text-gray-400"
            >
              <Mail className="mx-auto mb-3 h-8 w-8" />
              <p className="font-medium">No invitations yet.</p>
              <a
                href="/campaigns/gifted"
                className="mt-2 inline-flex items-center gap-1 text-blue-400 underline"
              >
                Browse campaigns <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ) : (
            visibleInvites.map((invite) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <InvitationCard
                  invite={invite}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Tip: Deadline shows relative time with a full timestamp on hover.
      </p>
    </div>
  );
}
