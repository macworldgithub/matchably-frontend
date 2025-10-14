import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaInstagram } from "react-icons/fa";
import config from "../config";
import Cookies from "js-cookie";

const InstagramCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        console.log("Instagram callback params:", { code, state, error });

        // Handle error from Instagram
        if (error) {
          toast.error(`Instagram authorization failed: ${error}`, {
            theme: "dark",
          });
          navigate("/myaccount", { replace: true });
          return;
        }

        // Check for required parameters
        if (!code || !state) {
          toast.error("Missing authorization code or state parameter", {
            theme: "dark",
          });
          navigate("/myaccount", { replace: true });
          return;
        }

        // Show processing message
        toast.info("Processing Instagram authorization...", { theme: "dark" });

        // Send the authorization code to our backend
        const token = Cookies.get("token") || localStorage.getItem("token");
        console.log(token, 'TOKEN');
        const response = await fetch(
          `${config.BACKEND_URL}/social/instagram/process`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              code,
              state,
            }),
          }
        );

        const data = await response.json();
        console.log(data, "DATA");
        if (data.status === "success") {
          toast.success("Instagram account connected successfully!", {
            theme: "dark",
          });

          // Wait a moment for backend to save, then redirect with success flag
          setTimeout(() => {
            navigate("/myaccount?instagram_connected=success", { replace: true });
          }, 1000);
        } else {
          toast.error(data.message || "Failed to connect Instagram account", {
            theme: "dark",
          });
          navigate("/myaccount", { replace: true });
        }
      } catch (err) {
        console.error("Instagram callback processing error:", err);
        toast.error("Failed to process Instagram authorization", {
          theme: "dark",
        });
        navigate("/myaccount", { replace: true });
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl text-center border border-purple-500/20 max-w-md mx-4">
        <div className="mb-6">
          <FaInstagram className="text-purple-500 text-6xl mx-auto mb-4 animate-pulse" />
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-3">
          {processing ? "🔗 Connecting Instagram Account" : "✅ Redirecting..."}
        </h2>

        <div className="space-y-2 mb-4">
          <p className="text-gray-300 text-sm">
            {processing
              ? "Processing OAuth authorization..."
              : "Connection successful!"}
          </p>

          {processing && (
            <div className="space-y-1 text-xs text-gray-400">
              <p>✓ Validating authorization code</p>
              <p>✓ Exchanging for access token</p>
              <p>✓ Fetching profile data</p>
              <p>⏳ Saving to your account...</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-xs mb-4">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
            user_profile
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
            user_media
          </span>
        </div>

        <p className="text-gray-500 text-xs">
          Powered by Instagram Basic Display API
        </p>
      </div>
    </div>
  );
};

export default InstagramCallback;