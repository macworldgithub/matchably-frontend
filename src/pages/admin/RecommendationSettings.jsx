// import React, { useState } from "react";
// import axios from "axios";
// import config from "../../config";
// import Cookie from "js-cookie";
// import { toast } from "react-toastify";

// const initialWeights = {
//   BrandKeywordMatch: 15,
//   CategoryMatch: 10,
//   ContentScore: 5,
//   UploadRate: 10,
//   ApprovalRate: 10,
//   Satisfaction: 10,
//   ActivityinLast30Days: 5,
//   CTAPresence: 2,
//   NewAdjustmentFactor: 0,
// };

// const RecommendationSettings = () => {
//   const [weights, setWeights] = useState(initialWeights);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [currentVersion, setCurrentVersion] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [lastSavedWeights, setLastSavedWeights] = useState(initialWeights);

//   // Detect if current weights differ from last saved
//   const isDirty = React.useMemo(() => {
//     const keys = Object.keys(initialWeights);
//     return keys.some(
//       (k) => Number(weights[k] ?? 0) !== Number(lastSavedWeights[k] ?? 0)
//     );
//   }, [weights, lastSavedWeights]);

//   // Map between API keys (camelCase) and UI keys (TitleCase)
//   const apiToUiKey = {
//     brandKeywordMatch: "BrandKeywordMatch",
//     categoryMatch: "CategoryMatch",
//     contentScore: "ContentScore",
//     uploadRate: "UploadRate",
//     approvalRate: "ApprovalRate",
//     satisfaction: "Satisfaction",
//     activityLast30Days: "ActivityinLast30Days",
//     ctaPresence: "CTAPresence",
//     newAdjustmentFactor: "NewAdjustmentFactor",
//   };
//   const uiToApiKey = Object.fromEntries(
//     Object.entries(apiToUiKey).map(([k, v]) => [v, k])
//   );
//   const mapWeightsFromApi = (apiWeights = {}) => {
//     const mapped = { ...initialWeights };
//     Object.keys(apiWeights).forEach((k) => {
//       const uiKey = apiToUiKey[k];
//       if (uiKey) mapped[uiKey] = apiWeights[k];
//     });
//     return mapped;
//   };
//   const mapWeightsToApi = (uiWeights = {}) => {
//     const out = {};
//     Object.keys(uiWeights).forEach((k) => {
//       const apiKey = uiToApiKey[k];
//       if (apiKey) out[apiKey] = uiWeights[k];
//     });
//     return out;
//   };

//   const handleSliderChange = (key, value) => {
//     setWeights((prev) => ({ ...prev, [key]: value }));
//   };

//   // Fetch current settings from API
//   React.useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         setLoading(true);
//         const token = Cookie.get("AdminToken");
//         const res = await axios.get(
//           `${config.BACKEND_URL}/admin/recommendations/settings`,
//           {
//             headers: { Authorization: token },
//           }
//         );
//         if (res.data?.status === "success") {
//           const list = Array.isArray(res.data?.data) ? res.data.data : [];
//           setHistory(list);
//           if (list.length > 0) {
//             const latest = list[0];
//             if (latest.weights) {
//               const mapped = mapWeightsFromApi(latest.weights);
//               setWeights(mapped);
//               setLastSavedWeights(mapped);
//             }
//             setLastUpdated(latest.updatedAt || latest.createdAt || null);
//             setCurrentVersion(latest.version || null);
//           }
//         } else {
//           toast.error(res.data?.message || "Failed to fetch settings");
//         }
//       } catch (err) {
//         console.error("Error fetching settings:", err);
//         toast.error("Failed to load settings");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       if (!isDirty) {
//         toast.info("No changes to save");
//         setSaving(false);
//         return;
//       }
//       const token = Cookie.get("AdminToken");
//       const res = await axios.post(
//         `${config.BACKEND_URL}/admin/recommendations/settings`,
//         {
//           adminId: "68e619f740042456e84c9c75",
//           weights: mapWeightsToApi(weights),
//         },
//         { headers: { Authorization: token } }
//       );
//       if (res.data?.status === "success") {
//         toast.success("Settings saved successfully");
//         const data = res.data?.data;
//         if (Array.isArray(data) && data.length > 0) {
//           const latest = data[0];
//           setLastUpdated(
//             latest.updatedAt || latest.createdAt || new Date().toISOString()
//           );
//           setCurrentVersion(latest.version || currentVersion);
//           setHistory(data);
//           setLastSavedWeights(weights);
//         } else if (data && (data.updatedAt || data.createdAt)) {
//           setLastUpdated(data.updatedAt || data.createdAt);
//           setLastSavedWeights(weights);
//         } else {
//           setLastUpdated(new Date().toISOString());
//           setLastSavedWeights(weights);
//         }
//       } else {
//         toast.error(res.data?.message || "Total weight cannot exceed 100");
//       }
//     } catch (err) {
//       console.error("Error saving settings:", err);
//       toast.error("Total weight cannot exceed 100");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleRollback = async (versionId) => {
//     if (!versionId) return;

