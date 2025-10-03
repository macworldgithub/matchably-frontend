import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import {
  FaCopy,
  FaGift,
  FaLink,
  FaStar,
  FaTrophy,
  FaUsers,
  FaHistory,
  FaAmazon,
  FaCheckCircle,
  FaLock,
  FaQuestionCircle,
  FaClock,
} from "react-icons/fa";
import config from "../../config";

const RewardDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchRewardDashboard();
  }, []);

  const fetchRewardDashboard = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view rewards");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/user/rewards/dashboard`, {
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (data.status === "success") {
        setDashboardData(data.data);
      } else {
        toast.error(data.message || "Failed to load reward dashboard");
      }
    } catch (err) {
      console.error("Error fetching reward dashboard:", err);
      toast.error("Error loading reward dashboard");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (dashboardData?.referralLink) {
      navigator.clipboard.writeText(dashboardData.referralLink);
      toast.success("Referral link copied to clipboard!");
    }
  };

  const requestPayout = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      const res = await fetch(
        `${config.BACKEND_URL}/user/rewards/request-payout`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "amazon-gift-card",
          }),
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to request payout");
      }
    } catch (err) {
      toast.error("Error requesting payout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Failed to load reward dashboard</p>
        </div>
      </div>
    );
  }

  const {
    user,
    currentRewardAmount,
    nextMilestone,
    tiers,
    rewardPayouts,
    referralBonuses,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>My Rewards - Matchably</title>
        <meta
          name="description"
          content="Track your creator rewards and referral bonuses"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">💰 Rewards</h1>
          <p className="text-gray-400 text-lg mb-4">
            Earn Amazon e-Gift Cards just by getting your content approved.
          </p>
          <p className="text-gray-400">
            The more approved posts you have, the bigger your reward grows.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎯 How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Apply & Submit</h3>
              <p className="text-gray-400 text-sm">
                Join campaigns and upload real content.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get Approved</h3>
              <p className="text-gray-400 text-sm">
                Each approved post counts toward your cumulative reward tier.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Receive Rewards</h3>
              <p className="text-gray-400 text-sm">
                Amazon e-Gift Cards are sent automatically as you hit
                milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <FaStar className="text-yellow-400 text-2xl" />
              <h3 className="text-lg font-semibold">Approved Posts</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {user.totalApprovedCount}
            </p>
            <p className="text-sm text-gray-400">
              {user.approvedContent} your posts + {user.referralApprovedCount}{" "}
              referral bonus
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <FaAmazon className="text-green-400 text-2xl" />
              <h3 className="text-lg font-semibold">Total Earned</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              ${currentRewardAmount}
            </p>
            <p className="text-sm text-gray-400">Amazon e-Gift Cards</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <FaTrophy className="text-blue-400 text-2xl" />
              <h3 className="text-lg font-semibold">Next Milestone</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {nextMilestone.needed}
            </p>
            <p className="text-sm text-gray-400">
              more to earn ${nextMilestone.amount}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-purple-400 text-2xl" />
              <h3 className="text-lg font-semibold">Referrals</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {referralBonuses.length}
            </p>
            <p className="text-sm text-gray-400">Friends helped you earn</p>
          </div>
        </div>

        {/* Progress Message */}
        {nextMilestone.needed > 0 && (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 mb-8 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-yellow-400 text-2xl" />
              <div>
                <h3 className="text-lg font-semibold">
                  🎯 Reach {nextMilestone.next} approvals to unlock your next $
                  {nextMilestone.amount - currentRewardAmount} reward!
                </h3>
                <p className="text-gray-400">
                  You need {nextMilestone.needed} more approved post
                  {nextMilestone.needed > 1 ? "s" : ""} to reach this milestone.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {[
            { id: "overview", label: "Reward Tiers", icon: FaTrophy },
            { id: "referrals", label: "Referrals", icon: FaUsers },
            { id: "history", label: "History", icon: FaHistory },
            { id: "faq", label: "FAQ", icon: FaQuestionCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">🏆 Creator Reward Tiers</h2>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">
                    Approved Posts
                  </h4>
                  <p className="text-gray-400 text-sm">Your content count</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">
                    Additional Reward
                  </h4>
                  <p className="text-gray-400 text-sm">Bonus per tier</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Total Reward
                  </h4>
                  <p className="text-gray-400 text-sm">Cumulative amount</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Status</h4>
                  <p className="text-gray-400 text-sm">Your progress</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {tiers.map((tier, index) => {
                const isCompleted = tier.status === "completed";
                const isInProgress = tier.status === "in_progress";
                const isLocked = tier.status === "locked";

                return (
                  <div
                    key={tier.tier}
                    className={`rounded-xl p-6 border transition-all ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50"
                        : isInProgress
                        ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50"
                        : "bg-gray-800/50 border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-3xl ${
                            tier.tier === 1
                              ? "🥉"
                              : tier.tier === 3
                              ? "🥈"
                              : tier.tier === 5
                              ? "🥇"
                              : "💎"
                          }`}
                        >
                          {tier.tier === 1
                            ? "🥉"
                            : tier.tier === 3
                            ? "🥈"
                            : tier.tier === 5
                            ? "🥇"
                            : "💎"}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {tier.required} Approval
                            {tier.required > 1 ? "s" : ""}
                          </h3>
                          <p className="text-gray-400">
                            {tier.tier === 1
                              ? "Instant reward"
                              : `+$${tier.amount} bonus`}{" "}
                            • Total: ${tier.total}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-32 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isCompleted ? "bg-green-400" : "bg-blue-400"
                                }`}
                                style={{
                                  width: `${
                                    (tier.progress / tier.required) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400">
                              {tier.progress}/{tier.required}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <FaCheckCircle />
                            <span className="font-semibold">Completed</span>
                          </div>
                        ) : isInProgress ? (
                          <div className="flex items-center gap-2 text-blue-400">
                            <FaClock />
                            <span className="font-semibold">In Progress</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <FaLock />
                            <span className="font-semibold">Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 11+ Tier */}
              <div className="rounded-xl p-6 border border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🔁</div>
                    <div>
                      <h3 className="text-xl font-bold">11+ Approvals</h3>
                      <p className="text-gray-400">
                        +$5 per additional approval • Ongoing rewards
                      </p>
                      {user.totalApprovedCount > 10 && (
                        <p className="text-purple-400 font-semibold mt-1">
                          You've earned ${(user.totalApprovedCount - 10) * 5} in
                          continuous rewards!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {user.totalApprovedCount > 10 ? (
                      <div className="flex items-center gap-2 text-purple-400">
                        <FaStar />
                        <span className="font-semibold">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <FaLock />
                        <span className="font-semibold">Reach 10 first</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Rewards */}
            {rewardPayouts.some((r) => r.status === "pending") && (
              <div className="bg-yellow-500/20 rounded-xl p-6 border border-yellow-500/30">
                <h3 className="text-lg font-bold text-yellow-400 mb-4">
                  🎁 Pending Rewards
                </h3>
                <div className="space-y-2">
                  {rewardPayouts
                    .filter((r) => r.status === "pending")
                    .map((payout, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>Tier {payout.tier} Milestone</span>
                        <span className="font-bold text-yellow-400">
                          ${payout.amount}
                        </span>
                      </div>
                    ))}
                </div>
                <button
                  onClick={requestPayout}
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-colors"
                >
                  Request Payout via Email
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Amazon e-Gift Cards will be sent to your registered email
                  within 48 hours
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "referrals" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">
              👥 Invite Friends, Earn More
            </h2>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold mb-4">🎯 How Referrals Work</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">
                    You (Inviter)
                  </h4>
                  <p className="text-gray-300">
                    When your friend gets just 1 post approved
                  </p>
                  <p className="text-green-400 font-bold">
                    → You earn +1 extra approval count
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">
                    Friend (Invitee)
                  </h4>
                  <p className="text-gray-300">Gets 1 content approved</p>
                  <p className="text-green-400 font-bold">
                    → Their count increases by 1 too
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">📎 Your Referral Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dashboardData.referralLink}
                  readOnly
                  className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <FaCopy />
                  Copy
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                ✅ No limit on how many friends you can invite • More invited
                creators = faster reward unlocking
              </p>
            </div>

            {referralBonuses.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">
                  🎉 Your Referral Bonuses
                </h3>
                <div className="space-y-3">
                  {referralBonuses.map((bonus, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
                    >
                      <div>
                        <span className="font-semibold">
                          {bonus.relatedUser?.email || "Friend"}
                        </span>
                        <p className="text-sm text-gray-400">
                          Got their first approval
                        </p>
                      </div>
                      <div className="text-green-400 font-bold">
                        +1 approval count
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">
              📜 Approval & Reward History
            </h2>

            {dashboardData.approvalHistory.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.approvalHistory.map((event, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">
                          {event.type === "content-approval"
                            ? "📸 Content Approved"
                            : "👥 Referral Bonus"}
                        </h4>
                        <p className="text-gray-400">
                          {event.campaign?.campaignTitle || "Campaign"} •{" "}
                          {event.campaign?.brandName || "Brand"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-green-400 font-bold">
                        +1 approval count
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FaHistory className="text-4xl mx-auto mb-4 opacity-50" />
                <p>No approval history yet</p>
                <p className="text-sm">
                  Start applying to campaigns to build your history!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">
              ❓ Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                  Q. How fast do I get my rewards?
                </h3>
                <p className="text-gray-300">
                  Once you hit a milestone, your Amazon e-Gift Card will be
                  delivered to your registered email within 48 hours.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                  Q. What qualifies as an approved post?
                </h3>
                <p className="text-gray-300">
                  Only posts that are explicitly marked as Approved by the brand
                  count.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                  Q. Can I receive rewards multiple times?
                </h3>
                <p className="text-gray-300">
                  Yes! Rewards are cumulative — you will get a new gift card
                  each time you reach a new milestone.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                  Q. Can I invite multiple friends?
                </h3>
                <p className="text-gray-300">
                  Absolutely! You'll earn +1 reward credit for every friend who
                  gets at least one post approved. The more you invite, the
                  faster you earn!
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/30 text-center">
              <h3 className="text-xl font-bold mb-3">
                📸 Start creating content and get rewarded!
              </h3>
              <p className="text-gray-300 mb-4">
                ✅ The more you post, the more you earn.
              </p>
              <button
                onClick={() => (window.location.href = "/campaigns")}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                Browse Campaigns
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardDashboard;
