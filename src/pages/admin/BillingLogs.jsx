import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import Cookies from "js-cookie";

const BillingLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${config.BACKEND_URL}/admin/payments`, {
          headers: { Authorization: token },
        });
        setLogs(res.data.history || []);
      } catch (err) {
        console.error("Error fetching billing logs:", err);
        setError("Failed to fetch billing logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading)
    return <div className="text-gray-300 p-6 text-lg">Loading...</div>;
  if (error)
    return <div className="text-red-500 p-6 font-medium">{error}</div>;

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">All Payment History</h1>
      <div className="overflow-x-auto rounded-lg border border-[#2c2c2c]">
        <table className="min-w-full text-sm text-left bg-[#1a1a1a]">
          <thead>
            <tr className="bg-[#222] text-gray-300 uppercase text-xs">
              <th className="px-4 py-3 border-r border-[#2c2c2c]">Brand</th>
              <th className="px-4 py-3 border-r border-[#2c2c2c]">Plan</th>
              <th className="px-4 py-3 border-r border-[#2c2c2c]">Type</th>
              <th className="px-4 py-3 border-r border-[#2c2c2c]">Amount Paid</th>
              <th className="px-4 py-3 border-r border-[#2c2c2c]">Date</th>
              <th className="px-4 py-3">Session ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-6">
                  No payment logs found.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr
                  key={index}
                  className={`border-t border-[#2c2c2c] ${
                    index % 2 === 0 ? "bg-[#1f1f1f]" : "bg-[#181818]"
                  }`}
                >
                  <td className="px-4 py-3 border-r border-[#2c2c2c]">
                    {log.brand?.companyName || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-r border-[#2c2c2c]">
                    {log.plan?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-r border-[#2c2c2c] capitalize">
                    {log.type}
                  </td>
                  <td className="px-4 py-3 border-r border-[#2c2c2c] text-green-400">
                    ${log.amountPaid}
                  </td>
                  <td className="px-4 py-3 border-r border-[#2c2c2c] text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300 break-all">
                    {log.stripeSessionId}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingLogs;
