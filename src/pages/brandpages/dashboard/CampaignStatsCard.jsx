import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import {
  FileTextIcon,
  FileClockIcon,
  RocketIcon,
  CheckCircle2Icon,
  BarChart3Icon,
  HourglassIcon,
} from "lucide-react";

const CampaignStatsCard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    active: 0,
    completed: 0,
    averageSubmissionRate: 0,
  });

  const token = localStorage.getItem("BRAND_TOKEN");

  useEffect(() => {
    const fetchCampaignStats = async () => {
      try {
        const res = await axios.get(
          `${config.BACKEND_URL}/brand/campaign-request/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(res.data);
      } catch (err) {
        console.error("Error fetching campaign stats:", err);
      }
    };

    fetchCampaignStats();
  }, [token]);

  const cardStyle =
    "bg-[#2c2c2c] hover:bg-[#333] transition rounded-xl px-4 py-5 flex items-center gap-4 shadow-md border border-[#3a3a3a]";

  const statText = "text-sm text-gray-400";

  return (
    <div className="bg-[#1f1f1f] border border-[#2c2c2c] rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
          📦 Campaign Overview
        </h2>
        <button
          onClick={() => navigate("/brand/create-campaign")}
          className="text-sm bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white transition"
        >
          View All Campaigns
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={cardStyle}>
          <FileTextIcon className="w-8 h-8 text-white" />
          <div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className={statText}>Total Campaigns</p>
          </div>
        </div>

        <div className={cardStyle}>
          <FileClockIcon className="w-8 h-8 text-yellow-400" />
          <div>
            <p className="text-2xl font-semibold text-yellow-400">{stats.draft}</p>
            <p className={statText}>Draft </p>
          </div>
        </div>

        <div className={cardStyle}>
          <HourglassIcon className="w-8 h-8 text-orange-400" />
          <div>
            <p className="text-2xl font-semibold text-orange-400">{stats.pending}</p>
            <p className={statText}>Pending</p>
          </div>
        </div>

        <div className={cardStyle}>
          <RocketIcon className="w-8 h-8 text-green-400" />
          <div>
            <p className="text-2xl font-semibold text-green-400">{stats.active}</p>
            <p className={statText}>Active</p>
          </div>
        </div>

        <div className={cardStyle}>
          <CheckCircle2Icon className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-2xl font-semibold text-blue-400">{stats.completed}</p>
            <p className={statText}>Completed</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-[#2c2c2c]">
        <div className="flex items-center text-white gap-2 text-sm sm:text-base">
          <BarChart3Icon className="w-5 h-5 text-indigo-400" />
          <span className="font-medium">
            Average Submission Rate:{" "}
            <span className="text-indigo-400">{stats.averageSubmissionRate}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaignStatsCard;
