import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../config";
const URL = config.BACKEND_URL;

const ContentAnalysisPanel = ({ user }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState({
    instagram: false,
    tiktok: false,
    all: false,
    fetching: true,
  });
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    instagram: false,
    tiktok: false,
  });

  // 🧠 Initialize connected platforms from user if available
  useEffect(() => {
    if (user && user.snsConnected && user.sns) {
      setConnectedPlatforms({
        instagram: !!user.sns.instagram,
        tiktok: !!user.sns.tiktok,
      });
    }
  }, [user]);

  useEffect(() => {
    fetchExistingAnalysis();
    // Optionally update platform connection states from API
    checkConnectedPlatforms();
  }, []);

  const fetchExistingAnalysis = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetching: true }));
      const response = await axios.get(`${URL}/user/content-analysis`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (response.data.success) {
        setAnalysis(response.data.data);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Failed to fetch analysis:", error);
      }
    } finally {
      setLoading((prev) => ({ ...prev, fetching: false }));
    }
  };

  const checkConnectedPlatforms = async () => {
    try {
      const response = await axios.get(
        `${config.BACKEND_URL}/user/content-analysis/social-connections`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      if (response.data.success) {
        // 🧩 Merge API result with user-based data (so user.sns.* takes priority)
        setConnectedPlatforms((prev) => ({
          instagram: prev.instagram || response.data.data.instagram?.connected,
          tiktok: prev.tiktok || response.data.data.tiktok?.connected,
        }));
      }
    } catch (error) {
      console.error("Failed to check connected platforms:", error);
    }
  };

  const runAnalysis = async (platform) => {
    try {
      setLoading((prev) => ({ ...prev, [platform]: true }));

      const endpoint =
        platform === "all"
          ? `${config.BACKEND_URL}/user/content-analysis/all`
          : `${config.BACKEND_URL}/user/content-analysis/${platform}`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchExistingAnalysis();
      } else {
        toast.error(response.data.message || "Analysis failed");
      }
    } catch (error) {
      console.error(`${platform} analysis failed:`, error);
      toast.error(
        error.response?.data?.message ||
          `Failed to analyze ${platform} content`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const clearAnalysis = async () => {
    try {
      const response = await axios.delete(
        `${config.BACKEND_URL}/user/content-analysis`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      if (response.data.success) {
        toast.success("Content analysis cleared");
        setAnalysis(null);
      }
    } catch (error) {
      toast.error("Failed to clear analysis");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading.fetching) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Content Analysis
          </h3>
          <p className="text-sm text-gray-600">
            Analyze your social media content to improve campaign matching and
            recommendations
          </p>
        </div>
        {analysis && (
          <button
            onClick={clearAnalysis}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear Analysis
          </button>
        )}
      </div>

      {/* Connected Platforms */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Connected Platforms
        </h4>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                connectedPlatforms.instagram ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <span className="text-sm text-gray-600">Instagram</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                connectedPlatforms.tiktok ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <span className="text-sm text-gray-600">TikTok</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={() => runAnalysis("instagram")}
            disabled={!connectedPlatforms.instagram || loading.instagram}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              !connectedPlatforms.instagram
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : loading.instagram
                ? "bg-pink-100 text-pink-600 cursor-wait"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            {loading.instagram ? "Analyzing..." : "Analyze Instagram"}
          </button>

          <button
            onClick={() => runAnalysis("tiktok")}
            disabled={!connectedPlatforms.tiktok || loading.tiktok}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              !connectedPlatforms.tiktok
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : loading.tiktok
                ? "bg-gray-800 text-white cursor-wait"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {loading.tiktok ? "Analyzing..." : "Analyze TikTok"}
          </button>
        </div>

        <button
          onClick={() => runAnalysis("all")}
          disabled={
            (!connectedPlatforms.instagram && !connectedPlatforms.tiktok) ||
            loading.all
          }
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            !connectedPlatforms.instagram && !connectedPlatforms.tiktok
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : loading.all
              ? "bg-indigo-100 text-indigo-600 cursor-wait"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {loading.all
            ? "Analyzing All Platforms..."
            : "Analyze All Connected Platforms"}
        </button>
      </div>

      {!connectedPlatforms.instagram && !connectedPlatforms.tiktok && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Connect your social media accounts first to analyze your content.
            <a href="/onboarding" className="text-yellow-900 underline ml-1">
              Go to Onboarding
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentAnalysisPanel;
