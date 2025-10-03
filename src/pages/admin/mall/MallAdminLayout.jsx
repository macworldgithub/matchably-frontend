/** @format */

import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Tag,
  LogOut
} from 'lucide-react';
import Cookie from 'js-cookie';

function MallSidebarLink({ to, icon, label }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
        active
          ? "bg-[#2a2a2a] text-white border-l-4 border-lime-400"
          : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MallAdminLayout() {
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    Cookie.remove("AdminToken");
    window.location.href = "/admin/auth";
  };

  const switchToMainAdmin = () => {
    // Store the current mode in localStorage
    localStorage.setItem('admin_mode', 'ugc');
    navigate('/admin/campaigns');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#141414] text-white">
      {/* Sidebar */}
      <aside className="bg-[#1f1f1f] p-4 w-full md:w-72 border-r border-gray-800 flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Logo / Title */}
          <h1 className="text-xl font-bold text-center mb-6">Matchably Mall Admin</h1>

          {/* Back to Main Admin Button */}
          <button
            onClick={switchToMainAdmin}
            className="flex items-center gap-3 px-4 py-2 mb-6 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all font-medium text-sm text-white"
          >
            <ArrowLeft size={18} />
            Back to Main Admin
          </button>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-6">
            {/* Mall Management Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Mall Management
              </h4>
              <MallSidebarLink
                to="/admin/mall/products"
                icon={<Package size={18} />}
                label="Products"
              />
              <MallSidebarLink
                to="/admin/mall/orders"
                icon={<ShoppingCart size={18} />}
                label="Orders"
              />
            </div>

            {/* Sales & Analytics Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Sales & Analytics
              </h4>
              <MallSidebarLink
                to="/admin/mall/affiliate-sales"
                icon={<TrendingUp size={18} />}
                label="Affiliate Sales"
              />
              <MallSidebarLink
                to="/admin/mall/commission-management"
                icon={<DollarSign size={18} />}
                label="Commission Management"
              />
            </div>

            {/* Marketing Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">
                Marketing
              </h4>
              <MallSidebarLink
                to="/admin/mall/coupon-codes"
                icon={<Tag size={18} />}
                label="Coupon Codes"
              />
            </div>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleAdminLogout}
          className="flex items-center gap-3 px-4 py-2 mt-6 rounded-lg text-red-400 hover:bg-[#2a2a2a] hover:text-red-500 transition font-medium text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#141414] overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default MallAdminLayout;
