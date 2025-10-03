import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../config";

const PLATFORMS = [
  { key: "instagram_urls", label: "Instagram", colorClass: "text-purple-400" },
  { key: "tiktok_urls", label: "TikTok", colorClass: "text-pink-400" },
];

const CampaignSubmission = () => {
  const { campaignId, email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [submission, setSubmission] = useState(null);
  const [user, setUser] = useState(null);
  const [contentStatus, setContentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [applicants, setApplicants] = useState([]);

  const currentIndex = applicants.findIndex((e) => e === decodeURIComponent(email));

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevEmail = applicants[currentIndex - 1];
      navigate(`/admin/campaign-submission/${campaignId}/${encodeURIComponent(prevEmail)}`, {
        state: { applicants },
      });
    }
  };

  const goToNext = () => {
    if (currentIndex < applicants.length - 1) {
      const nextEmail = applicants[currentIndex + 1];
      navigate(`/admin/campaign-submission/${campaignId}/${encodeURIComponent(nextEmail)}`, {
        state: { applicants },
      });
    }
  };

  useEffect(() => {
    const fetchApplicantsIfNeeded = async () => {
    
        try {
          const token = Cookies.get("AdminToken");
          const res = await axios.get(`${config.BACKEND_URL}/admin/campaigns/campaign-applicants/${campaignId}`, {
            headers: { Authorization: token },
          });

          if (res.data.status === "success") {
            const fetchedApplicants = res.data.data.map(u => u.email);
            console.log(fetchedApplicants)
            setApplicants(fetchedApplicants);
          }
        } catch (err) {
          console.error("Error fetching applicants list:", err);
        }
   
    };

    fetchApplicantsIfNeeded();
  }, [campaignId, location ]);

  useEffect(() => {
    if (!campaignId || !email) return;

    const fetchData = async () => {
      setSubmission(null);
      setUser(null);
      setLoading(true);
      setError("");

      try {
        const token = Cookies.get("AdminToken");
        if (!token) throw new Error("Admin token missing");

        // Fetch user
        const userRes = await axios.get(
          `${config.BACKEND_URL}/admin/users/${encodeURIComponent(email)}`,
          { headers: { Authorization: token } }
        );

        if (userRes.data.status === "success") {
          setUser(userRes.data.user);
        }

        // Fetch submission
        try {
          const submissionRes = await axios.get(
            `${config.BACKEND_URL}/user/admin/submission/${campaignId}/${encodeURIComponent(email)}`,
            { headers: { Authorization: token } }
          );

          if (submissionRes.data.status === "success") {
            const submissionData = submissionRes.data.data;
            setSubmission(submissionData);
            setContentStatus({
              content_status: submissionData.content_status || "Pending",
            });
          }

        } catch (subErr) {
          console.warn("Submission fetch failed:", subErr);
        }

      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, email]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = Cookies.get("AdminToken");
      if (!token) throw new Error("Admin token missing");

      const status = contentStatus?.content_status;
      if (!status) {
        alert("Please select a content status.");
        setSaving(false);
        return;
      }

      const payload = {
        campaignId,
        email,
        contentStatus: { content_status: status },
      };

      const res = await axios.post(
        `${config.BACKEND_URL}/user/admin/submission/update-status`,
        payload,
        { headers: { Authorization: token } }
      );

      if (res.data.status === "success") {
        alert("Status updated successfully!");
      } else {
        alert(res.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error while saving content status:", err);
      alert("Something went wrong while saving status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center mb-6 space-x-3">
        <h1 className="text-2xl font-bold">Campaign Submission Details</h1>
      </div>

      {user && (
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-5 mb-6 shadow">
          <h2 className="text-xl font-bold mb-4 text-white">User Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
            <div>
              <strong className="text-white">Name:</strong> {user.name}
            </div>
            <div>
              <strong className="text-white">Email:</strong> {user.email}
            </div>
            <div>
              <strong className="text-white">Points:</strong> {user.points || 'NA'}
            </div>
            <div>
              <strong className="text-white">Instagram ID:</strong>{" "}
              {user.instagramId ? (
                <a
                  href={`https://instagram.com/${user.instagramId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  @{user.instagramId}
                </a>
              ) : (
                "N/A"
              )}
            </div>
            <div>
              <strong className="text-white">TikTok ID:</strong>{" "}
              {user.tiktokId ? (
                <a
                  href={`https://tiktok.com/@${user.tiktokId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  @{user.tiktokId}
                </a>
              ) : (
                "N/A"
              )}
            </div>
          </div>

          {applicants.length > 0 && currentIndex !== -1 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goToPrevious}
                disabled={currentIndex <= 0}
                className={`px-4 py-2 rounded-lg ${currentIndex <= 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                ← Previous
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex >= applicants.length - 1}
                className={`px-4 py-2 rounded-lg ${currentIndex >= applicants.length - 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading submission…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : !submission ? (
        <p className="text-gray-400">No submission found.</p>
      ) : (
        <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 space-y-6">
          <table className="w-full table-auto text-left text-white border border-gray-700 rounded-xl overflow-hidden">
            <tbody className="divide-y divide-gray-700">
              {PLATFORMS.map(({ key, label }) => {
                const urls = submission[key] || [];
                return (
                  <tr key={key} className="align-top">
                    <td className="w-40 p-3 font-semibold">{label}</td>
                    <td className="p-3 space-y-2">
                      {urls.length > 0 ? (
                        urls.map((url, i) => (
                          <div
                            key={i}
                            className="bg-gray-800 text-blue-400 p-2 rounded-md border border-gray-700 break-all"
                          >
                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {url}
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="italic text-gray-500">No URLs submitted</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td className="w-40 p-3 font-semibold text-green-400">Brand Reuse</td>
                <td className="p-3 text-green-300">
                  {submission.allow_brand_reuse ? "Yes" : "No"}
                </td>
              </tr>

              <tr>
                <td className="w-40 p-3 font-semibold text-yellow-400">Content Status</td>
                <td className="p-3">
                  <select
                    value={contentStatus?.content_status || "Pending"}
                    onChange={(e) =>
                      setContentStatus((prev) => ({ ...prev, content_status: e.target.value }))
                    }
                    className="bg-gray-900 border border-gray-600 px-3 py-2 rounded-lg text-white"
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Approved">✅ Approved</option>
                    <option value="Rejected">❌ Rejected</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="w-40 p-3 font-semibold text-cyan-300">Submitted At</td>
                <td className="p-3">
                  {new Date(submission.submitted_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pt-6 text-right">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
            >
              {saving ? "Saving..." : "Save & Update Status"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSubmission;
