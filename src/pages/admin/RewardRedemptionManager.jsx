// ✅ Reward Redemption Manager (Full UI + Logic)

import React, { useEffect, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const RewardRedemptionManager = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [approvalPayouts, setApprovalPayouts] = useState([]);
  const [activeTab, setActiveTab] = useState("legacy-redemptions");
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState({});
  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  // Fetch legacy redemptions
  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${config.BACKEND_URL}/admin/referrel/rewards/redemptions`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setRedemptions(data.redemptions || []);
      } else {
        toast.error(data.message || "Failed to load redemptions");
      }
    } catch {
      toast.error("Error fetching redemptions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch new approval-based payouts
  const fetchApprovalPayouts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${config.BACKEND_URL}/admin/rewards/payouts`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setApprovalPayouts(data.payouts || []);
      } else {
        toast.error(data.message || "Failed to load approval payouts");
      }
    } catch {
      toast.error("Error fetching approval payouts");
    } finally {
      setLoading(false);
    }
  };

  // Mark as complete
  const markComplete = async (id, note = "") => {
    console.log("🔥 Button clicked for:", id, "with note:", note);
    try {
      const res = await fetch(
        `${config.BACKEND_URL}/admin/referrel/rewards/redemptions/${id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminNote: note }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Marked as complete");
        fetchRedemptions();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to mark as complete");
    }
  };

  // Update approval payout status
  const updatePayoutStatus = async (id, status, failureReason = "") => {
    try {
      const res = await fetch(
        `${config.BACKEND_URL}/admin/rewards/payouts/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, failureReason }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Payout status updated to ${status}`);
        fetchApprovalPayouts();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to update payout status");
    }
  };

  useEffect(() => {
    if (activeTab === "legacy-redemptions") {
      fetchRedemptions();
    } else if (activeTab === "approval-payouts") {
      fetchApprovalPayouts();
    }
  }, [activeTab]);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reward Redemption Manager</h2>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-900 rounded-lg p-1">
        <button
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === "legacy-redemptions"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("legacy-redemptions")}
        >
          Legacy Redemptions
        </button>
        <button
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === "approval-payouts"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("approval-payouts")}
        >
          Approval-Based Payouts
        </button>
      </div>

      {/* Legacy Redemptions Tab */}
      {activeTab === "legacy-redemptions" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Legacy Point-Based Redemptions
          </h3>
          {redemptions.length === 0 ? (
            <p className="text-gray-400">No legacy redemptions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-700">
                <thead className="bg-gray-800">
                  <tr className="text-left">
                    <th className="p-2">User</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Reward</th>
                    <th className="p-2">Points Used</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Admin Note</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r, i) => (
                    <tr key={r.id} className="border-t border-gray-700">
                      <td className="p-2">{r.user}</td>
                      <td className="p-2">{r.email}</td>
                      <td className="p-2">{r.reward}</td>
                      <td className="p-2">{r.pointsUsed}</td>
                      <td className="p-2 capitalize">{r.status}</td>
                      <td className="p-2">
                        {r.status === "Pending" ? (
                          <input
                            type="text"
                            placeholder="Add note"
                            value={noteMap[r.id] || ""}
                            onChange={(e) =>
                              setNoteMap((prev) => ({
                                ...prev,
                                [r.id]: e.target.value,
                              }))
                            }
                            className="text-black text-xs p-1 rounded w-full"
                          />
                        ) : (
                          <span className="text-gray-400">
                            {r.adminNote || "-"}
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        {r.status?.toLowerCase() === "pending" ? (
                          <button
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                            onClick={() =>
                              markComplete(r.id, noteMap[r.id] || "")
                            }
                          >
                            Mark Complete
                          </button>
                        ) : (
                          <span className="text-green-400 font-semibold">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Approval-Based Payouts Tab */}
      {activeTab === "approval-payouts" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            New Approval-Based Reward Payouts
          </h3>
          {approvalPayouts.length === 0 ? (
            <p className="text-gray-400">No approval-based payouts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-700">
                <thead className="bg-gray-800">
                  <tr className="text-left">
                    <th className="p-2">User</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Approved Count</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Payment Method</th>
                    <th className="p-2">Requested</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalPayouts.map((p) => (
                    <tr key={p.id} className="border-t border-gray-700">
                      <td className="p-2">{p.user}</td>
                      <td className="p-2">{p.email}</td>
                      <td className="p-2">{p.totalApprovedCount}</td>
                      <td className="p-2">${p.amount}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            p.status === "completed"
                              ? "bg-green-600"
                              : p.status === "processing"
                              ? "bg-yellow-600"
                              : p.status === "failed"
                              ? "bg-red-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-2">{p.paymentMethod}</td>
                      <td className="p-2">
                        {new Date(p.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {p.status === "pending" && (
                          <div className="flex gap-1">
                            <button
                              className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                              onClick={() =>
                                updatePayoutStatus(p.id, "completed")
                              }
                            >
                              Complete
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                              onClick={() =>
                                updatePayoutStatus(
                                  p.id,
                                  "failed",
                                  "Admin marked as failed"
                                )
                              }
                            >
                              Failed
                            </button>
                          </div>
                        )}
                        {p.status === "processing" && (
                          <button
                            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                            onClick={() =>
                              updatePayoutStatus(p.id, "completed")
                            }
                          >
                            Complete
                          </button>
                        )}
                        {(p.status === "completed" ||
                          p.status === "failed") && (
                          <span className="text-gray-400 text-xs">
                            {p.status === "completed" ? "Paid" : "Failed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RewardRedemptionManager;
