import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import { ClockIcon, ArrowRightIcon } from "lucide-react";

const CampaignsEndingSoon = () => {
  const [endingSoon, setEndingSoon] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("BRAND_TOKEN");

  useEffect(() => {
    const fetchEndingSoonCampaigns = async () => {
      try {
        const res = await axios.get(
          `${config.BACKEND_URL}/brand/campaign-request/my-requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const today = new Date();
        const filtered = res.data.requests
          .filter((item) => {
            const end = new Date(item.recruitmentEndDate);
            const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
            return (
              diff >= 0 &&
              diff <= 20 &&
              item.approvalStatus === "Approved"
            );
          })
          .map((item) => {
            const end = new Date(item.recruitmentEndDate);
            const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
            return {
              id: item._id,
              title: item.brandName,
              daysLeft: diff,
            };
          });

        setEndingSoon(filtered);
      } catch (err) {
        console.error("Error fetching ending soon campaigns:", err);
      }
    };

    fetchEndingSoonCampaigns();
  }, [token]);

  if (!endingSoon.length) return null;

  return (
    <div className="bg-[#1f1f1f] border border-[#2c2c2c] rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 mb-5">
        <ClockIcon className="w-5 h-5 text-yellow-400" />
        Campaigns Ending Soon
      </h2>

      <ul className="space-y-4">
        {endingSoon.map((item) => (
          <li
            key={item.id}
            className="bg-[#2b2b2b] border border-[#3a3a3a] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[#333] transition"
          >
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-1 text-center sm:text-left">
                Ends in <span className="text-yellow-400 font-bold">D-{item.daysLeft}</span>
              </p>
            </div>

            <button
              onClick={() => navigate(`/brand/brand-applications/${item.id}`)}
              className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition"
            >
              View Campaign
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignsEndingSoon;
