/** @format */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Package,
  BadgeDollarSign,
  Megaphone,
  ReceiptText,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FaTasks, FaUser } from "react-icons/fa";
import BrandRoutes from '../../pages/BrandRoutes';
import { useState } from 'react';
import { IoMdAnalytics } from 'react-icons/io';

export default function BrandSidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('BRAND_TOKEN');
    navigate('/brand-auth');
  };

  const menu = [
    { name: 'Dashboard', path: '/brand/dashboard', icon: <LayoutDashboard size={18} /> },
      { name : "Performance", path : "/brand/performance", icon : <IoMdAnalytics size={18} /> },
    { name: 'My Plan', path: '/brand/activeplan', icon: <Package size={18} /> },
    { name: 'Compare Plans', path: '/brand/pricing', icon: <BadgeDollarSign size={18} /> },
    { name: 'Campaigns', path: '/brand/create-campaign', icon: <Megaphone size={18} /> },
    { name: 'Tasks', path: '/brand/tasks', icon: <FaTasks size={18} /> },
    { name: 'Blocked Creators List', path: '/brand/blocked-creators', icon: <FaUser size={18} /> },
    { name: 'Payment History', path: '/brand/payment-history', icon: <ReceiptText size={18} /> },
    { name: 'Brand Settings', path: '/brand/brand-settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white overflow-hidden">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#1a1a1a] p-2 rounded-lg border border-gray-700 shadow-lg hover:bg-[#222]"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full ${
          collapsed ? 'w-20' : 'w-64'
        } bg-[#141414] p-4 border-r border-gray-800 flex flex-col justify-between z-40 transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Logo + Collapse */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            {!collapsed && (
              <Link to="/" onClick={() => setSidebarOpen(false)} className="text-2xl font-bold text-blue-500">
                MATCHABLY
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-[#1e1e1e] rounded-md transition"
              aria-label="Toggle collapse"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2 mt-6">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${
                  isActive(item.path)
                    ? 'bg-[#1e1e1e] text-white border-l-4 border-blue-500'
                    : 'text-gray-400 hover:bg-[#1e1e1e] hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            setSidebarOpen(false);
            handleLogout();
          }}
          className="flex items-center gap-3 px-3 py-2 mt-6 rounded-lg text-red-400 hover:bg-[#1e1e1e] hover:text-red-500 transition font-medium"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto  scrollbar-thin scrollbar-thumb-[#2a2a2a]">
        <BrandRoutes />
      </main>
    </div>
  );
}
