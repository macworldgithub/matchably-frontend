import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import config from '../../../config'; // backend URL config

// 📄 Campaign Summary View Component
const BrandPerformancePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();
 const token = localStorage.getItem("BRAND_TOKEN");
  useEffect(() => {
    fetch(`${config.BACKEND_URL}/brand/performance/campaigns`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns || []))
      .catch((err) => console.error('Failed to load campaigns:', err));
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-b from-black via-[#0d0d0d] to-black text-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-8">Performance Summary</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 border border-gray-800"
          >
            <h2 className="text-xl font-semibold mb-3">{campaign.title}</h2>
            <div className="space-y-1 text-sm text-gray-300">
              <p>Total Views: <span className="text-white">{campaign.total_views || 0}</span></p>
              <p>Total Likes: <span className="text-white">{campaign.total_likes || 0}</span></p>
              <p>Total Comments: <span className="text-white">{campaign.total_comments || 0}</span></p>
              <p>Avg Engagement Rate: <span className="text-white">{(campaign.avg_engagement_rate || 0).toFixed(2)}%</span></p>
              <p>Matchably EMV: <span className="text-white">${(campaign.emv_total || 0).toFixed(2)}</span></p>
              <p>Google Ads Equivalent: <span className="text-white">${(campaign.google_ads_total || 0).toFixed(2)}</span></p>
              <p>Meta Ads Equivalent: <span className="text-white">${(campaign.meta_ads_total || 0).toFixed(2)}</span></p>
            </div>

            {!campaign.has_content && (
              <p className="text-xs text-yellow-400 mt-3">⚠️ Awaiting content submissions.</p>
            )}

            <button
              onClick={() => navigate(`/brand/campaigns/${campaign.id}/performance`)}
              className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition"
            >
              View Detail →
            </button>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center mt-12 text-gray-400">
          <p className="text-lg">📭 No campaigns found.</p>
        </div>
      )}
    </div>
  );
};



export default BrandPerformancePage;
