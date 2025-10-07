/** @format */

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { GoogleLogin } from "@react-oauth/google";
import Select from "react-select";
import countryList from "react-select-country-list";
import config from "../config";
import RecaptchaBox from "../components/RecaptchaBox";
import CountrySelectionModal from "../components/CountrySelectionModal";
import useAuthStore from "../state/atoms";

export default function Signup() {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [searchParams] = useSearchParams();
  const [referralId, setReferralId] = useState("");
  const [country, setCountry] = useState(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState(null);
  const Navigate = useNavigate();
  const recaptchaRef = useRef();

  const countryOptions = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    const refId = searchParams.get("ref");
    if (refId) setReferralId(refId);
  }, [searchParams]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log("Form submitted, prevented default"); // Debug log
    setLoading(true);

    // Get the form element
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // Validate all required fields
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields", { theme: "dark" });
      setLoading(false);
      return;
    }

    if (!country) {
      toast.error("Please select a country", { theme: "dark" });
      setLoading(false);
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA", { theme: "dark" });
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", { theme: "dark" });
      setLoading(false);
      return;
    }

    // Password length validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          country: country.label, // <-- send country name
          recaptchaToken,
          referrer: referralId || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Signup response:", data); // Debug log

      if (data.status === "success") {
        // Store user token if provided
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        toast.success("Account created! Check your email for verification.", {
          theme: "dark",
        });

        // Delay navigation to allow toast to show
        setTimeout(() => {
          Navigate("/signin?signup=success");
        }, 2000);
      } else {
        console.error("Signup failed:", data.message);
        toast.error(data.message || "Signup failed", { theme: "dark" });
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.message.includes("fetch")) {
        toast.error("Network error. Please check your connection.", {
          theme: "dark",
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          theme: "dark",
        });
      }
    } finally {
      recaptchaRef.current?.resetCaptcha();
      setRecaptchaToken("");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (idToken) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/auth/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          referrer: referralId || null,
          country: country?.label || null, // send if selected
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        // Also set in cookies for better persistence
        document.cookie = `token=${data.token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`;
        // Set user data immediately if available
        if (data.user) {
          setUser(data.user);
        }
        toast.success(
          "Account created with Google! Check your email for verification.",
          { theme: "dark" }
        );
        // Delay navigation to allow toast to show
        setTimeout(() => {
          Navigate("/signin?signup=success");
        }, 2000);
      } else if (data.status === "pending_urls") {
        // New Google user needs URL submission
        localStorage.setItem("token", data.token);
        toast.info("Welcome! Please submit 3 URLs to get started", {
          theme: "dark",
        });
        setTimeout(() => {
          Navigate("/onboarding?step=1");
        }, 2000);
      } else if (data.status === "needs_country") {
        // Google user needs to select country
        setPendingGoogleToken(data.token);
        setShowCountryModal(true);
      } else {
        toast.error(data.message, { theme: "dark" });
      }
    } catch (err) {
      console.error("Google signup error:", err);
      toast.error(`Google signup failed: ${err.message || "Unknown error"}`, {
        theme: "dark",
      });
    }
  };

  const handleCountryModalSuccess = (user) => {
    localStorage.setItem("token", pendingGoogleToken);
    // Don't show duplicate toast - main signup already showed one
    // Delay navigation to allow toast to show
    setTimeout(() => {
      Navigate("/signin");
    }, 500);
  };

  const handleCountryModalClose = () => {
    setShowCountryModal(false);
    setPendingGoogleToken(null);
    // Still allow user to continue without country for now
    if (pendingGoogleToken) {
      localStorage.setItem("token", pendingGoogleToken);
      // Show success message and redirect to signin
      toast.success(
        "Registration completed! Check your email for verification.",
        { theme: "dark" }
      );
      setTimeout(() => {
        Navigate("/signin");
      }, 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--background)]">
      <Helmet>
        <title>Sign Up | Matchably</title>
      </Helmet>

      <div className="w-[90%] md:w-[400px] p-5 rounded bg-[#ffffff1b]">
        <h2 className="text-center text-xl font-semibold text-white mb-6">
          Create an account
        </h2>

        <form
          className="space-y-5"
          onSubmit={handleFormSubmit}
          noValidate
          autoComplete="off"
        >
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          {/* Country Dropdown */}
          <div>
            <Select
              options={countryOptions}
              value={country}
              onChange={setCountry}
              placeholder="Select your country"
              className="text-black"
              isSearchable={true}
              required
            />
            {!country && (
              <p className="text-red-400 text-xs mt-1">
                Please select a country
              </p>
            )}
          </div>

          <input
            name="referrerId"
            defaultValue={referralId}
            placeholder="Referral ID (optional)"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <RecaptchaBox
            ref={recaptchaRef}
            onTokenChange={(token) => setRecaptchaToken(token)}
          />

          <button
            type="submit"
            disabled={loading || !country || !recaptchaToken}
            className="w-full bg-indigo-600 text-white p-2 rounded mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-5 text-center text-gray-300">OR</div>

        <div className="mt-3 flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const idToken = credentialResponse.credential;
              handleGoogleSignup(idToken);
            }}
            onError={() => {
              toast.error("Google Login Failed", { theme: "dark" });
            }}
          />
        </div>

        <p className="mt-5 text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-indigo-400 hover:underline">
            Sign in
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