//     try {
//       setSaving(true);
//       const token = Cookie.get("AdminToken");
//       const res = await axios.post(
//         `${config.BACKEND_URL}/admin/recommendations/settings/rollback/${versionId}`,
//         { adminId: "68e619f740042456e84c9c75" },
//         { headers: { Authorization: token } }
//       );

//       if (res.data?.status === "success") {
//         const data = res.data?.data;
//         if (data) {
//           const mapped = mapWeightsFromApi(data.weights);
//           setWeights(mapped);
//           setLastSavedWeights(mapped);
//           setLastUpdated(data.updatedAt || data.createdAt || null);
//           setCurrentVersion(data.version || null);

//           // Refresh the history after rollback
//           const historyRes = await axios.get(
//             `${config.BACKEND_URL}/admin/recommendations/settings`,
//             { headers: { Authorization: token } }
//           );

//           if (historyRes.data?.status === "success") {
//             setHistory(historyRes.data.data || []);
//           }

//           toast.success(`Successfully rolled back to version ${data.version}`);
//         } else {
//           toast.error("No data returned after rollback");
//         }
//       } else {
//         toast.error(res.data?.message || "Failed to rollback settings");
//       }
//     } catch (err) {
//       console.error("Error rolling back settings:", err);
//       toast.error("Failed to rollback settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = async () => {
//     try {
//       setSaving(true);
//       const token = Cookie.get("AdminToken");
//       const res = await axios.post(
//         `${config.BACKEND_URL}/admin/recommendations/settings/reset`,
//         { adminId: "68e619f740042456e84c9c75" },
//         { headers: { Authorization: token } }
//       );
//       if (res.data?.status === "success") {
//         const data = res.data?.data;
//         if (Array.isArray(data) && data.length > 0) {
//           const latest = data[0];
//           if (latest.weights) {
//             const mapped = mapWeightsFromApi(latest.weights);
//             setWeights(mapped);
//             setLastSavedWeights(mapped);
//           }
//           setLastUpdated(latest.updatedAt || latest.createdAt || null);
//           setCurrentVersion(latest.version || null);
//           setHistory(data);
//         } else if (data?.weights) {
//           const mapped = mapWeightsFromApi(data.weights);
//           setWeights(mapped);
//           setLastSavedWeights(mapped);
//         } else {
//           setWeights(initialWeights);
//           setLastSavedWeights(initialWeights);
//         }
//         toast.success("Settings reset to defaults");
//       } else {
//         toast.error(res.data?.message || "Failed to reset settings");
//       }
//     } catch (err) {
//       console.error("Error resetting settings:", err);
//       toast.error("Failed to reset settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         {/* Page Header */}
//         <h2 className="text-2xl font-bold mb-4">Recommendation Settings</h2>

