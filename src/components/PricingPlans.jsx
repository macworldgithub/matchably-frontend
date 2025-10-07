// PricingPlans.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBullseye,
  FaUsers,
  FaCalendarAlt,
  FaTools,
  FaSyncAlt,
  FaPuzzlePiece,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PricingPlans() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("one-time");
  const token = localStorage.getItem("BRAND_TOKEN");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
    fetchBrandProfile();
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/brand/package/plans`);
      setPlans(res.data.plans || res.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setPlans([]);
      toast.error("Failed to fetch plans.");
    }
  };

  const fetchBrandProfile = async () => {
    if (!token) {
      setBrand(null);
      return;
    }
    try {
      const res = await axios.get(`${config.BACKEND_URL}/brand/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.status === "success" && res.data.brand) {
        setBrand(res.data.brand);
      } else {
        setBrand(null);
        toast.error("Failed to verify brand profile.");
      }
    } catch (err) {
      console.error("Error fetching brand profile:", err);
      setBrand(null);
      toast.error("Error fetching brand profile.");
    }
  };

  const fetchSubscription = async () => {
    if (!token) return setSubscription(null);
    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/brand/package/subscription`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.status === "success")
        setSubscription(res.data.subscription);
      else setSubscription(null);
    } catch (err) {
      setSubscription(null);
      // toast.error("Failed to fetch subscription info.");
    }
  };

  const freeTrialPlan = plans.find(
    (p) =>
      p.name.toLowerCase().includes("free trial") ||
      p.slug === "free_trial" ||
      Number(p.price) === 0
  );

  const freeTrialActive =
    subscription &&
    subscription.plan &&
    (subscription.plan.slug === "free_trial" ||
      subscription.plan._id === freeTrialPlan?._id);

  const freeTrialAvailable =
    !!brand &&
    brand.isVerified &&
    !freeTrialActive &&
    !!freeTrialPlan &&
    !subscription;

  const handlePurchase = async (plan) => {
    if (!token) {
      navigate(
        plan._id === freeTrialPlan?._id
          ? "/brand-signup?trial=true"
          : "/brand-signup"
      );
      return;
    }

    if (plan._id === freeTrialPlan?._id) {
      if (!brand.isVerified) {
        toast.info(
          "Your account is pending approval. Free Trial will be available after approval."
        );
        return;
      }
      if (freeTrialActive) {
        navigate("/brand/create-campaign?trial=true");
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post(
          `${config.BACKEND_URL}/brand/package/activate-trial`,
          { planId: plan._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.status === "success") {
          await fetchBrandProfile();
          await fetchSubscription();
          toast.success("Free Trial activated successfully!");
          navigate("/brand/create-campaign?trial=true");
        } else {
          toast.error(res.data?.message || "Failed to start Free Trial.");
        }
      } catch (err) {
        console.error("Free Trial error:", err);
        toast.error(
          err?.response?.data?.message ||
            "Server error while starting Free Trial."
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // Paid plan flow
    setLoading(true);
    try {
      const endpoint = subscription
        ? "/brand/package/upgrade"
        : "/brand/package/subscribe";
      const payload = subscription
        ? { newPlanId: plan._id }
        : { planId: plan._id };
      const res = await axios.post(
        `${config.BACKEND_URL}${endpoint}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to start checkout.");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      toast.error(err?.response?.data?.message || "Failed to purchase plan");
    } finally {
      setLoading(false);
    }
  };

  const tabButtonClass = (active) =>
    `px-6 py-2 rounded-full font-semibold cursor-pointer transition-all duration-200 border-b-2 ${
      active
        ? "bg-green-500 text-black"
        : "bg-zinc-800 text-zinc-300 border-transparent hover:bg-zinc-700"
    }`;

  const activePlans = plans.filter(
    (p) =>
      p.planType === tab ||
      p.planType === (tab === "one-time" ? "one-time" : "subscription")
  );

  return (
    <div className="px-6 md:px-12 lg:px-20 py-12 bg-[#121212] text-white min-h-screen">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
        Choose Your Campaign Plan
      </h1>
      <p className="text-center text-lg text-gray-400 mb-6">
        Save up to 20% compared to other UGC platforms
      </p>

      {/* Top messages */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        {!brand && (
          <div className="bg-yellow-900/10 border border-yellow-800 text-yellow-200 p-4 rounded">
            Looking for the Free Trial?{" "}
            <button
              onClick={() => handlePurchase(freeTrialPlan)}
              className="ml-2 px-4 py-1 bg-yellow-400 text-black rounded"
            >
              Try Free Campaign
            </button>
          </div>
        )}

        {brand && !brand.isVerified && (
          <div className="bg-yellow-900/10 border border-yellow-800 text-yellow-200 p-4 rounded">
            Your account is pending approval. Free Trial will be available after
            admin approval.
          </div>
        )}

        {freeTrialAvailable && (
          <div className="bg-green-900/10 border border-green-700 text-green-200 p-4 rounded">
            You don’t have an active plan — your Free Trial is available! 🎁
            <div className="mt-3">
              <button
                onClick={() => handlePurchase(freeTrialPlan)}
                className="px-5 py-2 rounded bg-green-500 text-black font-semibold"
              >
                Try Free Campaign
              </button>
            </div>
          </div>
        )}

        {freeTrialActive && (
          <div className="bg-blue-900/10 border border-blue-700 text-blue-200 p-4 rounded">
            🎁 Free Trial active — valid until{" "}
            {subscription?.expiresAt
              ? new Date(subscription.expiresAt).toLocaleDateString()
              : "N/A"}
            .
            <br />1 gifted campaign · up to 5 creators.
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          className={tabButtonClass(tab === "one-time")}
          onClick={() => setTab("one-time")}
        >
          One-Time Plans
        </button>
        <button
          className={tabButtonClass(tab === "subscription")}
          onClick={() => setTab("subscription")}
        >
          Subscription Plans
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {activePlans.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">
            No {tab} plans available at the moment.
          </div>
        )}

        {activePlans.map((plan) => {
          const isActive =
            subscription &&
            subscription.plan &&
            subscription.plan._id === plan._id;
          const isFreeTrialPlan = plan._id === freeTrialPlan?._id;

          return (
            <div
              key={plan._id}
              className="relative bg-[#1a1a1a] border border-gray-700 p-6 rounded-lg shadow-md flex flex-col justify-between hover:border-green-500 transition-transform hover:scale-[1.02]"
            >
              <div className="absolute top-3 right-3 flex gap-2 flex-wrap">
                {plan.isPopular && (
                  <span className="bg-pink-600 text-xs font-semibold px-2 py-1 rounded">
                    Most Popular
                  </span>
                )}
                {plan.isBestValue && (
                  <span className="bg-blue-600 text-xs font-semibold px-2 py-1 rounded">
                    Best Value
                  </span>
                )}
                {isActive && (
                  <span className="bg-green-600 text-xs font-semibold px-2 py-1 rounded">
                    Active
                  </span>
                )}
                {isFreeTrialPlan && (
                  <span className="bg-purple-600 text-xs font-semibold px-2 py-1 rounded">
                    🎁 Free Trial
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>

                {freeTrialActive && isFreeTrialPlan ? (
                  <div className="mb-4">
                    <div className="text-sm text-gray-300 mt-1">
                      1 gifted campaign · up to 5 creators
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-extrabold text-green-400 mb-4">
                    {plan.currency || "$"} {plan.price}
                  </p>
                )}

                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <FaBullseye /> {plan.campaignsAllowed} Campaigns
                  </li>
                  <li className="flex items-center gap-2">
                    <FaUsers /> Up to {plan.creatorsAllowed} Creators
                  </li>
                  {plan.validityMonths && (
                    <li className="flex items-center gap-2">
                      <FaCalendarAlt /> {plan.validityMonths} Month Validity
                    </li>
                  )}
                  {plan.supportLevel && (
                    <li className="flex items-center gap-2">
                      <FaTools /> Support: {plan.supportLevel}
                    </li>
                  )}
                  {plan.targetAudience && (
                    <li className="flex items-center gap-2">
                      <FaBullseye /> Target: {plan.targetAudience}
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <FaSyncAlt /> Auto Reset Monthly:{" "}
                    {plan.autoResetMonthly ? "Yes" : "No"}
                  </li>
                  {plan.features && plan.features.length > 0 && (
                    <li className="flex items-start gap-2">
                      <FaPuzzlePiece className="mt-1" />
                      <div>
                        Features:
                        <ul className="list-disc list-inside ml-4">
                          {plan.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              <div>
                {freeTrialActive && isFreeTrialPlan ? (
                  <button
                    disabled
                    className="w-full py-2 rounded bg-zinc-700 text-gray-300 mt-4"
                  >
                    Free Trial Active
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(plan)}
                    disabled={loading || isActive}
                    className="mt-6 bg-green-500 hover:bg-green-700 text-black py-2 rounded-md font-semibold text-sm w-full disabled:opacity-50 transition"
                  >
                    {loading
                      ? "Processing..."
                      : isActive
                      ? "Current Plan"
                      : "Select Plan"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-xs text-gray-400 border-t border-gray-700 pt-6">
        <p>• All plans valid for 6 months (unless stated otherwise)</p>
        <p>• Creator limits apply per campaign</p>
        <p className="text-blue-400 mt-2">
          💡 Contact info@matchably.kr for volume discounts
        </p>
      </div>
    </div>
  );
}
