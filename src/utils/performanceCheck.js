// Performance and Accessibility Utilities
// This file contains utilities to check LCP performance and WCAG AA contrast compliance

/**
 * Check Largest Contentful Paint (LCP) performance
 * Target: LCP < 2.5 seconds for good performance
 */
export const checkLCP = () => {
  if (typeof window === 'undefined') return;

  // Use PerformanceObserver to measure LCP
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    console.log('🚀 LCP Performance Check:');
    console.log(`LCP Time: ${lastEntry.startTime.toFixed(2)}ms`);
    
    if (lastEntry.startTime < 2500) {
      console.log('✅ LCP Performance: GOOD (< 2.5s)');
    } else if (lastEntry.startTime < 4000) {
      console.log('⚠️ LCP Performance: NEEDS IMPROVEMENT (2.5s - 4s)');
    } else {
      console.log('❌ LCP Performance: POOR (> 4s)');
    }
  });

  observer.observe({ entryTypes: ['largest-contentful-paint'] });

  // Cleanup after 10 seconds
  setTimeout(() => {
    observer.disconnect();
  }, 10000);
};

/**
 * Check WCAG AA contrast compliance
 * WCAG AA requires a contrast ratio of at least 4.5:1 for normal text
 * and 3:1 for large text (18pt+ or 14pt+ bold)
 */
export const checkContrastCompliance = () => {
  if (typeof window === 'undefined') return;

  console.log('🎨 WCAG AA Contrast Compliance Check:');

  // Helper function to calculate luminance
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Helper function to calculate contrast ratio
  const getContrastRatio = (color1, color2) => {
    const lum1 = getLuminance(...color1);
    const lum2 = getLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Test key color combinations used in the Hero section
  const colorTests = [
    {
      name: 'White text on black/50% backdrop',
      foreground: [255, 255, 255], // white
      background: [0, 0, 0], // black (50% opacity backdrop)
      isLargeText: false
    },
    {
      name: 'White text on lime-500 button',
      foreground: [255, 255, 255], // white
      background: [132, 204, 22], // lime-500
      isLargeText: true // buttons are typically larger text
    },
    {
      name: 'Lime-400 accent on black background',
      foreground: [163, 230, 53], // lime-400
      background: [0, 0, 0], // black
      isLargeText: false
    }
  ];

  colorTests.forEach(test => {
    const ratio = getContrastRatio(test.foreground, test.background);
    const requiredRatio = test.isLargeText ? 3.0 : 4.5;
    const passes = ratio >= requiredRatio;
    
    console.log(`${passes ? '✅' : '❌'} ${test.name}: ${ratio.toFixed(2)}:1 (Required: ${requiredRatio}:1)`);
  });
};

/**
 * Initialize performance and accessibility checks
 */
export const initPerformanceChecks = () => {
  // Run checks after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        checkLCP();
        checkContrastCompliance();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      checkLCP();
      checkContrastCompliance();
    }, 1000);
  }
};

// Auto-initialize in development mode
if (process.env.NODE_ENV === 'development') {
  initPerformanceChecks();
}
