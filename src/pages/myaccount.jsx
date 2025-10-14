import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlay,
  FaEye,
  FaHeart,
} from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import config from "../config";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { Link, useSearchParams } from "react-router-dom";
import ContentAnalysisPanel from "../components/ContentAnalysisPanel";

const MyAccount = ({ user }) => {
  console.log(user, "User");
  const [searchParams] = useSearchParams();
  const [socialLinks, setSocialLinks] = useState({
    instagramId: user.instagramId || "",
    tiktokId: user.tiktokId || "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiktokData, setTiktokData] = useState(null);
  const [loadingTiktok, setLoadingTiktok] = useState(false);

  // ✅ NEW: Creator access request state
  const [accessRequestStatus, setAccessRequestStatus] = useState(null);
  const [requestingAccess, setRequestingAccess] = useState(false);

  // Check for TikTok connection status on component mount
  useEffect(() => {
    const tiktokConnected = searchParams.get("tiktok_connected");
    const tiktokError = searchParams.get("tiktok_error");

    if (tiktokConnected === "success") {
      toast.success("TikTok account connected successfully!", {
        theme: "dark",
      });
      // Refresh page to get updated user data
      window.location.replace("/myaccount");
    }

    if (tiktokError) {
      toast.error(`TikTok connection failed: ${tiktokError}`, {
        theme: "dark",
      });
    }

    // Fetch TikTok data if connected
    if (user.snsConnected && user.sns?.tiktok) {
      setTiktokData(user.sns.tiktok);
    }

    // ✅ NEW: Check creator access request status
    checkAccessRequestStatus();
  }, [searchParams, user]);

  // ✅ NEW: Check creator access request status
  const checkAccessRequestStatus = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(`${config.BACKEND_URL}/car/status`, {
        headers: { authorization: token },
      });
      const data = await res.json();

      if (data.status === "success") {
        setAccessRequestStatus(data.data);
      }
    } catch (err) {
      console.error("Error checking access request status:", err);
    }
  };

  // ✅ NEW: Request access to paid campaigns
  const requestAccessToPaidCampaigns = async () => {
    setRequestingAccess(true);
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(`${config.BACKEND_URL}/car`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.status === "success") {
        toast.success(
          "Access request submitted successfully! We'll review your application.",
          {
            theme: "dark",
          }
        );
        await checkAccessRequestStatus();
      } else {
        toast.error(data.message || "Failed to submit access request", {
          theme: "dark",
        });
      }
    } catch (err) {
      toast.error("Failed to submit access request. Please try again.", {
        theme: "dark",
      });
    } finally {
      setRequestingAccess(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const response = await fetch(
        `${config.BACKEND_URL}/user/campaigns/update-social`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(socialLinks),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Social links updated!", {
          theme: "dark",
        });
        user.instagramId = socialLinks.instagramId;
        user.tiktokId = socialLinks.tiktokId;
      } else {
        toast.error(data.message || "Update failed.", { theme: "dark" });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Something went wrong while saving.");
    }
  };

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const response = await fetch(
        `${config.BACKEND_URL}/user/campaigns/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Password changed successfully!", {
          theme: "dark",
          autoClose: 3000,
          position: "top-right",
        });
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "Failed to change password.", {
          theme: "dark",
          autoClose: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Something went wrong while changing the password.");
    }
  };

  const handleTiktokConnect = async () => {
    try {
      setLoadingTiktok(true);
      const token = Cookies.get("token") || localStorage.getItem("token");
      const response = await fetch(`${config.BACKEND_URL}/social/tiktok/auth`, {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (data.status === "success") {
        // Redirect to TikTok OAuth
        window.location.href = data.authUrl;
      } else {
        toast.error(data.message || "Failed to start TikTok connection", {
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("TikTok connection error:", error);
      toast.error("Failed to connect to TikTok. Please try again.", {
        theme: "dark",
      });
    } finally {
      setLoadingTiktok(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <Helmet>
        <title>My Account</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-[#171717] rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
          <div className="flex items-center space-x-4">
            <FaUser className="text-3xl text-blue-500" />
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - User Info */}
          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-3">
              User Info
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-400" />
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-3 break-all">
                <FaEnvelope className="text-blue-400" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Social Profiles - COMMENTED OUT */}
            {/*
            <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-3">
              Social Profiles
            </h2>
            <div className="space-y-4">
              {/* Instagram */}
            {/*
              <div className="flex items-center gap-3">
                <FaInstagram className="text-pink-500" />
                {user.instagramId ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.instagramId}</span>
                    <FaCheckCircle
                      className="text-green-500"
                      title="Connected"
                    />
                  </div>
                ) : (
                  <></>
                  // <Link
                  //   to="/onboarding?step=2"
                  //   className="px-3 py-3  flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                  // >
                  //   <FaExclamationCircle /> Connect Now
                  // </Link>
                )}
              </div>

              {/* TikTok */}
            {/*
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaTiktok className="text-pink-500 text-xl" />
                    <span className="font-semibold text-white">TikTok</span>
                  </div>
                  {tiktokData ? (
                    <FaCheckCircle
                      className="text-green-500"
                      title="Connected"
                    />
                  ) : (
                    <></>
                    // <button
                    //   onClick={handleTiktokConnect}
                    //   disabled={loadingTiktok}
                    //   className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    // >
                    //   {loadingTiktok ? "Connecting..." : "Connect TikTok"}
                    // </button>
                  )}
                </div>

                {tiktokData && (
                  <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                    {/* Profile Info */}
            {/*
                    <div className="flex items-center gap-3">
                      {tiktokData.profilePicture && (
                        <img
                          src={tiktokData.profilePicture}
                          alt={tiktokData.username}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {tiktokData.username}
                          </h3>
                          {tiktokData.isVerified && (
                            <FaCheckCircle
                              className="text-blue-500 text-sm"
                              title="Verified"
                            />
                          )}
                        </div>
                        {tiktokData.bio && (
                          <p className="text-gray-400 text-sm">
                            {tiktokData.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
            {/*
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-gray-700 rounded p-3">
                        <div className="text-lg font-bold text-white">
                          {tiktokData.followerCount?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-400">Followers</div>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="text-lg font-bold text-white">
                          {tiktokData.likesCount?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-400">Likes</div>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="text-lg font-bold text-white">
                          {tiktokData.videoCount?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-400">Videos</div>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="text-lg font-bold text-white">
                          {tiktokData.followingCount?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-400">Following</div>
                      </div>
                    </div>

                    {/* Recent Videos */}
            {/*
                    {tiktokData.recentVideos &&
                      tiktokData.recentVideos.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Recent Videos
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {tiktokData.recentVideos.map((video) => (
                              <div
                                key={video.id}
                                className="relative bg-gray-700 rounded overflow-hidden aspect-video"
                              >
                                {video.cover_image_url ? (
                                  <img
                                    src={video.cover_image_url}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FaPlay className="text-gray-400" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <FaPlay className="text-white text-lg" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Edit Inputs */}
            {/*
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  name="instagramId"
                  value={socialLinks.instagramId}
                  onChange={handleChange}
                  placeholder="Instagram ID"
                  className="w-full bg-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="tiktokId"
                  value={socialLinks.tiktokId}
                  onChange={handleChange}
                  placeholder="TikTok ID"
                  className="w-full bg-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition"
                >
                  Save Social Profiles
                </button>
              </div>
            </div>
            */}
          </div>

          {/* Right - Security & Access Section */}
          <div className="flex flex-col justify-between">
            {/* ✅ NEW: Creator Access Request Section */}
            {accessRequestStatus && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-blue-400 mb-4">
                  Campaign Access Status
                </h2>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    {accessRequestStatus.accessRequest?.status ===
                    "approved" ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : accessRequestStatus.accessRequest?.status ===
                      "rejected" ? (
                      <FaExclamationCircle className="text-red-500" />
                    ) : accessRequestStatus.accessRequest?.status ===
                      "pending" ? (
                      <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaLock className="text-gray-400" />
                    )}
                    <span className="font-medium">
                      {accessRequestStatus.accessRequest?.status === "approved"
                        ? "Access Granted"
                        : accessRequestStatus.accessRequest?.status ===
                          "rejected"
                        ? "Access Denied"
                        : accessRequestStatus.accessRequest?.status ===
                          "pending"
                        ? "Request Pending"
                        : "No Access Request"}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">
                    {accessRequestStatus.statusMessage}
                  </p>

                  {accessRequestStatus.accessRequest?.status === "rejected" && (
                    <p className="text-red-400 text-sm mb-4">
                      Reason:{" "}
                      {accessRequestStatus.accessRequest.rejectionReason ||
                        "No reason provided"}
                    </p>
                  )}

                  {!accessRequestStatus.accessRequest &&
                    accessRequestStatus.canRequestAccess && (
                      <button
                        onClick={requestAccessToPaidCampaigns}
                        disabled={requestingAccess}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
                      >
                        {requestingAccess
                          ? "Submitting..."
                          : "Request Access to Paid Campaigns"}
                      </button>
                    )}
                </div>
              </div>
            )}

            <div className="mt-8 md:mt-0">
              <h2 className="text-lg font-semibold text-blue-400 mb-4">
                Security
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-md transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Analysis Panel */}
      <div className="max-w-4xl mx-auto mt-8">
        <ContentAnalysisPanel />
      </div>

      {/* Password Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-[#1f1f1f] text-white rounded-xl p-6 shadow-xl">
            <Dialog.Title className="text-xl font-semibold text-blue-400 mb-4">
              Change Password
            </Dialog.Title>
            <div className="space-y-4">
              {["oldPassword", "newPassword", "confirmPassword"].map(
                (field, idx) => (
                  <div className="flex items-center gap-3" key={idx}>
                    <FaLock className="text-blue-400" />
                    <input
                      type="password"
                      placeholder={
                        field === "oldPassword"
                          ? "Old Password"
                          : field === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"
                      }
                      className="flex-1 bg-gray-800 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={passwords[field]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [field]: e.target.value })
                      }
                    />
                  </div>
                )
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Update
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyAccount;
