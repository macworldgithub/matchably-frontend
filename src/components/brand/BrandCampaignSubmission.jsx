import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { AiOutlineArrowLeft } from "react-icons/ai";

const PLATFORMS = [
  { key: "instagram_urls", label: "Instagram", colorClass: "text-purple-400" },
  { key: "tiktok_urls", label: "TikTok", colorClass: "text-pink-400" },
];

const BrandCampaignSubmission = () => {
  const { campaignId, email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const applicants = location.state?.applicants || [];
  const currentIndex = applicants.findIndex((e) => e === decodeURIComponent(email));

  const [user, setUser] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [contentStatus, setContentStatus] = useState({});
  const [saving, setSaving] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("BRAND_TOKEN");
  const [trackingInfo, setTrackingInfo] = useState({
  courier: '',
  tracking_number: '',
});


  useEffect(() => {
    const fetchData = async () => {
      setUser(null);
      setSubmission(null);
      setContentStatus({});
      setTrackingId("");
      setLoading(true);

      try {
        const token = localStorage.getItem("BRAND_TOKEN");
        if (!token) throw new Error("Brand token missing");

        // 1. Fetch User
        const userRes = await axios.get(
          `${config.BACKEND_URL}/brand/users/${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${token}` }
}
        );
        if (userRes.data.status === "success") {
          setUser(userRes.data.user);
        }

        // 2. Fetch Submission
        const submissionRes = await axios.get(
          `${config.BACKEND_URL}/brand/submission/${campaignId}/${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (submissionRes.data.status === "success") {
  const data = submissionRes.data.data;
  setSubmission(data);
  setContentStatus({ content_status: data.content_status || "Pending" });
  setTrackingInfo({
  courier: data.tracking_info?.courier || '',
  tracking_number: data.tracking_info?.tracking_number || '',
});

}

      } catch (err) {
        console.error("Fetch Error:", err);
        alert("Something went wrong while fetching submission details.");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId && email) {
      fetchData();
    }
  }, [campaignId, email]);

  const goBack = () => navigate(-1);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevEmail = applicants[currentIndex - 1];
      navigate(`/brand/campaign-submission/${campaignId}/${encodeURIComponent(prevEmail)}`, {
        state: { applicants },
      });
    }
  };

  const goToNext = () => {
    if (currentIndex < applicants.length - 1) {
      const nextEmail = applicants[currentIndex + 1];
      navigate(`/brand/campaign-submission/${campaignId}/${encodeURIComponent(nextEmail)}`, {
        state: { applicants },
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!token) throw new Error("Brand token missing");

      const payload = {
        campaignId,
        email,
        contentStatus: { content_status: contentStatus.content_status },
      };

      const res = await axios.post(
        `${config.BACKEND_URL}/brand/submission/update-status`,
        payload,
        { headers: { Authorization:  `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        alert(" Status updated successfully!");
      } else {
        alert(res.data.message || "❌ Failed to update status");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong while saving status.");
    } finally {
      setSaving(false);
    }
  };

const handleTrackingSave = async () => {
  try {
    if (!token) throw new Error("Brand token missing");

    const res = await axios.post(
      `${config.BACKEND_URL}/brand/submission/update-tracking`,
      {
        campaignId,
        email,
        courier: trackingInfo.courier,
        tracking_number: trackingInfo.tracking_number,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.status === "success") {
      alert(" Tracking info saved successfully!");

      // 🧠 Update both states
      setSubmission((prev) => ({
        ...prev,
        tracking_info: res.data.data,
      }));

      setTrackingInfo({
        courier: res.data.data.courier || '',
        tracking_number: res.data.data.tracking_number || '',
      });
    } else {
      alert(res.data.message || "❌ Failed to save tracking info");
    }
  } catch (err) {
    console.error("Tracking Save Error:", err);
    alert("Something went wrong while saving tracking info.");
  }
};


  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center mb-6 space-x-3">
        {/* <button
          onClick={goBack}
          className="inline-flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
        >
          <AiOutlineArrowLeft size={18} />
          <span className="ml-1">Back</span>
        </button> */}
        <h1 className="text-2xl font-bold">Campaign Submission Details</h1>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-400">Loading submission…</p>
      ) : (
        <>
          {/* Tracking Section */}
          <div className="mb-8 bg-[#1a1a1a] border border-gray-700 rounded-xl p-5 shadow-md">
  <h2 className="text-lg font-semibold text-white mb-4">📦 Track Shipment</h2>
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
    <select
      value={trackingInfo.courier}
      onChange={(e) =>
        setTrackingInfo({ ...trackingInfo, courier: e.target.value })
      }
      className="bg-gray-900 border border-gray-600 px-4 py-2 rounded-lg text-white w-full sm:w-1/3"
    >
      <option value="">Select Courier</option>
      <option value="UPS">UPS</option>
      <option value="FedEx">FedEx</option>
      <option value="USPS">USPS</option>
      <option value="Other">Other</option>
    </select>

    <input
      type="text"
      value={trackingInfo.tracking_number}
      onChange={(e) =>
        setTrackingInfo({ ...trackingInfo, tracking_number: e.target.value })
      }
      placeholder="Enter tracking number"
      maxLength={50}
      className="bg-gray-900 border border-gray-600 px-4 py-2 rounded-lg text-white w-full sm:w-1/3"
    />

    <div className="flex gap-2">
      <button
        onClick={handleTrackingSave}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
      >
        Save
      </button>
      {submission?.tracking_info?.tracking_number && (
  <div className="mt-4 text-sm text-green-400">
    <p>
      Last Saved:{" "}
      <span className="text-white font-semibold">
        {submission.tracking_info.tracking_number}
      </span>{" "}
      ({submission.tracking_info.courier})
    </p>
    <a
      href={submission.tracking_info.tracking_link}
      target="_blank"
      rel="noreferrer"
      className="text-blue-400 underline"
    >
      Track Here ↗
    </a>
  </div>
)}

    </div>
  </div>
  <p className="text-sm text-gray-400 mt-2">
    Save the courier and tracking number. A tracking email will be sent to the creator automatically.
  </p>
          </div>


          {/* User Info */}
          {user && (
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-5 mb-6 shadow">
              <h2 className="text-xl font-bold mb-4 text-white">User Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                <div><strong className="text-white">Name:</strong> {user.name}</div>
                <div><strong className="text-white">Email:</strong> {user.email}</div>
                <div><strong className="text-white">Points:</strong> {user.points}</div>
                <div>
                  <strong className="text-white">Instagram ID:</strong>{" "}
                  {user.instagramId ? (
                    <a
                      href={`https://instagram.com/${user.instagramId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      @{user.instagramId}
                    </a>
                  ) : "N/A"}
                </div>
                <div>
                  <strong className="text-white">TikTok ID:</strong>{" "}
                  {user.tiktokId ? (
                    <a
                      href={`https://tiktok.com/@${user.tiktokId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      @{user.tiktokId}
                    </a>
                  ) : "N/A"}
                </div>
              </div>

              {applicants.length > 0 && (
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

          {/* Submission Info */}
          {submission ? (
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
                    <td className="p-3 text-green-300">{submission.allow_brand_reuse ? "Yes" : "No"}</td>
                  </tr>

                  <tr>
                    <td className="w-40 p-3 font-semibold text-yellow-400">Content Status</td>
                    <td className="p-3">
                      <select
                        value={contentStatus.content_status}
                        onChange={(e) => setContentStatus({ content_status: e.target.value })}
                        className="bg-gray-900 border border-gray-600 px-3 py-2 rounded-lg text-white"
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Approved"> Approved</option>
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
          ) : (
            <p className="text-gray-400">No submission found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default BrandCampaignSubmission;
