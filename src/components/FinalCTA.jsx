import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../state/atoms';

const FinalCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isLogin } = useAuthStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('final-cta');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleStartCampaign = () => {
    if (isLogin) {
      // If logged in, go to campaign creation
      window.location.href = '/add-campaign';
    } else {
      // If not logged in, go to login page
      window.location.href = '/signin';
    }
  };

  return (
    <section id="final-cta" className="w-full bg-[var(--background)] py-24 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-lime-400/5 via-green-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main Headline */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[28px] md:text-[42px] lg:text-[48px] font-bold FontLato leading-tight mb-6 relative">
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Whether you sell products, software, or services —{' '}
            </span>
            <span className="text-lime-400 drop-shadow-[0_0_12px_rgba(132,204,22,0.8)]">
              Matchably helps you scale with UGC.
            </span>

            {/* Glowing underline effect */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-lime-400/0 via-lime-400/80 to-lime-400/0 rounded-full animate-pulse"></div>
          </h2>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Start a Campaign Button */}
          <button
            onClick={handleStartCampaign}
            className="group relative text-white px-8 py-4 rounded-[30px] text-lg font-bold FontNoto
              bg-gradient-to-r from-lime-500 via-green-600 to-emerald-600
              border-2 border-lime-400/50 hover:border-lime-300
              shadow-[0_0_30px_rgba(132,204,22,0.4)] hover:shadow-[0_0_40px_rgba(132,204,22,0.7)]
              transition-all duration-500 transform hover:scale-105 hover:-translate-y-2
              min-w-[220px] text-center overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Start a Campaign</span>
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            {/* Enhanced shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-lime-600 via-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[30px]"></div>
          </button>

          {/* View Brand Stories Button */}
          <Link
            to="/for-brands"
            className="group relative text-lime-400 px-8 py-4 rounded-[30px] text-lg font-bold FontNoto
              bg-transparent border-2 border-lime-400/50 hover:border-lime-300
              hover:bg-lime-400/10 hover:text-lime-300
              transition-all duration-500 transform hover:scale-105 hover:-translate-y-2
              min-w-[220px] text-center overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>View Brand Stories</span>
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[30px]"></div>
          </Link>
        </div>

        {/* Additional trust elements */}
        <div className={`mt-16 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400 text-sm FontNoto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-700"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
        {/* Floating elements for visual interest */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-lime-400/30 rounded-full animate-pulse`}
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
