/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../../../config';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

export default function BrandsList() {
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending' | 'approved' | 'all'
  const [brands, setBrands] = useState([]);
  const [loading, setLoading]  = useState(true);
  const token = Cookies.get('AdminToken');

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/admin/brands`,
        {
          params: { status: statusFilter },
          headers: { authorization: token }
        }
      );

      if (res.data.status === 'success') {
        setBrands(res.data.brands || []);
      } else {
        throw new Error(res.data.message || 'Failed to fetch brands');
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      toast.error('Error loading brands.', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      await axios.patch(
        `${config.BACKEND_URL}/admin/brands/${id}/${endpoint}`,
        {},
        { headers: { authorization: token } }
      );
      toast.success(`Brand ${endpoint}d.`, { theme: 'dark' });
      // remove just-acted-on brand from list
      setBrands((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(`Error on ${action}:`, err);
      toast.error(`Failed to ${action} brand.`, { theme: 'dark' });
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [statusFilter]);

  return (
    <div className="p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]">
      <Helmet>
        <title>{statusFilter === 'pending' ? 'Pending' : statusFilter === 'approved' ? 'Approved' : 'All'} Brands</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['pending','approved','all'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded ${
              statusFilter === s ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">
        {statusFilter === 'pending'
          ? 'Pending Brand Applications'
          : statusFilter === 'approved'
          ? 'Approved Brands'
          : 'All Brands'}
      </h2>

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading brands...</div>
      ) : brands.length === 0 ? (
        <div className="text-gray-400 text-center py-10">
          {statusFilter === 'pending'
            ? 'No pending applications.'
            : statusFilter === 'approved'
            ? 'No approved brands.'
            : 'No brands found.'}
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#202020] rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Applied On</th>
                <th className="px-4 py-2 text-left">Status</th>
                {statusFilter === 'pending' && (
                  <th className="px-4 py-2 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-700">
                  <td className="px-4 py-2">{brand.companyName}</td>
                  <td className="px-4 py-2">{brand.email}</td>
                  <td className="px-4 py-2">
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        brand.isVerified
                          ? 'bg-green-600'
                          : 'bg-yellow-600'
                      }`}
                    >
                      {brand.isVerified ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  {statusFilter === 'pending' && (
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleAction(brand._id, 'approve')}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(brand._id, 'reject')}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
