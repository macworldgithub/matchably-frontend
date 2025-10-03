import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Cookie from "js-cookie";
import config from "../../config";

const SubmissionDelays = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch campaigns with delayed submissions
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const token = Cookie.get("AdminToken");
        const { data } = await axios.get(
          `${config.BACKEND_URL}/admin/submission-delays`,
          {
            headers: { authorization: token },
          }
        );
        setCampaigns(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch campaigns");
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Save contact summary edits
  const handleSaveContact = async (updates) => {
    try {
      await axios.put(
        `${config.BACKEND_URL}/admin/influencer/${editingInfluencer.id}/contact-summary`,
        updates,
        {
          headers: { authorization: Cookie.get("AdminToken") },
        }
      );
      setSelectedCampaign((prev) => ({
        ...prev,
        delayedInfluencers: prev.delayedInfluencers.map((i) =>
          i.id === editingInfluencer.id ? { ...i, ...updates } : i
        ),
      }));
      setEditingInfluencer(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save contact summary");
    }
  };

  if (loading)
    return (
      <p className="text-gray-400 text-center mt-10">Loading campaigns...</p>
    );
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 flex flex-col gap-6 text-white bg-[#141414] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Submission Delays</h1>

      {/* Campaign Cards */}
      {campaigns.length === 0 && (
        <p className="text-gray-400 text-center">No campaigns found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-[#1f1f1f] p-4 rounded-lg shadow hover:shadow-md"
          >
            <h2 className="text-lg font-bold mb-1">{c.title}</h2>
            <p className="text-gray-400 mb-1">Type: {c.type}</p>
            <p className="text-gray-400 mb-1">
              Original Deadline: {dayjs(c.deadline).format("MMM D, YYYY")}
            </p>
            <p className="text-gray-400 mb-1">
              Total Participants: {c.totalParticipants}
            </p>
            <p className="text-red-500 mb-2">Delayed: {c.delayed}</p>
            <button
              className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-sm"
              onClick={() => setSelectedCampaign(c)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
          <div className="bg-[#1f1f1f] rounded-lg p-6 w-full max-w-4xl relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setSelectedCampaign(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {selectedCampaign.title} – Delayed Influencers
            </h2>

            <div className="overflow-auto rounded-lg border border-gray-700">
              <table className="w-full text-left text-gray-300">
                <thead className="bg-[#1f1f1f] text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Influencer Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone Number</th>
                    <th className="px-4 py-2">Days Overdue</th>
                    <th className="px-4 py-2">Contact Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCampaign.delayedInfluencers?.map((i) => {
                    const daysSinceLast = dayjs().diff(
                      dayjs(i.last_contact_date),
                      "day"
                    );
                    return (
                      <tr
                        key={i.id}
                        className="border-t border-gray-700 hover:bg-[#2a2a2a]"
                      >
                        <td className="px-4 py-2">{i.name}</td>
                        <td className="px-4 py-2">{i.email}</td>
                        <td className="px-4 py-2">{i.phone}</td>
                        <td className="px-4 py-2">{i.daysOverdue}</td>
                        <td className="px-4 py-2">
                          <button
                            className="text-blue-500 underline text-sm"
                            onClick={() =>
                              setEditingInfluencer({
                                ...i,
                                email_count: i.email_count || 0,
                                sms_count: i.sms_count || 0,
                                dm_count: i.dm_count || 0,
                                daysSinceLast,
                              })
                            }
                          >
                            {`Email ${i.email_count || 0}x / SMS ${
                              i.sms_count || 0
                            }x${
                              i.dm_count ? ` / DM ${i.dm_count}x` : ""
                            } (${daysSinceLast} days ago)`}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Summary Modal */}
      {editingInfluencer && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#1f1f1f] rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setEditingInfluencer(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">
              Edit Contact Summary – {editingInfluencer.name}
            </h3>
            <div className="flex flex-col gap-4">
              <label>
                Email Count
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 rounded bg-[#141414] border border-gray-700"
                  defaultValue={editingInfluencer.email_count}
                  onChange={(e) =>
                    (editingInfluencer.email_count = Number(e.target.value))
                  }
                />
              </label>
              <label>
                SMS Count
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 rounded bg-[#141414] border border-gray-700"
                  defaultValue={editingInfluencer.sms_count}
                  onChange={(e) =>
                    (editingInfluencer.sms_count = Number(e.target.value))
                  }
                />
              </label>
              <label>
                DM Count
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 rounded bg-[#141414] border border-gray-700"
                  defaultValue={editingInfluencer.dm_count}
                  onChange={(e) =>
                    (editingInfluencer.dm_count = Number(e.target.value))
                  }
                />
              </label>
              <label>
                Last Contact Date
                <input
                  type="date"
                  className="w-full p-2 rounded bg-[#141414] border border-gray-700"
                  defaultValue={dayjs(
                    editingInfluencer.last_contact_date
                  ).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    (editingInfluencer.last_contact_date = e.target.value)
                  }
                />
              </label>
              <button
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
                onClick={() => handleSaveContact(editingInfluencer)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionDelays;
