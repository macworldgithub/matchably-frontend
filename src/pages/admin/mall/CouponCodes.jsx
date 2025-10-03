/** @format */

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Filter, Edit, Trash2, Copy, Calendar } from 'lucide-react';

const CouponCodes = () => {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample data - in production this would come from localStorage and API
  useEffect(() => {
    const sampleCoupons = [
      {
        id: 1,
        code: 'WELCOME20',
        description: 'Welcome discount for new customers',
        type: 'percentage',
        value: 20,
        minimumOrder: 50,
        usageLimit: 100,
        usedCount: 23,
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        affiliateSpecific: false,
        applicableProducts: 'all'
      },
      {
        id: 2,
        code: 'JANE10',
        description: 'Jane\'s affiliate discount',
        type: 'percentage',
        value: 10,
        minimumOrder: 25,
        usageLimit: 50,
        usedCount: 15,
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        affiliateSpecific: true,
        affiliateId: 'jane_creator',
        applicableProducts: 'beauty'
      },
      {
        id: 3,
        code: 'FLASH25',
        description: 'Flash sale discount',
        type: 'percentage',
        value: 25,
        minimumOrder: 100,
        usageLimit: 200,
        usedCount: 189,
        status: 'expired',
        startDate: '2024-01-10',
        endDate: '2024-01-15',
        affiliateSpecific: false,
        applicableProducts: 'electronics'
      }
    ];

    // Load from localStorage if available
    const savedCoupons = localStorage.getItem('mall_coupons');
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    } else {
      setCoupons(sampleCoupons);
      localStorage.setItem('mall_coupons', JSON.stringify(sampleCoupons));
    }
  }, []);

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const updateCouponStatus = (couponId, newStatus) => {
    const updatedCoupons = coupons.map(coupon =>
      coupon.id === couponId ? { ...coupon, status: newStatus } : coupon
    );
    setCoupons(updatedCoupons);
    localStorage.setItem('mall_coupons', JSON.stringify(updatedCoupons));
  };

  const deleteCoupon = (couponId) => {
    const updatedCoupons = coupons.filter(coupon => coupon.id !== couponId);
    setCoupons(updatedCoupons);
    localStorage.setItem('mall_coupons', JSON.stringify(updatedCoupons));
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // In a real app, you'd show a toast notification here
  };

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCoupon = {
      id: Date.now(),
      code: formData.get('code') || generateRandomCode(),
      description: formData.get('description'),
      type: formData.get('type'),
      value: parseFloat(formData.get('value')),
      minimumOrder: parseFloat(formData.get('minimumOrder')) || 0,
      usageLimit: parseInt(formData.get('usageLimit')) || 0,
      usedCount: 0,
      status: 'active',
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      affiliateSpecific: formData.get('affiliateSpecific') === 'on',
      affiliateId: formData.get('affiliateId') || null,
      applicableProducts: formData.get('applicableProducts')
    };

    const updatedCoupons = [...coupons, newCoupon];
    setCoupons(updatedCoupons);
    localStorage.setItem('mall_coupons', JSON.stringify(updatedCoupons));
    setShowAddModal(false);
  };

  // Calculate stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const expiredCoupons = coupons.filter(c => c.status === 'expired').length;

  return (
    <div className="p-6 bg-[#141414] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Tag className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold">Coupon Codes</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Create Coupon
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Coupons</h3>
            <p className="text-2xl font-bold text-white">{totalCoupons}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Active Coupons</h3>
            <p className="text-2xl font-bold text-green-400">{activeCoupons}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Usage</h3>
            <p className="text-2xl font-bold text-blue-400">{totalUsage}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Expired</h3>
            <p className="text-2xl font-bold text-red-400">{expiredCoupons}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-gray-800">
                  <th className="text-left p-4 font-semibold text-gray-300">Code</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Description</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Discount</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Min Order</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Usage</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Valid Until</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-400">{coupon.code}</span>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <Copy size={14} className="text-gray-400" />
                        </button>
                        {coupon.affiliateSpecific && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                            Affiliate
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{coupon.description}</td>
                    <td className="p-4 text-gray-300">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                    </td>
                    <td className="p-4 text-gray-300">${coupon.minimumOrder}</td>
                    <td className="p-4 text-gray-300">
                      {coupon.usedCount}/{coupon.usageLimit || '∞'}
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-500" />
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={coupon.status}
                        onChange={(e) => updateCouponStatus(coupon.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none ${getStatusColor(coupon.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Edit size={16} className="text-gray-400" />
                        </button>
                        <button 
                          onClick={() => deleteCoupon(coupon.id)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Tag size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No coupons found matching your criteria</p>
          </div>
        )}

        {/* Add Coupon Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Coupon Code</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Leave empty to auto-generate"
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    required
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Type</label>
                    <select
                      name="type"
                      required
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Value</label>
                    <input
                      type="number"
                      name="value"
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Minimum Order</label>
                    <input
                      type="number"
                      name="minimumOrder"
                      min="0"
                      step="0.01"
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Usage Limit</label>
                    <input
                      type="number"
                      name="usageLimit"
                      min="0"
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Applicable Products</label>
                  <select
                    name="applicableProducts"
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value="all">All Products</option>
                    <option value="beauty">Beauty</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="affiliateSpecific"
                    className="rounded"
                  />
                  <label className="text-sm text-gray-400">Affiliate-specific coupon</label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponCodes;
