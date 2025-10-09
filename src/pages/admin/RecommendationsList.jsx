// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import config from "../../config";
// import Cookie from "js-cookie";
// import { toast } from "react-toastify";

// // Props: creators, brands, campaigns fetched from API
// const RecommendationsList = ({ onRecalculate, onExclude }) => {
//   const [platformFilter, setPlatformFilter] = useState("All");
//   const [scoreRange, setScoreRange] = useState([0, 100]);
//   const [brand, setBrand] = useState("");
//   const [campaign, setCampaign] = useState("");

//   // State for API data
//   const [creators, setCreators] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch recommendations from API
//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const fetchRecommendations = async () => {
//     try {
//       setLoading(true);
//       const token = Cookie.get("AdminToken");

//       const response = await axios.get(
//         `${config.BACKEND_URL}/admin/recommendations/list`,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );

//       if (response.data.status === "success") {
//         setCreators(response.data.data.creators || []);
//         setBrands(response.data.data.brands || []);
//         setCampaigns(response.data.data.campaigns || []);
//       } else {
//         toast.error(response.data.message || "Failed to fetch recommendations");
//       }
//     } catch (error) {
//       console.error("Error fetching recommendations:", error);
//       toast.error("Failed to load recommendations data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filtered creators
//   const filteredCreators = creators?.filter((c) =>
//     (platformFilter === "All" || c.platform === platformFilter) &&
//     c.score >= scoreRange[0] &&
//     c.score <= scoreRange[1] &&
//     (brand ? c.brandId === brand : true) &&
//     (campaign ? c.campaignId === campaign : true)
//   );

