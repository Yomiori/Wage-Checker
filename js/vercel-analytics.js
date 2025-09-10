/**
 * Vercel Analytics Configuration for SalaryCheck.us
 * Enhanced tracking for salary checker website
 */

(function() {
    'use strict';
    
    // Vercel Analytics Enhanced Configuration
    const VercelAnalytics = {
        
        // Initialize enhanced tracking
        init: function() {
            this.trackPageViews();
            this.trackSalaryChecks();
            this.trackUserInteractions();
            this.trackFormSubmissions();
        },
        
        // Track page views with custom data
        trackPageViews: function() {
            if (typeof window.va !== 'undefined') {
                // Track page view with additional context
                window.va('track', 'pageview', {
                    page: window.location.pathname,
                    title: document.title,
                    referrer: document.referrer,
                    timestamp: new Date().toISOString()
                });
            }
        },
        
        // Track salary checker usage
        trackSalaryChecks: function() {
            // Track when salary form is submitted
            const salaryForm = document.getElementById('salaryForm');
            if (salaryForm) {
                salaryForm.addEventListener('submit', function(e) {
                    if (typeof window.va !== 'undefined') {
                        window.va('track', 'salary_check', {
                            action: 'form_submit',
                            page: 'salary_checker',
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }
            
            // Track salary results display
            const resultsContainer = document.getElementById('results');
            if (resultsContainer) {
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            if (typeof window.va !== 'undefined') {
                                window.va('track', 'salary_results', {
                                    action: 'results_displayed',
                                    page: 'salary_checker',
                                    timestamp: new Date().toISOString()
                                });
                            }
                        }
                    });
                });
                
                observer.observe(resultsContainer, {
                    childList: true,
                    subtree: true
                });
            }
        },
        
        // Track user interactions
        trackUserInteractions: function() {
            // Track navigation clicks
            document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && typeof window.va !== 'undefined') {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        window.va('track', 'navigation', {
                            action: 'link_click',
                            destination: href,
                            text: link.textContent.trim(),
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            });
            
            // Track button clicks
            document.addEventListener('click', function(e) {
                const button = e.target.closest('button');
                if (button && typeof window.va !== 'undefined') {
                    window.va('track', 'interaction', {
                        action: 'button_click',
                        button_text: button.textContent.trim(),
                        button_id: button.id || 'unknown',
                        timestamp: new Date().toISOString()
                    });
                }
            });
        },
        
        // Track form submissions
        trackFormSubmissions: function() {
            // Track contact form submissions
            const contactForm = document.querySelector('form[name="contact"]');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    if (typeof window.va !== 'undefined') {
                        window.va('track', 'contact', {
                            action: 'form_submit',
                            form_type: 'contact',
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }
            
            // Track newsletter signups (if any)
            const emailInputs = document.querySelectorAll('input[type="email"]');
            emailInputs.forEach(function(input) {
                const form = input.closest('form');
                if (form) {
                    form.addEventListener('submit', function(e) {
                        if (typeof window.va !== 'undefined') {
                            window.va('track', 'email_signup', {
                                action: 'form_submit',
                                form_type: 'email_collection',
                                timestamp: new Date().toISOString()
                            });
                        }
                    });
                }
            });
        },
        
        // Track custom events
        trackCustomEvent: function(eventName, eventData) {
            if (typeof window.va !== 'undefined') {
                window.va('track', eventName, {
                    ...eventData,
                    timestamp: new Date().toISOString()
                });
            }
        },
        
        // Track performance metrics
        trackPerformance: function() {
            if (typeof window.va !== 'undefined' && 'performance' in window) {
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        if (perfData) {
                            window.va('track', 'performance', {
                                action: 'page_load',
                                load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                                dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                                timestamp: new Date().toISOString()
                            });
                        }
                    }, 1000);
                });
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            VercelAnalytics.init();
            VercelAnalytics.trackPerformance();
        });
    } else {
        VercelAnalytics.init();
        VercelAnalytics.trackPerformance();
    }
    
    // Make available globally for custom tracking
    window.VercelAnalytics = VercelAnalytics;
    
})();
