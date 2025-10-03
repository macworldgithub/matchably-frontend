import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#80808029] text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Navigation</h3>
            <ul>
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/campaigns" className="text-gray-300 hover:text-white">Campaigns</Link></li>
              <li><Link to="/forbrand" className="text-gray-300 hover:text-white">For Brands</Link></li>
              <li><Link to="/influencer" className="text-gray-300 hover:text-white">For Influencers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Company</h3>
            <ul>
              <li><Link to="/aboutus" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/rewards&affiliation" className="text-gray-300 hover:text-white">Rewards & Affiliation</Link></li>
              <li><Link to="/brand-price" className="text-gray-300 hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Legal</h3>
            <ul>
              <li><Link to="/terms-of-service" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/do-not-sell-my-info" className="text-gray-300 hover:text-white">Do Not Sell My Personal Information</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p>Email:{" "}
              <a href="mailto:info@matchably.kr" className="text-blue-500 hover:underline">
                info@matchably.kr
              </a>
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-5 text-xl">
            <span className="text-sm font-semibold">Follow Us</span>
            <a href="https://www.instagram.com/matchably_official/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaInstagram />
            </a>
            {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaFacebook />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaLinkedin />
            </a> */}
            <a href="https://www.tiktok.com/@matchably_officia?lang=en" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-sm">
  © {new Date().getFullYear()} Guideway Consulting. All rights reserved.
</div>

      </div>
    </footer>
  );
};

export default Footer;
