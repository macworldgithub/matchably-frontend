import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HeroSection() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("BRAND_TOKEN");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await axios.get(`${config.BACKEND_URL}/api/brand/auth/verify`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          setUser(res.data.brand);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setUser(null);
      }
    };
    verifyUser();
  }, [token, navigate]);

  const handleTryFreeClick = async () => {
    if (!user) {
      navigate("/brand-signup?trial=true");
      return;
    }

    if (!user.isVerified) {
      toast.warn("Your account is pending approval.");
      return;
    }

    if (user.trialUsed) {
      toast.info(
        "You’ve already used your Free Trial. View plans to continue."
      );
      // navigate("/brand-price");
      return;
    }

    try {
      const res = await axios.post(
        `${config.BACKEND_URL}/brand/package/activate-trial`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("🎉 Free trial activated! Start your campaign now.");
        navigate("/brand/create-campaign?trial=true");
      } else {
        toast.error(res.data.message || "Failed to activate trial");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error activating trial");
    }
  };

  return (
    <>
      <div className="relative flex justify-center items-center h-[85vh] w-full p-2 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute z-10 w-full h-full bg-opacity-40"></div>

        {/* Content Box */}
        <div className="gap-[80px] lg:gap-[40px] bg-[#8181811f] w-[90%] text-center py-20 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 h-[90%] rounded-[20px] flex flex-col justify-center items-center relative z-20">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute z-[-1] w-full h-full object-cover rounded-[20px] opacity-[0.5]"
          >
            <source src="/videos/backgroundV.mp4" type="video/mp4" />
          </video>

          {/* Text */}
          <div>
            <h1 className="text-white text-[23px] sm:text-3xl font-extrabold leading-tight FontLato">
              <span className="text-lime-300">
                The Easiest Way for Creators and Brands to Run UGC Campaigns
              </span>
            </h1>
            <p className="text-gray-200 mt-4 text-base sm:text-lg max-w-3xl mx-auto FontNoto">
              Brands get ready-to-use content. Creators get free products or
              rewards. Everything tracked, all in one place.
            </p>
          </div>

          {/* Main Buttons */}
          <div className="flex flex-wrap gap-5 justify-center">
            <Link
              to="/brand-signup"
              className="mt-6 text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-[25px] text-sm md:text-lg font-semibold FontNoto
                            bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900
                            border-1 border-white hover:border-white
                            shadow-[0_0_10px_2px_rgba(0,0,255,0.4)]
                            transition duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_4px_rgba(0,255,255,0.5)] w-[250px] lg:w-auto"
            >
              I'm a Brand
            </Link>

            <Link
              to="/signup"
              className="mt-6 text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-[25px] text-sm md:text-lg font-semibold FontNoto
                            bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                            border-1 border-white hover:border-white
                            shadow-[0_0_10px_2px_rgba(255,0,255,0.4)]
                            transition duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_4px_rgba(0,255,255,0.5)] w-[250px] lg:w-auto"
            >
              I'm an Influencer
            </Link>
          </div>

          {/* CTA: Try Free Campaign */}
          <div className="mt-2">
            <button
              onClick={handleTryFreeClick}
              className={`text-white cursor-pointer px-6 md:px-10 py-3 md:py-3.5 rounded-[25px] text-sm md:text-lg font-semibold FontNoto
                            bg-gradient-to-r from-green-400 via-green-600 to-green-800
                            border-1 border-white hover:border-white
                            shadow-[0_0_10px_2px_rgba(0,255,0,0.4)]
                            transition duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_4px_rgba(0,255,0,0.5)]
                            ${
                              user?.trialUsed
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
            >
              Try Free Campaign
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
