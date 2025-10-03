import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaMoneyBillWave, FaClock, FaGem } from "react-icons/fa"; // add these at the top
// Import UI Components
import CampaignStatsCard from "./dashboard/CampaignStatsCard";
import CampaignsEndingSoon from "./dashboard/CampaignsEndingSoon";
import BrandToDoCard from "./dashboard/BrandToDoCard";
import ExtensionRequestsCard from "./dashboard/ExtensionRequestsCard";

export default function BrandDashboard() {
  const [hasPlan, setHasPlan] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCampaigns, setHasCampaigns] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("BRAND_TOKEN");

  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      try {
        // Fetch plan
        const planRes = await axios.get(
          `${config.BACKEND_URL}/brand/package/subscription`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (planRes.data.status === "success") {
          setSubscription(planRes.data.subscription);
          setHasPlan(true);
        }

        // Fetch campaign requests
        const campaignRes = await axios.get(
          `${config.BACKEND_URL}/brand/campaign-request/my-requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasCampaigns(
          Array.isArray(campaignRes.data.requests) &&
            campaignRes.data.requests.length > 0
        );
      } catch (err) {
        console.error("❌ Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Brand Dashboard
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition duration-300 shadow-md flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <IoMdArrowRoundBack size={20} /> Return to Home
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 text-lg">
            Loading your plan...
          </div>
        ) : !hasPlan ? (
          <div className="bg-[#1a1a1a] border border-[#2c2c2c] p-10 rounded-2xl shadow-lg text-center">
            <p className="mb-6 text-xl text-gray-300 font-medium">
              You don't have an active plan.
            </p>
            <button
              onClick={() => navigate("/brand/pricing")}
              className="bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black font-semibold py-2.5 px-6 rounded-xl transition duration-300 shadow-md"
            >
              See Our Pricing
            </button>
          </div>
        ) : !hasCampaigns ? (
          <div className="bg-[#1a1a1a] border border-[#2c2c2c] p-10 rounded-2xl shadow-lg text-center">
            <p className="mb-6 text-xl text-gray-300 font-medium">
              You don't have any campaigns yet.
            </p>
            <button
              onClick={() => navigate("/brand/create-campaign")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition duration-300 shadow-md"
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <CampaignStatsCard />
            <CampaignsEndingSoon />

            {/* Mobile: BrandToDoCard appears above Plan Info */}
              <BrandToDoCard />
            {subscription.plan && (
              <div className="bg-[#1a1a1a] border border-[#2c2c2c] p-6 rounded-2xl shadow-md">
                <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FaGem className="text-lime-400" /> Plan Info
                </h2>
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <FaGem className="text-indigo-400" />
                    <span className="font-medium">
                      {subscription.plan.name || "Your Plan"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-400" />
                    <span className="text-white font-bold text-lg">
                      {subscription.plan.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-l border-gray-600 pl-4">
                    <FaClock className="text-yellow-400" />
                    <span className="text-sm">
                      {subscription.plan.billingType === "onetime"
                        ? "One-time"
                        : "Recurring"}
                      , {subscription.plan.validityMonths}-month validity
                    </span>
                  </div>
                </div>
              </div>
            )}

            <ExtensionRequestsCard />
          </div>
        )}
      </div>
    </div>
  );
}
