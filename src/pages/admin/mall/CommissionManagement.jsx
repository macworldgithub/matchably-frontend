/** @format */

import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Users, Calendar, Search, Filter, Download } from 'lucide-react';

const CommissionManagement = () => {
  const [commissions, setCommissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample data - in production this would come from localStorage and API
  useEffect(() => {
    const sampleCommissions = [
      {
        id: 1,
        affiliateId: 'jane_creator',
        affiliateName: 'Jane Smith',
        affiliateEmail: 'jane@example.com',
        totalEarned: 18.00,
        pendingAmount: 13.50,
        paidAmount: 4.50,
        salesCount: 2,
        lastPayment: '2024-01-01T00:00:00Z',
        nextPayment: '2024-02-01T00:00:00Z',
        status: 'active',
        paymentMethod: 'PayPal'
      },
      {
        id: 2,
        affiliateId: 'mike_influencer',
        affiliateName: 'Mike Johnson',
        affiliateEmail: 'mike@example.com',
        totalEarned: 25.99,
        pendingAmount: 25.99,
        paidAmount: 0,
        salesCount: 1,
        lastPayment: null,
        nextPayment: '2024-02-01T00:00:00Z',
        status: 'active',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: 3,
        affiliateId: 'alex_creator',
        affiliateName: 'Alex Wilson',
        affiliateEmail: 'alex@example.com',
        totalEarned: 39.99,
        pendingAmount: 0,
        paidAmount: 39.99,
        salesCount: 1,
        lastPayment: '2024-01-15T00:00:00Z',
        nextPayment: '2024-02-01T00:00:00Z',
        status: 'active',
        paymentMethod: 'PayPal'
      }
    ];

    // Load from localStorage if available
    const savedCommissions = localStorage.getItem('mall_commissions');
    if (savedCommissions) {
      setCommissions(JSON.parse(savedCommissions));
    } else {
      setCommissions(sampleCommissions);
      localStorage.setItem('mall_commissions', JSON.stringify(sampleCommissions));
    }
  }, []);

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.affiliateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.affiliateId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const processPayment = (affiliateId) => {
    const updatedCommissions = commissions.map(commission => {
      if (commission.affiliateId === affiliateId) {
        return {
          ...commission,
          paidAmount: commission.paidAmount + commission.pendingAmount,
          pendingAmount: 0,
          lastPayment: new Date().toISOString()
        };
      }
      return commission;
    });
    setCommissions(updatedCommissions);
    localStorage.setItem('mall_commissions', JSON.stringify(updatedCommissions));
  };

  const updateCommissionStatus = (affiliateId, newStatus) => {
    const updatedCommissions = commissions.map(commission =>
      commission.affiliateId === affiliateId ? { ...commission, status: newStatus } : commission
    );
    setCommissions(updatedCommissions);
    localStorage.setItem('mall_commissions', JSON.stringify(updatedCommissions));
  };

  // Calculate stats
  const totalPendingCommissions = commissions.reduce((sum, c) => sum + c.pendingAmount, 0);
  const totalPaidCommissions = commissions.reduce((sum, c) => sum + c.paidAmount, 0);
  const totalEarnings = commissions.reduce((sum, c) => sum + c.totalEarned, 0);
  const activeAffiliates = commissions.filter(c => c.status === 'active').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      case 'pending_approval': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-6 bg-[#141414] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <DollarSign className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold">Commission Management</h1>
          </div>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Pending Commissions</h3>
            <p className="text-2xl font-bold text-yellow-400">${totalPendingCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Paid Commissions</h3>
            <p className="text-2xl font-bold text-green-400">${totalPaidCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Earnings</h3>
            <p className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Active Affiliates</h3>
            <p className="text-2xl font-bold text-blue-400">{activeAffiliates}</p>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800 mb-6">
          <h3 className="text-lg font-semibold mb-4">Commission Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Default Commission Rate</label>
              <input
                type="number"
                defaultValue="15"
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="15"
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Minimum Payout</label>
              <input
                type="number"
                defaultValue="50"
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="50"
              />
              <span className="text-xs text-gray-500">USD</span>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Payment Schedule</label>
              <select className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white">
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search affiliates..."
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
                <option value="suspended">Suspended</option>
                <option value="pending_approval">Pending Approval</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commissions Table */}
        <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-gray-800">
                  <th className="text-left p-4 font-semibold text-gray-300">Affiliate</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Sales</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Total Earned</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Pending</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Paid</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Payment Method</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-white">{commission.affiliateName}</p>
                        <p className="text-sm text-gray-400">@{commission.affiliateId}</p>
                        <p className="text-sm text-gray-500">{commission.affiliateEmail}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{commission.salesCount}</td>
                    <td className="p-4 text-white font-semibold">${commission.totalEarned.toFixed(2)}</td>
                    <td className="p-4 text-yellow-400">${commission.pendingAmount.toFixed(2)}</td>
                    <td className="p-4 text-green-400">${commission.paidAmount.toFixed(2)}</td>
                    <td className="p-4 text-gray-300">{commission.paymentMethod}</td>
                    <td className="p-4">
                      <select
                        value={commission.status}
                        onChange={(e) => updateCommissionStatus(commission.affiliateId, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none ${getStatusColor(commission.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending_approval">Pending Approval</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {commission.pendingAmount > 0 && (
                          <button
                            onClick={() => processPayment(commission.affiliateId)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors">
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCommissions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No commission records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionManagement;