//         {/* Description */}
//         <p className="text-gray-300 mb-4">
//           Adjust the weight of each factor in the AI recommendation score and
//           manage change history
//         </p>

//         <div className="w-full mb-6">
//           <div className="bg-[#0f0f10] border border-gray-800 rounded-lg px-6 py-3 text-sm text-gray-300 shadow-sm">
//             <div className="flex justify-between items-center">
//               <div className="text-gray-300 ">Current score version</div>
//               <div className="text-gray-300 ">
//                 Last update:{" "}
//                 <span className="font-medium ">
//                   {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
//                 </span>
//               </div>
//             </div>
//             {currentVersion && (
//               <div className="text-xs text-gray-500 mt-1">
//                 Version: {currentVersion}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Sliders */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {Object.keys(weights).map((key) => (
//           <div
//             key={key}
//             className="flex flex-col gap-2 bg-[#1f1f1f] p-4 rounded-lg shadow"
//           >
//             <div className="flex justify-between text-gray-400 text-sm">
//               <span>{key}</span>
//               <span>{weights[key]}</span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="30"
//               value={weights[key]}
//               onChange={(e) => handleSliderChange(key, Number(e.target.value))}
//               className="w-full h-2 bg-gray-700 rounded-lg accent-blue-500 cursor-pointer"
//               disabled={loading}
//             />
//             <div className="flex justify-between text-xs text-gray-500">
//               <span>0</span>
//               <span>30</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-4 mt-4">
//         <button
//           className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white disabled:opacity-60"
//           onClick={handleReset}
//           disabled={loading || saving}
//         >
//           Reset to Default
//         </button>
//         <button
//           className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-60"
//           onClick={handleSave}
//           disabled={loading || saving}
//         >
//           {saving ? "Saving..." : "Save & Apply"}
//         </button>
//       </div>

//       {/* Change History Table */}
//       <div className="mt-6">
//         <h3 className="font-bold mb-2">Change History</h3>
//         <div className="overflow-auto rounded-lg border border-gray-700">
//           <table className="w-full text-left text-gray-300">
//             <thead className="bg-[#1f1f1f] text-gray-400">
//               <tr>
//                 <th className="px-4 py-2">Date & Time</th>
//                 <th className="px-4 py-2">Changed By</th>
//                 <th className="px-4 py-2">Version</th>
//                 <th className="px-4 py-2">Modified Factors</th>
//                 <th className="px-4 py-2">Rollback Button</th>
//               </tr>
//             </thead>
//             <tbody>
//               {history && history.length > 0 ? (
//                 history.map((h) => (
//                   <tr
//                     key={h._id}
//                     className="border-t border-gray-700 hover:bg-[#2a2a2a]"
//                   >
//                     <td className="px-4 py-2">
//                       {new Date(h.updatedAt || h.createdAt).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-2">{h.changedBy || "—"}</td>
//                     <td className="px-4 py-2">{h.version || "—"}</td>
//                     <td className="px-4 py-2 text-sm text-gray-400">
//                       {h.changeDescription || "—"}
//                     </td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => handleRollback(h._id)}
//                         className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm disabled:opacity-50"
//                         disabled={saving}
//                       >
//                         {saving && currentVersion === h.version
//                           ? "Rolling back..."
//                           : "Rollback"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr className="border-t border-gray-700">
//                   <td className="px-4 py-3" colSpan={5}>
//                     no data
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecommendationSettings;



import React, { useState } from "react";
import axios from "axios";
import config from "../../config";
import Cookie from "js-cookie";
import { toast } from "react-toastify";

const initialWeights = {
  BrandKeywordMatch: 15,
  CategoryMatch: 10,
  ContentScore: 5,
  UploadRate: 10,
  ApprovalRate: 7.5,
  Satisfaction: 7.5,
  ActivityinLast30Days: 5,
  CTAPresence: 2.5,
  NewAdjustmentFactor: 5,
};

