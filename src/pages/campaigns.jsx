import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import config from "../config";
import useAuthStore from "../state/atoms";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Lock } from "lucide-react";

const CampaignList = ({ type }) => {
  const [showLimitPopupIndex, setShowLimitPopupIndex] = useState(null);
  const [appliedThisMonth, setAppliedThisMonth] = useState(0);
  const [page, setPage] = useState(1);
  const [campaigns, setCampaigns] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [moreTriggerLoading, setMoreTriggerLoading] = useState(false);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState([]);
  const [paidAccess, setPaidAccess] = useState(null);
  const [paidReason, setPaidReason] = useState("");
  const [accessRequestStatus, setAccessRequestStatus] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [canAccessRequestPaid, setAccessRequestPaid] = useState(false);

  const { isLogin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const getCampaigns = useCallback(
    async (pageNum = 1) => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const isLogin = useAuthStore.getState().isLogin;
        const user = isLogin ? useAuthStore.getState().User : null;

        const campaignType = location.pathname.includes("gifted")
          ? "gifted"
          : "paid";
        const res = await axios.get(
          `${config.BACKEND_URL}/user/campaigns/?type=${campaignType}&page=${pageNum}`,
          {
            headers: { authorization: token },
          }
        );
        if (res.data.status === "success") {
          const mappedCampaigns = res.data.campaigns.map((campaign) => ({
            ...campaign,
            campaignTitle: campaign.name || campaign.campaignTitle,
            brandName: campaign.brand || campaign.brandName,
            productImages: campaign.image ? [campaign.image] : [],
            brandLogo: campaign.image,
            contentFormat: campaign.category || [],
            campaignType: campaign.campaignType || campaign.type || "gifted",
          }));
          if (mappedCampaigns.length === 0) {
            setLoadMore(false);
          } else {
            setCampaigns((prev) => [...prev, ...mappedCampaigns]);
            setPage((prev) => prev + 1);
          }
        } else if (res.data.message === "No campaigns found") {
          setLoadMore(false);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    },
    [location.pathname]
  );

  useEffect(() => {
    setLoading(true);
    setCampaigns([]);
    setPage(1);
    setLoadMore(true);
    getCampaigns(1).then(() => {
      setLoading(false);
    });
  }, [getCampaigns]);

  useEffect(() => {
    if (isLogin) {
      fetchAppliedCampaigns();
    }
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) {
      checkPaidAccess();
    }
  }, [type, isLogin]);

  useEffect(() => {
    if (isLogin) {
      checkAccessRequestStatus();
    }
  }, [isLogin, canAccessRequestPaid]);

  const checkAccessRequestStatus = useCallback(async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.get(`${config.BACKEND_URL}/api/car/status`, {
        headers: { authorization: token },
      });
      if (res.data.status === "success") {
        // Set based on whether they can request access (content approved)
        setAccessRequestStatus(res.data.data.canRequestAccess);
      }
    } catch (err) {
      setAccessRequestStatus(false);
      console.error("Error checking access request status:", err);
    }
  }, []);

  async function fetchAppliedCampaigns() {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.get(
        `${config.BACKEND_URL}/user/campaigns/appliedCampaigns`,
        {
          headers: { authorization: token },
        }
      );
      if (res.data.status === "success") {
        const ids = res.data.campaigns.map((c) => String(c.id));
        setAppliedCampaignIds(ids);
        setAppliedThisMonth(res.data.appliedThisMonth || ids.length);
        // Check if user applied to Matchably Review Campaign (regardless of content approval)
        const reviewCampaign = res.data.campaigns.find(
          (c) =>
            c.id === "682f58586fda45dba090da7c" &&
            ["Approved"].includes(c.applicationStatus)
        );

        if (reviewCampaign) {
          setAccessRequestPaid(true);
        }
      }
    } catch (err) {
      console.error("Error fetching applied campaigns:", err);
    }
  }

  const handleLoadMore = () => {
    setMoreTriggerLoading(true);
    getCampaigns(page).then(() => {
      setMoreTriggerLoading(false);
    });
  };

  async function checkPaidAccess() {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.get(
        `${config.BACKEND_URL}/user/campaigns/access-paid-campaigns`,
        {
          headers: { authorization: token },
        }
      );
      if (res.data.access) {
        setPaidAccess(true);
      } else {
        setPaidAccess(false);
        setPaidReason(res.data.reason || "");
      }
    } catch (err) {
      setPaidAccess(false);
      setPaidReason("Unable to verify access. Please try again later.");
    }
  }

  const requestAccessToPaidCampaigns = useCallback(async () => {
    setRequestingAccess(true);
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.post(
        `${config.BACKEND_URL}/car`,
        {},
        {
          headers: { authorization: token },
        }
      );
      if (res.data.status === "success") {
        toast.success(
          "Access request submitted successfully! We'll review your application."
        );
        await checkAccessRequestStatus();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to submit access request";
      toast.error(errorMessage);
    } finally {
      setRequestingAccess(false);
    }
  }, [checkAccessRequestStatus]);

  const filteredCampaigns = campaigns.filter((c) => {
    if (!type) return true;
    if (c.campaignType) return c.campaignType === type;
    if (type === "gifted")
      return c.influencersReceive?.toLowerCase().includes("gifted");
    if (type === "paid")
      return c.influencersReceive?.toLowerCase().includes("paid");

    return true;
  });

  const now = new Date();

  const displayedCampaigns = filteredCampaigns.filter((c) => {
    const hasApplied = appliedCampaignIds.includes(String(c.id));
    const recruitmentEnd = new Date(c.recruitmentEndDate);
    const isRecruitmentExpired = recruitmentEnd < now;
    const status = c.campaignStatus ?? c.status;
    const finalStatus =
      status === "Deactive" || isRecruitmentExpired ? "Deactive" : "Active";
    if (c.campaignType === "paid" && paidAccess == false) {
      return false;
    }
    if (!isLogin) return true;
    if (finalStatus === "Deactive" && !hasApplied) return false;

    return true;
  });

  if (type === "paid" && isLogin && canAccessRequestPaid == false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] py-12 px-4">
        <div className="bg-[#1e1e1e] p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-[#333]">
          <h2 className="text-3xl font-extrabold text-white mb-6">
            🔒 Paid Campaigns Locked
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            To unlock Paid Campaigns:
          </p>
          <div className="text-left text-gray-200 text-sm mb-6 space-y-2">
            <div>
              ✅ <strong>Step 1:</strong> Complete the{" "}
              <span className="text-blue-400 font-medium">
                Matchably Review Challenge
              </span>
            </div>
            <div>
              ✅ <strong>Step 2:</strong> Get your content{" "}
              <span className="text-blue-400 font-medium">Approved</span>
            </div>
            <div className="py-3">
              Once you're approved, Paid Campaigns will be available to you.
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            👉 Ready to unlock access?
          </p>
          <Link
            to="/campaign/682f58586fda45dba090da7c"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Start the Review Challenge →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <Helmet>
        <title>Explore Campaigns | Matchably</title>
        <meta
          name="description"
          content="Browse and explore the latest campaigns to apply and grow your influence with exciting opportunities."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Campaigns, Explore, Apply Campaigns, Influencer Jobs, Matchably"
        />
        <meta property="og:title" content="Explore Campaigns | Matchably" />
        <meta
          property="og:description"
          content="Discover trending campaigns to participate in and boost your brand presence."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center items-center flex-col">
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6 FontNoto">
          Campaigns
        </h2>

        {isLogin && canAccessRequestPaid == true && paidAccess == false && (
          <div className="w-full max-w-xs mb-6">
            <button
              onClick={requestAccessToPaidCampaigns}
              disabled={requestingAccess || !accessRequestStatus}
              className={`w-full py-3 px-0 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                accessRequestStatus
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {requestingAccess ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="none"
                      d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4m15 0h4m-3.78-7.78l-2.83 2.83M7.05 16.95l-2.83 2.83"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Submitting...
                </>
              ) : accessRequestStatus ? (
                <>💰 Request Access to Paid Campaigns</>
              ) : (
                <>⏳ Waiting for Content Approval</>
              )}
            </button>
          </div>
        )}

        <div className="flex justify-center md:justify-around gap-8 flex-wrap w-[90%]">
          {displayedCampaigns.map((data, index) => {
            const hasApplied = appliedCampaignIds.includes(String(data.id));
            return (
              <div
                key={index}
                className="bg-[#262626eb] p-5 w-[320px] rounded-2xl px-[20px] shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-full flex justify-center mb-4">
                  <img
                    src={
                      data.image?.trim()
                        ? data.image
                        : "https://media.istockphoto.com/id/2086856987/photo/golden-shiny-vintage-picture-frame-isolated-on-white.webp"
                    }
                    alt="Campaign Logo"
                    className="w-[120px] h-[120px] rounded-full object-cover bg-white"
                  />
                </div>
                <h3 className="text-[#d2d2d2] font-bold text-[14px] mb-1">
                  Brand: {data.brand?.replace(/^#/, "") || "Unknown"}
                </h3>
                {data?.product && (
                  <h4 className="text-[#d2d2d2] font-bold text-[12px] mb-1">
                    Product: {data.product}
                  </h4>
                )}
                <h3 className="text-[#d2d2d2] font-bold text-[14px] mb-1">
                  Campaign: {data.name || "Unnamed"}
                </h3>

                <p className="text-[#d2d2d2] text-sm mb-1">
                  Platforms: {data.category?.join(", ") || "N/A"}
                </p>
                <p className="text-[#d2d2d2] text-sm mb-1">
                  Apply by: {data.deadline?.split("T")[0] || "N/A"}
                </p>
                <span
                  className={`text-xs font-bold inline-block px-3 py-1 rounded-full mb-3 ${
                    data.campaignStatus === "Closed"
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {data.campaignStatus || "Recruiting"}
                </span>

                {isLogin ? (
                  <>
                    {data.isBlocked == false ? (
                      <>
                        {hasApplied ? (
                          <button
                            className="w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
                            disabled
                          >
                            Applied
                          </button>
                        ) : data.campaignStatus === "Closed" ? (
                          <button
                            className="w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
                            disabled
                          >
                            Closed
                          </button>
                        ) : appliedThisMonth >= 5 &&
                          data?.id !== "682f58586fda45dba090da7c" ? (
                          <div className="relative w-full">
                            <button
                              className="w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
                              onMouseEnter={() => setShowLimitPopupIndex(index)}
                              onMouseLeave={() => setShowLimitPopupIndex(null)}
                            >
                              Limit Reached
                            </button>
                            {showLimitPopupIndex === index && (
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black text-white text-sm rounded px-3 py-2 shadow-xl z-50 w-[240px] text-center">
                                You've reached your monthly apply limit (5
                                campaigns).
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            className="w-full border-[1px] cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition-all FontNoto"
                            onClick={() => navigate(`/campaign/${data.id}`)}
                          >
                            Apply Now
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
                          disabled
                        >
                          Apply Not Allowed
                        </button>
                        <p className="text-red-500 text-xs mt-2">
                          You are blocked from applying to this campaign.
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <button
                    className="w-full border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition-all font-semibold shadow-sm hover:shadow-md FontNoto"
                    onClick={() => navigate("/signin")}
                  >
                    Sign In to Apply
                  </button>
                )}
              </div>
            );
          })}

          {loading &&
            [...Array(6)].map((_, i) => <CampaignCardSkeleton key={i} />)}
        </div>

        {!isLogin && (
          <p className="flex items-center justify-center text-sm text-gray-400 mt-4 text-center">
            <Lock size={14} className="mr-2" />
            Sign up to see all available campaigns.
          </p>
        )}

        {isLogin && loadMore && (
          <button
            onClick={handleLoadMore}
            disabled={moreTriggerLoading}
            className="bg-black cursor-pointer p-2 px-4 mt-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 FontNoto text-white"
          >
            {moreTriggerLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mx-auto"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4m15 0h4m-3.78-7.78l-2.83 2.83M7.05 16.95l-2.83 2.83"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              "Load More"
            )}
          </button>
        )}

        {!loadMore && isLogin && (
          <p className="text-gray-400 text-center w-full mt-4 FontNoto">
            No more campaigns available.
          </p>
        )}
      </div>
    </div>
  );
};

const CampaignCardSkeleton = () => (
  <div className="bg-gradient-to-r from-[#272727] via-[#101010] to-[#262626] p-6 rounded-lg shadow-lg w-[300px] animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/3 mt-6"></div>
  </div>
);

export default CampaignList;
