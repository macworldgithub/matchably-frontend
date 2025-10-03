import React, { useEffect, useState } from "react";
import axios from "axios";
import config from '../../config';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormData = () => ({
  name: "",
  planType: "one-time",
  price: "",
  campaignsAllowed: "",
  creatorsAllowed: "",
  creatorsPerCampaign: "",
  validityMonths: "",
  autoResetMonthly: false,
  targetAudience: "",
  features: "",
  supportLevel: "",
  analyticsLevel: "",
  competitorReport: false,
  bestFor: "",
  isPopular: false,
  isBestValue: false,
});

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [tab, setTab] = useState("one-time");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/brand/package/plans`, {
        headers: { Authorization: token },
      });
      setPlans(res.data.plans || []);
    } catch (err) {
      toast.error("Failed to fetch plans.");
      console.error("Error fetching plans", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        campaignsAllowed: Number(formData.campaignsAllowed),
        creatorsAllowed: Number(formData.creatorsAllowed),
        creatorsPerCampaign: formData.creatorsPerCampaign ? Number(formData.creatorsPerCampaign) : undefined,
        validityMonths: formData.validityMonths ? Number(formData.validityMonths) : undefined,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      };

      const endpoint = editingPlan
        ? `${config.BACKEND_URL}/brand/package/plans/${editingPlan._id}`
        : `${config.BACKEND_URL}/brand/package/plans`;

      const method = editingPlan ? axios.patch : axios.post;

      await method(endpoint, payload, {
        headers: { Authorization: token },
      });

      toast.success(`Plan ${editingPlan ? "updated" : "created"} successfully`);
      setFormData(initialFormData());
      setEditingPlan(null);
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      toast.error("Failed to save plan.");
      console.error("Error saving plan", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    setLoading(true);
    try {
      await axios.delete(`${config.BACKEND_URL}/brand/package/plans/${id}`, {
        headers: { Authorization: token },
      });
      toast.success("Plan deleted.");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete plan.");
      console.error("Error deleting plan", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      ...plan,
      features: (plan.features || []).join(', '),
    });
    setShowModal(true);
  };

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Plan Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setEditingPlan(null);
            setFormData(initialFormData());
            setShowModal(true);
          }}
        >
          + Create Plan
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['one-time', 'subscription'].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-t ${tab === t ? "bg-zinc-900 border-b-2 border-blue-500 text-blue-400" : "bg-zinc-800 text-zinc-300"}`}
            onClick={() => setTab(t)}
          >
            {t === "one-time" ? "One-Time Plans" : "Subscription Plans"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.filter((p) => p.planType === tab).map((plan) => (
          <div
            key={plan._id}
            className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow space-y-2"
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {plan.name}
              {plan.isPopular && <span className="bg-yellow-500 text-black px-2 py-0.5 text-xs rounded">Popular</span>}
              {plan.isBestValue && <span className="bg-green-500 text-white px-2 py-0.5 text-xs rounded">Best Value</span>}
            </h3>
            <p>💰 Price: {plan.price}</p>
            <p>🎯 Target Audience: {plan.targetAudience}</p>
            <p>📦 Campaigns Allowed: {plan.campaignsAllowed}</p>
            <p>👥 Creators Allowed: {plan.creatorsAllowed}</p>
            {plan.creatorsPerCampaign && <p>👤/📦 Creators Per Campaign: {plan.creatorsPerCampaign}</p>}
            {plan.validityMonths && <p>🕒 Validity: {plan.validityMonths} months</p>}
            <p>📞 Support Level: {plan.supportLevel}</p>
            {plan.autoResetMonthly && <p className="text-green-400">🔄 Auto Resets Monthly</p>}
            {plan.competitorReport && <p className="text-green-400">📊 Competitor Report Included</p>}
            <div>
              <h4 className="font-semibold mt-2">Features:</h4>
              <ul className="list-disc list-inside text-sm text-zinc-300">
                {(plan.features || []).map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(plan)}
                className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(plan._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-zinc-900 text-white p-6 rounded-lg w-full max-w-md shadow-lg border border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {[
                { field: "name", label: "Name", type: "text" },
                { field: "planType", label: "Plan Type", type: "select", options: ["one-time", "subscription"] },
                { field: "price", label: "Price", type: "text" },
                { field: "campaignsAllowed", label: "Campaigns Allowed", type: "number" },
                { field: "creatorsAllowed", label: "Creators Allowed", type: "number" },
                { field: "creatorsPerCampaign", label: "Creators Per Campaign", type: "number" },
                { field: "validityMonths", label: "Validity Months", type: "number" },
                { field: "targetAudience", label: "Target Audience", type: "text" },
                { field: "features", label: "Features (comma-separated)", type: "text" },
                { field: "supportLevel", label: "Support Level", type: "text" },
                { field: "analyticsLevel", label: "Analytics Level", type: "text" },
                { field: "bestFor", label: "Best For", type: "text" },
              ].map(({ field, label, type, options }) => (
                <div key={field}>
                  <label className="block text-sm mb-1">{label}</label>
                  {type === "select" ? (
                    <select
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded outline-none"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded outline-none"
                    />
                  )}
                </div>
              ))}

              {/* Checkboxes */}
              {[
                { field: "autoResetMonthly", label: "Auto Reset Monthly" },
                { field: "competitorReport", label: "Competitor Report" },
                { field: "isPopular", label: "Popular" },
                { field: "isBestValue", label: "Best Value" },
              ].map(({ field, label }) => (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field]}
                    onChange={handleChange}
                  />
                  <label>{label}</label>
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border border-zinc-500 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingPlan ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;