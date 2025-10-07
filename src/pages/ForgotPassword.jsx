import React, { useState } from "react";
import { toast } from "react-toastify";
import config from "../config";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return toast.error("Please enter a valid email address.");
    }
    setSubmitting(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        toast.success("Temporary password sent to your email.", {
          theme: "dark",
        });
        // 👇 Navigate to Signin after 2 seconds
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      } else {
        toast.error(data.message || "Failed to send reset email.", {
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-customBg">
      <Helmet>
        <title>Forgot Password | Matchably</title>
      </Helmet>

      <form
        onSubmit={handleSubmit}
        className="bg-[#ffffff1b] p-6 rounded-lg w-[90%] md:w-[400px] text-white"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-300 mb-6 text-center">
          Enter your email and we'll send you a temporary password.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 rounded bg-[#ffffff29] text-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className={`w-full mt-4 py-2 rounded text-white font-semibold ${
            submitting ? "bg-gray-500" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? "Sending..." : "Send Temporary Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
