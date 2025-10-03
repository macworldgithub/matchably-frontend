/** @format */

import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <div className='bg-black text-white min-h-screen px-4 py-16'>
      <Helmet>
        <title>Privacy Policy – Matchably</title>
        <meta name='description' content='Learn how Matchably collects, uses, and protects your personal information. We respect your privacy.' />
      </Helmet>

      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl md:text-5xl font-bold text-center mb-10'>Privacy Policy</h1>

        <p className='text-gray-300 mb-6 text-center'>Effective Date: May 14, 2025</p>

        <p className='text-gray-400 mb-6'>
          At Matchably, we respect your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.
        </p>

        <hr className='border-gray-700 my-8' />

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>1. Information We Collect</h2>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Name, email address, country, and social media handles</li>
          <li>Device and usage information (IP address, browser type)</li>
          <li>Campaign participation and performance data</li>
          <li>Communications with Matchably (support, emails, messages)</li>
        </ul>

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>2. How We Use Your Information</h2>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Match creators with campaigns</li>
          <li>Monitor and improve campaign outcomes</li>
          <li>Provide rewards and maintain platform operations</li>
          <li>Send notifications and platform updates</li>
        </ul>

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>3. Sharing of Information</h2>
        <p className='text-gray-400 mb-4'>We do not sell your personal information.</p>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Brands: Only for campaign-related metrics and only if you’ve joined their campaign</li>
          <li>Service providers: Email, hosting, or analytics tools</li>
          <li>Trust and safety partners: Only non-identifiable data in serious violations</li>
        </ul>

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>4. Cookies & Tracking</h2>
        <p className='text-gray-400 mb-6'>
          We use cookies and tracking technologies to enhance platform usability and analytics.
          You can manage cookies through your browser settings. If required by law, we display a cookie banner.
        </p>

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>5. Your Rights</h2>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Access, correct, or delete your personal data</li>
          <li>Opt out of certain uses of your data</li>
          <li>For California residents (CCPA):
            <ul className='list-disc ml-6 mt-2 space-y-1'>
              <li>Request what personal data we collect</li>
              <li>Request deletion of your data</li>
              <li>Submit a "Do Not Sell My Personal Information" request via <a href='mailto:info@matchably.kr' className='text-blue-400 underline'>info@matchably.kr</a></li>
            </ul>
          </li>
        </ul>

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>6. Data Retention</h2>
        <p className='text-gray-400 mb-6'>
          We retain user data for up to 2 years unless otherwise required by law or unless you request deletion earlier.
        </p>

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>7. Children’s Privacy</h2>
        <p className='text-gray-400 mb-6'>
          We do not knowingly collect personal data from children under 13. If we discover such data, we will delete it immediately.
        </p>

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>8. Contact</h2>
        <p className='text-gray-400 mb-6'>
          For privacy-related concerns or requests, contact us at:  
          <br />
          📧 <a href='mailto:info@matchably.kr' className='text-blue-400 underline'>info@matchably.kr</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
