/** @format */

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Devider from "../components/Devider";
import { useRef, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Phone1 from "/assets/phone.png";
import {
    Heart,
    MessageCircle,
    Share,
    Bookmark,
    Search,
    Plus,
    Home,
    Compass,
    User,
    Music,
} from "lucide-react";
import "keen-slider/keen-slider.min.css";

import brandlogo1 from "/assets/brandlogos/BrandLogo1.png";
import brandlogo2 from "/assets/brandlogos/BrandLogo2.png";
import brandlogo3 from "/assets/brandlogos/BrandLogo3.png";
import brandlogo4 from "/assets/brandlogos/BrandLogo4.png";
import brandlogo5 from "/assets/brandlogos/BrandLogo5.png";
import brandlogo6 from "/assets/brandlogos/BrandLogo6.png";
import brandlogo7 from "/assets/brandlogos/BrandLogo7.png";
import brandlogo8 from "/assets/brandlogos/BrandLogo8.png";
import brandlogo9 from "/assets/brandlogos/BrandLogo9.png";
import brandlogo10 from "/assets/brandlogos/BrandLogo10.png";
import brandlogo11 from "/assets/brandlogos/BrandLogo11.png";
import brandlogo12 from "/assets/brandlogos/BrandLogo12.png";
import brandlogo13 from "/assets/brandlogos/BrandLogo13.png";
import brandlogo14 from "/assets/brandlogos/BrandLogo14.png";

const GiftedCampaignsContent = () => {
    const videoWrapperRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            const el = videoWrapperRef.current;
            if (!el) return;
            let scrollAmount = 1;

            const interval = setInterval(() => {
                el.scrollLeft -= scrollAmount;
                if (el.scrollLeft <= 0) {
                    el.scrollLeft = el.scrollWidth / 2;
                }
            }, 20); // smoother scroll

            return () => clearInterval(interval);
        }
    }, [isHovered]);
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full h-screen overflow-hidden bg-black text-white">
                {/* Content */}
                <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    {/* Left Column: Text + Buttons */}
                    <div
                        className="text-center md:text-left max-w-xl"
                        data-aos="fade-right"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Start your campaign
                            <br className="hidden md:block" /> in 5 minutes
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-10">
                            No outreach. No ghosting. No chasing. Just real
                            content from real creators — fully managed for you.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-y-4 gap-x-4 sm:gap-x-6 justify-center md:justify-start">
                          

                            <Link
                                to="/brand/dashboard"
                                className="relative group inline-block w-[240px] h-[64px] text-lg font-semibold text-center leading-[64px] rounded-xl bg-lime-500 hover:bg-lime-600 text-black transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)]"
                            >
                                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-lime-500 z-[-1]"></span>
                                Start Your Campaign
                            </Link>

                            <Link
                                to="/brand-price"
                                className="relative group inline-block w-[240px] h-[64px] text-lg font-semibold text-center leading-[64px] rounded-xl bg-lime-500 hover:bg-lime-600 text-black transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)]"
                            >
                                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-lime-500 z-[-1]"></span>
                                Compare Plans
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Phone Mockup */}
                    <div
                        className="mt-12 md:mt-0 md:ml-8 w-[260px] md:w-[300px] shrink-0"
                        data-aos="fade-left"
                    >
                        <img
                            src={Phone1}
                            alt="New Campaign Mockup"
                            className="rounded-[2rem] shadow-2xl"
                        />
                    </div>
                </div>
            </section>
            <Devider />

            {/* Section 1: How Matchably Works - Vertical Timeline */}
            <section className="py-20 px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    How Matchably Works
                </h2>

                <div className="relative pl-12">
                    {/* Vertical dotted line */}
                    <div className="absolute left-[22px] top-0 h-full w-1 border-l-4 border-dotted border-green-400"></div>

                    {/* Steps */}
                    <div>
                        {[
                            {
                                icon: "📄",
                                title: "Launch Your Campaign",
                                desc: "Submit your brief & product — takes less than 5 minutes.",
                            },
                            {
                                icon: "🙋‍♂️",
                                title: "Creators Apply",
                                desc: "30+ creators apply within 5 days. You choose who to work with.",
                            },
                            {
                                icon: "📦",
                                title: "Ship Your Product",
                                desc: "You ship the product. We handle all deadlines and reminders.",
                            },
                            {
                                icon: "🎥",
                                title: "Receive Your Content",
                                desc: "Creators upload content. We review and deliver it to your dashboard — ready to use.",
                            },
                        ].map((step, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 mb-10"
                                data-aos="fade-up"
                            >
                                {/* Icon with better vertical alignment */}
                                <div className="text-3xl w-10 h-10 flex items-center justify-center">
                                    {step.icon}
                                </div>

                                {/* Text block */}
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold mb-2">
                                        Step {i + 1}: {step.title}
                                    </h3>
                                    <p className="text-base md:text-lg font-medium text-gray-300">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Devider />

            {/* Watch It. Trust It. Use It. Section */}
            <section className="bg-black text-white py-5 px-4">
                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-3">
                        Watch It. Trust It. Use It.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Real content from real creators, Backed by real results.
                    </p>
                </div>

                {/* Video Carousel */}
                <div
                    className="relative group mb-14"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Scrollable Container */}
                    <div
                        ref={videoWrapperRef}
                        className="relative overflow-hidden"
                    >
                        <div className="flex gap-6 w-fit">
                            {[
  "/videos/brandvideo9.mp4",
  "/videos/brandvideo10.mp4",
  "/videos/brandvideo11.mp4",
  "/videos/brandvideo12.mp4",
  "/videos/brandvideo13.mp4",
  "/videos/brandvideo14.mp4",
  "/videos/brandvideo15.mp4",
  "/videos/brandvideo16.mp4",
  "/videos/brandvideo17.mp4",
  "/videos/brandvideo18.mp4",
  "/videos/brandvideo19.mp4",
  "/videos/brandvideo20.mp4",

]
.map((vid, idx) => (
                                <div
                                    key={idx}
                                    className="min-w-[200px] sm:min-w-[280px] md:min-w-[320px] rounded-xl overflow-hidden"
                                >
                                    <video
                                        src={vid}
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
                                        className=" object-cover rounded-xl"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={() => {
                            videoWrapperRef.current.scrollLeft -= 320;
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full z-10 hover:bg-opacity-80 transition hidden group-hover:block"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => {
                            videoWrapperRef.current.scrollLeft += 320;
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full z-10 hover:bg-opacity-80 transition hidden group-hover:block"
                    >
                        ▶
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 px-2">
                    {[
                        {
                            icon: "✅",
                            value: "93%",
                            label: "On-time content delivery",
                        },
                        {
                            icon: "👥",
                            value: "50+",
                            label: "Avg applicants per campaign",
                        },
                        {
                            icon: "📈",
                            value: "9.5K+",
                            label: "Avg views per UGC post",
                        },
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-[#111] p-6 rounded-2xl border border-gray-700 text-center shadow-lg"
                        >
                            <div className="text-4xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-extrabold text-green-400">
                                {stat.value}
                            </div>
                            <p className="text-sm text-gray-300 mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Trusted Brands */}

                <div className="bg-black py-8">
                    <div className="text-center mt-4 mb-6">
                        <p className="text-white uppercase tracking-wider text-sm">
                            Trusted by:
                        </p>
                    </div>

                    {/* Marquee Wrapper */}
                    <div className="overflow-hidden w-full">
                        <div className="flex whitespace-nowrap animate-scroll group-hover:[animation-play-state:paused]">
                            {[
                                brandlogo1,
                                brandlogo2,
                                brandlogo3,
                                brandlogo4,
                                brandlogo5,
                                brandlogo6,
                                brandlogo7,
                                brandlogo8,
                                brandlogo9,
                                brandlogo10,
                                brandlogo11,
                                brandlogo12,
                                brandlogo13,
                                brandlogo14,
                            ]
                                .concat([
                                    brandlogo1,
                                    brandlogo2,
                                    brandlogo3,
                                    brandlogo4,
                                    brandlogo5,
                                    brandlogo6,
                                    brandlogo7,
                                    brandlogo8,
                                    brandlogo9,
                                    brandlogo10,
                                    brandlogo11,
                                    brandlogo12,
                                    brandlogo13,
                                    brandlogo14,
                                ])
                                .map((logo, idx) => (
                                    <div
                                        key={idx}
                                        className="mx-4 flex-none flex items-center justify-center h-40 w-35 rounded-md"
                                    >
                                        <img
                                            src={logo}
                                            alt={`Brand logo ${(idx % 14) + 1}`}
                                            className="h-full mw-full object-contain border-green-300 border-[1px] shadow-lg shadow-green-300"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Local animation CSS */}
                    <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 30s linear infinite;
    }
  `}</style>
                </div>
            </section>
            <Devider />

            {/* Section 3: Why Matchably */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
                    <span className="text-red-500"></span> STOP WASTING TIME AND
                    MONEY.
                </h2>
                <p className="text-center text-lg text-gray-300 mb-12">
                    Matchably saves you $5,000 and 15 hours — with guaranteed
                    results.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-10 md:gap-x-12">
                    {[
                        {
                            icon: "💸",
                            title: "$6,360 → $1,200",
                            desc: "Most brands pay over $6K for 30 UGCs. With Matchably, it's just $1,200 — flat, all-in.",
                        },
                        {
                            icon: "⏱️",
                            title: "15 hours → 0 hours",
                            desc: "No cold outreach. No follow-ups. We manage the entire process for you.",
                        },
                        {
                            icon: "🚫",
                            title: "Guaranteed Delivery",
                            desc: "No content? No problem. We instantly replace creators who drop out.",
                        },
                        {
                            icon: "📜",
                            title: "Usage Rights Included",
                            desc: "Use your content anywhere — forever. Raw files optional on request.",
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-[#111] py-8 px-6 rounded-2xl border border-gray-700 shadow-lg flex flex-col space-y-4"
                            data-aos="fade-up"
                        >
                            <div className="text-3xl w-8 h-8 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                {item.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <Devider />

            {/* Section 4: FAQ */}
            <section className="py-20 px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
                <div className="space-y-6">
                    {[
                        {
                            q: "What types of products or businesses are allowed?",
                            a: "**Any brand** with a product, service, or experience to promote. Beauty, lifestyle, wellness, restaurants, local services — all are welcome.",
                        },
                        {
                            q: "Do I just ship the product?",
                            a: "**Yes.** Once you approve the creators, you ship the product — we handle the rest. For service-based campaigns, we will coordinate with creators.",
                        },
                        {
                            q: "Can I use the content however I want?",
                            a: "**Yes — commercial use is included.** For resale, paid ads, or affiliate use, we will help you get extended permissions if needed.",
                        },
                        {
                            q: "What if I do not like the content?",
                            a: "**You can request one revision per creator.** We will handle the reshoot — no back-and-forth needed on your side.",
                        },
                        {
                            q: "Are there contracts or hidden fees?",
                            a: "**No.** We use flat-rate pricing. No commissions. No surprises.",
                        },
                        {
                            q: "Can I choose the creators?",
                            a: "**Yes — you approve every creator.** In rare cases, we may assign backups with your approval, if someone drops out.",
                        },
                    ].map(({ q, a }, i) => (
                        <details
                            key={i}
                            className="bg-[#111] p-4 rounded-xl border border-gray-700 group transition-all"
                            data-aos="fade-up"
                        >
                            <summary className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                                {q}
                            </summary>
                            <p
                                className="mt-2 text-gray-300"
                                dangerouslySetInnerHTML={{
                                    __html: a.replace(
                                        /\*\*(.*?)\*\*/g,
                                        "<strong>$1</strong>"
                                    ),
                                }}
                            ></p>
                        </details>
                    ))}
                </div>
            </section>
            <Devider />

            {/* Final CTA Footer */}
            <section className="py-20 px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                    Ready to get real creator content — without the hassle?
                </h2>
                <Link
                    to="/brand-price"
                    className="inline-block mt-4 px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black shadow-xl hover:scale-110 transition-transform"
                >
                    Compare Pricing Plans →
                </Link>
            </section>
        </>
    );
};

const EnhancedProSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            emoji: "🚀",
            title: "Scaling Fast",
            description: "Already have traction and want to grow even faster.",
            gradient: "from-emerald-400 to-teal-600",
            bgGradient: "from-emerald-500/10 to-teal-500/10",
            shadow: "shadow-emerald-500/20",
        },
        {
            emoji: "🎯",
            title: "Creative Control",
            description: "Choose your creators and guide the content.",
            gradient: "from-red-400 to-pink-600",
            bgGradient: "from-red-500/10 to-pink-500/10",
            shadow: "shadow-red-500/20",
        },
        {
            emoji: "⚡",
            title: "Timeline Guaranteed",
            description: "Clear start and end dates, no ghosting.",
            gradient: "from-purple-400 to-indigo-600",
            bgGradient: "from-purple-500/10 to-indigo-500/10",
            shadow: "shadow-purple-500/20",
        },
        {
            emoji: "📊",
            title: "Analytics-Focused",
            description: "Track reach, engagement, and ROI.",
            gradient: "from-blue-400 to-cyan-600",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
            shadow: "shadow-blue-500/20",
        },
        {
            emoji: "🎨",
            title: "Ad-Ready Content",
            description: "High-quality visuals you can reuse for paid media.",
            gradient: "from-orange-400 to-yellow-600",
            bgGradient: "from-orange-500/10 to-yellow-500/10",
            shadow: "shadow-orange-500/20",
        },
    ];

    return (
        <section className="px-4 py-8 max-w-2xl mx-auto relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-xl animate-pulse"></div>
                <div
                    className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>

            <div
                className={`relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/20 rounded-xl p-4 md:p-6 shadow-2xl transform transition-all duration-1000 ${
                    isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                }`}
            >
                {/* Header with enhanced styling */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-2.5 py-1 mb-3">
                        <span className="text-sm animate-bounce">✨</span>
                        <span className="text-purple-300 font-medium text-xs">
                            Strategic Partnership
                        </span>
                    </div>

                    <h2 className="text-white text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent leading-tight">
                        Time to Go Pro: Launch with Paid Creators
                    </h2>

                    <p className="text-white/80 mb-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        A Strategic Choice for Brands Seeking Immediate
                        Visibility and Impact
                    </p>
                </div>

                {/* Enhanced feature grid */}
                <div className="space-y-3">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className={`group relative bg-gradient-to-br ${
                                item.bgGradient
                            } border border-white/10 rounded-lg p-3 md:p-4 transition-all duration-500 hover:border-white/30 hover:${
                                item.shadow
                            } hover:shadow transform hover:-translate-y-0.5 cursor-pointer ${
                                isVisible ? "animate-fade-in" : ""
                            }`}
                            style={{
                                animationDelay: `${index * 150}ms`,
                                animationFillMode: "both",
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Animated background gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-500`}
                            ></div>

                            {/* Content */}
                            <div className="relative flex items-start gap-3">
                                {/* Enhanced emoji with animation */}
                                <div
                                    className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center text-sm transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2`}
                                >
                                    <span className="filter drop-shadow-lg">
                                        {item.emoji}
                                    </span>
                                </div>

                                {/* Text content */}
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className={`text-white font-bold text-base mb-1 bg-gradient-to-r ${item.gradient} bg-clip-text group-hover:text-transparent transition-all duration-300`}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-white/70 text-xs md:text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Hover arrow indicator */}
                                {/* <div
                  className={`flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300`}
                >
                  <svg
                    className="w-2 h-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div> */}
                            </div>

                            {/* Subtle shine effect */}
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:animate-shine"></div>
                        </div>
                    ))}
                </div>

                {/* Call to action button */}
                {/* <div className="text-center mt-6">
          <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-0.5 transition-all duration-300 text-sm">
            <span className="relative z-10">Get Started Today</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </button>
        </div> */}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shine {
                    0% {
                        transform: translateX(-100%) skewX(-12deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-12deg);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }

                .animate-shine {
                    animation: shine 1.5s ease-out;
                }
            `}</style>
        </section>
    );
};

const TikTokIPhoneMockup = ({ videoSrc = "/videos/brandvideo15.mp4", className = "" }) => {
    return (
        <div
            className={`md:w-1/2 flex items-center justify-center`}
            data-aos="fade-left"
        >
            <div
                className="relative"
                style={{ width: "280px", height: "560px" }}
            >
                {/* iPhone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-white to-gray-300 rounded-[40px] shadow-2xl border border-gray-300">
                    <div className="absolute inset-[3px] bg-black rounded-[37px] overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-[7px] left-1/2 transform -translate-x-1/2 w-[120px] h-[15px] bg-black rounded-[14px] z-40"></div>

                        <div className="absolute inset-[6px] bg-black rounded-[31px] overflow-hidden">
                            {/* Status Bar */}
                            <div className="absolute top-0 left-0 right-0 h-[15px] z-30 flex items-center justify-between px-[15px] pt-[8px]">
                                <div className="text-white text-[10px] font-semibold tracking-[-0.24px]">
                                    9:41
                                </div>
                                <div className="flex items-center space-x-[6px]">
                                    <div className="flex space-x-[4px]">
                                        <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
                                        <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
                                        <div className="w-[4px] h-[4px] bg-white rounded-full opacity-40"></div>
                                    </div>
                                    <svg
                                        width="25"
                                        height="15"
                                        viewBox="0 0 25 12"
                                        fill="none"
                                    >
                                        <rect
                                            x="2"
                                            y="2"
                                            width="21"
                                            height="8"
                                            rx="4"
                                            stroke="white"
                                            strokeWidth="1"
                                        />
                                        <path
                                            d="M23 4V8"
                                            stroke="white"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                        />
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="6"
                                            rx="3"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* TikTok Header */}
                            <div className="absolute top-[15px] left-0 right-0 h-[29px] bg-transparent z-30 flex items-center justify-between px-[15px] w-full bg-red-600">
                                <div className="flex justify-between item-center w-full">
                                    <button className="text-white/60 text-[10px] font-normal">
                                        Following
                                    </button>
                                    <button className="text-white text-[10px] font-bold">
                                        For You
                                    </button>
                                    <Search
                                        className="w-[10px] h-[10px] text-white"
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>

                            {/* Video Container */}
                            <div className="absolute top-[42px] left-0 right-0 bottom-[56px] bg-black overflow-hidden">
                                <video
                                    src={videoSrc }
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />

                                {/* Video Overlay Content */}
                                <div className="absolute inset-0">
                                    {/* Right Side Actions */}
                                    <div className="absolute right-[6px] bottom-[20px] flex flex-col items-center space-y-[6px] z-20">
                                        {/* Like */}
                                        <div className="flex flex-col items-center space-y-[3px]">
                                            <div className="w-[20px] h-[20px] flex items-center justify-center">
                                                <Heart
                                                    className="w-[32px] h-[32px] text-white fill-white"
                                                    strokeWidth={1.5}
                                                />
                                            </div>
                                            <span className="text-white text-[10px] font-semibold">
                                                2.3M
                                            </span>
                                        </div>

                                        {/* Comment */}
                                        <div className="flex flex-col items-center space-y-[3px]">
                                            <div className="w-[20px] h-[20px] flex items-center justify-center">
                                                <MessageCircle
                                                    className="w-[32px] h-[32px] text-white"
                                                    strokeWidth={1.5}
                                                />
                                            </div>
                                            <span className="text-white text-[10px] font-semibold">
                                                547
                                            </span>
                                        </div>

                                        {/* Share */}
                                        <div className="flex flex-col items-center space-y-[3px]">
                                            <div className="w-[20px] h-[20px] flex items-center justify-center">
                                                <Share
                                                    className="w-[28px] h-[28px] text-white"
                                                    strokeWidth={1.5}
                                                />
                                            </div>
                                            <span className="text-white text-[10px] font-semibold">
                                                Share
                                            </span>
                                        </div>

                                        {/* Bookmark */}
                                        <div className="flex flex-col items-center space-y-[3px]">
                                            <div className="w-[20px] h-[20px] flex items-center justify-center">
                                                <Bookmark
                                                    className="w-[28px] h-[28px] text-white"
                                                    strokeWidth={1.5}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="absolute bottom-[20px] left-[16px] right-[80px] z-20">
                                        <div className="text-white space-y-[4px]">
                                            <div className="flex items-center">
                                                <span className="text-[12px] font-bold">
                                                    @Matchably
                                                </span>
                                            </div>
                                            <p className="text-[10px] leading-[20px] font-normal">
                                                Creating a world where anyone
                                                can collaborate with brands.
                                                #matchably
                                            </p>
                                            <div className="flex items-center">
                                                <Music className="w-[12px] h-[16px] text-white mr-[8px]" />
                                                <span className="text-[13px] font-normal">
                                                    Original sound - Matchably
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Navigation */}
                            <div className="absolute bottom-0 left-0 right-0 h-[43px] bg-black z-30">
                                <div className="flex items-center justify-around h-full px-[20px] pb-[20px]">
                                    <div className="flex flex-col items-center space-y-[2px]">
                                        <Home
                                            className="w-[20px] h-[20px] text-white"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-white text-[8px] font-medium">
                                            Home
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-[2px]">
                                        <Compass
                                            className="w-[20px] h-[20px] text-gray-400"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-gray-400 text-[8px] font-medium">
                                            Discover
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-[48px] h-[32px] bg-gradient-to-r from-pink-500 to-red-500 rounded-[8px] flex items-center justify-center">
                                            <Plus
                                                className="w-[20px] h-[20px] text-white"
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center space-y-[2px]">
                                        <MessageCircle
                                            className="w-[20px] h-[20px] text-gray-400"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-gray-400 text-[8px] font-medium">
                                            Inbox
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-[2px]">
                                        <User
                                            className="w-[20px] h-[20px] text-gray-400"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-gray-400 text-[8px] font-medium">
                                            Profile
                                        </span>
                                    </div>
                                </div>

                                {/* Home Indicator */}
                                <div className="absolute bottom-[4px] left-1/2 transform -translate-x-1/2 w-[134px] h-[3px] bg-white rounded-full opacity-60"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* iPhone Physical Buttons */}
                <div className="absolute -left-[2px] top-[108px] w-[3px] h-[32px] bg-gradient-to-r from-gray-400 to-gray-500 rounded-r-[2px] shadow-sm"></div>
                <div className="absolute -left-[2px] top-[156px] w-[3px] h-[56px] bg-gradient-to-r from-gray-400 to-gray-500 rounded-r-[2px] shadow-sm"></div>
                <div className="absolute -left-[2px] top-[228px] w-[3px] h-[56px] bg-gradient-to-r from-gray-400 to-gray-500 rounded-r-[2px] shadow-sm"></div>
                <div className="absolute -right-[2px] top-[156px] w-[3px] h-[80px] bg-gradient-to-l from-gray-400 to-gray-500 rounded-l-[2px] shadow-sm"></div>

                {/* iPhone Reflection/Highlights */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[40px] pointer-events-none"></div>

                {/* Shadow */}
                <div className="absolute -bottom-[12px] left-1/2 transform -translate-x-1/2 w-[240px] h-[40px] bg-black/20 rounded-full blur-[20px] -z-10"></div>
            </div>
        </div>
    );
};

const PaidCollaborationsContent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById("how-it-works");
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, []);

    // Auto-cycle through steps for demo
    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % 3);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [isVisible]);

    const steps = [
        {
            step: "1",
            icon: "🚀",
            title: "Create",
            description: "Build a campaign and choose Bid or Fixed model.",
            videoSrc: "/videos/brandvideo7.mp4",
            gradient: "from-blue-500 to-purple-600",
            bgColor: "bg-blue-500/10",
        },
        {
            step: "2",
            icon: "📝",
            title: "Match",
            description: "Creators apply, brands review and approve.",
            videoSrc: "/videos/brandvideo8.mp4",
            gradient: "from-green-500 to-emerald-600",
            bgColor: "bg-green-500/10",
        },
        {
            step: "3",
            icon: "⚡",
            title: "Deliver",
            description:
                "Content is submitted, reviewed, and approved on-platform.",
            videoSrc: "/videos/brandvideo9.mp4",
            gradient: "from-purple-500 to-pink-600",
            bgColor: "bg-purple-500/10",
        },
    ];
    return (
        <>
            {/* 1. Hero Section */}
            <section className="bg-black text-white pt-10 pb-20 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div
                        className="md:w-1/2 text-center md:text-left"
                        data-aos="fade-right"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Run Paid UGC Campaigns — Safely, Zero Commission
                        </h1>
                        <div className="flex justify-center md:justify-start gap-4">
                            <Link
                                to="/brand-price"
                                className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
                            >
                                Start Campaign →
                            </Link>
                            <Link
                                to="/brand-price"
                                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-transform transform hover:scale-105"
                            >
                                See Plans →
                            </Link>
                        </div>
                    </div>
          
                    <TikTokIPhoneMockup />
                </div>
            </section>

            <Devider />

            {/* 2. Pain vs Solution Section */}
            {/* <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="relative group cursor-pointer transition-all duration-500 hover:scale-102"
            data-aos="fade-up"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl opacity-0 transition-opacity duration-500 blur-sm group-hover:opacity-20"></div>

            <div className="relative bg-transparent backdrop-blur-sm border rounded-2xl p-8 shadow-lg transition-all duration-500 border-white/20 hover:border-red-400/50 hover:shadow-2xl h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    ❌
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    Brand Pain
                  </h3>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      Creators don't care about the product
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      No idea if it'll perform
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      What if creators ghost?
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      Communication gets messy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="relative group cursor-pointer transition-all duration-500 hover:scale-102"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl opacity-0 transition-opacity duration-500 blur-sm group-hover:opacity-20"></div>

            <div className="relative bg-transparent backdrop-blur-sm border rounded-2xl p-8 shadow-lg transition-all duration-500 border-white/20 hover:border-green-400/50 hover:shadow-2xl h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    ✅
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    Matchably Solution
                  </h3>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      Only creators who completed 2+ gifted campaigns can join
                      paid
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      Data-backed projections based on past campaign results
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      All chats, files, and decisions stay in-platform,
                      time-stamped
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/90 leading-relaxed">
                      Matchably reviews the case — everything is logged and
                      traceable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

            <section className="py-20 px-4 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-y-10 gap-x-10 md:gap-x-12">
                    {[
                        {
                            painIcon: "😒",
                            painTitle: "Creators Don't Care About the Product",
                            painDesc:
                                "Most creators just want free stuff. They barely check your brand.",
                            solutionIcon: "✅",
                            solutionTitle: "Filtered for Fit",
                            solutionDesc:
                                "Only creators who've successfully completed 2+ campaigns can apply to paid ones.",
                        },
                        {
                            painIcon: "🤷‍♂️",
                            painTitle: "No Idea If It'll Perform",
                            painDesc:
                                "You're sending products and hoping for results — with zero data.",
                            solutionIcon: "✅",
                            solutionTitle: "Predictable ROI",
                            solutionDesc:
                                "We show projected views and performance based on past campaign data.",
                        },
                        {
                            painIcon: "👻",
                            painTitle: "What If Creators Ghost?",
                            painDesc:
                                "You send products, and they vanish. No post, no reply.",
                            solutionIcon: "✅",
                            solutionTitle: "Guaranteed Delivery",
                            solutionDesc:
                                "We instantly replace no-shows — no extra charge, no delay.",
                        },
                        {
                            painIcon: "📬",
                            painTitle: "Communication Gets Messy",
                            painDesc:
                                "Emails, DMs, spreadsheets — everything's scattered.",
                            solutionIcon: "✅",
                            solutionTitle: "All-In-One Platform",
                            solutionDesc:
                                "Chats, files, and deadlines stay inside Matchably — time-stamped and trackable.",
                        },
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="bg-[#111] p-6 rounded-2xl border border-gray-700 shadow-lg"
                        >
                            {/* Pain Point Section */}
                            <div className="mb-2 pb-2">
                                <div className=" mb-2">
                                    <div className="text-xl flex-shrink-0 my-1">
                                        {card.painIcon}
                                    </div>
                                    <h3 className="text-lg font-bold text-red-400 mb-2">
                                        {card.painTitle}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {card.painDesc}
                                    </p>
                                </div>
                            </div>

                            {/* Solution Section */}
                            <div>
                                <div className="">
                                    <div className="text-xl flex-shrink-0 my-1">
                                        {card.solutionIcon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-400 mb-2">
                                            {card.solutionTitle}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {card.solutionDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Devider />

            <section
                id="how-it-works"
                className="w-full bg-[var(--background)] py-20 px-4 relative overflow-hidden"
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
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
                                How It Works
                            </span>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lime-400/0 via-lime-400/60 to-lime-400/0 rounded-full"></div>
                        </h2>
                    </div>

                    {/* Main Content Layout */}
                    <div className="text-center items-center">
                        {/* Desktop: 3 horizontal cards, Mobile: vertical stack */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`relative transition-all duration-700 delay-${
                                        index * 200 + 500
                                    } ${
                                        isVisible
                                            ? "opacity-100 translate-x-0"
                                            : "opacity-0 translate-x-10"
                                    }`}
                                    onMouseEnter={() => setActiveStep(index)}
                                >
                                    {/* Step Card */}
                                    <div
                                        className={`relative group cursor-pointer transition-all duration-500 h-full ${
                                            activeStep === index
                                                ? "scale-105"
                                                : "hover:scale-102"
                                        }`}
                                    >
                                        {/* Glowing border effect */}
                                        <div
                                            className={`absolute -inset-1 bg-gradient-to-r ${
                                                step.gradient
                                            } rounded-2xl opacity-0 transition-opacity duration-500 blur-sm ${
                                                activeStep === index
                                                    ? "opacity-30"
                                                    : "group-hover:opacity-20"
                                            }`}
                                        ></div>

                                        <div
                                            className={`relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border rounded-2xl p-6 shadow-lg transition-all duration-500 h-full flex flex-col ${
                                                step.bgColor
                                            } ${
                                                activeStep === index
                                                    ? "border-lime-400/50 shadow-2xl"
                                                    : "border-white/10 hover:border-white/20"
                                            }`}
                                        >
                                            {/* Icon at top */}
                                            <div className="flex justify-center mb-4">
                                                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                                    {step.icon}
                                                </div>
                                            </div>

                                            {/* Step Number Badge */}
                                            <div className="flex justify-center mb-4">
                                                <div
                                                    className={`w-10 h-10 bg-gradient-to-r ${step.gradient} text-white rounded-full flex items-center justify-center font-bold text-sm FontNoto shadow-lg`}
                                                >
                                                    {step.step}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-white text-lg md:text-xl font-bold FontNoto leading-tight mb-3 text-center">
                                                {step.title}
                                            </h3>

                                            {/* Description - keep it concise for horizontal layout */}
                                            <p className="text-gray-300 text-sm md:text-base FontNoto leading-relaxed text-center flex-1">
                                                {step.description}
                                            </p>

                                            {/* Active indicator */}
                                            {activeStep === index && (
                                                <div className="flex justify-center mt-4">
                                                    <div
                                                        className={`w-3 h-3 bg-gradient-to-r ${step.gradient} rounded-full animate-pulse`}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Devider />

            <EnhancedProSection />

            {/* <Devider /> */}
            <section className="py-20 px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
                <div className="space-y-6">
                    {[
                        {
                            q: " How do I pay creators?",
                            a: "You pay creators directly after agreement. Matchably does not touch the money.",
                        },
                        {
                            q: "Can I talk to creators outside the platform?",
                            a: "Yes, but Matchably will not be able to help if any issue arises outside.",
                        },
                        {
                            q: " What if they don't submit content?",
                            a: "All agreements are logged. If there is a problem, we will step in based on records.",
                        },
                        {
                            q: "Can I ask for revisions?",
                            a: "Yes. Use the chat to request changes. Set clear expectations upfront.",
                        },
                        {
                            q: "How is usage defined?",
                            a: " Brands define usage terms (duration, channels) during campaign setup.",
                        },
                    ].map(({ q, a }, i) => (
                        <details
                            key={i}
                            className="bg-[#111] p-4 rounded-xl border border-gray-700 group transition-all"
                            data-aos="fade-up"
                        >
                            <summary className="text-lg font-semibold cursor-pointer flex items-center gap-2">
                                {q}
                            </summary>
                            <p
                                className="mt-2 text-gray-300"
                                dangerouslySetInnerHTML={{
                                    __html: a.replace(
                                        /\*\*(.*?)\*\*/g,
                                        "<strong>$1</strong>"
                                    ),
                                }}
                            ></p>
                        </details>
                    ))}
                </div>
            </section>

            <Devider />

            <section className="py-20 px-4 text-center">
                <Link
                    to="/brand-price"
                    className="inline-block mt-4 px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-black shadow-xl hover:scale-110 transition-transform"
                >
                    Launch Campaign Now →
                </Link>
            </section>
        </>
    );
};

const BrandLandingPage = () => {
    const [campaignType, setCampaignType] = useState("gifted");

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    return (
        <div className="bg-black text-white">
            <Helmet>
                <title>Matchably for Brands</title>
                <meta
                    property="og:title"
                    content="Start Your UGC Campaign in 5 Minutes"
                />
                <meta
                    name="description"
                    content="No outreach. No ghosting. No chasing. Just real content from real creators — fully managed for you."
                />
            </Helmet>

            <div className="text-center py-4">
                <div className="inline-flex rounded-lg bg-gray-800 p-1">
                    <button
                        onClick={() => setCampaignType("gifted")}
                        className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${
                            campaignType === "gifted"
                                ? "bg-lime-500 text-black"
                                : "text-white"
                        }`}
                    >
                        Gifted Campaigns
                    </button>
                    <button
                        onClick={() => setCampaignType("paid")}
                        className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${
                            campaignType === "paid"
                                ? "bg-lime-500 text-black"
                                : "text-white"
                        }`}
                    >
                        Paid Campaigns
                    </button>
                </div>
            </div>

            {campaignType === "gifted" ? (
                <GiftedCampaignsContent />
            ) : (
                <PaidCollaborationsContent />
            )}
        </div>
    );
};

export default BrandLandingPage;
