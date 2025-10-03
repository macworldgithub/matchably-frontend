import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import {
  FaBullseye,
  FaUsers,
  FaCalendarAlt,
  FaTools,
  FaSyncAlt,
  FaPuzzlePiece,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PricingPlans() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("one-time");
  const token = localStorage.getItem("BRAND_TOKEN");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, [tab]);

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get(
        `${config.BACKEND_URL}/brand/package/plans`
      );
      setPlans(data.plans || []);
    } catch (err) {
      console.error("❌ Error fetching plans", err);
      toast.error("Failed to fetch plans.");
    }
  };

  const fetchSubscription = async () => {
    try {
      const { data } = await axios.get(
        `${config.BACKEND_URL}/brand/package/subscription`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status === "success") {
        setSubscription(data.subscription);
      }
    } catch {
      // No active subscription - silently fail or show toast if you want
    }
  };

  const handlePurchase = async (planId) => {
    setLoading(true);
    try {
      const endpoint = subscription
        ? "/brand/package/upgrade"
        : "/brand/package/subscribe";
      const payload = subscription ? { newPlanId: planId } : { planId };
      const { data } = await axios.post(
        `${config.BACKEND_URL}${endpoint}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Checkout error", err);
      toast.error("Failed to initiate checkout.");
    } finally {
      setLoading(false);
    }
  };

  const tabButtonClass = (active) =>
    `px-6 py-2 rounded-full font-semibold transition-all duration-200 border ${
      active
        ? "bg-green-500 text-black border-green-500 shadow-lg"
        : "bg-gray-700 text-gray-100 border-gray-700 hover:bg-gray-700"
    }`;

  const activePlans = plans.filter((plan) => plan.planType === tab);

  const addons = [
    {
      title: "① Extra Creator Add-on",
      highlight: "+10 creators",
      price: "$499",
      noteColor: "green",
      notes: [
        "❗ Only for Starter plans and above",
        "❗ Max 20 creators per campaign",
      ],
      query: "extra-creators",
    },
    {
      title: "② Extra Campaign Add-on",
      highlight: "+1 campaign",
      price: "$399",
      notes: [
        "❗ Only after 80% of the original plan is used",
        "❗ Max 2 extra campaigns per plan",
      ],
      query: "extra-campaign",
    },
  ];

  const faqs = [
    {
      q: "When do I need to pay?",
      a: "All plans are paid upfront at checkout.",
    },
    {
      q: "Can I upgrade my plan later?",
      a: "Yes — you can upgrade within 7 days by just paying the difference.",
    },
    {
      q: "If I upgrade, do I get new creators?",
      a: "Yes — your creator count resets, but creators already used in your previous plan cannot be reused.",
    },
    {
      q: "Can I cancel or get a refund?",
      a: "No — all purchases and add-ons are non-refundable.",
    },
    {
      q: "How does creator pricing work—fixed vs. bidding?",
      a: "You choose either a fixed price or a bid range. Creators see this before applying.",
    },
    {
      q: "Who handles payments?",
      a: "You pay creators directly. Matchably does not collect, hold, or guarantee payments.",
    },
    {
      q: "Can I switch a campaign from Gifted to Paid after launch?",
      a: 'No. You\'ll need to create a new campaign or use the "Add Paid Pricing" button if available.',
    },
    {
      q: "What if an approved creator doesn't deliver content?",
      a: "You may withhold payment. Matchably does not mediate or issue refunds.",
    },
    {
      q: "Do Paid campaigns count toward my plan limits?",
      a: "Yes. Every active campaign and its creators count toward your monthly plan quota.",
    },
    {
      q: "Can I cancel a campaign after launching it?",
      a: "Yes—within 24 hours, it's free. After that, even canceled campaigns still count against your plan.",
    },
  ];

  const ctas = [
    {
      label: "Launch Campaign",
      to: "/brand/create-campaign",
      className: "bg-green-500 text-black",
    },
    {
      label: "Contact Sales",
      onClick: () => (window.location.href = "mailto:info@matchably.kr"),
      className: "bg-gray-700 text-white",
    },
  ];

  return (
    <div className="px-6 md:px-12 lg:px-20 py-12 bg-[#0d0d0d] text-white min-h-screen">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
        Choose Your Campaign Plan
      </h1>
      <p className="text-center text-lg text-gray-400 mb-10">
        Save up to 20% compared to other UGC platforms
      </p>

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

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {activePlans.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">
            No {tab} plans available at the moment.
          </div>
        )}

        {activePlans.map((plan) => {
          const isActive = subscription && subscription.plan._id === plan._id;
          return (
            <div
              key={plan._id}
              className="relative bg-[#1a1a1a] border border-gray-700 p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:border-green-500 transition-transform hover:scale-105"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                {plan.isPopular && (
                  <span className="bg-pink-600 text-xs font-semibold px-2 py-1 rounded">
                    Most Popular
                  </span>
                )}
                {plan.isBestValue && (
                  <span className="bg-green-500 text-xs font-semibold px-2 py-1 rounded">
                    Best Value
                  </span>
                )}
                {isActive && (
                  <span className="bg-green-500 text-xs font-semibold px-2 py-1 rounded">
                    Active
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2 text-white">
                  {plan.name}
                </h2>
                <p className="text-2xl font-extrabold text-green-400 mb-4">
                  {plan.price}
                </p>
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

              <button
                onClick={() => handlePurchase(plan._id)}
                disabled={loading || isActive}
                className="mt-6 bg-green-500 hover:bg-green-700 text-black py-2 rounded-xl font-semibold text-sm w-full disabled:opacity-50 transition"
              >
                {loading
                  ? "Processing..."
                  : isActive
                  ? "Current Plan"
                  : subscription
                  ? "Upgrade Plan"
                  : "Select Plan"}
              </button>
            </div>
          );
        })}
      </div>

      {addons.length > 0 && (
        <>
          <div className="border-t border-gray-800 mt-20"></div>
          <AnimatePresence mode="wait">
            <motion.div
              key={plans + "-addons"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-8">
                ➕ Add-on Options
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                {addons.map((addon, idx) => (
                  <div
                    key={idx}
                    className="bg-[#111] p-8 rounded-2xl border border-gray-700 flex flex-col justify-between min-h-[280px]"
                  >
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-3">
                        {addon.title}
                      </h3>
                      <p className="text-base">
                        <span className="text-green-400 font-semibold">
                          {addon.highlight}
                        </span>{" "}
                        for {addon.price}
                      </p>
                      <ul className="text-sm font-medium mt-4 space-y-2">
                        {addon.notes.map((note, i) => (
                          <li key={i} className="text-red-400">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() =>
                          navigate(`/checkout?addon=${addon.query}`)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded font-semibold"
                      >
                        Add to Checkout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <div className="border-t border-gray-800 mt-20"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={plans + "-faqs"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            FAQs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((item, idx) => (
              <details
                key={idx}
                className="bg-[#111] p-5 rounded-xl border border-gray-700"
              >
                <summary className="cursor-pointer text-white text-base font-medium">
                  {item.q}
                </summary>
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="border-t border-gray-800 mt-20"></div>

      {/* CTA Buttons */}
      <div className="text-center py-14">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Ready to launch your campaign?
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {ctas.map((cta, idx) =>
            cta.to ? (
              <Link
                key={idx}
                to={cta.to}
                className={`px-6 py-3 rounded-xl hover:bg-green-400 font-semibold text-lg ${cta.className}`}
              >
                {cta.label}
              </Link>
            ) : (
              <button
                key={idx}
                onClick={cta.onClick}
                className={`px-6 py-3 rounded-xl hover:bg-gray-600 font-semibold text-lg ${cta.className}`}
              >
                {cta.label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
