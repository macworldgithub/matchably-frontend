/** @format */

// ✅ Refactored ViewCampaignApplicants with status update & proper hooks

import React, { useEffect, useState } from "react";
import {
  Download,
  Save,
  User,
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  MessageSquare,
  Edit3,
  SearchIcon,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../config";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AiOutlineEye } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-center items-center bg-gradient-to-l from-[#7d71ff] to-[#5b25ff] hover:bg-blue-800 text-white px-4 py-2 rounded-lg gap-2 FontLato transition shadow-md"
  >
    {children}
  </button>
);

// Creator Details Modal Component
const CreatorDetailsModal = ({ isOpen, onClose, creator }) => {
  const [adminNotes, setAdminNotes] = useState(creator?.adminNotes || "");
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    if (isOpen && creator) {
      fetchCreatorHistory();
      setAdminNotes(creator.adminNotes || "");
    }
  }, [isOpen, creator]);

  const fetchCreatorHistory = async () => {
    if (!creator?.email) return;

    setLoadingHistory(true);
    try {
      const token = Cookies.get("AdminToken");
      const response = await axios.get(
        `${config.BACKEND_URL}/admin/creator/history/${encodeURIComponent(
          creator.email
        )}`,
        { headers: { authorization: token } }
      );

      if (response.data.status === "success") {
        setCampaignHistory(response.data.history || []);
      }
    } catch (error) {
      console.error("Failed to fetch creator history:", error);
      setCampaignHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!creator?.email) return;

    setSavingNotes(true);
    try {
      const token = Cookies.get("AdminToken");
      const response = await axios.put(
        `${config.BACKEND_URL}/admin/creator/notes/${encodeURIComponent(
          creator.email
        )}`,
        { notes: adminNotes },
        { headers: { authorization: token } }
      );

      if (response.data.status === "success") {
        // Update the creator object in parent component
        creator.adminNotes = adminNotes;
      }
    } catch (error) {
      console.error("Failed to save admin notes:", error);
    } finally {
      setSavingNotes(false);
    }
  };

  if (!isOpen || !creator) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white FontLato">
              Creator Details: {creator.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white FontLato border-b border-gray-700 pb-2">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400 FontLato">
                    Full Name
                  </label>
                  <p className="text-white FontLato">{creator.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 FontLato">
                    Email
                  </label>
                  <p className="text-white FontLato">{creator.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 FontLato">
                    Phone
                  </label>
                  <p className="text-white FontLato">
                    {creator.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 FontLato">
                    Address
                  </label>
                  <p className="text-white FontLato">
                    {creator.address || "Not provided"}
                  </p>

                  {/* International Address Details */}
                  {creator.internationalAddress &&
                    Object.keys(creator.internationalAddress).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                        <p className="text-gray-400 mb-1">
                          International Address Details:
                        </p>
                        {Object.entries(creator.internationalAddress).map(
                          ([key, value]) =>
                            value && (
                              <p key={key} className="text-gray-300">
                                <span className="capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}:
                                </span>{" "}
                                {value}
                              </p>
                            )
                        )}
                      </div>
                    )}

                  {creator.country && (
                    <p className="text-gray-400 text-xs mt-1">
                      Country: {creator.country}
                    </p>
                  )}

                  {creator.unit && (
                    <p className="text-gray-400 text-xs">
                      Unit/Apt: {creator.unit}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Handles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white FontLato border-b border-gray-700 pb-2">
                Social Media Handles
              </h3>
              <div className="space-y-3">
                {creator.socialMedia?.instagram && (
                  <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <div>
                      <label className="text-sm text-gray-400 FontLato">
                        Instagram
                      </label>
                      <p className="text-white FontLato">
                        {creator.socialMedia.instagram}
                      </p>
                    </div>
                  </div>
                )}
                {creator.socialMedia?.youtube && (
                  <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <div>
                      <label className="text-sm text-gray-400 FontLato">
                        YouTube
                      </label>
                      <p className="text-white FontLato">
                        {creator.socialMedia.youtube}
                      </p>
                    </div>
                  </div>
                )}
                {creator.socialMedia?.tiktok && (
                  <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                    <svg
                      className="w-5 h-5 text-black bg-white rounded"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                    <div>
                      <label className="text-sm text-gray-400 FontLato">
                        TikTok
                      </label>
                      <p className="text-white FontLato">
                        {creator.socialMedia.tiktok}
                      </p>
                    </div>
                  </div>
                )}
                {creator.socialMedia?.twitter && (
                  <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <div>
                      <label className="text-sm text-gray-400 FontLato">
                        Twitter
                      </label>
                      <p className="text-white FontLato">
                        {creator.socialMedia.twitter}
                      </p>
                    </div>
                  </div>
                )}
                {(!creator.socialMedia ||
                  Object.keys(creator.socialMedia).length === 0) && (
                  <p className="text-gray-400 FontLato italic">
                    No social media handles provided
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Campaign History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white FontLato border-b border-gray-700 pb-2">
              Campaign History
            </h3>
            {loadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                <p className="text-gray-400 FontLato mt-2">
                  Loading campaign history...
                </p>
              </div>
            ) : campaignHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#2a2a2a]">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-400 FontLato">
                        Campaign
                      </th>
                      <th className="px-4 py-2 text-left text-gray-400 FontLato">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-gray-400 FontLato">
                        Applied Date
                      </th>
                      <th className="px-4 py-2 text-left text-gray-400 FontLato">
                        Content Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {campaignHistory.map((campaign, index) => (
                      <tr key={index} className="hover:bg-[#2a2a2a]">
                        <td className="px-4 py-2 text-white FontLato">
                          {campaign.campaignTitle}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              campaign.status === "Approved"
                                ? "bg-green-600 text-white"
                                : campaign.status === "Rejected"
                                ? "bg-red-600 text-white"
                                : campaign.status === "Pending"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-600 text-white"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-300 FontLato">
                          {new Date(campaign.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-gray-300 FontLato">
                          {campaign.contentSubmitted ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 FontLato italic">
                No previous campaign history found
              </p>
            )}
          </div>

          {/* Admin Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <h3 className="text-lg font-semibold text-white FontLato flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Admin Notes
              </h3>
              <button
                onClick={saveAdminNotes}
                disabled={savingNotes}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add admin notes about this creator..."
              className="w-full h-32 p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white FontLato resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors FontLato"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicantCard = ({
  applicant,
  edited,
  onFieldChange,
  onSave,
  onDelete,
  onViewDetails,
  onGrantPaidAccess,
  campaignId,
  applications,
}) => {
  const {
    status,
    rejectionReason,
    showReasonToInfluencer,
    instagram_urls = [],
    tiktok_urls = [],
  } = edited || applicant || {};

  // Add new empty URL input
  const addUrl = (field) => {
    onFieldChange(applicant.id, field, [
      ...(edited?.[field] || applicant[field] || []),
      "",
    ]);
  };

  // Update specific URL
  const updateUrl = (field, idx, value) => {
    const urls = [...(edited?.[field] || applicant[field] || [])];
    urls[idx] = value;
    onFieldChange(applicant.id, field, urls);
  };

  // Remove specific URL
  const removeUrl = (field, idx) => {
    const urls = [...(edited?.[field] || applicant[field] || [])];
    urls.splice(idx, 1);
    onFieldChange(applicant.id, field, urls);
  };

  return (
    <div className="bg-[#1f1f1f] border border-gray-700 rounded-2xl shadow-lg p-5 mb-6 transition hover:shadow-xl">
      {/* ---- Header ---- */}
      <div className="flex justify-between items-center mb-4">
        <span>
          Participation Status:{" "}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "Approved"
                ? "bg-green-600 text-white"
                : status === "Rejected"
                ? "bg-red-600 text-white"
                : "bg-yellow-600 text-white"
            }`}
          >
            {status || "Pending"}
          </span>
        </span>

        <button
          onClick={() => onGrantPaidAccess(applicant.id)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-xs rounded-md shadow-md"
        >
          Mark as Paid Creator
        </button>
      </div>

      {/* ---- User Info ---- */}
      <div className="space-y-2 text-sm text-gray-200">
        <p>
          <strong className="text-gray-400">Name:</strong> {applicant.name}
        </p>
        <p>
          <strong className="text-gray-400">Phone:</strong> {applicant.phone}
        </p>
        <p>
          <strong className="text-gray-400">Address:</strong>{" "}
          {applicant.address}
        </p>
        {applicant.country && (
          <p>
            <strong className="text-gray-400">Country:</strong>{" "}
            {applicant.country}
          </p>
        )}
        <p>
          <strong className="text-gray-400">Applied On:</strong>{" "}
          {applicant.appliedAt?.split("T")[0]}
        </p>
        <p>
          <strong className="text-gray-400">Email:</strong> {applicant.email}
        </p>
        <p>
          <strong className="text-gray-400">Delivery Status:</strong>{" "}
          {applicant?.instagram_urls.length + applicant?.tiktok_urls.length > 0
            ? "Submitted"
            : "Not Submitted"}
        </p>
        <p>
          <strong className="text-gray-400">Content Status:</strong>{" "}
          {applicant.content_status || "Pending"}
        </p>
      </div>

      {/* ---- Content URLs ---- */}
      <div className="mt-4 space-y-6">
        {/* Instagram */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Instagram URLs
          </label>
          {instagram_urls.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="url"
                value={url}
                placeholder="Enter Instagram content URL"
                onChange={(e) =>
                  updateUrl("instagram_urls", idx, e.target.value)
                }
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
              />
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => removeUrl("instagram_urls", idx)}
                className="text-red-400 hover:text-red-500"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
          <button
            onClick={() => addUrl("instagram_urls")}
            className="text-xs text-indigo-400 hover:text-indigo-500"
          >
            + Add Instagram URL
          </button>
        </div>

        {/* TikTok */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            TikTok URLs
          </label>
          {tiktok_urls.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="url"
                value={url}
                placeholder="Enter TikTok content URL"
                onChange={(e) => updateUrl("tiktok_urls", idx, e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
              />
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => removeUrl("tiktok_urls", idx)}
                className="text-red-400 hover:text-red-500"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
          <button
            onClick={() => addUrl("tiktok_urls")}
            className="text-xs text-indigo-400 hover:text-indigo-500"
          >
            + Add TikTok URL
          </button>
        </div>
      </div>

      {/* ---- Status Controls ---- */}
      <div className="mt-4 space-y-2">
        <select
          value={status}
          onChange={(e) =>
            onFieldChange(applicant.id, "status", e.target.value)
          }
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        {status === "Rejected" && (
          <div className="space-y-2">
            <input
              type="text"
              value={rejectionReason}
              onChange={(e) =>
                onFieldChange(applicant.id, "rejectionReason", e.target.value)
              }
              placeholder="Rejection reason..."
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showReasonToInfluencer}
                onChange={(e) =>
                  onFieldChange(
                    applicant.id,
                    "showReasonToInfluencer",
                    e.target.checked
                  )
                }
                className="rounded"
              />
              Show reason to influencer
            </label>
          </div>
        )}
      </div>

      {/* ---- Actions ---- */}
      <div className="flex justify-between items-center mt-5">
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(applicant)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1"
          >
            <User className="w-3 h-3" />
            Details
          </button>
          <button
            onClick={() => onSave(applicant.id)}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
          >
            Save
          </button>
        </div>

        <button
          onClick={() => onDelete(applicant.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
        >
          <FaTrashAlt className="w-3 h-3" /> Delete
        </button>
      </div>

      {/* ---- View Submission ---- */}
      <div className="mt-4 flex justify-end">
        <Link
          to={`/admin/campaign-submission/${campaignId}/${encodeURIComponent(
            applicant.email
          )}`}
          state={{ applicants: applications.map((app) => app.email) }}
          className="w-full flex items-center gap-2 px-3 py-[6px] rounded-md justify-center bg-gradient-to-l from-[#7d71ff] to-[#5b25ff]"
        >
          <AiOutlineEye className="h-5 w-5" />
          <span>View Submission</span>
        </Link>
      </div>
    </div>
  );
};

const ViewCampaignApplicants = () => {
  const { campaignId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [editedApplications, setEditedApplications] = useState({});
  const [recruitingLimit, setRecruitingLimit] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [usageTerms, setUsageTerms] = useState([]);
  const [campaignType, setCampaignType] = useState("");
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [showCreatorDetailsModal, setShowCreatorDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const exportToCSV = async () => {
    try {
      const response = await axios.get(
        `${config.BACKEND_URL}/admin/applications/download/${campaignId}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download CSV.");
    }
  };

  const handleSaveOne = async (applicantId) => {
    const edited = editedApplications[applicantId];
    if (!edited) return;

    try {
      const token = Cookies.get("AdminToken");
      const res = await axios.patch(
        `${config.BACKEND_URL}/admin/applications/${applicantId}/status`,
        edited,
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicantId ? { ...app, ...edited } : app
          )
        );

        setEditedApplications((prev) => {
          const newEdited = { ...prev };
          delete newEdited[applicantId];
          return newEdited;
        });

        toast.success("Application status updated successfully!");
      }
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const getApplications = async (page = 1) => {
    setLoading(true);
    try {
      const token = Cookies.get("AdminToken");
      const limit = 20;
      const res = await axios.get(
        `${
          config.BACKEND_URL
        }/admin/applications/${campaignId}?page=${page}&limit=${limit}&search=${encodeURIComponent(
          searchInput
        )}`,
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        const apps = res.data.applications;

        setApplications(apps);

        const initialEdits = {};
        apps.forEach((app) => {
          initialEdits[app.id] = {
            status: app.status,
            rejectionReason: app.rejectionReason || "",
            showReasonToInfluencer: app.showReasonToInfluencer || false,
          };
        });
        setEditedApplications(initialEdits);

        setCampaignTitle(res.data.campaignTitle);
        setRecruitingLimit(res.data.recruitingLimit);
        setApprovedCount(res.data.approvedCount);
        setUsageTerms(res.data.rights || []);
        setCampaignType(res.data.campaignType);
        setTotalPages(res.data.totalPages); // Backend must send totalPages
        setCurrentPage(page);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (applicantId, field, value) => {
    setEditedApplications((prev) => ({
      ...prev,
      [applicantId]: {
        ...prev[applicantId],
        [field]: value,
      },
    }));
  };

  const saveAll = async () => {
    try {
      const token = Cookies.get("AdminToken");
      const res = await axios.put(
        `${config.BACKEND_URL}/admin/applications/${campaignId}/bulk`,
        { applications: editedApplications },
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        setApplications((prev) =>
          prev.map((app) => ({
            ...app,
            ...editedApplications[app.id],
          }))
        );

        setEditedApplications({});
        toast.success("All changes saved successfully!");
      }
    } catch {
      alert("Failed to save all changes.");
    }
  };

  const handleDelete = async (applicantId) => {
    try {
      const token = Cookies.get("AdminToken");
      const res = await axios.delete(
        `${config.BACKEND_URL}/admin/applications/${campaignId}/${applicantId}`,
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        setApplications((prev) => prev.filter((app) => app.id !== applicantId));

        setEditedApplications((prev) => {
          const newEdited = { ...prev };
          delete newEdited[applicantId];
          return newEdited;
        });

        toast.success("Applicant deleted successfully!");
      }
    } catch {
      alert("Failed to delete applicant.");
    }
  };

  const handleViewDetails = (applicant) => {
    setCreatorDetails(applicant);
    setShowCreatorDetailsModal(true);
  };

  useEffect(() => {
    getApplications(1);
  }, [campaignId, searchInput]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    getApplications(1, searchInput);
  };

  const handleGrantPaidAccess = async (applicantId) => {
    alert("Coming Soon");

    return false;
    try {
      const token = Cookies.get("AdminToken");
      const res = await axios.post(
        `${config.BACKEND_URL}/admin/applications/${campaignId}/${applicantId}/grant-paid-access`,
        {},
        { headers: { authorization: token } }
      );

      if (res.data.status === "success") {
        toast.success("Paid access granted successfully!");
      }
    } catch {
      toast.error("Failed to grant paid access.");
    }
  };

  return (
    <div className="p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]">
      <Helmet>
        <title>My Account</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold FontLato">Applicants</h2>
        <div className="inline-flex items-center gap-2 px-3 py-[6px] rounded-md bg-[#2d2d2d] border border-yellow-400 text-yellow-300 text-sm shadow FontLato">
          <span className="font-semibold tracking-wide">Approved in DB:</span>
          <span className="text-white">
            {approvedCount} / {recruitingLimit}
          </span>
        </div>

        <div className="flex space-x-2">
          <Button onClick={saveAll}>
            <Save size={16} /> <span>Save All</span>
          </Button>

          <Button onClick={exportToCSV}>
            <Download size={16} /> <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="text-white text-[green]">
          <Link to={`/campaign/${campaignId}`}>{campaignTitle}</Link>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email..."
          className="p-2 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 w-full max-w-md"
        />
      </div>
      {campaignType === "paid" && (
        <div className=" bg-[#232323] rounded-lg border border-gray-700">
          <div className="">
            <span className="font-semibold text-gray-300">Usage Rights: </span>
            {Array.isArray(usageTerms) && usageTerms.length > 0
              ? usageTerms.join(", ")
              : "N/A"}
          </div>
        </div>
      )}

      <div className="overflow-x-auto  rounded-[5px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              applications={applications}
              campaignId={campaignId}
              edited={editedApplications[applicant.id]}
              onFieldChange={handleFieldChange}
              onDelete={(id) => {
                setSelectedApplicantId(id);
                setShowDeleteModal(true);
              }}
              onSave={handleSaveOne}
              onViewDetails={handleViewDetails}
              onGrantPaidAccess={handleGrantPaidAccess} // ✅ make sure this exists in parent
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => getApplications(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-yellow-500 text-black font-bold"
                  : "bg-gray-700 text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700 w-[90%] max-w-md">
            <h2 className="text-2xl text-white font-semibold FontLato mb-5">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6 FontLato">
              Are you sure you want to delete this applicant? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg FontLato"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(selectedApplicantId);
                  setShowDeleteModal(false);
                  setSelectedApplicantId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg FontLato"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreatorDetailsModal && creatorDetails && (
        <CreatorDetailsModal
          isOpen={showCreatorDetailsModal}
          onClose={() => setShowCreatorDetailsModal(false)}
          creator={creatorDetails}
        />
      )}
    </div>
  );
};

export default ViewCampaignApplicants;
