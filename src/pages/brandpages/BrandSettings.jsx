import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import config from "../../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function BrandSettings() {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    productCategory: "",
    introduction: "",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("BRAND_TOKEN");
        const response = await axios.get(
          `${config.BACKEND_URL}/brand/settings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status === "success") {
          const data = response.data.brand;
          setForm({
            companyName: data.companyName || "",
            contactName: data.contactName || "",
            email: data.email || "",
            phone: data.phone || "",
            website: data.website || "",
            productCategory: data.productCategory || "",
            introduction: data.introduction || "",
          });
          if (data.logo) setLogoPreview(data.logo);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (logoFile) formData.append("logo", logoFile);
      if (showPasswordSection) {
        formData.append("newPassword", newPassword);
        formData.append("confirmPassword", confirmPassword);
      }

      const token = localStorage.getItem("BRAND_TOKEN");
      const response = await axios.put(
        `${config.BACKEND_URL}/brand/settings`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setSuccess(true);
        setShowPasswordSection(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white px-6 md:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">
           Brand Settings
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-[#333]"
        >
          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-600/20 border border-green-600 text-green-200 p-3 rounded-lg">
              Settings updated successfully!
            </div>
          )}

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Brand Name</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              type="text"
              placeholder="Enter your brand name"
              className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-semibold mb-2">Contact Person</label>
            <input
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              type="text"
              placeholder="Enter contact person name"
              className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="text"
                placeholder="Enter phone number"
                className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Logo</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 hover:file:bg-indigo-700"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="h-12 w-12 rounded-full object-cover border"
                />
              )}
            </div>
          </div>

          {/* Brand Intro */}
          <div>
            <label className="block text-sm font-semibold mb-2">Brand Introduction</label>
            <textarea
              name="introduction"
              value={form.introduction}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your brand..."
              className="w-full px-4 py-3 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>

          {/* Toggle Change Password */}
          <div>
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium underline"
            >
              {showPasswordSection ? "Hide" : "Change"} Password
            </button>
          </div>

          {/* Change Password Fields */}
          {showPasswordSection && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="relative">
                <label className="block text-sm font-semibold mb-2">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-all w-full md:w-auto"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
