/**
 * Performance optimization utilities for the PawCare platform
 */

/**
 * Preload critical routes for faster navigation
 */
export const preloadRoutes = () => {
  if (typeof window !== 'undefined') {
    const criticalRoutes = [
      '/doctors',
      '/appointments',
      '/pricing',
      '/sign-up'
    ];

    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImages = () => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
};

/**
 * Debounce function for optimizing event handlers
 */
export const debounce = (func, wait) => {
  if (typeof func !== 'function') {
    console.warn('debounce: func is not a function', func);
    return () => { };
  }
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll events
 */
export const throttle = (func, limit) => {
  if (typeof func !== 'function') {
    console.warn('throttle: func is not a function', func);
    return () => { };
  }
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get optimized animation config based on user preferences
 */
export const getAnimationConfig = (config) => {
  if (prefersReducedMotion()) {
    return {
      ...config,
      duration: 0,
      delay: 0,
    };
  }
  return config;
};

/**
 * Preconnect to external domains
 */
export const preconnectDomains = () => {
  if (typeof window !== 'undefined') {
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
};
