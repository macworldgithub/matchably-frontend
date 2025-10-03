/** @format */

import React from 'react';
import { Link } from 'react-router-dom';

const Influencer = () => {
  const stats = [
    {
      campaign: '1',
      repost: '✅ Yes',
      growth: '+1,200',
    },
    {
      campaign: '2',
      repost: '❌ No',
      growth: '+150',
    },
    {
      campaign: '3',
      repost: '✅ Yes',
      growth: '+2,300',
    },
    {
      campaign: '4',
      repost: '✅ Yes',
      growth: '+3,800',
    },
  ];

  const perks = [
    '🎁 Up to $100+ in product value per campaign',
    '💳 Monthly Amazon gift cards for top creators',
    '🔓 Priority access to upcoming paid campaigns',
    '🧰 Build your portfolio with high-quality brand content',
    '🔁 Repeat collaborations with your favorite brands',
  ];

  return (
    <div className='bg-black text-white'>
      {/* Hero Section */}
      <section className='py-20 px-4 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold mb-6'>
          Grow Your Influence. One Free Product at a Time.
        </h1>
        <Link
          to='/campaigns'
          className='relative group inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_#00ffcc] hover:from-green-300 hover:to-blue-300'
        >
            <span className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-green-400 to-blue-400 z-[-1]'></span>
          Apply to a Campaign
        </Link>
        <p className='mt-6 text-sm text-gray-300'>
          🎁 Last month’s top creators received over $300 in product value and gained 5,000+ followers.
        </p>
      </section>

      {/* Why Creators Love Matchably */}
      <section className='py-20 px-4 max-w-5xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-8'>Why Creators Love Matchably</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full border-collapse'>
            <thead>
              <tr className='border-b border-gray-700'>
                <th className='py-4 text-left'>Feature</th>
                <th className='py-4 text-center'>Matchably</th>
                <th className='py-4 text-center'>Traditional Platforms</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Free full-size products',
                'No sign-up or platform fees',
                'Reposts from 100K+ brand accounts',
                'Campaign-ready in 24 hours',
                'Real growth, real engagement',
              ].map((feature, i) => (
                <tr key={i} className='border-b border-gray-800'>
                  <td className='py-4'>{feature}</td>
                  <td className='py-4 text-center text-green-400'>✅</td>
                  <td className='py-4 text-center text-red-500'>❌</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 px-4 bg-black'>
        <h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto'>
          {[
            {
              title: 'Apply in Seconds',
              desc: 'Browse available campaigns and apply with just one click.',
            },
            {
              title: 'Receive Free Products',
              desc: 'Receive full-size items — totally free, no strings attached.',
            },
            {
              title: 'Create Content',
              desc: 'Post your honest review on TikTok or Instagram.',
            },
            {
              title: 'Get Noticed',
              desc: 'Top content gets reposted by brands.Many creators see real follower growth from a single campaign.',
            },
          ].map((card, i) => (
            <div
              key={i}
              className='p-6 bg-black border border-gray-700 rounded-xl text-center shadow-lg transition-all hover:border-blue-400 hover:shadow-blue-500/40'
            >
              <h3 className='text-xl font-bold text-green-400 mb-2'>{card.title}</h3>
              <p className='text-gray-300 text-base'>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real Results */}
      <section className='py-20 px-4 max-w-4xl mx-auto text-center'>
        <h2 className='text-4xl font-bold mb-8'>📈 Real Growth. Real Impact.</h2>
        <p className='text-base text-gray-300 mb-6'>
        Over the past 3 months, creators on Matchably have seen real audience growth.
        </p>
        <div className='overflow-x-auto'>
          <table className='min-w-full border-collapse border border-gray-700'>
            <thead>
              <tr className='border-b border-gray-700'>
                <th className='py-3'>Campaigns</th>
                <th className='py-3'>Reposted by Brand</th>
                <th className='py-3'>Avg Follower Growth</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row, i) => (
                <tr key={i} className='border-b border-gray-800'>
                  <td className='py-3'>{row.campaign}</td>
                  <td className='py-3'>{row.repost}</td>
                  <td className='py-3 text-green-400'>{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Creator Testimonials */}
      <section className='py-20 px-4 bg-black'>
        <h2 className='text-3xl font-bold text-center mb-12'>Creator Testimonials</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
          {[
            { quote: '“I had under 1K followers when I joined. After a brand repost, my content exploded.”', name: '— Jasmine L., California' },
            { quote: '“Matchably made it super easy. No pitching, just real brands who cared about my content.”', name: '— Marcus K., Florida' },
            { quote: '“I’ve been featured twice — and both times, I saw real growth in followers and DMs.”', name: '— Sophie T., Texas' },
            { quote: '“We don’t even have to buy products anymore. We get them free, post content, and that’s it.”', name: '— Alex R., New York' },
          ].map((t, i) => (
            <div
              key={i}
              className='bg-black border border-gray-700 rounded-xl p-6 shadow-md hover:border-blue-400 transition-all'
            >
              <p className='italic text-gray-300 mb-2'>{t.quote}</p>
              <p className='text-sm text-gray-500'>{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks & Rewards */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
  <h2 className="text-4xl font-extrabold text-white mb-12 tracking-wide">
    ✨ Perks & Rewards
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {perks.map((perk, i) => {
      const [icon, ...textParts] = perk.split(' ');

      return (
        <div
          key={i}
          className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-gray-700 rounded-2xl p-6 text-left shadow-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(96,165,250,0.4)] group"
        >
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3 transition-transform duration-300 group-hover:scale-125">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-[#DDDDDD]">
              {textParts.join(' ')}
            </h3>
          </div>
          <p className="text-[#DDDDDD] text-base leading-relaxed">
            {/* Optional: Add more sentence details here if needed */}
          </p>
        </div>
      );
    })}
  </div>
</section>



      {/* Final CTA */}
      <section className='py-20 px-4 text-center bg-gradient-to-r from-black to-[#050014]'>
        <h2 className='text-4xl font-bold mb-6'>Ready to Create. Grow. Get Rewarded?</h2>
        <Link
          to='/campaigns'
          className='relative group inline-block px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_#00ffcc] hover:from-green-300 hover:to-blue-300'
        >
            <span className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-green-400 to-blue-400 z-[-1]'></span>
          Apply to a Campaign
        </Link>
        <p className='mt-4 text-sm text-gray-400'>📩 info@matchably.kr</p>
      </section>
    </div>
  );
};

export default Influencer;