// Map max values from schema
const maxWeights = {
  BrandKeywordMatch: 30,
  CategoryMatch: 20,
  ContentScore: 10,
  UploadRate: 20,
  ApprovalRate: 15,
  Satisfaction: 15,
  ActivityinLast30Days: 10,
  CTAPresence: 5,
  NewAdjustmentFactor: 10,
};

const RecommendationSettings = () => {
  const [weights, setWeights] = useState(initialWeights);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastSavedWeights, setLastSavedWeights] = useState(initialWeights);

  // Detect if current weights differ from last saved
  const isDirty = React.useMemo(() => {
    const keys = Object.keys(initialWeights);
    return keys.some(
      (k) => Number(weights[k] ?? 0) !== Number(lastSavedWeights[k] ?? 0)
    );
  }, [weights, lastSavedWeights]);

  // Map between API keys (camelCase) and UI keys (TitleCase)
  const apiToUiKey = {
    brandKeywordMatch: "BrandKeywordMatch",
    categoryMatch: "CategoryMatch",
    contentScore: "ContentScore",
    uploadRate: "UploadRate",
    approvalRate: "ApprovalRate",
    satisfaction: "Satisfaction",
    activityLast30Days: "ActivityinLast30Days",
    ctaPresence: "CTAPresence",
    newAdjustmentFactor: "NewAdjustmentFactor",
  };
  const uiToApiKey = Object.fromEntries(
    Object.entries(apiToUiKey).map(([k, v]) => [v, k])
  );
  const mapWeightsFromApi = (apiWeights = {}) => {
    const mapped = { ...initialWeights };
    Object.keys(apiWeights).forEach((k) => {
      const uiKey = apiToUiKey[k];
      if (uiKey) mapped[uiKey] = apiWeights[k];
    });
    return mapped;
  };
  const mapWeightsToApi = (uiWeights = {}) => {
    const out = {};
    Object.keys(uiWeights).forEach((k) => {
      const apiKey = uiToApiKey[k];
      if (apiKey) out[apiKey] = uiWeights[k];
    });
    return out;
  };

  const handleSliderChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch current settings from API
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = Cookie.get("AdminToken");
        const res = await axios.get(
          `${config.BACKEND_URL}/admin/recommendations/settings`,
          {
            headers: { Authorization: token },
          }
        );
        if (res.data?.status === "success") {
          const list = Array.isArray(res.data?.data) ? res.data.data : [];
          setHistory(list);
          if (list.length > 0) {
            const latest = list[0];
            if (latest.weights) {
              const mapped = mapWeightsFromApi(latest.weights);
              setWeights(mapped);
              setLastSavedWeights(mapped);
            }
            setLastUpdated(latest.updatedAt || latest.createdAt || null);
            setCurrentVersion(latest.version || null);
          }
        } else {
          toast.error(res.data?.message || "Failed to fetch settings");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!isDirty) {
        toast.info("No changes to save");
        setSaving(false);
        return;
      }
      const token = Cookie.get("AdminToken");
      const res = await axios.post(
        `${config.BACKEND_URL}/admin/recommendations/settings`,
        {
          adminId: "68e619f740042456e84c9c75",
          weights: mapWeightsToApi(weights),
        },
        { headers: { Authorization: token } }
      );
      if (res.data?.status === "success") {
        toast.success("Settings saved successfully");
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];
          setLastUpdated(
            latest.updatedAt || latest.createdAt || new Date().toISOString()
          );
          setCurrentVersion(latest.version || currentVersion);
          setHistory(data);
          setLastSavedWeights(weights);
        } else if (data && (data.updatedAt || data.createdAt)) {
          setLastUpdated(data.updatedAt || data.createdAt);
          setLastSavedWeights(weights);
        } else {
          setLastUpdated(new Date().toISOString());
          setLastSavedWeights(weights);
        }
      } else {
        toast.error(res.data?.message || "Total weight cannot exceed 100");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Total weight cannot exceed 100");
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (versionId) => {
    if (!versionId) return;

    try {
      setSaving(true);
      const token = Cookie.get("AdminToken");
      const res = await axios.post(
        `${config.BACKEND_URL}/admin/recommendations/settings/rollback/${versionId}`,
        { adminId: "68e619f740042456e84c9c75" },
        { headers: { Authorization: token } }
      );

      if (res.data?.status === "success") {
        const data = res.data?.data;
        if (data) {
          const mapped = mapWeightsFromApi(data.weights);
          setWeights(mapped);
          setLastSavedWeights(mapped);
          setLastUpdated(data.updatedAt || data.createdAt || null);
          setCurrentVersion(data.version || null);

          // Refresh the history after rollback
          const historyRes = await axios.get(
            `${config.BACKEND_URL}/admin/recommendations/settings`,
            { headers: { Authorization: token } }
          );

          if (historyRes.data?.status === "success") {
            setHistory(historyRes.data.data || []);
          }

          toast.success(`Successfully rolled back to version ${data.version}`);
        } else {
          toast.error("No data returned after rollback");
        }
      } else {
        toast.error(res.data?.message || "Failed to rollback settings");
      }
    } catch (err) {
      console.error("Error rolling back settings:", err);
      toast.error("Failed to rollback settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const token = Cookie.get("AdminToken");
      const res = await axios.post(
        `${config.BACKEND_URL}/admin/recommendations/settings/reset`,
        { adminId: "68e619f740042456e84c9c75" },
        { headers: { Authorization: token } }
      );
      if (res.data?.status === "success") {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];
          if (latest.weights) {
            const mapped = mapWeightsFromApi(latest.weights);
            setWeights(mapped);
            setLastSavedWeights(mapped);
          }
          setLastUpdated(latest.updatedAt || latest.createdAt || null);
          setCurrentVersion(latest.version || null);
          setHistory(data);
        } else if (data?.weights) {
          const mapped = mapWeightsFromApi(data.weights);
          setWeights(mapped);
          setLastSavedWeights(mapped);
        } else {
          setWeights(initialWeights);
          setLastSavedWeights(initialWeights);
        }
        toast.success("Settings reset to defaults");
      } else {
        toast.error(res.data?.message || "Failed to reset settings");
      }
    } catch (err) {
      console.error("Error resetting settings:", err);
      toast.error("Failed to reset settings");
    } finally {
      setSaving(false);
    }
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
                <span className="font-medium ">
                  {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
                </span>
              </div>
            </div>
            {currentVersion && (
              <div className="text-xs text-gray-500 mt-1">
                Version: {currentVersion}
              </div>
            )}
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
              max={maxWeights[key]}
              step="0.5"
              value={weights[key]}
              onChange={(e) => handleSliderChange(key, Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg accent-blue-500 cursor-pointer"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{maxWeights[key]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white disabled:opacity-60"
          onClick={handleReset}
          disabled={loading || saving}
        >
          Reset to Default
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-60"
          onClick={handleSave}
          disabled={loading || saving}
        >
          {saving ? "Saving..." : "Save & Apply"}
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
              {history && history.length > 0 ? (
                history.map((h) => (
                  <tr
                    key={h._id}
                    className="border-t border-gray-700 hover:bg-[#2a2a2a]"
                  >
                    <td className="px-4 py-2">
                      {new Date(h.updatedAt || h.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{h.changedBy || "—"}</td>
                    <td className="px-4 py-2">{h.version || "—"}</td>
                    <td className="px-4 py-2 text-sm text-gray-400">
                      {h.changeDescription || "—"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleRollback(h._id)}
                        className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm disabled:opacity-50"
                        disabled={saving}
                      >
                        {saving && currentVersion === h.version
                          ? "Rolling back..."
                          : "Rollback"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-3" colSpan={5}>
                    no data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecommendationSettings;