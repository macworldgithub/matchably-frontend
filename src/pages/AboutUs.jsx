import React from "react";
import { FaShieldAlt, FaUsers, FaPenAlt, FaExchangeAlt } from "react-icons/fa";
import { GiReceiveMoney, GiPresent } from "react-icons/gi";
import { MdOutlineDashboard, MdOutlineInventory, MdOutlineAnalytics } from "react-icons/md";
import { RiUserStarLine, RiCreativeCommonsLine } from "react-icons/ri";
import { BsGraphUp, BsHandThumbsUp } from "react-icons/bs";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="text-white ">
      {/* Section 1: Hero */}
      <section className="bg-gradient-to-b from-[#070707] to-[#161616] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            We're <span className="text-[#00FF99]">Changing</span> How Creators & Brands Collaborate
          </h1>
          <p className="text-xl text-[#DDDDDD] max-w-2xl mx-auto">
            Creating a world where anyone can collaborate with brands.
          </p>
        </div>
      </section>

      {/* Section 2: Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#141414]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What We Believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaShieldAlt className="text-3xl" />,
                title: "Authentic content builds trust",
                text: "If the content is genuine, trust will follow."
              },
              {
                icon: <FaUsers className="text-3xl" />,
                title: "Opportunity for everyone",
                text: "Anyone can participate, regardless of follower count."
              },
              {
                icon: <RiCreativeCommonsLine className="text-3xl" />,
                title: "Brands want real stories, not ads",
                text: "Focus on genuine product reviews."
              },
              {
                icon: <FaExchangeAlt className="text-3xl" />,
                title: "Simple and transparent",
                text: "Easy flow from application to results."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-[#1F1F1F] p-6 rounded-lg hover:bg-[#2A2A2A] transition duration-300 group"
              >
                <div className="text-[#00FF99] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[#CCCCCC]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How We're Different */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How We're Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <RiUserStarLine className="text-5xl mx-auto" />,
                title: "No follower count requirement",
                text: "We focus on content quality, not vanity metrics."
              },
              {
                icon: <GiPresent className="text-5xl mx-auto" />,
                title: "Product-based collaborations",
                text: "Real products, not ad budgets. Get paid in cash or products."
              },
              {
                icon: <MdOutlineDashboard className="text-5xl mx-auto" />,
                title: "All-in-one platform",
                text: "From discovery to payment - all in one place."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-[#1F1F1F] p-8 rounded-lg hover:bg-[#2A2A2A] transition duration-300 hover:-translate-y-2"
              >
                <div className="text-[#00FF99] mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                <p className="text-[#CCCCCC] text-center">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Platform Flow - Optimized */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Streamlined Collaboration Process</h2>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Creators Flow - Enhanced */}
            <div className="flex-1 bg-[#1F1F1F] p-8 rounded-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#00FF99] text-black p-3 rounded-full mr-4">
                  <FaPenAlt className="text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold">For Creators</h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    icon: <GiReceiveMoney className="text-2xl text-[#00FF99]" />,
                    step: "Apply for campaigns",
                    desc: "Browse and apply to campaigns matching your niche"
                  },
                  {
                    icon: <MdOutlineInventory className="text-2xl text-[#00FF99]" />,
                    step: "Receive products",
                    desc: "Get products shipped directly to you"
                  },
                  {
                    icon: <BsHandThumbsUp className="text-2xl text-[#00FF99]" />,
                    step: "Create & submit content",
                    desc: "Post authentic reviews and keep the products"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold">{item.step}</h4>
                      <p className="text-[#CCCCCC] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Brands Flow - Enhanced */}
            <div className="flex-1 bg-[#1F1F1F] p-8 rounded-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#00FF99] text-black p-3 rounded-full mr-4">
                  <BsGraphUp className="text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold">For Brands</h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    icon: <MdOutlineAnalytics className="text-2xl text-[#00FF99]" />,
                    step: "Create campaign",
                    desc: "Set parameters and select product samples"
                  },
                  {
                    icon: <FaUsers className="text-2xl text-[#00FF99]" />,
                    step: "Match with creators",
                    desc: "Our algorithm finds the perfect creators"
                  },
                  {
                    icon: <MdOutlineDashboard className="text-2xl text-[#00FF99]" />,
                    step: "Track & analyze",
                    desc: "Real-time analytics and performance reports"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold">{item.step}</h4>
                      <p className="text-[#CCCCCC] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Our Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-4xl font-bold mb-6 animate-fadeIn">
            We are building a new ecosystem where authentic creators and brands grow together.
          </h2>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Matchably Today!</h2>
          <p className="text-xl text-[#DDDDDD] mb-8">
            Start receiving products and creating content.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="bg-gradient-to-r from-[#00FF99] to-[#0099FF] text-black font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition">
              Get Started as a Creator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;