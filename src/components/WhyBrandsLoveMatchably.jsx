import React, { useState, useEffect } from 'react';

const WhyBrandsLoveMatchably = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('why-brands-love');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "✉️",
      title: "No DMs, No Ghosting",
      description: "Creators apply directly to your campaign — no chasing required.",
      gradient: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-400/30"
    },
    {
      icon: "✅",
      title: "93% On-Time Submission",
      description: "Most creators post within 14 days of receiving your product.",
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-400/30"
    },
    {
      icon: "📊",
      title: "Automated Performance Tracking",
      description: "Track views, likes, comments & engagement — all in one place.",
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-400/30"
    },
    {
      icon: "💸",
      title: "Flat-Rate Pricing",
      description: "No commissions. No long-term contracts. One transparent fee.",
      gradient: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-400/30"
    }
  ];

  return (
    <section id="why-brands-love" className="w-full bg-[var(--background)] py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title - Smaller Text */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[20px] md:text-[24px] FontNoto leading-tight mb-3 relative">
            <span className="text-lime-400 font-semibold drop-shadow-[0_0_8px_rgba(132,204,22,0.6)]">
              Why Brands Love Matchably
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-lime-400/0 via-lime-400/60 to-lime-400/0 rounded-full"></div>
          </h2>
          <p className="text-lime-500 text-sm md:text-base FontNoto max-w-2xl mx-auto font-semibold drop-shadow-[0_0_6px_rgba(132,204,22,0.4)]">
            Join thousands of brands who've discovered the power of authentic UGC
          </p>
        </div>

        {/* 2x2 Grid on Desktop, 1x4 Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-700 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glowing border effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm`}></div>

              <div className={`relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border ${feature.borderColor} rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-opacity-60 ${feature.bgColor}`}>
                {/* Icon with animated background */}
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-full opacity-20 blur-lg scale-150 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <div className="relative text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  {/* Floating particles */}
                  {hoveredCard === index && (
                    <div className="absolute inset-0">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-1 h-1 bg-gradient-to-r ${feature.gradient} rounded-full animate-ping`}
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`,
                            animationDelay: `${i * 0.3}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-white text-lg md:text-xl font-bold FontNoto mb-3 leading-tight group-hover:text-lime-100 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base FontNoto leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Success indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-3 h-3 bg-gradient-to-r ${feature.gradient} rounded-full animate-pulse`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBrandsLoveMatchably;
