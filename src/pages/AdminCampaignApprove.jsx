import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import Cookie from "js-cookie";
import { toast } from "react-toastify";

const REJECTION_REASONS = [
  "Product image missing",
  "Content brief too vague",
  "Fixed price too low",
  "Bidding range invalid",
  "Usage rights too aggressive",
  "Other",
];

const AdminCampaignApprove = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCampaign, setExpandedCampaign] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState({
    id: null,
    type: null,
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const fetchPendingCampaigns = async () => {
    setLoading(true);
    try {
      const token = Cookie.get("AdminToken");
      const res = await axios.get(
        `${config.BACKEND_URL}/admin/campaign-approvals/pending`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.status === "success") {
        console.log(res.data.requests);
        setRequests(res.data.requests);
      } else {
        toast.error("Failed to load campaigns");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, type, reason = "") => {
    try {
      const token = Cookie.get("AdminToken");
      let url = `${config.BACKEND_URL}/admin/campaign-approvals/${id}/${type}`;
      let data = {};
      if (type === "reject" && reason) {
        data.rejection_reason = reason;
      }
      const res = await axios.patch(url, data, {
        headers: {
          Authorization: token,
        },
      });

      if (res.data.status === "success") {
        toast.success(`Campaign ${type} successfully`);
        fetchPendingCampaigns();
      } else {
        toast.error(res.data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating campaign status");
    }
  };

  const toggleExpansion = (campaignId) => {
    setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId);
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#181818] to-[#232323] text-white">
      <h2 className="text-3xl font-extrabold mb-8 tracking-tight">
        Pending Campaign Approvals
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></span>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-400 mt-16 text-lg">
          No pending campaigns.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {requests.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-[#232323] p-6 rounded-2xl shadow-lg border border-[#333] hover:shadow-2xl transition-all duration-300 relative group"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={campaign.brandLogo}
                  alt="Brand Logo"
                  className="h-14 w-14 rounded-full object-cover border-2 border-[#444]"
                />
                <div>
                  <h3 className="text-xl font-bold">
                    {campaign.campaignTitle}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {campaign.brandName}
                  </span>
                </div>
                {campaign.pricingModel && (
                  <span
                    className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold
                ${
                  campaign.pricingModel === "fixed"
                    ? "bg-green-700/80 text-green-200"
                    : "bg-blue-700/80 text-blue-200"
                }
              `}
                  >
                    {campaign.pricingModel?.charAt(0).toUpperCase() +
                      campaign.pricingModel?.slice(1)}
                  </span>
                )}
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="bg-gray-700/60 px-2 py-1 rounded text-xs">
                  <strong>Deadline:</strong>{" "}
                  {new Date(campaign.deadline).toLocaleDateString()}
                </span>
                <span className="bg-gray-700/60 px-2 py-1 rounded text-xs">
                  <strong>Creator Count:</strong> {campaign.creatorCount}
                </span>
                <span className="bg-gray-700/60 px-2 py-1 rounded text-xs">
                  <strong>Status:</strong> {campaign.status}
                </span>
              </div>
              <div className="mb-2">
                {campaign.pricingModel && (
                  <span className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {campaign.pricingModel === "fixed" &&
                      campaign.fixedPrice && (
                        <>${campaign.fixedPrice} per creator</>
                      )}
                    {campaign.pricingModel === "bidding" && (
                      <>
                        Min ${campaign.minBid} / Max ${campaign.maxBid}
                      </>
                    )}
                  </span>
                )}
                {!campaign.pricingModel && (
                  <span className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Gifted
                  </span>
                )}
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-300">
                  <strong>Usage Rights:</strong>{" "}
                  {campaign.usageTerms?.usageRights?.join(", ")}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-300">
                  <strong>Description:</strong> {campaign.productDescription}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setPendingAction({
                      id: campaign._id,
                      type: "approve",
                    });
                    setShowConfirm(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-2 rounded-lg shadow transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setPendingAction({
                      id: campaign._id,
                      type: "reject",
                      campaign,
                    });
                    if (campaign.pricingModel) {
                      setRejectReason("");
                      setCustomReason("");
                      setShowRejectModal(true);
                    } else {
                      setShowConfirm(true);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 rounded-lg shadow transition"
                >
                  Reject
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 rounded-lg shadow transition flex items-center justify-center gap-2"
                  onClick={() => toggleExpansion(campaign._id)}
                >
                  {expandedCampaign === campaign._id
                    ? "Hide Details"
                    : "View Details"}
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      expandedCampaign === campaign._id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Expanded Details Section */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedCampaign === campaign._id
                    ? "max-h-[2000px] opacity-100 mt-6"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t border-[#444] pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Campaign Title:
                      </span>{" "}
                      {campaign.campaignTitle || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Industry:
                      </span>{" "}
                      {campaign.campaignIndustry || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Product:
                      </span>{" "}
                      {campaign.productName || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Full Description:
                      </span>{" "}
                      {campaign.productDescription || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Target Audience:
                      </span>{" "}
                      {campaign.targetAudience || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Content Format:
                      </span>{" "}
                      {campaign.contentFormat?.join(", ") || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Deliverables:
                      </span>{" "}
                      {campaign.deliverables || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Platforms:
                      </span>{" "}
                      {campaign.platforms?.join(", ") || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Creator Count:
                      </span>{" "}
                      {campaign.creatorCount || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Required Hashtags:
                      </span>{" "}
                      {campaign.requiredHashtags?.join(", ") || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Mention Handle:
                      </span>{" "}
                      {campaign.mentionHandle || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Tone Guide:
                      </span>{" "}
                      {campaign.toneGuide || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Participation Requirements:
                      </span>{" "}
                      {campaign.participationRequirements || "Unknown"}
                    </div>

                    {/* Location Filter Information */}
                    <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <span className="font-semibold text-gray-300 block mb-2">
                        📍 Location Targeting:
                      </span>
                      {campaign.locationFilter?.noLocationPreference ? (
                        <div className="text-green-300 font-medium">
                          🌍 Worldwide (No Preference)
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {campaign.locationFilter?.regions?.length > 0 && (
                            <div>
                              <span className="text-blue-300 font-medium">
                                Regions:{" "}
                              </span>
                              <span className="text-gray-200">
                                {campaign.locationFilter.regions.join(", ")}
                              </span>
                            </div>
                          )}
                          {campaign.locationFilter?.countries?.length > 0 && (
                            <div>
                              <span className="text-orange-300 font-medium">
                                Countries:{" "}
                              </span>
                              <span className="text-gray-200">
                                {campaign.locationFilter.countries.join(", ")}
                              </span>
                            </div>
                          )}
                          {!campaign.locationFilter?.regions?.length &&
                            !campaign.locationFilter?.countries?.length && (
                              <div className="text-gray-400 italic">
                                No location preferences specified
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Requested Content:
                      </span>
                      <span className="ml-1">
                        Videos: {campaign.requestedContent?.videos || 0},
                        Photos: {campaign.requestedContent?.photos || 0}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Notes:
                      </span>{" "}
                      {campaign.requestedContent?.notes || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Product Images:
                      </span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {campaign.productImages &&
                        campaign.productImages.length > 0 ? (
                          campaign.productImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Product"
                              className="h-16 w-16 rounded-lg object-cover border border-[#444] shadow cursor-pointer hover:scale-110 transition-transform"
                              title="Click to enlarge"
                            />
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No images available
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Usage Rights:
                      </span>{" "}
                      {campaign.usageTerms?.usageRights?.join(", ") ||
                        "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Usage Rights Duration:
                      </span>{" "}
                      {campaign.usageTerms?.usageRightsDuration || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Late Submission Penalty:
                      </span>{" "}
                      {campaign.usageTerms?.lateSubmissionPenalty || "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Payment Responsibility Notice:
                      </span>{" "}
                      {campaign.usageTerms?.paymentResponsibilityNotice
                        ? "Yes"
                        : "No"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Deadline:
                      </span>{" "}
                      {campaign.deadline
                        ? new Date(campaign.deadline).toLocaleDateString()
                        : "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Recruitment End Date:
                      </span>{" "}
                      {campaign.recruitmentEndDate
                        ? new Date(
                            campaign.recruitmentEndDate
                          ).toLocaleDateString()
                        : "Unknown"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-300">
                        Pricing Model:
                      </span>{" "}
                      {campaign.pricingModel ? (
                        <span className="text-blue-300 font-semibold">
                          {campaign.pricingModel.charAt(0).toUpperCase() +
                            campaign.pricingModel.slice(1)}
                        </span>
                      ) : (
                        <span className="text-green-300 font-semibold">
                          Gifted
                        </span>
                      )}
                    </div>
                    {campaign.pricingModel && (
                      <div className="mb-2">
                        <span className="font-semibold text-gray-300">
                          Price:
                        </span>{" "}
                        {campaign.pricingModel === "fixed" &&
                          campaign.fixedPrice && (
                            <span className="text-green-300 font-semibold">
                              ${campaign.fixedPrice} per creator
                            </span>
                          )}
                        {campaign.pricingModel === "bidding" && (
                          <span className="text-blue-300 font-semibold">
                            Min ${campaign.minBid} / Max ${campaign.maxBid}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232323] p-8 rounded-2xl shadow-2xl text-white max-w-sm w-full border border-[#444]">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              Confirm{" "}
              {pendingAction.type === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="mb-6 text-gray-300">
              Are you sure you want to{" "}
              <span className="font-semibold">{pendingAction.type}</span> this
              campaign?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={
                  pendingAction.type === "approve"
                    ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 px-4 py-2 rounded-lg font-semibold transition"
                    : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-2 rounded-lg font-semibold transition"
                }
                onClick={() => {
                  handleApproval(pendingAction.id, pendingAction.type);
                  setShowConfirm(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232323] p-8 rounded-2xl shadow-2xl text-white max-w-sm w-full border border-[#444]">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              Reject Campaign
            </h3>
            <p className="mb-4 text-gray-300">
              Please select a reason for rejection:
            </p>
            <select
              className="w-full p-2 mb-4 rounded bg-[#181818] border border-[#444] text-white"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {rejectReason === "Other" && (
              <textarea
                className="w-full p-2 mb-4 rounded bg-[#181818] border border-[#444] text-white"
                maxLength={200}
                placeholder="Enter custom reason (max 200 chars)"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-2 rounded-lg font-semibold transition"
                disabled={
                  !rejectReason ||
                  (rejectReason === "Other" && !customReason.trim())
                }
                onClick={() => {
                  const reason =
                    rejectReason === "Other"
                      ? customReason.trim()
                      : rejectReason;
                  handleApproval(pendingAction.id, "reject", reason);
                  setShowRejectModal(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignApprove;
