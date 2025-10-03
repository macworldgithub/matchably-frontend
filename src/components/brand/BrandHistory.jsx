import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

const BrandHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const token = localStorage.getItem("BRAND_TOKEN");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${config.BACKEND_URL}/brand/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.history || [];
        setHistory(data);
        setFilteredHistory(data);
      } catch (err) {
        console.error("❌ Failed to fetch brand history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchHistory();
  }, [token]);

  useEffect(() => {
    let data = [...history];

    if (filterType !== "all") {
      data = data.filter((item) => item.type === filterType);
    }

    if (search) {
      data = data.filter((item) =>
        item.planName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredHistory(data);
  }, [search, filterType, history]);

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Your Payment History</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Plan Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-[#1c1c1c] text-white border border-[#333] focus:outline-none focus:ring focus:ring-yellow-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded bg-[#1c1c1c] text-white border border-[#333] focus:outline-none focus:ring focus:ring-yellow-500"
        >
          <option value="all">All Types</option>
          <option value="purchase">Purchase</option>
          <option value="upgrade">Upgrade</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading payment history...</p>
      ) : filteredHistory.length === 0 ? (
        <p className="text-gray-400">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#2c2c2c] shadow-lg">
          <table className="min-w-full text-sm bg-[#1a1a1a] text-white">
            <thead className="bg-[#222] text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Plan</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry, index) => (
                <tr
                  key={index}
                  className={`border-t border-[#2c2c2c] hover:bg-[#2c2c2c] transition ${
                    index % 2 === 0 ? "bg-[#1f1f1f]" : "bg-[#181818]"
                  }`}
                >
                  <td className="px-6 py-3">{entry.planName || "N/A"}</td>
                  <td className="px-6 py-3 capitalize">{entry.type}</td>
                  <td className="px-6 py-3 text-green-400">
                    ${entry.amountPaid}
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {new Date(entry.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrandHistory;
