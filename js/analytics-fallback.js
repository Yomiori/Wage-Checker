/**
 * Emergency Fallback Analytics Implementation for SalaryCheck.us
 * Use this if ES6 modules are not working in production
 */

(function() {
    'use strict';
    
    // Initialize Vercel Analytics
    function initializeVercelAnalytics() {
        // Set up analytics queue
        window.va = window.va || function () {
            (window.vaq = window.vaq || []).push(arguments);
        };
        
        // Load Vercel insights script if not already loaded
        if (!document.querySelector('script[src*="_vercel/insights"]')) {
            const script = document.createElement('script');
            script.src = '/_vercel/insights/script.js';
            script.defer = true;
            script.onload = function() {
                console.log('✅ Vercel Analytics loaded successfully');
                trackPageView();
            };
            script.onerror = function() {
                console.error('❌ Failed to load Vercel Analytics script');
            };
            document.head.appendChild(script);
        } else {
            // Script already exists, just track page view
            trackPageView();
        }
    }
    
    // Track page view
    function trackPageView() {
        if (window.va) {
            window.va('track', 'pageview', {
                page: window.location.pathname,
                title: document.title,
                url: window.location.href,
                referrer: document.referrer,
                timestamp: new Date().toISOString(),
                fallback_method: true
            });
            console.log('📊 Page view tracked (fallback method)');
        }
    }
    
    // Track custom events
    function trackEvent(eventName, properties) {
        if (window.va) {
            window.va('track', eventName, {
                ...properties,
                timestamp: new Date().toISOString(),
                fallback_method: true
            });
            console.log('📊 Event tracked:', eventName, properties);
        }
    }
    
    // Track salary checker events
    function trackSalaryCheck(data) {
        trackEvent('salary_check', {
            action: 'form_submit',
            page: 'salary_checker',
            ...data
        });
    }
    
    // Track form submissions
    function trackFormSubmission(formType, data) {
        trackEvent('form_submission', {
            form_type: formType,
            ...data
        });
    }
    
    // Track navigation
    function trackNavigation(destination, data) {
        trackEvent('navigation', {
            destination: destination,
            source: window.location.pathname,
            ...data
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Track salary form submissions
        const salaryForm = document.getElementById('salaryForm');
        if (salaryForm) {
            salaryForm.addEventListener('submit', function() {
                trackSalaryCheck({
                    page: 'homepage',
                    form_type: 'salary_checker'
                });
            });
        }
        
        // Track contact form submissions
        const contactForm = document.querySelector('form[name="contact"]');
        if (contactForm) {
            contactForm.addEventListener('submit', function() {
                trackFormSubmission('contact', {
                    page: 'contact'
                });
            });
        }
        
        // Track navigation clicks
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('#')) {
                trackNavigation(link.href, {
                    link_text: link.textContent.trim(),
                    link_type: 'navigation'
                });
            }
        });
        
        // Track button clicks
        document.addEventListener('click', function(e) {
            const button = e.target.closest('button');
            if (button) {
                trackEvent('button_click', {
                    button_text: button.textContent.trim(),
                    button_id: button.id || 'unknown',
                    page: window.location.pathname
                });
            }
        });
    }
    
    // Initialize everything
    function initialize() {
        console.log('🔄 Initializing fallback analytics...');
        initializeVercelAnalytics();
        setupEventListeners();
        
        // Make functions available globally
        window.AnalyticsFallback = {
            trackEvent: trackEvent,
            trackSalaryCheck: trackSalaryCheck,
            trackFormSubmission: trackFormSubmission,
            trackNavigation: trackNavigation
        };
        
        console.log('✅ Fallback analytics initialized');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();
