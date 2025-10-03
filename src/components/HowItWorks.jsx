import React, { useState, useEffect } from "react";

const HowItWorks = () => {
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
            title: "Launch Your Campaign",
            description:
                "Any industry welcome. From physical products to digital services, Matchably works with it all.",
            videoSrc: "/videos/brandvideo7.mp4",
            gradient: "from-blue-500 to-purple-600",
            bgColor: "bg-blue-500/10",
        },
        {
            step: "2",
            icon: "📝",
            title: "Get Creator Applications",
            description:
                "You'll receive an average of 15+ creator applications — fully handled by our team.",
            videoSrc: "/videos/brandvideo8.mp4",
            gradient: "from-green-500 to-emerald-600",
            bgColor: "bg-green-500/10",
        },
        {
            step: "3",
            icon: "⚡",
            title: "Receive UGC in ~13 Days",
            description:
                "Get authentic, ad-ready content from real creators — delivered fast.",
            videoSrc: "/videos/brandvideo9.mp4",
            gradient: "from-purple-500 to-pink-600",
            bgColor: "bg-purple-500/10",
        },
    ];

    return (
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
                    <p className="text-lime-500 text-lg FontNoto max-w-2xl mx-auto font-semibold drop-shadow-[0_0_6px_rgba(132,204,22,0.4)]">
                        Three simple steps to get authentic UGC content for your
                        brand
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Video Demo */}
                    <div
                        className={`transition-all duration-1000 delay-300 ${
                            isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-10"
                        }`}
                    >
                        <div className="relative aspect-[9/16] max-w-[350px] mx-auto">
                            {/* Glowing border effect */}
                            <div
                                className={`absolute -inset-1 bg-gradient-to-r ${steps[activeStep].gradient} rounded-2xl opacity-30 blur-sm`}
                            ></div>

                            <div className="relative bg-black rounded-2xl overflow-hidden">
                                <video
                                    key={activeStep}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source
                                        src={steps[activeStep].videoSrc}
                                        type="video/mp4"
                                    />
                                </video>

                                {/* Video overlay */}
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                            <p className="text-white text-sm font-semibold">
                                                Step {steps[activeStep].step}{" "}
                                                Demo
                                            </p>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Step indicator */}
                                {/* <div className="absolute top-4 left-4">
                                    <div
                                        className={`bg-gradient-to-r ${steps[activeStep].gradient} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                                    >
                                        Step {steps[activeStep].step}
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Steps */}
                    <div className="space-y-6">
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
                                    className={`relative group cursor-pointer transition-all duration-500 ${
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
                                        className={`relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
                                            step.bgColor
                                        } ${
                                            activeStep === index
                                                ? "border-lime-400/50 shadow-2xl"
                                                : "border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Step Number Badge */}
                                            <div
                                                className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${step.gradient} text-white rounded-full flex items-center justify-center font-bold text-lg FontNoto shadow-lg`}
                                            >
                                                {step.step}
                                            </div>

                                            <div className="flex-1">
                                                {/* Icon and Title */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                                        {step.icon}
                                                    </div>
                                                    <h3 className="text-white text-lg md:text-xl font-bold FontNoto leading-tight">
                                                        {step.title}
                                                    </h3>
                                                </div>

                                                {/* Description */}
                                                <p className="text-gray-300 text-sm md:text-base FontNoto leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>

                                            {/* Active indicator */}
                                            {activeStep === index && (
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className={`w-3 h-3 bg-gradient-to-r ${step.gradient} rounded-full animate-pulse`}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Connecting Line */}
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center mt-4 mb-2">
                                        <div className="w-1 h-6 bg-gradient-to-b from-lime-400/60 to-lime-400/20 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

