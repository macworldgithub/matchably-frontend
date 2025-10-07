/** @format */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config";
import { Instagram, Music2, CheckCircle } from "lucide-react";
import Cookies from "js-cookie";
import useAuthStore from "../state/atoms";

export default function OnboardingFlow() {
  const Navigate = useNavigate();
  const location = useLocation();
  const { User, verifyLogin } = useAuthStore();

  const queryParams = new URLSearchParams(location.search);
  const queryStep = parseInt(queryParams.get("step"), 10);

  const [step, setStep] = useState(1);
  const [urls, setUrls] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const urlRegex = /^https?:\/\/(www\.)?(tiktok\.com|instagram\.com)\/.+$/;

  // ---- Handle input change ----
  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value.trim();
    setUrls(newUrls);
  };

  const getPlatform = (url) => {
    if (/tiktok\.com/.test(url)) return "tiktok";
    if (/instagram\.com/.test(url)) return "instagram";
    return null;
  };

  const validateUrls = () => {
    const uniqueUrls = new Set(urls);
    if (urls.some((u) => !urlRegex.test(u))) return false;
    if (uniqueUrls.size !== 3) return false;
    return true;
  };

  useEffect(() => {
    setIsValid(validateUrls());
  }, [urls]);

  // ---- STEP INITIALIZATION ----
  useEffect(() => {
    // Check if user has both submitted URLs AND connected social accounts
    const hasConnectedAccounts =
      User?.sns?.instagram?.connected ||
      User?.sns?.tiktok?.connected ||
      User?.snsConnected;

    // Only redirect to account if they've completed BOTH URL submission AND social connection (or explicitly want to skip)
    if (
      User?.urlsSubmitted &&
      User?.submittedUrls?.length >= 3 &&
      hasConnectedAccounts
    ) {
      Navigate("/myaccount", { replace: true });
      return;
    }

    if (queryStep) {
      setStep(queryStep);
    } else if (User?.submittedUrls?.length >= 3) {
      // If URLs are submitted but no social accounts connected, go to step 2
      setStep(2);
      updateQueryStep(2);
    } else {
      setStep(1);
      updateQueryStep(1);
    }
  }, [User, queryStep, Navigate]);

  const updateQueryStep = (s) => {
    const params = new URLSearchParams(location.search);
    params.set("step", s);
    Navigate({ search: params.toString() }, { replace: true });
  };

  const goToStep = (s) => {
    setStep(s);
    updateQueryStep(s);
  };

  // ---- URL Submit ----
  const handleSubmitUrls = async () => {
    if (!validateUrls()) {
      toast.error(
        "Please check your URLs (must be 3 unique TikTok/Instagram links).",
        { theme: "dark" }
      );
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(
        `${config.BACKEND_URL}/user/campaigns/submit-urls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ urls }),
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        toast.success("URLs submitted successfully!", { theme: "dark" });
        goToStep(2);
      } else {
        toast.error(data.message || "Failed to submit URLs", { theme: "dark" });
      }
    } catch (err) {
      console.error("URL submission error:", err);
      toast.error("Something went wrong. Please try again.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // ---- Start OAuth flow ----
  const startOAuth = async (provider) => {
    if (provider === "tiktok") {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await fetch(`${config.BACKEND_URL}/social/tiktok/auth`, {
          headers: { Authorization: token },
        });
        const data = await res.json();

        if (data.status === "success") {
          // Redirect to TikTok OAuth
          window.location.href = data.authUrl;
        } else {
          toast.error(data.message || "Failed to start TikTok connection", {
            theme: "dark",
          });
        }
      } catch (err) {
        console.error("TikTok OAuth error:", err);
        toast.error("Failed to connect to TikTok. Please try again.", {
          theme: "dark",
        });
      }
    } else if (provider === "instagram") {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await fetch(`${config.BACKEND_URL}/social/instagram/auth`, {
          headers: { Authorization: token },
        });
        const data = await res.json();

        if (data.status === "success") {
          // Redirect to Instagram OAuth
          window.location.href = data.authUrl;
        } else {
          toast.error(data.message || "Failed to start Instagram connection", {
            theme: "dark",
          });
        }
      } catch (err) {
        console.error("Instagram OAuth error:", err);
        toast.error("Failed to connect to Instagram. Please try again.", {
          theme: "dark",
        });
      }
    }
  };

  // ---- Confirm OAuth after redirect ----
  const confirmConnection = async (provider) => {
    try {
      setConnecting(true);
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(`${config.BACKEND_URL}/social/status`, {
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (data.status === "success" && data[provider]?.connected) {
        toast.success(`${provider} connected!`, { theme: "dark" });
        goToStep(3);
      } else {
        toast.error(`Failed to connect ${provider}.`, { theme: "dark" });
      }
    } catch (e) {
      console.error("Connection check error:", e);
      toast.error("Unable to verify connection. Please try again.", {
        theme: "dark",
      });
    } finally {
      setConnecting(false);
      // clean URL
      const params = new URLSearchParams(location.search);
      params.delete("provider");
      params.delete("status");
      Navigate({ search: params.toString() }, { replace: true });
    }
  };

  // ---- Handle redirect query after OAuth ----
  useEffect(() => {
    const provider = queryParams.get("provider");
    const status = queryParams.get("status");

    if (provider && status === "success") {
      confirmConnection(provider);
    }
  }, [location.search]);

  const steps = [
    { id: 1, label: "Submit URLs" },
    { id: 2, label: "Connect Accounts" },
    { id: 3, label: "Done" },
  ];

  // Show loading only briefly while checking user state
  if (!User) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950">
      <div className="w-[90%] md:w-[500px] p-8 rounded-2xl bg-white/10 shadow-xl backdrop-blur-md border border-white/20">
        {/* Progress Bar */}
        <div className="relative flex items-center justify-between mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold z-10 ${
                  step === s.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : step > s.id
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-700 text-gray-300 border-gray-500"
                }`}
              >
                {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step === s.id
                    ? "text-indigo-400"
                    : step > s.id
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-[calc(25%+${
                    i * 50
                  }%)] w-[33%] h-[2px] ${
                    step > s.id ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Submit URLs */}
        {step === 1 && (
          <>
            <h2 className="text-center text-2xl font-bold text-white mb-4">
              Submit Your Content
            </h2>
            <p className="text-gray-300 text-sm mb-6 text-center leading-relaxed">
              Please submit 3 TikTok/Instagram content URLs.
            </p>

            <div className="space-y-4">
              {urls.map((url, index) => {
                const platform = getPlatform(url);
                const isFilled = urlRegex.test(url);

                return (
                  <div key={index} className="relative">
                    <input
                      type="url"
                      placeholder={`Content URL ${index + 1}`}
                      value={url}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className={`w-full p-3 pr-10 rounded-xl bg-gray-800 text-white border ${
                        isFilled ? "border-green-500" : "border-gray-600"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {platform === "instagram" && (
                        <Instagram className="w-5 h-5 text-pink-400" />
                      )}
                      {platform === "tiktok" && (
                        <Music2 className="w-5 h-5 text-green-400" />
                      )}
                      {isFilled && !platform && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              disabled={!isValid || loading}
              onClick={handleSubmitUrls}
              className={`w-full p-3 rounded-xl mt-6 font-semibold transition-colors duration-200 ${
                isValid && !loading
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Submitting..." : "Submit & Continue"}
            </button>
          </>
        )}

        {/* Step 2: Connect Accounts */}
        {step === 2 && (
          <>
            <h2 className="text-center text-2xl font-bold text-white mb-4">
              Connect Your Accounts
            </h2>
            <p className="text-gray-300 text-sm mb-6 text-center">
              Link your TikTok/Instagram for enhanced recommendations.
            </p>

            <div className="space-y-4">
              <button
                disabled={connecting}
                onClick={() => startOAuth("tiktok")}
                className="w-full p-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold"
              >
                {connecting ? "Connecting..." : "Connect TikTok"}
              </button>
              <button
                disabled={connecting}
                onClick={() => startOAuth("instagram")}
                className="w-full p-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
              >
                {connecting ? "Connecting..." : "Connect Instagram"}
              </button>
              <button
                onClick={() => goToStep(3)}
                className="w-full p-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold"
              >
                Skip for now
              </button>
            </div>

            {/* Allow resubmission */}
            <p className="text-xs text-gray-400 mt-4 text-center">
              Not happy with your URLs?{" "}
              <button
                onClick={() => goToStep(1)}
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                Resubmit
              </button>
            </p>
          </>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <>
            <h2 className="text-center text-2xl font-bold text-green-400 mb-4">
              🎉 All Set!
            </h2>
            <p className="text-gray-300 text-sm mb-6 text-center">
              You're ready to be recommended to brands.
            </p>
            <button
              onClick={async () => {
                // Refresh user login state before navigating
                if (verifyLogin) {
                  await verifyLogin();
                }
                Navigate("/myaccount", { replace: true });
              }}
              className="w-full p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
