// src/components/common/CampaignSubmittedModal.jsx
import React from "react";

export function CampaignSubmittedModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-4">
          <div className="text-3xl">🪧</div>
          <h2 className="text-xl font-semibold text-green-400">
             Your campaign has been submitted for review.
          </h2>
          <p className="text-gray-300">
            Our admin team will review and activate it within 24 hours.
            <br />
            You’ll receive a notification once it goes live.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
