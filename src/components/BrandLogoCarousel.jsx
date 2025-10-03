import React, { useState, useEffect } from 'react';

const BrandLogoCarousel = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('brand-logos');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const brands = [
    {
      name: 'Ivoskin',
      logo: '/ivoskin.png',
      size: 'normal' 
    },
    {
      name: 'Hersteller',
      logo: '/hersteller.png',
      size: 'large' 
    },
    {
      name: 'EVERDAZE',
      logo: '/everydaze.png',
      size: 'large' 
    },
    {
      name: 'INERTIA',
      logo: '/inertia.png',
      size: 'normal' 
    },
    {
      name: 'Judydoll',
      logo: '/judydoll.png.webp',
      size: 'large' 
    },
    {
      name: 'Terre-D',
      logo: '/terre.d.png',
      size: 'large' 
    },
    {
      name: 'Aromang',
      logo: '/aromang.png',
      size: 'large' 
    },
    {
      name: 'COLORKEY',
      logo: '/colurkey.jpg.png',
      size: 'large' 
    },
    {
      name: 'Biodance',
      logo: '/biodance.png',
      size: 'large' 
    },
    {
      name: 'Dr.Ato',
      logo: '/DrAto.webp',
      size: 'normal' 
    },
    {
      name: 'Neogen',
      logo: '/neogen.png',
      size: 'large' 
    },
    {
      name: 'MIMU MIMU',
      logo: '/mimumimu.png',
      size: 'large' 
    },
    {
      name: 'Nature Republic',
      logo: '/nature.png',
      size: 'large' 
    },
    {
      name: 'Wellogy',
      logo: '/KakaoTalk.jpeg',
      size: 'large' 
    },
    {
      name: 'Senka',
      logo: '/senka.png',
      size: 'large' 
    }
  ];

  // Triple brands for seamless infinite scroll without gaps
  const duplicatedBrands = [...brands, ...brands, ...brands];

  // Function to get logo sizing based on brand size property
  const getLogoSizing = (brand) => {
    switch (brand.size) {
      case 'large':
        return {
          width: '120px',  // Larger width for smaller logos
          height: '120px', // Larger height for smaller logos
          maxWidth: '120px',
          maxHeight: '120px'
        };
      case 'normal':
      default:
        return {
          width: '100px',  // Standard size (Ivoskin reference)
          height: '100px',
          maxWidth: '100px',
          maxHeight: '100px'
        };
    }
  };

  return (
    <section id="brand-logos" className="w-full bg-[var(--background)] py-16 px-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-[20px] md:text-[28px] FontNoto leading-tight mb-4 relative">
            <span className="text-lime-400 font-semibold drop-shadow-[0_0_8px_rgba(132,204,22,0.6)]">
              Trusted by brands of all types — from household names to emerging startups
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-lime-400/0 via-lime-400/60 to-lime-400/0 rounded-full"></div>
          </h2>
          <h3 className="text-[24px] md:text-[32px] FontNoto font-bold leading-tight mt-6">
            <span className="text-[#E0FFFA] drop-shadow-[0_0_12px_rgba(224,255,250,0.8)]">
              They don't just trust us. <span className="text-[#7EFCD8]">They grow with us.</span>
            </span>
          </h3>
        </div>

        {/* Logo Carousel Container */}
        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {/* Enhanced gradient overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[var(--background)] via-[var(--background)]/80 to-transparent z-10"></div>

          {/* Scrolling container - Compact to fit all 15 logos */}
          <div className="brand-logo-carousel-wrapper overflow-hidden">
            <div className="logo-carousel-track flex items-center gap-6 brand-logo-animate-scroll" style={{width: 'max-content'}}>
              {duplicatedBrands.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 flex flex-col items-center group cursor-pointer focus-within:outline-none"
                  tabIndex="0"
                  role="button"
                  aria-label={`${brand.name} brand logo`}
                >
                  {/* Logo container - Wider for better visibility */}
                  <div className="relative focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black rounded-lg">
                    <div className="relative w-[150px] h-[180px] bg-transparent flex items-center justify-center p-4 transition-all duration-300 group-hover:scale-105 group-focus:scale-105">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="object-contain transition-all duration-300 filter-none group-hover:grayscale group-focus:grayscale"
                        style={{
                          ...getLogoSizing(brand),
                          filter: brand.removeBackground
                            ? 'brightness(0) invert(1)' // Remove background and make white
                            : brand.whiteText
                            ? 'brightness(0) invert(1)' // Make text white
                            : 'none',
                          mixBlendMode: brand.removeBackground || brand.whiteText ? 'screen' : 'normal'
                        }}
                        onError={(e) => {
                          console.log(`Failed to load logo: ${brand.name} - ${brand.logo}`);
                          // Enhanced fallback system with cache busting
                          if (!e.target.dataset.fallbackAttempted) {
                            e.target.dataset.fallbackAttempted = 'true';
                            // Try with cache busting first
                            const cacheBuster = `?v=${Date.now()}`;
                            e.target.src = brand.logo + cacheBuster;
                          } else if (!e.target.dataset.secondFallback) {
                            e.target.dataset.secondFallback = 'true';
                            // Try alternative path
                            const altPath = brand.logo.includes('/assets/')
                              ? brand.logo.replace('/assets/brandlogos/', '/')
                              : `/assets/brandlogos/${brand.name.toLowerCase().replace(/\s+/g, '')}.png`;
                            e.target.src = altPath;
                          } else {
                            // Final fallback to clean placeholder
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=180&background=000000&color=ffffff&format=png&rounded=false&bold=true`;
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Brand name label - Bold */}
                  <div className="mt-2 text-center">
                    <p className="text-[#9CA3AF] text-[10px] FontNoto font-bold">
                      {brand.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>




      </div>

      {/* Enhanced CSS for animations */}
      <style>{`
        @keyframes brandLogoScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .brand-logo-animate-scroll {
          animation: brandLogoScroll 18s linear infinite;
        }

        .brand-logo-animate-scroll:hover {
          animation-play-state: paused;
        }

        .brand-logo-carousel-wrapper {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        /* Mobile adjustments - slower scroll with swipe support */
        @media (max-width: 768px) {
          .brand-logo-animate-scroll {
            animation-duration: 20s;
          }

          .brand-logo-carousel-wrapper {
            touch-action: pan-x;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Accessibility - Focus ring for keyboard navigation */
        .group:focus {
          outline: 2px solid #84cc16;
          outline-offset: 4px;
          border-radius: 12px;
        }

        /* Performance optimization */
        .brand-logo-animate-scroll {
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default BrandLogoCarousel;
