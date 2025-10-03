import React, { useState } from "react";
import {
  FaSearch,
  FaBullhorn,
  FaUsers,
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";

const HowItWorks = () => {
  const [tabValue, setTabValue] = useState(1);

  const handleTabChange = (value) => {
    setTabValue(value);
  };

  const brandFeatures = [
    {
      icon: <FaSearch className="text-[orange] text-2xl mb-3" />,
      title: "Search & Filter",
      description:
        "Find the perfect influencers by country, category, followers, and more.",
    },
    {
      icon: <FaBullhorn className="text-[orange] text-2xl mb-3" />,
      title: "Post Campaigns",
      description:
        "Create and manage campaign listings to reach your target audience.",
    },
    {
      icon: <FaUsers className="text-[orange] text-2xl mb-3" />,
      title: "Manage Applications",
      description:
        "Review and collaborate with influencers who match your brand.",
    },
  ];

  const influencerFeatures = [
    {
      icon: <FaUserPlus className="text-[orange] text-2xl mb-3" />,
      title: "Create Your Profile",
      description: "Show brands who you are. No followers minimum.",
    },
    {
      icon: <FaBullhorn className="text-[orange] text-2xl mb-3" />,
      title: "Find Campaigns",
      description: "You Love Beauty, lifestyle, wellness & more.",
    },
    {
      icon: <FaCheckCircle className="text-[orange] text-2xl mb-3" />,
      title: "Apply in One Click",
      description:
        "Receive products. Make content. Get rewards.",
    },
  ];
  const features = tabValue === 0 ? brandFeatures : influencerFeatures;

  return (
    <div className="max-w-6xl mx-auto py-16 justify-center items-center flex flex-col">
      <div className="flex justify-center mb-8">
        <button
          className={`cursor-pointer px-6 py-2 text-lg font-semibold ${
            tabValue === 1
              ? "text-white border-b-[2px] border-b-[white]"
              : " text-gray-500"
          }`}
          onClick={() => handleTabChange(1)}
        >
          For Influencers
        </button>
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 px-[25px] md:px-0 lg:w-[80%]">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative bg-[#232323] shadow-lg rounded-lg p-6 text-center"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2 FontNoto">
              {feature.title}
            </h3>
            <p className="text-gray-400 FontNoto lg:text-[14px]">{feature.description}</p>
            {index < features.length - 1 && (
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-6 h-[2px] bg-gray-400 hidden md:block z-[999]"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
