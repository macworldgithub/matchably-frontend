/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const RewardsPage = () => {
  const tiers = [
    { count: 1, reward: "$10", note: "$10 instantly" },
    { count: 3, reward: "$25", note: "+$15 bonus" },
    { count: 5, reward: "$55", note: "+$30 bonus" },
    { count: 10, reward: "$110", note: "+$55 bonus" },
    { count: "11+", reward: "+$5 per approval", note: "e.g., 15 = $135" },
  ];

  const faqs = [
    [
      "How do I get my rewards?",
      "Once you reach a milestone (3+ approved posts), you can manually request your Amazon e-Gift Card payout. It will be delivered to your registered email within 48 hours of your request.",
    ],
    [
      "What qualifies as an approved post?",
      "Only posts that are explicitly marked as Approved by the brand count.",
    ],
    [
      "Can I receive rewards multiple times?",
      "Yes! Rewards are cumulative — you will get a new gift card each time you reach a new milestone.",
    ],
    [
      "Can I invite multiple friends?",
      "Absolutely! You'll earn +1 reward credit for every friend who gets at least one post approved. The more you invite, the faster you earn!",
    ],
  ];

  return (
    <div className="bg-black text-white">
      {/* SEO */}
      <Helmet>
        <title>Matchably Rewards</title>
        <meta
          name="description"
          content="Earn Amazon e-Gift Cards just by getting your content approved. Invite friends and unlock bigger rewards with Matchably!"
        />
        <meta property="og:title" content="Matchably Creator Rewards" />
        <meta
          property="og:description"
          content="Turn approved posts into Amazon gift cards. Invite friends and boost your rewards!"
        />
      </Helmet>

      {/* Hero */}
      <section className="text-center py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Rewards
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Earn Amazon e-Gift Cards just by getting your content approved. The
            more approved posts you have, the bigger your reward grows.
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_#00ffcc]"
          >
            Start creating content and get rewarded!
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "1",
                title: "Apply & Submit",
                desc: "Join campaigns and upload real content.",
              },
              {
                icon: "2",
                title: "Get Approved",
                desc: "Each approved post counts toward your cumulative reward tier.",
              },
              {
                icon: "3",
                title: "Request Rewards",
                desc: "Request your Amazon e-Gift Card payout when you reach reward milestones.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-8 bg-[#111] rounded-xl border border-gray-700 hover:border-blue-400 shadow-lg hover:shadow-blue-500/30 text-center transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto font-bold">
                  {s.icon}
                </div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="py-24 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            Creator Reward Tiers
          </h2>
          <div className="text-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
              <div className="p-4 bg-[#111] rounded-lg border border-gray-700">
                <h3 className="font-semibold text-green-400 mb-2">
                  Approved Posts
                </h3>
              </div>
              <div className="p-4 bg-[#111] rounded-lg border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-2">
                  Additional Reward
                </h3>
              </div>
              <div className="p-4 bg-[#111] rounded-lg border border-gray-700">
                <h3 className="font-semibold text-yellow-400 mb-2">
                  Total Reward
                </h3>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#111] rounded-xl border border-gray-700 shadow-md hover:border-blue-400 hover:shadow-blue-500/30 transition-all duration-300"
              >
                <div className="text-center">
                  <span className="text-lg font-bold text-green-400">
                    {tier.count}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-semibold text-blue-400">
                    {tier.note}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-yellow-400">
                    {tier.reward}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-[#111] rounded-xl border border-green-700">
            <p className="text-center text-green-400 font-semibold">
              Only content approved by the brand is eligible for rewards.
            </p>
          </div>
        </div>
      </section>

      {/* Reward Details */}
      <section className="py-24 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Reward Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#111] rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">
                Approval Rule
              </h3>
              <p className="text-gray-300">
                Only posts marked as Approved by the brand in the campaign
                dashboard count toward rewards.
              </p>
            </div>
            <div className="p-6 bg-[#111] rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                Payout Method
              </h3>
              <p className="text-gray-300">
                Request your Amazon e-Gift Card payout manually when you reach
                reward milestones. Payouts are processed within 48 hours.
              </p>
            </div>
            <div className="p-6 bg-[#111] rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                Beyond 10 Posts
              </h3>
              <p className="text-gray-300">
                After your 10th approved post, you'll earn $5 per additional
                approval.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Example: 15 approved posts = $110 + (5 × $5) = $135
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Rewards */}
      <section className="py-24 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Invite Friends, Earn More</h2>
          <p className="text-gray-400 mb-10">
            Invite your friends and get extra reward credit when they succeed!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
            <div className="p-6 bg-[#111] rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                You (Inviter)
              </h3>
              <p className="text-gray-300 mb-2">
                Your friend gets just 1 post approved
              </p>
              <p className="text-blue-400 font-semibold">
                You earn +1 extra approval count
              </p>
            </div>
            <div className="p-6 bg-[#111] rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                Friend (Invitee)
              </h3>
              <p className="text-gray-300 mb-2">Gets 1 content approved</p>
              <p className="text-blue-400 font-semibold">
                Their count increases by 1 too
              </p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-green-400 font-semibold mb-2">
              No limit on how many friends you can invite
            </p>
            <p className="text-green-400 font-semibold">
              More invited creators = faster reward unlocking
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] rounded-xl border border-blue-700 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
              Example
            </h3>
            <p className="text-gray-300 mb-2">
              Let's say you invite 4 friends (B, C, D, and E), and each of them
              gets at least 1 post approved.
            </p>
            <p className="text-green-400 font-semibold mb-1">
              You earn +4 extra approval credits
            </p>
            <p className="text-yellow-400 font-semibold">
              With 6 total credits, you automatically reach the $60 milestone
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map(([q, a], i) => (
              <div
                key={i}
                className="p-6 bg-[#111] rounded-xl border border-gray-700 shadow-md hover:shadow-blue-500/30 hover:border-blue-400 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  {q}
                </h3>
                <p className="text-sm text-gray-300">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-gray-800 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start earning?
          </h2>
          <Link
            to="/campaigns"
            className="inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_35px_#00ffff]"
          >
            Start creating content and get rewarded!
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            The more you post, the more you earn.
          </p>
        </div>
      </section>
    </div>
  );
};

export default RewardsPage;
