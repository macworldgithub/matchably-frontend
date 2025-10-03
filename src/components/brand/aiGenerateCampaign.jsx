import React, { useState } from "react";
import axios from "axios";
import configf from "../../config";

export default function AIGenerateCampaign({
  setCampaign,
  config = {
    buttonLabel: "AI Generate",
    modalTitle: "Enter Product Page URL",
    inputPlaceholder: "https://brand.com/products/xyz",
    successMessage: "✅ Draft completed.",
    errorMessage: "AI draft generation failed. Please check the URL or try again later.",
  },
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const payload = { url };

      const { data } = await axios.post(
        `${configf.BACKEND_URL}/brand/campaigns/generate-campaign-draft`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!data.status || !data.campaign) {
        setError(data.message || config.errorMessage);
      } else {
        setCampaign((prev) => ({
          ...prev,
          ...data.campaign,
        }));
        setSuccess(true);
        setShowModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || config.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative inline-flex items-center space-x-2">
        {/* Tooltip Icon with Hover */}
        <div className="relative group">
          <span className="text-xl text-blue-600 dark:text-blue-400 cursor-pointer">❗</span>

          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-800 text-white text-sm rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
            <strong className="block mb-1">Our AI creates your campaign for you</strong>
            <p>Just provide your product details.</p>
            <p className="mt-2 text-yellow-300">⚠️ Only works with English-language pages.</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {config.buttonLabel}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">{config.modalTitle}</h3>
        
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={config.inputPlaceholder}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 mb-4 bg-white dark:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-500"
            />

          
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</div>
            )}
            {success && (
              <div className="text-green-600 dark:text-green-400 text-sm mb-2">
                {config.successMessage}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading
                    ? "bg-blue-400 dark:bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                } transition`}
              >
                {loading ? "Generating..." : "Generate with AI"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
