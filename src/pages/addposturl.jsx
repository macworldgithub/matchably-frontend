import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../config";

const MAX_URLS = 11;

const AddPostUrl = () => {
  const { campaignId } = useParams();

  const [platform, setPlatform] = useState("");
  const [rows, setRows] = useState([{ instagram: null, tiktok: null }]);
  const [campaignTitle, setCampaignTitle] = useState("Untitled Campaign");
  const [contentFormat, setContentFormat] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState({});
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAuthHeader = () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    return { Authorization: token || "" };
  };

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${config.BACKEND_URL}/user/campaign-submission/${campaignId}`,
        { headers: getAuthHeader() }
      );

      if (data.status === "success") {
        const {
          instagram_urls = [],
          tiktok_urls = [],
          tracking_info = {},
          campaignTitle = "",
          campaignPlateform = [],
        } = data.data;

        setContentFormat(campaignPlateform.map((p) => p.toLowerCase()));
        const instagramArray = Array.isArray(instagram_urls)
          ? instagram_urls
          : [];
        const tiktokArray = Array.isArray(tiktok_urls) ? tiktok_urls : [];

        const safeString = (val) => (typeof val === "string" ? val : "");

        const max = Math.max(instagramArray.length, tiktokArray.length, 1);

        const newRows = Array.from({ length: max }, (_, i) => ({
          instagram: safeString(instagramArray[i]),
          tiktok: safeString(tiktokArray[i]),
        }));

        setRows(newRows);
        setTrackingInfo(tracking_info || {});
        setCampaignTitle(campaignTitle || "Untitled Campaign");
        if (newRows[0].instagram == "" && newRows[0].tiktok == "") {
          setExists(false);
        } else {
          setExists(true);
        }
      } else {
        setRows([{ instagram: "", tiktok: "" }]);

        setExists(false);
        setCampaignTitle("Untitled Campaign");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load your submission.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const handleChange = (idx, field, value) => {
    const updatedRows = [...rows];
    updatedRows[idx][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    const currentCount = rows.filter((row) => row[platform].trim()).length;
    if (currentCount >= MAX_URLS) {
      setError(`Maximum ${MAX_URLS} ${platform} URLs allowed.`);
      return;
    }
    setRows([...rows, { instagram: "", tiktok: "" }]);
  };

  const removeRow = (idx) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (platform == "") {
      alert("please select platform");
      return false;
    }

    setLoading(true);
    setError("");
    // Filter non-empty URLs
    const urls = rows
      .map((row) => row[platform]?.trim()) // trim whitespace
      .filter((url) => url); // removes empty strings and falsy values

    console.log(urls);

    if (!urls) {
      setError(`At least one ${platform} URL is required.`);
      setLoading(false);
      return;
    }

    if (urls && urls.length === 0) {
      setError(`At least one ${platform} URL is required.`);
      setLoading(false);
      return;
    }

    const payload = {
      campaign_id: campaignId,
      instagram_urls: platform === "instagram" ? urls : [],
      tiktok_urls: platform === "tiktok" ? urls : [],
      allow_brand_reuse: false,
    };

    try {
      await axios.post(
        `${config.BACKEND_URL}/user/campaign-submission`,
        payload,
        {
          headers: getAuthHeader(),
        }
      );
      setExists(true);
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your submission?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(
        `${config.BACKEND_URL}/user/campaign-submission/${campaignId}`,
        { headers: getAuthHeader() }
      );
      setRows([{ instagram: "", tiktok: "" }]);
      setTrackingInfo({});
      setExists(false);

      setCampaignTitle("Untitled Campaign");
    } catch (err) {
      console.error(err);
      setError("Delete failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setError("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">{campaignTitle}</h2>
          <button
            onClick={exists ? handleDelete : () => setIsModalOpen(true)}
            disabled={loading}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              exists
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-green-500 hover:bg-green-400 text-black"
            }`}
          >
            {loading
              ? exists
                ? "Deleting..."
                : "Loading..."
              : exists
              ? "Delete Submission"
              : "+ Add URLs"}
          </button>
        </div>

        {loading && !isModalOpen ? (
          <p className="text-center text-gray-400">Loading your submission…</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg text-sm">
                <thead>
                  <tr className="bg-gray-700 text-left text-gray-200">
                    <th className="px-4 py-2">Instagram</th>
                    <th className="px-4 py-2">TikTok</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-700 hover:bg-gray-700"
                    >
                      <td className="px-4 py-2 text-white break-all">
                        {row.instagram || (
                          <span className="text-gray-500 italic">–</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-white break-all">
                        {row.tiktok || (
                          <span className="text-gray-500 italic">–</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {trackingInfo && trackingInfo.tracking_number && (
        <div className="bg-gray-800 rounded-lg p-4 mt-4 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-2">
            📦 Shipment Info
          </h4>
          <div className="text-gray-300 space-y-1">
            <p>
              <strong className="text-white">Courier:</strong>{" "}
              {trackingInfo.courier || "N/A"}
            </p>
            <p>
              <strong className="text-white">Tracking Number:</strong>{" "}
              {trackingInfo.tracking_number}
            </p>
            <p>
              <strong className="text-white">Delivery Status:</strong>{" "}
              {trackingInfo.delivery_status}
            </p>
            <p>
              <strong className="text-white">Last Updated:</strong>{" "}
              {trackingInfo.last_updated}
            </p>
            {trackingInfo.tracking_link && (
              <p>
                <a
                  href={trackingInfo.tracking_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  View Tracking ↗
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur">
          <div className="w-full max-w-xl rounded-lg bg-gray-900 p-6 shadow-2xl space-y-4 animate-slide-in">
            <h3 className="text-xl font-bold text-white">
              {exists ? "Edit Submission" : "Add New Submission"}
            </h3>

            <div>
              <label className="text-gray-300 mr-2">Platform:</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-gray-800 text-white rounded px-3 py-1"
              >
                <option value="">Select a platform</option>
                {contentFormat &&
                  contentFormat.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {rows.map((row, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="url"
                    placeholder={
                      platform === "instagram"
                        ? "https://instagram.com/p/..."
                        : "https://www.tiktok.com/@user/video/..."
                    }
                    value={row[platform]}
                    onChange={(e) =>
                      handleChange(idx, platform, e.target.value)
                    }
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  />
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(idx)}
                      className="text-red-400 hover:text-red-300"
                      aria-label="Remove URL"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={addRow}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add Another URL
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-600"
              >
                {loading ? "Saving..." : "Save Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPostUrl;
