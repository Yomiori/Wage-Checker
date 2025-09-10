/**
 * Simple Vercel Analytics Module for Static Pages
 * Lightweight implementation for about, contact, methodology, privacy pages
 */

// Simple analytics injection (equivalent to import { inject } from "@vercel/analytics")
async function injectAnalytics() {
  // Inject Vercel Analytics script
  if (!document.querySelector('script[src*="_vercel/insights"]')) {
    const script = document.createElement('script');
    script.src = '/_vercel/insights/script.js';
    script.defer = true;
    document.head.appendChild(script);
  }

  // Initialize analytics queue
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  // Track page view
  if (window.va) {
    window.va('track', 'pageview', {
      page: window.location.pathname,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }

  return true;
}

// Auto-inject analytics
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectAnalytics);
} else {
  injectAnalytics();
}

// Export for module usage
export { injectAnalytics as inject };
