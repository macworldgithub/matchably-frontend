/** @format */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, Search, Eye } from 'lucide-react';

const AffiliateSales = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample data - in production this would come from localStorage and API
  useEffect(() => {
    const sampleSales = [
      {
        id: 1,
        affiliateId: 'jane_creator',
        affiliateName: 'Jane Smith',
        affiliateEmail: 'jane@example.com',
        productName: 'Premium Skincare Set',
        orderId: 'ORD001',
        saleAmount: 89.99,
        commission: 13.50,
        commissionRate: 15,
        date: '2024-01-15T10:30:00Z',
        status: 'confirmed'
      },
      {
        id: 2,
        affiliateId: 'mike_influencer',
        affiliateName: 'Mike Johnson',
        affiliateEmail: 'mike@example.com',
        productName: 'Wireless Earbuds Pro',
        orderId: 'ORD002',
        saleAmount: 129.99,
        commission: 25.99,
        commissionRate: 20,
        date: '2024-01-14T15:45:00Z',
        status: 'pending'
      },
      {
        id: 3,
        affiliateId: 'alex_creator',
        affiliateName: 'Alex Wilson',
        affiliateEmail: 'alex@example.com',
        productName: 'Smart Fitness Watch',
        orderId: 'ORD003',
        saleAmount: 199.99,
        commission: 39.99,
        commissionRate: 20,
        date: '2024-01-13T09:15:00Z',
        status: 'paid'
      },
      {
        id: 4,
        affiliateId: 'jane_creator',
        affiliateName: 'Jane Smith',
        affiliateEmail: 'jane@example.com',
        productName: 'Organic Face Mask',
        orderId: 'ORD004',
        saleAmount: 29.99,
        commission: 4.50,
        commissionRate: 15,
        date: '2024-01-12T14:20:00Z',
        status: 'confirmed'
      }
    ];

    // Load from localStorage if available
    const savedSales = localStorage.getItem('mall_affiliate_sales');
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    } else {
      setSales(sampleSales);
      localStorage.setItem('mall_affiliate_sales', JSON.stringify(sampleSales));
    }
  }, []);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.affiliateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    
    const saleDate = new Date(sale.date);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return matchesSearch && saleDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && saleDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return matchesSearch && saleDate >= monthAgo;
      default:
        return matchesSearch;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const updateSaleStatus = (saleId, newStatus) => {
    const updatedSales = sales.map(sale => 
      sale.id === saleId ? { ...sale, status: newStatus } : sale
    );
    setSales(updatedSales);
    localStorage.setItem('mall_affiliate_sales', JSON.stringify(updatedSales));
  };

  // Calculate stats
  const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);
  const totalCommissions = sales.reduce((sum, sale) => sum + sale.commission, 0);
  const uniqueAffiliates = [...new Set(sales.map(sale => sale.affiliateId))].length;
  const pendingCommissions = sales
    .filter(sale => sale.status === 'pending' || sale.status === 'confirmed')
    .reduce((sum, sale) => sum + sale.commission, 0);

  // Top performers
  const affiliateStats = sales.reduce((acc, sale) => {
    if (!acc[sale.affiliateId]) {
      acc[sale.affiliateId] = {
        name: sale.affiliateName,
        email: sale.affiliateEmail,
        totalSales: 0,
        totalCommission: 0,
        salesCount: 0
      };
    }
    acc[sale.affiliateId].totalSales += sale.saleAmount;
    acc[sale.affiliateId].totalCommission += sale.commission;
    acc[sale.affiliateId].salesCount += 1;
    return acc;
  }, {});

  const topPerformers = Object.values(affiliateStats)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  return (
    <div className="p-6 bg-[#141414] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-blue-400" size={24} />
          <h1 className="text-2xl font-bold">Affiliate Sales</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Sales</h3>
            <p className="text-2xl font-bold text-white">${totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Commissions</h3>
            <p className="text-2xl font-bold text-green-400">${totalCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Active Affiliates</h3>
            <p className="text-2xl font-bold text-blue-400">{uniqueAffiliates}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Pending Commissions</h3>
            <p className="text-2xl font-bold text-yellow-400">${pendingCommissions.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Performers */}
          <div className="lg:col-span-1">
            <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={18} />
                Top Performers
              </h3>
              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={performer.email} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{performer.name}</p>
                      <p className="text-sm text-gray-400">{performer.salesCount} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">${performer.totalSales.toFixed(2)}</p>
                      <p className="text-sm text-gray-400">${performer.totalCommission.toFixed(2)} comm.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="lg:col-span-2">
            <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by affiliate, product, or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-gray-800">
                  <th className="text-left p-4 font-semibold text-gray-300">Affiliate</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Product</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Order ID</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Sale Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Commission</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Rate</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-white">{sale.affiliateName}</p>
                        <p className="text-sm text-gray-400">@{sale.affiliateId}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{sale.productName}</td>
                    <td className="p-4">
                      <span className="font-mono text-blue-400">{sale.orderId}</span>
                    </td>
                    <td className="p-4 text-gray-300">${sale.saleAmount}</td>
                    <td className="p-4 text-green-400">${sale.commission}</td>
                    <td className="p-4 text-gray-300">{sale.commissionRate}%</td>
                    <td className="p-4">
                      <select
                        value={sale.status}
                        onChange={(e) => updateSaleStatus(sale.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none ${getStatusColor(sale.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Eye size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No sales found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateSales;
