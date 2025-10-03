import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import {
  FaCopy,
  FaGift,
  FaUsers,
  FaHistory,
  FaCheckCircle,
  FaLock,
  FaClock,
  FaAmazon,
  FaStar,
  FaCrown,
  FaGem,
} from "react-icons/fa";
import config from "../config";

const ReferralRewards = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchUserStats();
    fetchDashboardData();
  }, []);

  const fetchUserStats = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/user/rewards/stats`, {
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (data.status === "success") {
        setUserStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${config.BACKEND_URL}/user/rewards/dashboard`, {
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (data.status === "success") {
        setDashboardData(data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleRequestPayout = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to request payout");
      return;
    }

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
        fetchUserStats(); // Refresh stats
        fetchDashboardData(); // Refresh dashboard
      } else {
        toast.error(data.message || "Failed to request payout");
      }
    } catch (err) {
      toast.error("Error requesting payout");
    }
  };

  const copyReferralLink = () => {
    const referralLink =
      dashboardData?.referralLink ||
      `https://matchably.kr/signup?ref=${userStats?.userId || "XXXXXX"}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
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

  const totalApprovedCount = userStats?.totalApprovedCount || 0;
  const approvedContent = userStats?.approvedContent || 0;
  const referralApprovedCount = userStats?.referralApprovedCount || 0;
  const lastRewardTier = userStats?.lastRewardTier || 0;
  const totalEarned = userStats?.totalEarned || 0;

  // User is eligible if they have 3+ approvals AND haven't claimed current tier yet
  const isEligible = totalApprovedCount >= 3 && totalEarned > lastRewardTier;

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>My Rewards & Referrals - Matchably</title>
        <meta
          name="description"
          content="Track your creator rewards and referral bonuses"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">💰 Rewards</h1>
          <p className="text-gray-400 text-center mb-8 text-lg">
            Earn Amazon e-Gift Cards just by getting your content approved.
            <br />
            The more approved posts you have, the bigger your reward grows.
          </p>

          {/* 🎯 How It Works */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              🎯 How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Your Approved Posts */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              ⭐ Your Approved Posts
            </h2>
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {totalApprovedCount}
            </div>
            <p className="text-gray-400 mb-2">
              {approvedContent > 0 && referralApprovedCount > 0 ? (
                <>
                  {approvedContent} direct + {referralApprovedCount} referral
                  bonuses
                </>
              ) : (
                "Total Approved Posts"
              )}
            </p>
            {totalApprovedCount < 1 ? (
              <p className="text-yellow-400">
                🎯 Get your first post approved to unlock your $10 reward!
              </p>
            ) : totalApprovedCount < 3 ? (
              <p className="text-yellow-400">
                🎯 Reach {3 - totalApprovedCount} more approvals to unlock your
                next $15 bonus!
              </p>
            ) : totalApprovedCount < 5 ? (
              <p className="text-yellow-400">
                🎯 Reach {5 - totalApprovedCount} more approvals to unlock your
                next $30 bonus!
              </p>
            ) : totalApprovedCount < 10 ? (
              <p className="text-yellow-400">
                🎯 Reach {10 - totalApprovedCount} more approvals to unlock your
                next $55 bonus!
              </p>
            ) : (
              <p className="text-green-400">
                🎉 You're earning $5 for every additional approval!
              </p>
            )}
          </div>

          {/* Creator Reward Tiers */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Creator Reward Tiers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  tier: "🥉 1 Approval",
                  icon: <FaStar className="text-yellow-400" />,
                  condition: "Instant",
                  reward: "$10",
                  total: "$10",
                  status: totalApprovedCount >= 1 ? "✅ Claimed" : "🔒 Locked",
                  progress: Math.min(totalApprovedCount, 1),
                },
                {
                  tier: "🥈 3 Approvals",
                  icon: <FaCrown className="text-gray-300" />,
                  condition: "+$15 bonus",
                  reward: "$25 total",
                  total: "$25",
                  status:
                    totalApprovedCount >= 3
                      ? "✅ Claimed"
                      : totalApprovedCount >= 1
                      ? "⏳ In Progress"
                      : "🔒 Locked",
                  progress: Math.min(totalApprovedCount, 3),
                },
                {
                  tier: "🥇 5 Approvals",
                  icon: <FaCrown className="text-yellow-400" />,
                  condition: "+$30 bonus",
                  reward: "$55 total",
                  total: "$55",
                  status:
                    totalApprovedCount >= 5
                      ? "✅ Claimed"
                      : totalApprovedCount >= 3
                      ? "⏳ In Progress"
                      : "🔒 Locked",
                  progress: Math.min(totalApprovedCount, 5),
                },
                {
                  tier: "💎 10 Approvals",
                  icon: <FaGem className="text-purple-400" />,
                  condition: "+$55 bonus",
                  reward: "$110 total",
                  total: "$110",
                  status:
                    totalApprovedCount >= 10
                      ? "✅ Claimed"
                      : totalApprovedCount >= 5
                      ? "⏳ In Progress"
                      : "🔒 Locked",
                  progress: Math.min(totalApprovedCount, 10),
                },
              ].map((tier, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border relative overflow-hidden ${
                    totalApprovedCount >= [1, 3, 5, 10][i]
                      ? "bg-green-900/20 border-green-500"
                      : totalApprovedCount >= (i > 0 ? [0, 1, 3, 5][i] : 0)
                      ? "bg-yellow-900/20 border-yellow-500"
                      : "bg-gray-900/20 border-gray-700"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{tier.icon}</div>
                    <h3 className="text-lg font-bold mb-1">{tier.tier}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {tier.condition}
                    </p>
                    <div className="font-bold text-xl text-green-400 mb-1">
                      {tier.reward}
                    </div>
                    <div className="text-sm mb-3">{tier.status}</div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          totalApprovedCount >= [1, 3, 5, 10][i]
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                        style={{
                          width: `${(tier.progress / [1, 3, 5, 10][i]) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {tier.progress}/{[1, 3, 5, 10][i]} posts
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 11+ Ongoing */}
            {totalApprovedCount >= 10 && (
              <div className="mt-4 bg-purple-900/20 border border-purple-500 p-4 rounded-xl text-center">
                <h3 className="text-lg font-bold mb-2">🔁 11+ Approvals</h3>
                <p className="text-gray-400 mb-2">+$5 per additional post</p>
                <div className="font-bold text-xl text-purple-400">
                  Current: ${totalEarned}
                  {totalApprovedCount > 10 && (
                    <span className="text-sm text-gray-400">
                      {" "}
                      (${110} base + ${(totalApprovedCount - 10) * 5} bonus)
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-400">
                  ✅ Ongoing rewards active
                </p>
              </div>
            )}

            {/* Rule note */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                ✅ Only content marked as{" "}
                <span className="text-green-400">"Approved"</span> by the brand
                is eligible for rewards.
              </p>
            </div>
          </div>

          {/* Reward Details */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Reward Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📋 Approval Rule:</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Only posts marked as{" "}
                  <span className="text-green-400">Approved</span> by the brand
                  in the campaign dashboard count toward rewards.
                </p>

                <h3 className="font-semibold mb-2">💳 Payout Method:</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Rewards are sent as Amazon e-Gift Cards (weekly)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🚀 Beyond 10 Posts:</h3>
                <p className="text-gray-400 text-sm mb-4">
                  After your 10th approved post, you'll earn $5 per additional
                  approval.
                </p>

                <h3 className="font-semibold mb-2">💡 Example:</h3>
                <p className="text-gray-400 text-sm">
                  15 approved posts = $110 + (5 × $5) ={" "}
                  <span className="text-green-400 font-semibold">$135</span>
                </p>
              </div>
            </div>
          </div>

          {/* Request Payout Button */}
          <div className="text-center mb-8">
            {isEligible ? (
              <>
                <button
                  onClick={handleRequestPayout}
                  className="bg-gradient-to-r from-green-400 to-blue-400 text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
                >
                  <FaAmazon className="inline mr-2" />
                  Request ${totalEarned - lastRewardTier} Amazon e-Gift Card
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  🕐 Rewards are sent within 48 hours
                </p>
              </>
            ) : totalApprovedCount < 3 ? (
              <>
                <button
                  disabled
                  className="bg-gray-600 text-gray-400 px-8 py-3 rounded-xl font-semibold cursor-not-allowed opacity-50"
                >
                  <FaLock className="inline mr-2" />
                  Need {3 - totalApprovedCount} More Approvals
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  Get 3+ approved posts to unlock reward requests
                </p>
              </>
            ) : (
              <>
                <button
                  disabled
                  className="bg-gray-600 text-gray-400 px-8 py-3 rounded-xl font-semibold cursor-not-allowed opacity-50"
                >
                  <FaCheckCircle className="inline mr-2" />
                  All Available Rewards Claimed
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  Get more approved posts to unlock the next tier
                </p>
              </>
            )}
          </div>

          {/* 👥 Invite Friends, Earn More */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              <FaUsers className="inline mr-2" />
              👥 Invite Friends, Earn More
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Invite your friends and get extra reward credit when they succeed!
            </p>

            {/* Referral Benefits Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">You (Inviter)</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Your friend gets just 1 post approved
                </p>
                <p className="text-green-400 font-semibold">
                  You earn +1 extra approval count
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Friend (Invitee)</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Gets 1 content approved
                </p>
                <p className="text-green-400 font-semibold">
                  Their count increases by 1 too
                </p>
              </div>
            </div>

            {/* Referral Stats */}
            {referralApprovedCount > 0 && (
              <div className="text-center mb-4">
                <div className="bg-green-900/20 border border-green-500 rounded-lg p-3 inline-block">
                  <span className="text-green-400 font-semibold">
                    🎉 You've earned +{referralApprovedCount} bonus approval
                    {referralApprovedCount > 1 ? "s" : ""} from referrals!
                  </span>
                </div>
              </div>
            )}

            {/* Your Referral Link */}
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-300">Your referral link:</p>
              <div className="flex items-center justify-center bg-gray-800 rounded-lg p-3 mb-4 max-w-2xl mx-auto">
                <code className="text-green-400 text-sm flex-1 break-all">
                  {dashboardData?.referralLink ||
                    `https://matchably.kr/signup?ref=${
                      userStats?.userId || "XXXXXX"
                    }`}
                </code>
                <button
                  onClick={copyReferralLink}
                  className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex-shrink-0"
                >
                  <FaCopy />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-green-400">
                  ✅ No limit on how many friends you can invite
                </p>
                <p className="text-sm text-green-400">
                  ✅ More invited creators = faster reward unlocking
                </p>
              </div>
            </div>
          </div>

          {/* 🎁 Example */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              🎁 Example
            </h2>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gray-300 mb-4">
                Let's say you invite 4 friends (B, C, D, and E), and each of
                them gets at least 1 post approved.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <p className="text-lg">
                    👉 You earn{" "}
                    <span className="text-purple-400 font-bold">
                      +4 extra approval credits
                    </span>
                  </p>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4">
                  <p className="text-lg">
                    👉 With 6 total credits, you automatically reach the{" "}
                    <span className="text-blue-400 font-bold">
                      $55 milestone
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ❓ Frequently Asked Questions */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Q. How fast do I get my rewards?
                </h3>
                <p className="text-gray-400 text-sm">
                  Once you hit a milestone, your Amazon e-Gift Card will be
                  delivered to your registered email within 48 hours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Q. What qualifies as an approved post?
                </h3>
                <p className="text-gray-400 text-sm">
                  Only posts that are explicitly marked as{" "}
                  <span className="text-green-400">Approved</span> by the brand
                  count.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Q. Can I receive rewards multiple times?
                </h3>
                <p className="text-gray-400 text-sm">
                  Yes! Rewards are cumulative — you will get a new gift card
                  each time you reach a new milestone.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Q. Can I invite multiple friends?
                </h3>
                <p className="text-gray-400 text-sm">
                  Absolutely! You'll earn +1 reward credit for every friend who
                  gets at least one post approved. The more you invite, the
                  faster you earn!
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold mb-4">
              📸 Start creating content and get rewarded!
            </h2>
            <p className="text-xl text-green-400 mb-6">
              ✅ The more you post, the more you earn.
            </p>
            <Link
              to="/campaigns"
              className="bg-gradient-to-r from-green-400 to-blue-400 text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 inline-block"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewards;
