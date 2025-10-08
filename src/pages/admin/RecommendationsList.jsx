import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import Cookie from "js-cookie";
import { toast } from "react-toastify";

// Props: creators, brands, campaigns fetched from API
const RecommendationsList = ({ onRecalculate, onExclude }) => {
  const [platformFilter, setPlatformFilter] = useState("All");
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [brand, setBrand] = useState("");
  const [campaign, setCampaign] = useState("");
  
  // State for API data
  const [creators, setCreators] = useState([]);
  const [brands, setBrands] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recommendations from API
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = Cookie.get("AdminToken");
      
      const response = await axios.get(
        `${config.BACKEND_URL}/admin/recommendations/list`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        setCreators(response.data.data.creators || []);
        setBrands(response.data.data.brands || []);
        setCampaigns(response.data.data.campaigns || []);
      } else {
        toast.error(response.data.message || "Failed to fetch recommendations");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to load recommendations data");
    } finally {
      setLoading(false);
    }
  };

  // Filtered creators
  const filteredCreators = creators?.filter((c) => 
    (platformFilter === "All" || c.platform === platformFilter) &&
    c.score >= scoreRange[0] &&
    c.score <= scoreRange[1] &&
    (brand ? c.brandId === brand : true) &&
    (campaign ? c.campaignId === campaign : true)
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-[#1f1f1f] p-4 rounded-lg">
        <input 
          type="range" 
          min="0" max="100" 
          value={scoreRange[1]} 
          onChange={(e) => setScoreRange([scoreRange[0], Number(e.target.value)])} 
          className="w-40 accent-blue-500" 
        />
        <select
          className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
          value={brand} 
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands && brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select
          className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
          value={campaign} 
          onChange={(e) => setCampaign(e.target.value)}
        >
          <option value="">All Campaigns</option>
          {campaigns && campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
          value={platformFilter} 
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          <option>All</option>
          <option>TikTok</option>
          <option>Instagram</option>
        </select>
        <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white" onClick={() => {setBrand(""); setCampaign(""); setPlatformFilter("All"); setScoreRange([0,100]);}}>Reset</button>
        <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">Apply</button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#1f1f1f] text-gray-400">
            <tr>
              <th className="px-4 py-2">Creator</th>
              <th className="px-4 py-2">Platform</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Why Recommended</th>
              <th className="px-4 py-2">Invites/Acceptance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCreators && filteredCreators?.map(c => (
              <tr key={c.id} className="border-t border-gray-700 hover:bg-[#2a2a2a]">
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={c.avatar} alt={c.username} className="w-6 h-6 rounded-full" />
                  {c.username}
                </td>
                <td className="px-4 py-2">{c.platform}</td>
                <td className="px-4 py-2">
                  <div className="w-full bg-gray-800 rounded h-2 mt-1">
                    <div className="bg-blue-500 h-2 rounded" style={{ width: `${c.score}%` }}></div>
                  </div>
                  <span className="text-sm mt-1 block">{c.score}</span>
                </td>
                <td className="px-4 py-2">
                  {c.reason.length > 50 ? (
                    <span>{c.reason.slice(0,50)}... <button className="text-blue-500 underline">View More</button></span>
                  ) : c.reason}
                </td>
                <td className="px-4 py-2">{c.invites}/{c.accepted}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm" onClick={()=>onRecalculate(c.id)}>Recalculate</button>
                  <button className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-sm text-white" onClick={()=>onExclude(c.id)}>Exclude</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendationsList;
