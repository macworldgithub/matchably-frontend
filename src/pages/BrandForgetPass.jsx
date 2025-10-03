/** @format */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

const BrandForgetPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/api/brand/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        setMessage(data.message);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md bg-[#1f1f1f] rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Forgot Password
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Enter your work email to receive a temporary password.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Work Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="brand@example.com"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Send Temporary Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <Link to="/brand-auth" className="text-indigo-400 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandForgetPass;
