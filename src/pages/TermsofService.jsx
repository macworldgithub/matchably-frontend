/** @format */

import React from 'react';
import { Helmet } from 'react-helmet';

const TermsofService = () => {
  return (
    <div className='bg-black text-white min-h-screen px-4 py-16'>
      <Helmet>
        <title>Terms of Service – Matchably</title>
        <meta name='description' content='Read the Terms of Service for Matchably to understand your rights and responsibilities when using our platform.' />
      </Helmet>

      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl md:text-5xl font-bold text-center mb-10'>Terms of Service</h1>
        <p className='text-gray-300 mb-6 text-center'>Effective Date: May 14, 2025</p>

        <p className='text-gray-400 mb-6'>
          Welcome to Matchably! These Terms of Service (“Terms”) govern your access to and use of our platform. By signing up or participating in campaigns, you agree to these Terms. If you do not agree, please do not use our services.
        </p>

        <hr className='border-gray-700 my-8' />

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>1. Eligibility</h2>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Must be at least 13 years old</li>
          <li>Under 18 requires parental/legal guardian consent</li>
          <li>We do not knowingly collect info from children under 13</li>
        </ul>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>2. Account Responsibility</h2>
        <p className='text-gray-400 mb-6'>
          You are responsible for maintaining your login credentials and activity. Provide accurate and current info. If compromised, notify us at <a href='mailto:info@matchably.kr' className='text-blue-400 underline'>info@matchably.kr</a>.
        </p>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>3. Campaign Participation (Creators)</h2>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Upload content within 7 days unless specified otherwise</li>
          <li>Include required tags and hashtags</li>
          <li>After 10 days of no submission (without reason):</li>
          <ul className='ml-6 list-disc space-y-1'>
            <li>You may be asked to return the product (not required)</li>
            <li>Your reliability score may be affected</li>
            <li>You may be excluded from future campaigns</li>
          </ul>
          <li>Products are not returnable under normal conditions</li>
          <li>Non-compliance data may be shared (anonymized) for trust-building</li>
          <li>Multiple violations can lead to account suspension or termination</li>
        </ul>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>4. Platform Use (Brands)</h2>
        <p className='text-gray-400 mb-6'>
          Brands may use Matchably to launch campaigns, ship products, and collect user-generated content. We do not guarantee specific results but offer tools and metrics to info decisions.
        </p>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>5. Content Ownership & Usage Rights</h2>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Creators retain ownership of their content</li>
          <li>By submitting content, you grant us and brands a non-exclusive, royalty-free license for promotional use</li>
          <li>You may revoke future use by emailing <a href='mailto:info@matchably.kr' className='text-blue-400 underline'>info@matchably.kr</a>. Past uses already published remain unaffected</li>
        </ul>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>6. Prohibited Conduct</h2>
        <ul className='text-gray-400 list-disc pl-6 mb-6 space-y-2'>
          <li>Submitting false or misleading info</li>
          <li>Violating intellectual property rights</li>
          <li>Uploading harmful, offensive, or illegal content</li>
          <li>Breaking laws or platform policies</li>
          <li>Using the platform deceptively</li>
        </ul>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>7. Termination</h2>
        <p className='text-gray-400 mb-6'>
          We may suspend or terminate your account if these Terms are violated. You may cancel at any time by contacting <a href='mailto:info@matchably.kr' className='text-blue-400 underline'>info@matchably.kr</a>.
        </p>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>8. Disclaimer</h2>
        <p className='text-gray-400 mb-6'>
          Matchably is provided “as is” and “as available.” We don’t guarantee uninterrupted service or results.
        </p>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>9. Limitation of Liability</h2>
        <p className='text-gray-400 mb-6'>
          Our liability is limited to USD $100 to the fullest extent allowed by law.
        </p>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>10. Governing Law and Dispute Resolution</h2>
        <p className='text-gray-400 mb-6'>
          These Terms are governed by California law. Disputes will be resolved via binding arbitration in Los Angeles County under AAA rules.
        </p>

        <h2 className='text-2xl font-semibold text-green-400 mb-3'>11. Changes to Terms</h2>
        <p className='text-gray-400 mb-6'>
          We may update these Terms over time. Continued use after changes means you accept them. We’ll notify you via email or in-platform messages for major updates.
        </p>
      </div>
    </div>
  );
};

export default TermsofService;
