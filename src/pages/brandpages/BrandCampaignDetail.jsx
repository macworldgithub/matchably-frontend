import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaTrash,
  FaInstagram,
  FaTiktok,
  FaTimes,
} from "react-icons/fa";

import config from "../../config";
import CreatorCardList from "../../components/brand/brandCampaignDetail/CreatorCardList";
import ContentSubmission from "./ContentSubmission";

export default function BrandCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [campaign, setCampaign] = useState(null);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "creators";
  });
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentStatus, setContentStatus] = useState("Pending");
  const [updating, setUpdating] = useState(false);
  const [exportWarning, setExportWarning] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (creators.length > 0) {
      const now = new Date();
      const updatedCreators = creators.map((creator) => {
        if (creator.deliveredAt && creator.contentStatus !== " Submitted") {
          const contentDeadline = calculateContentDeadline(creator.deliveredAt);
          if (contentDeadline && now > contentDeadline) {
            return { ...creator, contentStatus: "Overdue" };
          }
        }
        return creator;
      });
      const hasChanges = updatedCreators.some(
        (creator, index) =>
          creator.contentStatus !== creators[index].contentStatus
      );
      if (hasChanges) setCreators(updatedCreators);
    }
  }, [creators]);
  const fetchCampaignData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const campaignRes = await axios.get(
        `${config.BACKEND_URL}/brand/campaigns/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const creatorsRes = await axios.get(
        `${config.BACKEND_URL}/brand/creators/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (campaignRes.data.status === "success")
        setCampaign(campaignRes.data.campaign);
      if (creatorsRes.data.status === "success")
        setCreators(creatorsRes.data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [id]);

  const calculateContentDeadline = (deliveredAt) => {
    if (!deliveredAt) return null;
    const deliveryDate = new Date(deliveredAt);
    const contentDeadline = new Date(deliveryDate);
    contentDeadline.setDate(deliveryDate.getDate() + 10);
    return contentDeadline;
  };

  const getContentDeadlineDisplay = (deliveredAt, contentStatus) => {
    if (!deliveredAt || contentStatus === " Submitted") return null;
    const contentDeadline = calculateContentDeadline(deliveredAt);
    if (!contentDeadline) return null;
    const now = new Date();
    const daysLeft = Math.ceil((contentDeadline - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0)
      return (
        <span className="text-sm font-medium text-red-400">
          ⚠️ {Math.abs(daysLeft)} days overdue
        </span>
      );
    if (daysLeft <= 3)
      return (
        <span className="text-sm font-medium text-orange-400">
          ⏰ {daysLeft} days left
        </span>
      );
    return (
      <span className="text-sm font-medium text-green-400">
        📅 {daysLeft} days left
      </span>
    );
  };

  const getContentStatusColor = (status) => {
    if (status === " Submitted") return "text-green-400";
    if (status === "Overdue") return "text-red-400";
    return "text-gray-400";
  };

  const handleViewContent = (creator) => {
    setSelectedContent(creator);
    setContentStatus(creator.contentStatus || "Pending");
    setShowContentModal(true);
  };

  const handleContentStatusUpdate = async () => {
    if (!selectedContent) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const response = await axios.put(
        `${config.BACKEND_URL}/brand/creators/${selectedContent.id}/content-status`,
        {
          status: contentStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status === "success") {
        setCreators(
          creators.map((creator) =>
            creator.id === selectedContent.id
              ? { ...creator, contentStatus }
              : creator
          )
        );
        setShowContentModal(false);
        alert("Content status updated successfully");
      } else {
        alert(response.data.message || "Failed to update content status");
      }
    } catch (error) {
      console.error("Error updating content status:", error);
      alert("Failed to update content status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCampaign = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const res = await axios.delete(
        `${config.BACKEND_URL}/brand/campaigns/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status === "success") navigate("/brand/campaigns");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const updateTabInURL = (tabName) => {
    const params = new URLSearchParams(location.search);
    params.set("tab", tabName);
    navigate(
      { pathname: location.pathname, search: `?${params.toString()}` },
      { replace: true }
    );
  };

  const contentSubmissionCount = creators.filter(
    (c) => c.contentUrls?.instagram || c.contentUrls?.tiktok
  ).length;

  if (loading) {
    return (
      <div className="p-8 text-white animate-pulse space-y-6">
        {/* Header Skeleton */}
        <div className="flex gap-4 items-center">
          <div className="bg-gray-700 rounded-full w-10 h-10" />
          <div className="space-y-2">
            <div className="bg-gray-700 h-4 w-48 rounded" />
            <div className="flex space-x-4 text-xs text-gray-500">
              <div className="bg-gray-700 h-3 w-24 rounded" />
              <div className="bg-gray-700 h-3 w-20 rounded" />
              <div className="bg-gray-700 h-3 w-16 rounded" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 border-b space-y-5 border-gray-800">
          <div className="bg-gray-700 h-8 w-32 rounded" />
          <div className="bg-gray-700 h-8 w-40 rounded" />
        </div>

        {/* Creator Card List Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ].map((i) => (
            <div
              key={i}
              className="bg-[#1e1e1e] border border-gray-800 p-4 rounded shadow animate-pulse"
            >
              <div className="bg-gray-700 h-4 w-32 rounded mb-2" />
              <div className="bg-gray-700 h-3 w-24 rounded mb-1" />
              <div className="bg-gray-700 h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!campaign)
    return <div className="p-8 text-white">Campaign not found</div>;

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Helmet>
        <title>{campaign.campaignTitle} | Matchably</title>
      </Helmet>

      <header className="p-2 px-5 border-b border-gray-800 flex justify-between items-center">
        <div className="flex gap-4  items-center">
          <button
            className="bg-neutral-800 p-3 rounded-full shadow-lg"
            onClick={() => navigate("/brand/create-campaign")}
          >
            <FaArrowLeft />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <img
                src={campaign.brandLogo}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-md font-bold text-neutral-400">
                <span className="text-lime-400 font-bold"> Campaign:</span>{" "}
                {campaign.campaignTitle}
              </h1>
            </div>
            <div className="text-xs my-2 text-gray-400">
              <span>
                Status:{" "}
                <span className="text-lime-400 font-bold">
                  {campaign.status}
                </span>
              </span>
              <span className="ml-4">
                Creators:{" "}
                <span className="text-lime-400 font-bold">
                  {creators.length}
                </span>
              </span>
              <span className="ml-4">
                Type:{" "}
                <span className="text-lime-400 font-bold">
                  {campaign.campaignType}
                </span>
              </span>
              <span className="ml-4">
                Select Limit:{" "}
                <span className="text-lime-400 font-bold">
                  {campaign?.creatorCount || campaign?.recurring}
                </span>
              </span>
              <span className="ml-4">
                Brand:{" "}
                <span className="text-lime-400 font-bold">
                  {campaign.brandName}
                </span>
              </span>
              <span className="ml-4">
                Industry:{" "}
                <span className="text-lime-400 font-bold">
                  {campaign.campaignIndustry}
                </span>
              </span>
              <span className="ml-4">
                Created:{" "}
                <span className="text-lime-400 font-bold">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </span>
              {campaign.deadline && (
                <span className="ml-4">
                  Deadline:{" "}
                  <span className="text-lime-400 font-bold">
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </span>{" "}
                </span>
              )}
            </div>
          </div>
        </div>
        {campaign.status === "draft" && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-400"
          >
            <FaTrash />
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto bg-[#1e1e1e] p-4 rounded">
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => {
              setActiveTab("creators");
              updateTabInURL("creators");
            }}
            className={`px-4 py-2 ${
              activeTab === "creators"
                ? "border-b-2 border-lime-400"
                : "text-gray-400"
            }`}
          >
            Creators{" "}
            <span className="text-lime-400 font-bold">
              ({creators.length || 0})
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("content");
              updateTabInURL("content");
            }}
            className={`px-4 py-2 ${
              activeTab === "content"
                ? "border-b-2 border-lime-400"
                : "text-gray-400"
            }`}
          >
            Content Submissions{" "}
            <span className="text-lime-400 font-bold">
              ({contentSubmissionCount})
            </span>
          </button>
        </div>

        {activeTab === "creators" && (
          <section>
            {exportWarning && (
              <p className="text-red-500 text-sm mb-2">{exportWarning}</p>
            )}
            {creators.length === 0 ? (
              <p className="text-gray-400">No creators found.</p>
            ) : (
              <CreatorCardList
                creators={creators}
                campaign={campaign}
                onRefresh={fetchCampaignData}
                onhandleViewContent={handleViewContent}
              />
            )}
          </section>
        )}

        {activeTab == "content" && (
          <ContentSubmission
            creators={creators}
            handleViewContent={handleViewContent}
            getContentStatusColor={getContentStatusColor}
          />
        )}
      </main>

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Campaign</h3>
            <p className="mb-6">
              Are you sure you want to delete "{campaign.campaignTitle}"? This
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                className="bg-red-600 px-4 py-2 rounded text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Modal */}
      {showContentModal && selectedContent && (
        <ContentSubmissionModal
          selectedContent={selectedContent}
          setShowContentModal={setShowContentModal}
          contentStatus={contentStatus}
          setContentStatus={setContentStatus}
          handleContentStatusUpdate={handleContentStatusUpdate}
          updating={updating}
        />
      )}
    </div>
  );
}

function ContentSubmissionModal({
  selectedContent,
  setShowContentModal,
  contentStatus,
  setContentStatus,
  handleContentStatusUpdate,
  updating,
  // ...other props
}) {
  // State for feedback
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [checkboxes, setCheckboxes] = useState({
    productShown: false,
    toneMatched: false,
    guidelinesFollowed: false,
  });
  const [savingFeedback, setSavingFeedback] = useState(false);

  // Save feedback async simulation
  const saveFeedback = async (emoji, checks) => {
    setSavingFeedback(true);
    try {
      // Replace this with your actual async call, e.g. axios.post(...)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network latency

      // TODO: call API to save feedback here, passing emoji + checkbox data

      toast.success("Your feedback has been saved");
    } catch (error) {
      toast.error("Failed to save feedback");
    } finally {
      setSavingFeedback(false);
    }
  };

  const onEmojiClick = (emojiKey) => {
    if (savingFeedback) return; // prevent multiple clicks while saving

    setSelectedEmoji(emojiKey);
    // Save asynchronously but don't block UI
    saveFeedback(emojiKey, checkboxes);
  };

  const onCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => {
      const newState = { ...prev, [name]: checked };
      // Save if any checkbox is checked
      if (Object.values(newState).some((v) => v)) {
        saveFeedback(selectedEmoji, newState);
      }
      return newState;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] shadow-lg rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white FontNoto">
            Content Submission
          </h3>
          <button
            onClick={() => setShowContentModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Creator Info */}
          <div className="text-white FontNoto">
            <p>
              <strong>Name:</strong> {selectedContent.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedContent.email}
            </p>
            <p>
              <strong>Social:</strong>
              <a
                href={selectedContent.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-lime-400"
              >
                {selectedContent.socialId}{" "}
                <FaExternalLinkAlt className="inline w-3 h-3 ml-1" />
              </a>
            </p>
          </div>

          {/* Content URLs */}
          <div>
            {selectedContent.contentUrls?.instagram?.map((instagram) => (
              <div key={instagram} className="flex items-center space-x-2">
                <FaInstagram className="text-pink-400" />
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-400 hover:text-lime-300 transition-colors text-sm"
                >
                  Instagram Post{" "}
                  <FaExternalLinkAlt className="inline w-3 h-3 ml-1" />
                </a>
              </div>
            ))}
            {selectedContent.contentUrls?.tiktok?.map((tiktok) => (
              <div key={tiktok} className="flex items-center space-x-2">
                <FaTiktok className="text-white" />
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-400 hover:text-lime-300 transition-colors text-sm"
                >
                  TikTok Video{" "}
                  <FaExternalLinkAlt className="inline w-3 h-3 ml-1" />
                </a>
              </div>
            ))}
          </div>

          {/* Status Update */}
          <select
            value={contentStatus}
            onChange={(e) => setContentStatus(e.target.value)}
            className="bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 text-white w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Overdue">Overdue</option>
          </select>

          {/* Content Evaluation UI */}
          <div className="mt-6 border-t border-gray-700 pt-4">
            <p className="text-white FontNoto mb-2">
              How was this content?{" "}
              <span className="text-gray-500">(Optional)</span>
            </p>
            <div className="flex space-x-6 mb-4">
              {[
                { key: "loved", label: "Loved it" },
                { key: "okay", label: "It was okay" },
                { key: "disappointed", label: "Disappointed" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => onEmojiClick(key)}
                  disabled={savingFeedback}
                  className={`text-base font-semibold flex items-center space-x-2 px-3 py-2 rounded-md
                    ${
                      selectedEmoji === key
                        ? "bg-lime-500 text-black"
                        : "bg-[#2a2a2a] text-white hover:bg-lime-600"
                    }
                    transition-colors`}
                  aria-pressed={selectedEmoji === key}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Optional Checkboxes */}
            <div className="space-y-2 text-white">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="productShown"
                  checked={checkboxes.productShown}
                  onChange={onCheckboxChange}
                  className="form-checkbox rounded text-lime-500"
                />
                <span>The product was well shown</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="toneMatched"
                  checked={checkboxes.toneMatched}
                  onChange={onCheckboxChange}
                  className="form-checkbox rounded text-lime-500"
                />
                <span>The tone matched our brand</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="guidelinesFollowed"
                  checked={checkboxes.guidelinesFollowed}
                  onChange={onCheckboxChange}
                  className="form-checkbox rounded text-lime-500"
                />
                <span>The creator followed the guidelines well</span>
              </label>
            </div>
          </div>

          {/* Deadline Info */}
          {/* ...existing deadline code... */}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowContentModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleContentStatusUpdate}
              disabled={updating}
              className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {updating ? "Updating..." : "Save & Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
