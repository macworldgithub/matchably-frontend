import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { AiOutlineEye } from "react-icons/ai";
import { Save } from "lucide-react";

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-center items-center bg-gradient-to-l from-[#7d71ff] to-[#5b25ff] hover:bg-blue-800 text-white px-4 py-2 rounded-lg gap-2 FontLato transition shadow-md"
  >
    {children}
  </button>
);

const BrandApplication = () => {
  const { campaignId } = useParams();
  const [applications, setApplications] = useState([]);
  const [editedApplications, setEditedApplications] = useState({});
  const [campaignTitle, setCampaignTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [recruitingLimit, setRecruitingLimit] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  const getApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("BRAND_TOKEN");
      const res = await axios.get(
        `${config.BACKEND_URL}/brand/campaign-apply/${campaignId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "success") {
        const apps = res.data.applications;
        setApplications(apps);

        const edits = {};
        apps.forEach((app) => {
          edits[app.id] = {
            status: app.status,
            rejectionReason: app.rejectionReason || "",
            showReasonToInfluencer: app.showReasonToInfluencer || false,
          };
        });
        setEditedApplications(edits);
        setCampaignTitle(res.data.campaignTitle);
        setRecruitingLimit(res.data.recruitingLimit || 0);
        setApprovedCount(res.data.approvedCount || 0);
      } else {
        console.warn("Campaign not found or invalid ID");
      }
    } catch (err) {
      console.error("❌ Error fetching brand applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setEditedApplications((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveOne = async (id) => {
    const token = localStorage.getItem("BRAND_TOKEN");
    const data = editedApplications[id];
    try {
      const res = await axios.patch(
        `${config.BACKEND_URL}/brand/campaign-apply/${id}/status`,
        {
          status: data.status,
          rejectionReason: data.rejectionReason,
          showReasonToInfluencer: data.showReasonToInfluencer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status === "success") {
        alert(" Applicant updated");
        getApplications();
      }
    } catch (err) {
      console.error("❌ Save error", err);
      alert("❌ Update failed");
    }
  };

  const saveAll = async () => {
    const token = localStorage.getItem("BRAND_TOKEN");
    let updated = 0;

    for (const [id, data] of Object.entries(editedApplications)) {
      try {
        const res = await axios.patch(
          `${config.BACKEND_URL}/brand/campaign-apply/${id}/status`,
          {
            status: data.status,
            rejectionReason: data.rejectionReason,
            showReasonToInfluencer: data.showReasonToInfluencer,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === "success") {
          updated++;
        }
      } catch (err) {
        console.error("❌ Error updating ID", id, err);
      }
    }

    alert(` ${updated} applicants updated`);
    getApplications();
  };

  useEffect(() => {
    if (campaignId?.length === 24) {
      getApplications();
    } else {
      console.warn("⚠️ Invalid campaignId format (should be 24 char ObjectId)");
    }
  }, [campaignId]);

  return (
    <div className="p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]">
      <Helmet>
        <title>Brand Applications</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold FontLato">Applicants</h2>
        <div className="flex gap-2">
          <Button onClick={saveAll}>
            <Save size={16} /> <span>Save All</span>
          </Button>
        </div>
      </div>

      <div className="text-white h-[50px] text-green-400">
        <Link to={`/campaign/${campaignId}`}>{campaignTitle}</Link>
      </div>

      <div className="overflow-x-auto bg-[#202020] rounded-[5px]">
        {applications.length !== 0 || loading ? (
          <table className="min-w-full rounded-lg border-none">
            <thead>
              <tr className="bg-[#3c3c3c] text-left text-sm font-semibold text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Date</th>
                <th className="p-3">Submission</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const edit = editedApplications[app.id];
                return (
                  <tr key={app.id} className="hover:bg-[#2a2a2a] transition">
                    <td className="p-3">{app.name}</td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">{app.phone}</td>
                    <td className="p-3">{app.appliedAt?.split("T")[0]}</td>
                    <td className="p-3">
                      <Link
                        to={`/brand/campaign-submission/${campaignId}/${app.email}`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                      >
                        <AiOutlineEye className="mr-2" /> View
                      </Link>
                    </td>
                    <td className="p-3">
                      <select
                        value={edit?.status}
                        onChange={(e) =>
                          handleFieldChange(app.id, "status", e.target.value)
                        }
                        className={`bg-[#2c2c2c] border px-2 py-1 rounded text-white w-full mb-2 ${
                          edit?.status === "Approved"
                            ? "border-green-500"
                            : edit?.status === "Rejected"
                            ? "border-red-500"
                            : "border-yellow-500"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      {edit?.status === "Rejected" && (
                        <>
                          <textarea
                            placeholder="Rejection reason"
                            value={edit.rejectionReason}
                            onChange={(e) =>
                              handleFieldChange(
                                app.id,
                                "rejectionReason",
                                e.target.value
                              )
                            }
                            className="w-full p-2 bg-[#1e1e1e] border border-gray-600 rounded text-white text-sm mb-2"
                          />
                          <label className="flex items-center gap-2 text-sm text-white mb-2">
                            <input
                              type="checkbox"
                              checked={edit.showReasonToInfluencer}
                              onChange={() =>
                                handleFieldChange(
                                  app.id,
                                  "showReasonToInfluencer",
                                  !edit.showReasonToInfluencer
                                )
                              }
                            />
                            Show reason to influencer
                          </label>
                        </>
                      )}

                      <button
                        onClick={() => handleSaveOne(app.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center h-[80vh] bg-[#414141]">
            <p>No Applicants Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandApplication;
