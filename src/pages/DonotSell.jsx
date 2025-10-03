/** @format */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const DonotSell = () => {
  const email = 'info@matchably.kr';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    alert('📧 Email copied to clipboard!');
  };

  return (
    <div className='bg-black text-white min-h-screen px-4 py-16'>
      {/* SEO */}
      <Helmet>
        <title>Do Not Sell My Info – Matchably</title>
        <meta name='description' content='Request to opt out of the sale or sharing of your personal information as per U.S. privacy laws like CCPA.' />
      </Helmet>

      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl md:text-5xl font-bold text-center mb-10'>
          Do Not Sell My Personal Information
        </h1>

        <p className='text-gray-300 mb-6 text-center'>
          Effective Date: May 14, 2025
        </p>

        <p className='text-gray-400 mb-6'>
          As described in our <Link to='/privacy-policy' className='text-blue-400 underline'>Privacy Policy</Link>, we collect personal information from your interactions with us and our website — including through cookies and similar technologies.
        </p>

        <p className='text-gray-400 mb-6'>
          We may share this personal information with third parties such as advertising partners or brand clients to show you relevant content or fulfill campaign operations. Depending on your state, this may be considered “selling” or “sharing” under U.S. privacy laws.
        </p>

        <hr className='border-gray-700 my-10' />

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>🚫 How to Opt Out</h2>
        <p className='text-gray-400 mb-2'>U.S. residents may request that we do not sell or share their personal information by emailing us at:</p>

        <div className='flex items-center gap-3 mb-4'>
          <code className='bg-gray-800 px-3 py-1 rounded text-sm'>{email}</code>
          <button onClick={copyEmail} className='px-3 py-1 bg-blue-500 text-black rounded hover:bg-blue-400 text-sm'>
            Copy Email
          </button>
        </div>

        <p className='text-gray-400 mb-6'>
          📬 Subject Line: <code className='bg-gray-800 px-2 py-1 rounded'>CCPA/US State Privacy Opt-Out Request</code>
        </p>

        <p className='text-gray-400 mb-6'>
          Include your full name and the email linked to your Matchably account. We’ll process your request within 15 business days.
        </p>

        <hr className='border-gray-700 my-10' />

        <h2 className='text-2xl font-semibold mb-4 text-green-400'>🌐 Global Privacy Control (GPC)</h2>
        <p className='text-gray-400 mb-6'>
          If you visit our site using a browser that sends a Global Privacy Control (GPC) signal, we’ll treat it as a valid opt-out request for that device.
        </p>

        {typeof navigator !== 'undefined' && navigator.globalPrivacyControl && (
          <p className='text-green-400 mb-6'>
            ✅ GPC signal detected on this browser.
          </p>
        )}

        <hr className='border-gray-700 my-10' />

        <h2 className='text-xl font-semibold mb-4 text-green-400'>❓ FAQs</h2>
        <ul className='space-y-4 text-gray-400'>
          <li>
            <strong>Who can submit a request?</strong><br />
            Only residents of states with consumer data privacy laws (e.g., CA, CO, VA).
          </li>
          <li>
            <strong>Will my request be confirmed?</strong><br />
            Yes, we’ll send confirmation within 15 business days after verifying your identity.
          </li>
        </ul>

        <div className='mt-10 text-center'>
          <Link to='/privacy-policy' className='text-blue-400 hover:underline text-sm'>
            ← Back to Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonotSell;
