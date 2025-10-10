import React, { useState, useEffect, useRef } from "react";
import logo from "/assets/logo_matchably.png";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import axios from "axios";
import moment from "moment";
import NotificationBell from "./NotificationBell";
import config from "../config";
const URL = config.BACKEND_URL;
const Navbar = ({ Islogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
  const [communityMenuOpen, setCommunityMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [invites, setInvites] = useState([]);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const isBrandLoggedIn = localStorage.getItem("BRAND_TOKEN");
  const isCreatorLoggedIn = Cookie.get("token") ? true : false;

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (!isOpen) {
        const current = window.scrollY;
        setIsScrollingDown(current > lastScrollY && current > 10);
        setLastScrollY(current);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setDropdownOpen(false);
        setCampaignMenuOpen(false);
        setCommunityMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch invites (only for creator)
  useEffect(() => {
    if (Islogin && isCreatorLoggedIn) {
      (async () => {
        try {
          const token = Cookie.get("token");
          const res = await axios.get(`${config.BACKEND_URL}/invitations`, {
            headers: { Authorization: token },
          });

          // ✅ enforce array response
          const result = res.data?.data || res.data || [];
          if (Array.isArray(result)) {
            setInvites(result);
          } else {
            setInvites([]);
          }
        } catch (e) {
          console.error("Failed fetching invites:", e);
        }
      })();
    }
  }, [Islogin, isCreatorLoggedIn]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookie.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("BRAND_TOKEN");
      setIsOpen(false);
      window.location.reload();
    }
  };

  // Badge count
  const pendingCount = Array.isArray(invites)
    ? invites.filter((i) => i.status === "pending").length
    : 0;
  const badgeText = pendingCount > 99 ? "99+" : pendingCount;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center items-center h-[15vh]">
        <nav
          ref={menuRef}
          className={`backdrop-blur-md bg-[#1a1a1a]/90 border border-white/20 text-white px-6 py-3 md:px-12 lg:px-20 rounded-[20px] fixed w-[90%] z-[999] transition-transform duration-300 ${
            isScrollingDown ? "-translate-y-[140%]" : "translate-y-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold font-sans">
              <img src={logo} alt="logo" width={120} />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 text-gray-200 text-sm items-center relative">
              {/* Campaigns */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCampaignMenuOpen(!campaignMenuOpen);
                    setCommunityMenuOpen(false);
                  }}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  Campaigns <FiChevronDown />
                </button>
                {campaignMenuOpen && (
                  <div className="absolute top-8 w-56 bg-[#1a1a1a]/95 backdrop-blur-md text-white rounded-md border border-white/10 shadow-lg z-50">
                    <Link
                      to="/campaigns/gifted"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Gifted Campaigns
                    </Link>
                    <Link
                      to="/campaigns/paid"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Paid Campaigns
                    </Link>
                  </div>
                )}
              </div>

              {/* Community */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCommunityMenuOpen(!communityMenuOpen);
                    setCampaignMenuOpen(false);
                  }}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  Community <FiChevronDown />
                </button>
                {communityMenuOpen && (
                  <div className="absolute top-8 w-64 bg-[#1a1a1a]/95 backdrop-blur-md text-white rounded-md border border-white/10 shadow-lg z-50">
                    <Link
                      to="/forbrand"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      For Brands
                    </Link>
                    <Link
                      to="/influencer"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      For Influencers
                    </Link>
                    <Link
                      to="/rewards&affiliation"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Rewards & Affiliation
                    </Link>
                  </div>
                )}
              </div>

              {/* Invitations - Creator Only */}
              {Islogin && isCreatorLoggedIn && (
                <Link
                  to="/invitations"
                  className="flex items-center gap-1 hover:text-white transition relative"
                >
                  📩 Invitations
                  {/* TODO: Add pending count badge */}
                  {/* {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )} */}
                </Link>
              )}

              {/* <Link to="/mall" className="hover:text-white transition">\n                Matchably Mall\n              </Link> */}

              <Link to="/aboutus" className="hover:text-white transition">
                About Us
              </Link>

              {/* 🔔 Notifications */}
              {Islogin && isCreatorLoggedIn && <NotificationBell />}

              {/* Account */}
              {Islogin ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 border border-white px-4 py-1 rounded-full hover:bg-white hover:text-black transition"
                  >
                    <FaUserCircle size={18} />
                    <span>My Account</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a]/95 backdrop-blur-md text-white rounded-md shadow-md border border-white/10 z-50">
                      <Link
                        to="/myaccount"
                        className="block px-4 py-2 hover:bg-gray-800"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/Invitations"
                        className="block px-4 py-2 hover:bg-gray-800"
                      >
                        Invitations
                      </Link>
                      <Link
                        to="/UserApplyCampaign"
                        className="block px-4 py-2 hover:bg-gray-800"
                      >
                        Applied Campaigns
                      </Link>
                      <Link
                        to="/referral&rewards"
                        className="block px-4 py-2 hover:bg-gray-800"
                      >
                        Referral & Rewards
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : isBrandLoggedIn ? (
                <Link
                  to="/brand/dashboard"
                  className="border border-white rounded-full px-4 py-1 text-sm hover:bg-white hover:text-black transition"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/choose-role"
                  className="border border-white rounded-full px-4 py-1 text-sm hover:bg-white hover:text-black transition"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* 📱 Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-3">
              {/* 🔔 Notifications */}
              {Islogin && isCreatorLoggedIn && <NotificationBell />}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="border px-3 py-1 rounded-md text-sm hover:bg-white hover:text-black transition"
              >
                Menu
              </button>
            </div>
          </div>

          {/* 📱 Mobile Menu Items */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-[#1a1a1a]/95 border-t border-white/10 z-50 md:hidden flex flex-col space-y-2 p-4">
              <Link
                to="/campaigns/gifted"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 hover:bg-gray-800 rounded"
              >
                Gifted Campaigns
              </Link>
              <Link
                to="/campaigns/paid"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 hover:bg-gray-800 rounded"
              >
                Paid Campaigns
              </Link>
              <Link
                to="/forbrand"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 hover:bg-gray-800 rounded"
              >
                For Brands
              </Link>
              <Link
                to="/influencer"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 hover:bg-gray-800 rounded"
              >
                For Influencers
              </Link>
              <Link
                to="/rewards&affiliation"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 hover:bg-gray-800 rounded"
              >
                Rewards & Affiliation
              </Link>

              {/* Invitations - Creator Only (Mobile) */}
              {Islogin && isCreatorLoggedIn && (
                <Link
                  to="/invitations"
                  onClick={() => setIsOpen(false)}
                  className="block px-2 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
                >
                  📩 Invitations
                  {/* TODO: Add pending count badge */}
                </Link>
              )}

              {/* <Link
      to="/mall"
      onClick={() => setIsOpen(false)}
      className="block px-2 py-2 hover:bg-gray-800 rounded"
    >
      Matchably Mall
    </Link> */}
              <Link
                to="/aboutus"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 hover:bg-gray-800 rounded"
              >
                About Us
              </Link>

              {Islogin ? (
                <>
                  <Link
                    to="/myaccount"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-2 hover:bg-gray-800 rounded"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/Invitations"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-2 hover:bg-gray-800 rounded"
                  >
                    Invitations
                  </Link>
                  <Link
                    to="/UserApplyCampaign"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-2 hover:bg-gray-800 rounded"
                  >
                    Applied Campaigns
                  </Link>
                  <Link
                    to="/referral&rewards"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-2 hover:bg-gray-800 rounded"
                  >
                    Referral & Rewards
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block text-left px-2 py-2 hover:bg-gray-800 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : isBrandLoggedIn ? (
                <Link
                  to="/brand/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-2 py-2 hover:bg-gray-800 rounded"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/choose-role"
                  onClick={() => setIsOpen(false)}
                  className="block px-2 py-2 hover:bg-gray-800 rounded"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
