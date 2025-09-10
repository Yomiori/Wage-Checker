/**
 * Modern ES6 Vercel Analytics Module for SalaryCheck.us
 * Implements Vercel Analytics with ES6 import-like functionality
 */

// Vercel Analytics injection function (equivalent to import { inject } from "@vercel/analytics")
function injectVercelAnalytics() {
  // Create and inject the Vercel Analytics script
  if (!document.querySelector('script[src*="_vercel/insights"]')) {
    const script = document.createElement('script');
    script.src = '/_vercel/insights/script.js';
    script.defer = true;
    document.head.appendChild(script);
  }

  // Initialize the analytics queue
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  return {
    track: (event, properties) => {
      if (window.va) {
        window.va('track', event, properties);
      }
    },
    identify: (userId, properties) => {
      if (window.va) {
        window.va('identify', userId, properties);
      }
    }
  };
}

// Analytics module with modern syntax
class VercelAnalyticsModule {
  constructor() {
    this.analytics = null;
    this.isInitialized = false;
  }

  // Initialize analytics (equivalent to inject())
  async inject() {
    if (this.isInitialized) return this.analytics;

    try {
      this.analytics = injectVercelAnalytics();
      this.isInitialized = true;
      
      // Track initial page view
      this.trackPageView();
      
      console.log('✅ Vercel Analytics initialized successfully');
      return this.analytics;
    } catch (error) {
      console.error('❌ Failed to initialize Vercel Analytics:', error);
      return null;
    }
  }

  // Track page views
  trackPageView() {
    if (this.analytics) {
      this.analytics.track('pageview', {
        page: window.location.pathname,
        title: document.title,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Track custom events
  track(eventName, properties = {}) {
    if (this.analytics) {
      this.analytics.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Track salary checker events
  trackSalaryCheck(data = {}) {
    this.track('salary_check', {
      action: 'form_submit',
      ...data
    });
  }

  // Track form submissions
  trackFormSubmission(formType, data = {}) {
    this.track('form_submission', {
      form_type: formType,
      ...data
    });
  }

  // Track user interactions
  trackInteraction(type, data = {}) {
    this.track('user_interaction', {
      interaction_type: type,
      ...data
    });
  }

  // Track navigation
  trackNavigation(destination, data = {}) {
    this.track('navigation', {
      destination: destination,
      source: window.location.pathname,
      ...data
    });
  }
}

// Create singleton instance
const vercelAnalytics = new VercelAnalyticsModule();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    vercelAnalytics.inject();
  });
} else {
  vercelAnalytics.inject();
}

// Export for use in other modules
export { vercelAnalytics as analytics };
export { injectVercelAnalytics as inject };

// Also make available globally for non-module scripts
window.VercelAnalytics = vercelAnalytics;