//   return (
//     <div className="flex flex-col gap-6">

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 items-center bg-[#1f1f1f] p-4 rounded-lg">
//         <input
//           type="range"
//           min="0" max="100"
//           value={scoreRange[1]}
//           onChange={(e) => setScoreRange([scoreRange[0], Number(e.target.value)])}
//           className="w-40 accent-blue-500"
//         />
//         <select
//           className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}
//         >
//           <option value="">All Brands</option>
//           {brands && brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//         </select>
//         <select
//           className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
//           value={campaign}
//           onChange={(e) => setCampaign(e.target.value)}
//         >
//           <option value="">All Campaigns</option>
//           {campaigns && campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>
//         <select
//           className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
//           value={platformFilter}
//           onChange={(e) => setPlatformFilter(e.target.value)}
//         >
//           <option>All</option>
//           <option>TikTok</option>
//           <option>Instagram</option>
//         </select>
//         <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white" onClick={() => {setBrand(""); setCampaign(""); setPlatformFilter("All"); setScoreRange([0,100]);}}>Reset</button>
//         <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">Apply</button>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-lg border border-gray-700">
//         <table className="w-full text-left text-gray-300">
//           <thead className="bg-[#1f1f1f] text-gray-400">
//             <tr>
//               <th className="px-4 py-2">Creator</th>
//               <th className="px-4 py-2">Platform</th>
//               <th className="px-4 py-2">Score</th>
//               <th className="px-4 py-2">Why Recommended</th>
//               <th className="px-4 py-2">Invites/Acceptance</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCreators && filteredCreators?.map(c => (
//               <tr key={c.id} className="border-t border-gray-700 hover:bg-[#2a2a2a]">
//                 <td className="px-4 py-2 flex items-center gap-2">
//                   <img src={c.avatar} alt={c.username} className="w-6 h-6 rounded-full" />
//                   {c.username}
//                 </td>
//                 <td className="px-4 py-2">{c.platform}</td>
//                 <td className="px-4 py-2">
//                   <div className="w-full bg-gray-800 rounded h-2 mt-1">
//                     <div className="bg-blue-500 h-2 rounded" style={{ width: `${c.score}%` }}></div>
//                   </div>
//                   <span className="text-sm mt-1 block">{c.score}</span>
//                 </td>
//                 <td className="px-4 py-2">
//                   {c.reason.length > 50 ? (
//                     <span>{c.reason.slice(0,50)}... <button className="text-blue-500 underline">View More</button></span>
//                   ) : c.reason}
//                 </td>
//                 <td className="px-4 py-2">{c.invites}/{c.accepted}</td>
//                 <td className="px-4 py-2 flex gap-2">
//                   <button className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm" onClick={()=>onRecalculate(c.id)}>Recalculate</button>
//                   <button className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-sm text-white" onClick={()=>onExclude(c.id)}>Exclude</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RecommendationsList;

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
  // Track expanded rows for "Why Recommended" text
  const [expanded, setExpanded] = useState({});
  
  // Modal state for recommendation details
  const [showModal, setShowModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch recommendations from API
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = Cookie.get("AdminToken");
      console.log(token)
      
      const response = await axios.get(
        `${config.BACKEND_URL}/admin/recommendations/list`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        // Map the API response to match the expected format
        const recommendations = response.data.data || [];
        
        // Transform recommendations to creator format
        const transformedCreators = recommendations.map((rec) => ({
          id: rec._id,
          username: rec.creator?.name || rec.creator?.username || "Unknown Creator",
          avatar: rec.creator?.profilePicture || rec.creator?.avatar || "https://via.placeholder.com/40",
          platform: rec.platform,
          score: rec.score,
          reason: rec.whyRecommended?.join(", ") || "No reason provided",
          invites: rec.invitationCount || 0,
          accepted: Math.round(rec.acceptanceRate * rec.invitationCount) || 0,
          brandId: rec.brand?._id || rec.brand,
          campaignId: rec.campaign?._id || rec.campaign,
          invitationStatus: rec.invitationStatus,
          scoreBreakdown: rec.scoreBreakdown,
        }));
        
        setCreators(transformedCreators);
        
        // Extract unique brands and campaigns (if available)
        const uniqueBrands = [];
        const uniqueCampaigns = [];
        
        recommendations.forEach((rec) => {
          if (rec.brand && typeof rec.brand === 'object') {
            const exists = uniqueBrands.find(b => b.id === rec.brand._id);
            if (!exists) {
              uniqueBrands.push({ id: rec.brand._id, name: rec.brand.name || rec.brand.brandName });
            }
          }
          if (rec.campaign && typeof rec.campaign === 'object') {
            const exists = uniqueCampaigns.find(c => c.id === rec.campaign._id);
            if (!exists) {
              uniqueCampaigns.push({ id: rec.campaign._id, name: rec.campaign.title || rec.campaign.campaignTitle });
            }
          }
        });
        
        setBrands(uniqueBrands);
        setCampaigns(uniqueCampaigns);
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

  // Fetch recommendation details
  const fetchRecommendationDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const token = Cookie.get("AdminToken");
      
      const response = await axios.get(
        `${config.BACKEND_URL}/admin/recommendations/details/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        setSelectedRecommendation(response.data.data);
        setShowModal(true);
      } else {
        toast.error(response.data.message || "Failed to fetch recommendation details");
      }
    } catch (error) {
      console.error("Error fetching recommendation details:", error);
      toast.error("Failed to load recommendation details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedRecommendation(null);
  };

  // Recalculate score for specific recommendation
  const handleRecalculate = async (id, event) => {
    event.stopPropagation();
    
    if (!window.confirm("Are you sure you want to recalculate the score for this recommendation?")) {
      return;
    }

    try {
      const token = Cookie.get("AdminToken");
      
      const response = await axios.post(
        `${config.BACKEND_URL}/admin/recommendations/recalculate/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Score recalculated successfully!");
        // Refresh the recommendations list
        fetchRecommendations();
      } else {
        toast.error(response.data.message || "Failed to recalculate score");
      }
    } catch (error) {
      console.error("Error recalculating score:", error);
      const errorMessage = error.response?.data?.message || "Failed to recalculate score";
      toast.error(errorMessage);
    }
  };

  // Exclude creator from recommendations
  const handleExclude = async (id, event) => {
    event.stopPropagation(); 
    
 
    const reason = window.prompt("Please provide a reason for excluding this creator:");
    
    if (!reason) {
      toast.info("Exclusion cancelled - reason is required");
      return;
    }

    try {
      const token = Cookie.get("AdminToken");
      
      
      const adminId = "68e619f740042456e84c9c75";
      
      const response = await axios.post(
        `${config.BACKEND_URL}/admin/recommendations/exclude/${id}`,
        {
          adminId: adminId,
          reason: reason
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Creator excluded successfully!");
        // Refresh the recommendations list
        fetchRecommendations();
      } else {
        toast.error(response.data.message || "Failed to exclude creator");
      }
    } catch (error) {
      console.error("Error excluding creator:", error);
      const errorMessage = error.response?.data?.message || "Failed to exclude creator";
      toast.error(errorMessage);
    }
  };

  // Filtered creators
  const filteredCreators = creators?.filter(
    (c) =>
      (platformFilter === "All" || c.platform === platformFilter) &&
      c.score >= scoreRange[0] &&
      c.score <= scoreRange[1] &&
      (brand ? c.brandId === brand : true) &&
      (campaign ? c.campaignId === campaign : true)
  );

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-[#1f1f1f] p-4 rounded-lg">
        <input
          type="range"
          min="0"
          max="100"
          value={scoreRange[1]}
          onChange={(e) =>
            setScoreRange([scoreRange[0], Number(e.target.value)])
          }
          className="w-40 accent-blue-500"
        />
        <select
          className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands &&
            brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
        </select>
        <select
          className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
        >
          <option value="">All Campaigns</option>
          {campaigns &&
            campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
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
        <button
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white"
          onClick={() => {
            setBrand("");
            setCampaign("");
            setPlatformFilter("All");
            setScoreRange([0, 100]);
          }}
        >
          Reset
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">
          Apply
        </button>
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
            {filteredCreators && filteredCreators.length > 0 ? (
              filteredCreators.map(c => (
                <tr 
                  key={c.id} 
                  className="border-t border-gray-700 hover:bg-[#2a2a2a] cursor-pointer"
                  onClick={() => fetchRecommendationDetails(c.id)}
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img src={c.avatar} alt={c.username} className="w-6 h-6 rounded-full" />
                    {c.username}
                  </td>
                  <td className="px-4 py-2">{c.platform}</td>
                  <td className="px-4 py-2">
                    <div className="w-full bg-gray-800 rounded h-2 mt-1">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: `${c.score}%` }}></div>
                    </div>
                    <span className="text-sm mt-1 block">{c.score}%</span>
                  </td>
                  <td className="px-4 py-2">
                    {(() => {
                      const text = c.reason || "";
                      const isExpanded = !!expanded[c.id];
                      const limit = 100;
                      if (text.length <= limit) return text;
                      if (isExpanded) {
                        return (
                          <span>
                            {text} <button className="text-blue-500 underline ml-1" onClick={() => setExpanded(prev => ({ ...prev, [c.id]: false }))}>View Less</button>
                          </span>
                        );
                      }
                      return (
                        <span>
                          {text.slice(0, limit)}... <button className="text-blue-500 underline ml-1" onClick={() => setExpanded(prev => ({ ...prev, [c.id]: true }))}>View More</button>
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-2">{c.invites}/{c.accepted}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button 
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm" 
                      onClick={(e) => handleRecalculate(c.id, e)}
                    >
                      Recalculate
                    </button>
                    <button 
                      className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-sm text-white" 
                      onClick={(e) => handleExclude(c.id, e)}
                    >
                      Exclude
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg">No recommendations found</p>
                    <p className="text-sm">Try adjusting your filters or check back later</p>
                  </div>
                </td>
              </tr>
            )}
            )}
          </tbody>
        </table>
      </div>

      {/* Recommendation Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-[#1f1f1f] rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {loadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : selectedRecommendation ? (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                  <h2 className="text-2xl font-bold text-white">Recommendation Details</h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl">
                    ×
                  </button>
                </div>

                {/* Creator Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Creator Information</h3>
                  <div className="bg-[#141414] rounded-lg p-4 flex items-center gap-4">
                    <img 
                      src={selectedRecommendation.creator?.profilePicture || selectedRecommendation.creator?.avatar || "https://via.placeholder.com/80"} 
                      alt={selectedRecommendation.creator?.name || "Creator"} 
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium text-lg">
                        {selectedRecommendation.creator?.name || selectedRecommendation.creator?.username || "Unknown Creator"}
                      </p>
                      <p className="text-gray-400 text-sm">{selectedRecommendation.platform}</p>
                      {selectedRecommendation.creator?.email && (
                        <p className="text-gray-400 text-sm">{selectedRecommendation.creator.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Match Score</h3>
                  <div className="bg-[#141414] rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-800 rounded h-4">
                          <div className="bg-blue-500 h-4 rounded" style={{ width: `${selectedRecommendation.score}%` }}></div>
                        </div>
                      </div>
                      <span className="text-white font-bold text-xl">{selectedRecommendation.score}%</span>
                    </div>
                    
                    {/* Score Breakdown */}
                    {selectedRecommendation.scoreBreakdown && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {Object.entries(selectedRecommendation.scoreBreakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-white font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Why Recommended</h3>
                  <div className="bg-[#141414] rounded-lg p-4">
                    <ul className="list-disc list-inside space-y-2">
                      {selectedRecommendation.whyRecommended?.map((reason, index) => (
                        <li key={index} className="text-gray-300">{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Campaign & Brand Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedRecommendation.campaign && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Campaign</h3>
                      <div className="bg-[#141414] rounded-lg p-4">
                        <p className="text-white font-medium">
                          {selectedRecommendation.campaign.title || selectedRecommendation.campaign.campaignTitle || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedRecommendation.brand && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Brand</h3>
                      <div className="bg-[#141414] rounded-lg p-4">
                        <p className="text-white font-medium">
                          {selectedRecommendation.brand.name || selectedRecommendation.brand.brandName || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Invitation Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Invitation Status</h3>
                  <div className="bg-[#141414] rounded-lg p-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className={`font-medium capitalize ${
                        selectedRecommendation.invitationStatus === 'accepted' ? 'text-green-500' :
                        selectedRecommendation.invitationStatus === 'pending' ? 'text-yellow-500' :
                        'text-gray-300'
                      }`}>
                        {selectedRecommendation.invitationStatus?.replace('_', ' ') || 'Not Invited'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Invitations Sent</p>
                      <p className="text-white font-medium">{selectedRecommendation.invitationCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Acceptance Rate</p>
                      <p className="text-white font-medium">{Math.round(selectedRecommendation.acceptanceRate * 100) || 0}%</p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Created At</p>
                    <p className="text-white">{new Date(selectedRecommendation.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Updated At</p>
                    <p className="text-white">{new Date(selectedRecommendation.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsList;
