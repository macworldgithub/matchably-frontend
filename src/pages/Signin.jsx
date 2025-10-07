/** @format */

import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { SignInFunction } from "../utils/auth";
import config from "../config";
import { toast } from "react-toastify";
import useAuthStore from "../state/atoms";
import { Helmet } from "react-helmet";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash, FaTiktok } from "react-icons/fa";
import CountrySelectionModal from "../components/CountrySelectionModal";

export default function Signin() {
  const { setSignin, verifyLogin, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ lowercase, consistent
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState(null);
  const [isProcessingGoogleLogin, setIsProcessingGoogleLogin] = useState(false);

  // Shared error handler
  const handleGoogleError = (message = "Google Login Failed") => {
    toast.error(message, { theme: "dark" });
  };

  const HandleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await SignInFunction({ email, password });
    const { status, message } = res;

    if (status === "success") {
      toast.dismiss();
      toast.success(message, {
        theme: "dark",
        toastId: "regular-login-success", // Prevent duplicates
        autoClose: 3000,
      });
      verifyLogin();
      setSignin(true);

      if (res.data.hasUrls) {
        navigate("/"); // ✅ fixed
      } else {
        navigate("/myaccount"); // Route to myaccount
      }
    } else if (message === "Please verify your email first") {
      toast.error(
        "⚠️Please verify your email via the link sent to your inbox.",
        { theme: "dark" }
      );
    } else {
      toast.error(message || "Login failed", { theme: "dark" });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async (idToken) => {
    // Prevent duplicate calls
    if (isProcessingGoogleLogin) {
      console.log("Google login already in progress, ignoring duplicate call");
      return;
    }

    setIsProcessingGoogleLogin(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/auth/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data?.token);
        // Also set in cookies for better persistence
        document.cookie = `token=${data?.token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`;
        // Set user data immediately if available
        if (data.user) {
          setUser(data.user);
        }
        // Dismiss any existing toasts before showing success
        toast.dismiss();

        // Wait a moment to ensure all toasts are dismissed
        setTimeout(() => {
          console.log(
            "🎯 About to show Google login success toast:",
            data?.message
          );
          toast.success(data?.message || "Login successful!", {
            theme: "dark",
            toastId: "google-login-success", // Prevent duplicates
            autoClose: 3000,
          });
          console.log("✅ Google login success toast shown");
        }, 100);
        verifyLogin();
        setSignin(true);
        navigate("/"); // ✅ fixed
      } else if (data.status === "needs_country") {
        setPendingGoogleToken(data.token);
        setShowCountryModal(true);
      } else if (data.status === "pending_urls") {
        // Redirect to URL submission onboarding
        localStorage.setItem("token", data.token);
        toast.info("Please submit 3 URLs to complete your profile", {
          theme: "dark",
        });
        navigate("/onboarding?step=1");
      } else {
        const errorMessage = data?.message || "Google login failed";
        handleGoogleError(errorMessage);
      }
    } catch (err) {
      console.error("Google login error:", err);
      handleGoogleError("Google login failed");
    } finally {
      // Reset the flag after a delay to allow for proper completion
      setTimeout(() => {
        setIsProcessingGoogleLogin(false);
      }, 2000);
    }
  };

  const handleCountryModalSuccess = (user) => {
    localStorage.setItem("token", pendingGoogleToken);
    // Don't show additional success toast here - the main login already showed one
    verifyLogin();
    setSignin(true);
    navigate("/"); // ✅ fixed
  };

  const handleCountryModalClose = () => {
    setShowCountryModal(false);
    setPendingGoogleToken(null);

    if (pendingGoogleToken) {
      localStorage.setItem("token", pendingGoogleToken);
      verifyLogin();
      setSignin(true);
      navigate("/"); // ✅ fixed
    }
  };

  return (
    <div className="flex bg-customBg justify-center items-center h-[80vh]">
      <Helmet>
        <title>Sign In | Matchably</title>
      </Helmet>

      <div className="flex flex-col justify-center w-[90%] md:w-auto px-5 bg-[#ffffff1b] lg:min-w-[400px] rounded-[5px] py-[20px] my-[10px]">
        <h2 className="text-center text-2xl font-bold text-gray-100">
          Login to your account
        </h2>

        <form className="space-y-6 mt-10" onSubmit={HandleSignIn}>
          <div>
            <label htmlFor="email" className="text-sm text-gray-200 block">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full mt-2 rounded-md bg-[#ffffff29] px-3 py-1 text-base text-gray-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-200 block">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                className="w-full rounded-md bg-[#ffffff29] px-3 pr-10 py-1.5 text-base text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-300 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow ${
                loading ? "bg-gray-500" : "bg-indigo-600"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-center items-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const idToken = credentialResponse.credential;
              handleGoogleLogin(idToken);
            }}
            onError={() => {
              handleGoogleError("Google Login Failed");
            }}
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Country Selection Modal for Google Users */}
      <CountrySelectionModal
        isOpen={showCountryModal}
        onClose={handleCountryModalClose}
        onSuccess={handleCountryModalSuccess}
        token={pendingGoogleToken}
      />
    </div>
  );
}
