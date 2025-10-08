import React, { useState } from "react";

const initialWeights = {
  BrandKeywordMatch: 15,
  CategoryMatch: 10,
  ContentScore: 5,
  UploadRate: 10,
  ApprovalRate: 10,
  Satisfaction: 10,
  ActivityinLast30Days: 5,
  CTAPresence: 2,
  NewAdjustmentFactor: 0,
};

const RecommendationSettings = () => {
  const [weights, setWeights] = useState(initialWeights);

  const handleSliderChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        {/* Page Header */}
        <h2 className="text-2xl font-bold mb-4">Recommendation Settings</h2>

        {/* Description */}
        <p className="text-gray-300 mb-4">
          Adjust the weight of each factor in the AI recommendation score and
          manage change history
        </p>

        <div className="w-full mb-6">
          <div className="bg-[#0f0f10] border border-gray-800 rounded-lg px-6 py-3 text-sm text-gray-300 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="text-gray-300 ">Current score version</div>
              <div className="text-gray-300 ">
                Last update:{" "}
                <span className="font-medium ">2025-08-10 14:32</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(weights).map((key) => (
          <div
            key={key}
            className="flex flex-col gap-2 bg-[#1f1f1f] p-4 rounded-lg shadow"
          >
            <div className="flex justify-between text-gray-400 text-sm">
              <span>{key}</span>
              <span>{weights[key]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={weights[key]}
              onChange={(e) => handleSliderChange(key, Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>30</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white">
          Reset to Default
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white">
          Save & Apply
        </button>
      </div>

      {/* Change History Table */}
      <div className="mt-6">
        <h3 className="font-bold mb-2">Change History</h3>
        <div className="overflow-auto rounded-lg border border-gray-700">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-[#1f1f1f] text-gray-400">
              <tr>
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2">Changed By</th>
                <th className="px-4 py-2">Version</th>
                <th className="px-4 py-2">Modified Factors</th>
                <th className="px-4 py-2">Rollback Button</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700 hover:bg-[#2a2a2a]">
                <td>no data </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecommendationSettings;
