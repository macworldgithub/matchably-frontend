import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import Cookie from "js-cookie";
import { toast } from "react-toastify";

const kpiCards = [
  { key: "today", label: "Today's Recommendations" },
  { key: "avgScore", label: "Avg Score" },
  { key: "inviteConversion", label: "Invite Conversion" },
  { key: "acceptanceRate", label: "Acceptance Rate" },
];

const RecommendationsLayout = () => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch KPIs data
  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const token = Cookie.get("AdminToken");

      const response = await axios.get(
        `${config.BACKEND_URL}/admin/recommendations/kpis`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        setKpiData(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch KPIs");
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error);
      toast.error("Failed to load KPIs data");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col p-6 bg-[#141414] min-h-screen text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Recommendations Management</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card) => (
          <div
            key={card.key}
            className="p-4 bg-[#1f1f1f] rounded-lg shadow hover:shadow-md"
          >
            <span className="text-gray-400 text-sm">{card.label}</span>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-700 rounded mt-2"></div>
            ) : (
              <span className="text-xl font-bold mt-1 block">
                {kpiData?.[card.key] !== undefined ? kpiData[card.key] : "-"}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <nav className="flex gap-4 border-b border-gray-700 mb-6">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-3 py-2 text-sm font-medium rounded-t ${isActive ? "bg-[#1f1f1f] text-blue-500" : "text-gray-400 hover:text-white"}`
          }
        >
          List
        </NavLink>
        <NavLink
          to="settings"
          className={({ isActive }) =>
            `px-3 py-2 text-sm font-medium rounded-t ${isActive ? "bg-[#1f1f1f] text-blue-500" : "text-gray-400 hover:text-white"}`
          }
        >
          Settings
        </NavLink>
        <NavLink
          to="exclusions-whitelist"
          className={({ isActive }) =>
            `px-3 py-2 text-sm font-medium rounded-t ${isActive ? "bg-[#1f1f1f] text-blue-500" : "text-gray-400 hover:text-white"}`
          }
        >
          Exclusions & Whitelist
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};

export default RecommendationsLayout;
