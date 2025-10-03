// dashboard/PlanSummaryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function PlanSummaryCard({ subscription }) {
  const navigate = useNavigate();

  if (!subscription) return null;

  return (
    <div className="bg-[#1f1f1f] text-gray-200 p-6 rounded-xl shadow-lg border border-[#2c2c2c]">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {subscription?.plan?.name || "Your Plan"}
          </h2>
          <p className="text-sm text-gray-400">
            Purchased on:{" "}
            {subscription?.purchaseDate
              ? formatDate(subscription.purchaseDate)
              : "N/A"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Expires on:{" "}
            {subscription?.expiresAt
              ? formatDate(subscription.expiresAt)
              : "N/A"}
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate("/brand/pricing")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Plan Usage Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#2b2b2b] p-5 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">
            {subscription?.campaignsUsed} / {subscription?.plan?.campaignsAllowed}
          </p>
          <p className="text-sm text-gray-400 mt-1">Campaigns Used</p>
        </div>

        <div className="bg-[#2b2b2b] p-5 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">
            {subscription?.creatorsUsed} / {subscription?.plan?.creatorsAllowed}
          </p>
          <p className="text-sm text-gray-400 mt-1">Creators Used</p>
        </div>

        <div className="bg-[#2b2b2b] p-5 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">
            ₹{subscription?.plan?.price}
          </p>
          <p className="text-sm text-gray-400 mt-1">Plan Price</p>
        </div>
      </div>
    </div>
  );
}
