import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import local brand videos

const BrandExamplesShowcase = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentVideoSet, setCurrentVideoSet] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById("brand-showcase");
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, []);

    // Rotate through different sets of videos
    const videoSets = [
        [
            {
                videoSrc: "/videos/brandvideo1.mp4",
               // overlayText: "EVERDAZE – Functional food content reused in ads",
               // brandName: "EVERDAZE",
            },
            {
                videoSrc: "/videos/brandvideo2.mp4",
              //  overlayText:
               //     "Terre-D – Lifestyle creators activated in 12 days",
               // brandName: "Terre-D",
            },
            {
                videoSrc: "/videos/brandvideo3.mp4",
              //  overlayText:
            //"Liftology – 88% of creators submitted ahead of deadline",
              //  brandName: "Liftology",
            },
        ],
        [
            {
                videoSrc: "/videos/brandvideo4.mp4",
              //  overlayText: "BeautyBrand – 95% engagement rate achieved",
              //  brandName: "BeautyBrand",
            },
            {
                videoSrc: "/videos/brandvideo5.mp4",
             //   overlayText: "TechStart – 200% increase in conversions",
             //   brandName: "TechStart",
            },
            {
                videoSrc: "/videos/brandvideo6.mp4",
              //  overlayText: "FashionCo – Viral content in 48 hours",
              //  brandName: "FashionCo",
            },
        ],
    ];

    const brandExamples = videoSets[currentVideoSet];

    return (
        <section
            id="brand-showcase"
            className="w-full bg-[var(--background)] py-20 px-4 relative overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Title */}
                <div
                    className={`text-center mb-16 transition-all duration-1000 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h2 className="text-[25px] md:text-[30px] FontNoto leading-tight mb-4 relative">
                        <span className="text-lime-400 font-semibold drop-shadow-[0_0_8px_rgba(132,204,22,0.6)]">
                            Real Brands, Real Results
                        </span>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lime-400/0 via-lime-400/60 to-lime-400/0 rounded-full"></div>
                    </h2>
                    <p className="text-lime-500 text-lg FontNoto max-w-2xl mx-auto font-semibold drop-shadow-[0_0_6px_rgba(132,204,22,0.4)]">
                        See how leading brands are leveraging authentic UGC to
                        drive real business results
                    </p>
                </div>

                {/* Video Set Selector */}
                <div
                    className={`flex justify-center mb-12 transition-all duration-1000 delay-300 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                    }`}
                >
                    <div className="flex gap-2 bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
                        {videoSets.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentVideoSet(index)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    currentVideoSet === index
                                        ? "bg-lime-400 text-black shadow-lg"
                                        : "text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                Set {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid - 3 videos on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {brandExamples.map((example, index) => (
                        <div
                            key={`${currentVideoSet}-${index}`}
                            className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 delay-${
                                index * 200
                            } ${
                                isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}
                        >
                            {/* Glowing border effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-lime-400/30 via-green-500/30 to-emerald-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                            {/* Video Container */}
                            <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                >
                                    <source
                                        src={example.videoSrc}
                                        type="video/mp4"
                                    />
                                    {/* Fallback for browsers that don't support video */}
                                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <div className="text-4xl mb-4">
                                                🎥
                                            </div>
                                            <p className="text-lg font-semibold">
                                                {example.brandName}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                UGC Content
                                            </p>
                                        </div>
                                    </div>
                                </video>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500"></div>

                                {/* Brand Badge */}
                                <div className="hidden absolute top-4 left-4">
                                    <div className="bg-lime-400/20 backdrop-blur-sm border border-lime-400/30 text-lime-400 px-3 py-1 rounded-full text-xs font-semibold">
                                        {example.brandName}
                                    </div>
                                </div>

                                {/* Overlay Text */}
                                <div className="hidden absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/10 group-hover:border-lime-400/30 transition-colors duration-300">
                                        <p className="text-white text-sm md:text-base font-semibold FontNoto leading-relaxed">
                                            {example.overlayText}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-lime-400 text-xs">
                                            <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></span>
                                            Success Story
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Play Icon with Ripple Effect */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                                            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                                        </div>
                                        {/* Ripple effect */}
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                                    </div>
                                </div>

                                {/* Success Metrics Overlay */}
                                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                                        ✓ Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div
                    className={`text-center transition-all duration-1000 delay-700 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <Link
                        to="/forbrand"
                        className="group relative inline-flex items-center gap-3 text-white px-8 py-4 rounded-[25px] text-lg font-semibold FontNoto
              bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
              border border-purple-400/50 hover:border-purple-300
              shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]
              transition-all duration-500 transform hover:scale-105 hover:-translate-y-1
              overflow-hidden"
                    >
                        <span className="relative z-10">
                            See More Brand Examples
                        </span>
                        <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </Link>
                </div>
            </div>
        </section>
    );
};
export default BrandExamplesShowcase;
