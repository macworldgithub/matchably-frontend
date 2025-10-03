// src/pages/UserApplyCampaign.jsx
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";

const UserApplyCampaign = () => {
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState("gifted");
  const modalRef = useRef();
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [extensionError, setExtensionError] = useState("");
  const [extensionSuccess, setExtensionSuccess] = useState("");
  const [extensionDays, setExtensionDays] = useState(1);
  const [extensionReason, setExtensionReason] = useState("");
  const [extensionCampaign, setExtensionCampaign] = useState(null);
  const [monthlyExtensionsUsed, setMonthlyExtensionsUsed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await axios.get(
          `${config.BACKEND_URL}/user/campaigns/appliedCampaigns`,
          { headers: { authorization: token } }
        );
        if (res.data.status === "success") {
          console.log(res.data.campaigns);
          setAppliedCampaigns(res.data.campaigns);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMonthlyExtensionCount = async () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await axios.get(
          `${config.BACKEND_URL}/creator/extensions/monthly-count`,
          { headers: { authorization: token } }
        );
        if (res.data.status === "success") {
          setMonthlyExtensionsUsed(res.data.count || 0);
        }
      } catch (err) {
        console.error("Failed to fetch monthly extension count:", err);
        // If endpoint doesn't exist yet, default to 0
        setMonthlyExtensionsUsed(0);
      }
    };

    fetchCampaigns();
    fetchMonthlyExtensionCount();
  }, []);

  // Withdraw handler
  const handleWithdraw = (campaign) => {
    setSelectedCampaign(campaign);
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = async () => {
    if (!selectedCampaign) return;
    setWithdrawing(true);
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      await axios.post(
        `${config.BACKEND_URL}/user/campaigns/withdraw`,
        { campaignId: selectedCampaign.id },
        { headers: { authorization: token } }
      );
      setAppliedCampaigns((prev) =>
        prev.filter((c) => c.id !== selectedCampaign.id)
      );
    } catch (err) {
      console.error("Failed to withdraw application:", err);
    } finally {
      setWithdrawing(false);
      setShowWithdrawModal(false);
      setSelectedCampaign(null);
    }
  };

  // Helper: Check if extension can be requested
  const canRequestExtension = (c) => {
    // Must be approved
    if (c.applicationStatus !== "Approved") return false;
    
    // Content not submitted
    if (c.contentStatus === "Submitted" || c.contentStatus === "Approved") return false;
    
    // No pending extension
    if (c.extensionStatus && c.extensionStatus.toLowerCase().includes("pending")) return false;
    if (c.extensionRequested) return false;
    
    // Check if tracking info exists
    if (!c.trackingNumber || c.trackingNumber.trim() === "") return false;
    
    // Check monthly limit
    if (monthlyExtensionsUsed >= 1) return false;
    
    return true;
  };

  // Helper: Get extension status display and reason
  const getExtensionStatusInfo = (c) => {
    // If there's an existing extension status, show it
    if (c.extensionStatus) {
      if (c.extensionStatus.toLowerCase().includes("pending")) {
        return { display: "⏳ +2d Pending", color: "text-yellow-400", reason: null };
      } else if (c.extensionStatus.toLowerCase().includes("approved")) {
        const daysMatch = c.extensionStatus.match(/\+(\d+)d/);
        if (daysMatch) {
          const days = parseInt(daysMatch[1]);
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + days);
          return { 
            display: `✅ +${days}d Approved`, 
            color: "text-green-400", 
            reason: null 
          };
        }
        return { display: "✅ Approved", color: "text-green-400", reason: null };
      } else if (c.extensionStatus.toLowerCase().includes("rejected")) {
        return { display: "❌ Rejected", color: "text-red-400", reason: null };
      }
    }

    // Check if extension can be requested
    if (canRequestExtension(c)) {
      return { display: "🔘 Request Extension", color: "text-blue-400", reason: null, canRequest: true };
    }

    // Determine why extension is not available
    if (c.applicationStatus !== "Approved") {
      return { display: "🔒 Not Available", color: "text-gray-400", reason: "Campaign not approved" };
    }
    
    if (c.contentStatus === "Submitted" || c.contentStatus === "Approved") {
      return { display: "🔒 Not Available", color: "text-gray-400", reason: "Content already submitted" };
    }
    
    if (!c.trackingNumber || c.trackingNumber.trim() === "") {
      return { display: "🔒 Not Available", color: "text-gray-400", reason: "Tracking number not entered" };
    }
    
    if (monthlyExtensionsUsed >= 1) {
      return { display: "🔒 Not Available", color: "text-gray-400", reason: "Extension already requested this month" };
    }

    return { display: "🔒 Not Available", color: "text-gray-400", reason: "Not eligible" };
  };

  // Open modal
  const handleOpenExtensionModal = (campaign) => {
    setExtensionCampaign(campaign);
    setExtensionDays(1);
    setExtensionReason("");
    setExtensionError("");
    setExtensionSuccess("");
    setShowExtensionModal(true);
  };

  // Submit extension request
  const handleSubmitExtension = async () => {
    if (!extensionDays || !extensionReason.trim()) {
      setExtensionError("Please select days and provide a reason.");
      return;
    }
    setExtensionLoading(true);
    setExtensionError("");
    setExtensionSuccess("");
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.post(
        `${config.BACKEND_URL}/creator/extensions/request`,
        {
          campaignId: extensionCampaign.id,
          days: extensionDays,
          reason: extensionReason,
        },
        { headers: { authorization: token } }
      );
      if (res.data.status === "success") {
        setExtensionSuccess("Extension request submitted successfully.");
        setShowExtensionModal(false);
        
        // Update monthly count
        setMonthlyExtensionsUsed(prev => prev + 1);
        
        // Refresh campaigns data from backend to get updated extension status
        const campaignsRes = await axios.get(
          `${config.BACKEND_URL}/user/campaigns/appliedCampaigns`,
          { headers: { authorization: token } }
        );
        if (campaignsRes.data.status === "success") {
          setAppliedCampaigns(campaignsRes.data.campaigns);
        }
      } else {
        setExtensionError(res.data.message || "Failed to submit extension request.");
      }
    } catch (err) {
      setExtensionError(
        err?.response?.data?.message || "Failed to submit extension request."
      );
    } finally {
      setExtensionLoading(false);
    }
  };

  // Filter campaigns by tab
  const filteredCampaigns = appliedCampaigns.filter(
    (c) => c.campaignType === activeTab
  );

  return (
    <div className="flex bg-[var(--background)] justify-center w-full p-6">
      <div className="w-full lg:w-[70%] bg-[#171717] p-6 rounded-xl shadow-md border border-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">
          Applied Campaigns
        </h2>

        {/* Tab UI */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeTab === "gifted"
                ? "bg-green-500 text-black shadow-lg"
                : "bg-gray-800 text-white"
            }`}
            onClick={() => setActiveTab("gifted")}
          >
            Gifted
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              activeTab === "paid"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-800 text-white"
            }`}
            onClick={() => setActiveTab("paid")}
          >
            Paid
          </button>
        </div>

        {loading ? (
          // show 6 skeleton rows
          <div className="w-full">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCampaigns.map((c, idx) => {
                  const isPending = c.applicationStatus === "Pending";
                  let show7DayMsg = false;
                  if (isPending && activeTab === "paid") {
                    const appliedDate = new Date(c.appliedAt);
                    const now = new Date();
                    const diffDays = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24));
                    show7DayMsg = diffDays >= 7;
                  }
                  const extensionStatusInfo = getExtensionStatusInfo(c);
                  return (
                    <div key={idx} className="bg-[#232323] rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <button
                            className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-200 font-medium bg-transparent border-none text-left p-0 text-lg"
                            onClick={() => navigate(`/campaign/${c.id}`)}
                          >
                            {c.title}
                          </button>
                          <div className="text-xs text-gray-400 mt-1">Applied: {c.appliedAt.split("T")[0]}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block align-middle rounded-full mr-1 ${
                            c.applicationStatus === "Approved"
                              ? "bg-green-500"
                              : c.applicationStatus === "Rejected"
                              ? "bg-red-500"
                              : c.applicationStatus === "Pending"
                              ? "bg-yellow-400"
                              : "bg-gray-500"
                          }`} style={{ width: 10, height: 10 }} />
                          <span className={`font-bold text-base align-middle ${
                            c.applicationStatus === "Approved"
                              ? "text-green-400"
                              : c.applicationStatus === "Rejected"
                              ? "text-red-400"
                              : c.applicationStatus === "Pending"
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`} style={{ lineHeight: '1.5' }}>{c.applicationStatus}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-300">Tracking:</span> {c.trackingNumber ? (
                            <a href={`https://www.17track.net/en/track?nums=${c.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-1">Track Shipment</a>
                          ) : (
                            <span className="text-gray-400 ml-1">Waiting for shipment</span>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-300">Content:</span> <span className="ml-1">{c.contentStatus || "—"}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold text-gray-300">Extension:</span>
                        {extensionStatusInfo.canRequest ? (
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition text-xs ml-2"
                            onClick={() => handleOpenExtensionModal(c)}
                          >
                            Request Extension
                          </button>
                        ) : (
                          <span className={extensionStatusInfo.color + " ml-2"}>{extensionStatusInfo.display}</span>
                        )}
                      </div>
                      {activeTab === "paid" && isPending && (
                        <div className="mb-1 text-yellow-300 font-semibold whitespace-pre-line text-xs">
                          {`⏳ Status: Pending Brand Review\n🕒 Most brands respond within 3–5 days.\n📬 We'll notify you as soon as there's an update.`}
                          {show7DayMsg && (
                            <div className="mt-2 text-orange-300 whitespace-pre-line">
                              {`⏰ It's been over 7 days with no brand response.\nSome brands take longer to review. Feel free to apply to other campaigns while you wait.`}
                              <div className="mt-2">
                                <Link to="/campaigns/paid" className="text-blue-400 underline font-semibold">→ Browse Campaigns</Link>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {c.applicationStatus === "Rejected" && c.showReasonToInfluencer && c.rejectionReason && (
                        <details className="cursor-pointer text-sm text-white mt-1">
                          <summary>Why?</summary>
                          <div className="mt-1 bg-[#2a2a2a] p-2 rounded shadow text-gray-300 w-64">{c.rejectionReason}</div>
                        </details>
                      )}
                      <div className="flex gap-2 mt-2">
                        {c.applicationStatus === "Approved" && (
                          <Link
                            to={`/AddPostUrl/${c.id}`}
                            state={{ campaignTitle: c.title }}
                            className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-500 transition text-xs"
                          >
                            Submit Content
                          </Link>
                        )}
                        {c.applicationStatus === "Pending" && (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition flex items-center gap-2 mx-auto text-xs"
                            onClick={() => handleWithdraw(c)}
                            disabled={withdrawing}
                          >
                            Withdraw Application
                          </button>
                        )}
                        <Link
                          to={`/campaign/${c.id}`}
                          className="bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600 transition text-xs"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-300 text-center text-lg">No applied campaigns yet.</p>
            )}
          </div>
        )}

        {/* Tooltip Display */}
        {/* The setTooltipInfo state was removed, so this block is no longer needed. */}

        <p className="mt-4 text-gray-400 text-sm text-center">
          *All campaign approvals will be communicated individually via email.
        </p>

        {/* Withdraw Confirmation Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div ref={modalRef} className="bg-[#232323] p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-2">Are you sure you want to withdraw your application?</h3>
              <p className="text-gray-300 mb-4">Once canceled, you cannot re-apply to this campaign.</p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={withdrawing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold"
                  onClick={confirmWithdraw}
                  disabled={withdrawing}
                >
                  {withdrawing ? "Withdrawing..." : "Yes, Withdraw"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Extension Request Modal */}
        {showExtensionModal && (
          <Dialog open={showExtensionModal} onClose={() => setShowExtensionModal(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-[#171717] text-white rounded-xl p-6 shadow-xl">
                <Dialog.Title className="text-xl font-semibold text-blue-400 mb-4">Request Extension</Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm">Number of Days (1-5)</label>
                    <select
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={extensionDays}
                      onChange={e => setExtensionDays(Number(e.target.value))}
                      disabled={extensionLoading}
                    >
                      {[1,2,3,4,5].map(d => (
                        <option key={d} value={d}>{d} day{d > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Reason for Extension</label>
                    <textarea
                      className="w-full p-2 rounded bg-gray-700 text-white min-h-[80px]"
                      value={extensionReason}
                      onChange={e => setExtensionReason(e.target.value)}
                      maxLength={300}
                      disabled={extensionLoading}
                      placeholder="Explain why you need more time (min 10 characters)"
                    />
                  </div>
                  {extensionError && <div className="text-red-400 text-sm">{extensionError}</div>}
                  {extensionSuccess && <div className="text-green-400 text-sm">{extensionSuccess}</div>}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowExtensionModal(false)}
                      className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                      disabled={extensionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitExtension}
                      className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                      disabled={extensionLoading || extensionReason.length < 10}
                    >
                      {extensionLoading ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="flex justify-between gap-4 p-4 border-b border-gray-600 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-60" />
    <div className="h-4 bg-gray-700 rounded w-40" />
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 bg-gray-500 rounded-full" />
      <div className="h-4 bg-gray-700 rounded w-32" />
    </div>
  </div>
);

export default UserApplyCampaign;
