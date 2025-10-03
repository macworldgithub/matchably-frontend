import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import Cookies from 'js-cookie';
import useAuthStore from '../state/atoms';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { User } = useAuthStore();

  // Only show for creators
  if (!User || User.role !== 'creator') {
    return null;
  }

  // Fetch recent invitations for bell dropdown
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token') || localStorage.getItem('token');
      const response = await axios.get(`${config.BACKEND_URL}/invitations/bell`, {
        headers: { Authorization: token }
      });

      if (response.data.status === 'success') {
        const invites = response.data.data;
        setNotifications(invites);
        
        // Count pending invitations
        const pendingCount = invites.filter(inv => inv.status === 'pending').length;
        setUnreadCount(pendingCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications(); // Refresh when opening
    }
  };

  const handleViewAll = () => {
    navigate('/my/invitations');
    setIsOpen(false);
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getStatusPill = (invite) => {
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);
    const hoursUntilExpiry = (expiresAt - now) / (1000 * 60 * 60);

    if (invite.status === 'pending') {
      if (hoursUntilExpiry <= 24) {
        return <span className="px-2 py-0.5 text-xs bg-orange-600 text-orange-100 rounded">Expiring Soon</span>;
      }
      return <span className="px-2 py-0.5 text-xs bg-blue-600 text-blue-100 rounded">Invited</span>;
    }
    
    if (invite.status === 'expired') {
      return <span className="px-2 py-0.5 text-xs bg-gray-600 text-gray-200 rounded">Expired</span>;
    }

    return null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full"
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700 bg-gray-750">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Recent Invitations</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-400">
                  {unreadCount} pending
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <FaBell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No invitations yet.</p>
                <button
                  onClick={() => navigate('/campaigns/gifted')}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-xs underline"
                >
                  Browse campaigns
                </button>
              </div>
            ) : (
              notifications.map((invite) => (
                <div
                  key={invite._id}
                  className="px-4 py-3 border-b border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/my/invitations');
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Campaign Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={invite.campaign?.thumbnail || invite.campaign?.brand?.logo}
                        alt=""
                        className="w-10 h-10 rounded object-cover bg-gray-600"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate">
                            {invite.campaign?.name || 'Campaign'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {invite.campaign?.brand?.name || 'Brand'} • 
                            <span className="flex items-center gap-1 ml-1">
                              <FaExternalLinkAlt className="w-2 h-2" />
                              TikTok/Instagram
                            </span>
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          {getStatusPill(invite)}
                          <span className="text-gray-500 text-xs" title={new Date(invite.createdAt).toLocaleString()}>
                            {formatRelativeTime(invite.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-700 bg-gray-750">
              <button
                onClick={handleViewAll}
                className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All Invitations →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;