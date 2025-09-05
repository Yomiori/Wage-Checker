// Analytics and Tracking
class Analytics {
    constructor() {
        this.config = window.CONFIG || {};
        this.enabled = this.config.analytics?.enabled || false;
        this.gaId = this.config.analytics?.googleAnalyticsId;
        
        if (this.enabled && this.gaId && this.gaId !== 'G-XXXXXXXXXX') {
            this.initGoogleAnalytics();
        }
        
        this.setupEventTracking();
    }

    initGoogleAnalytics() {
        // Load Google Analytics 4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.gaId, {
            page_title: document.title,
            page_location: window.location.href
        });

        // Make gtag available globally
        window.gtag = gtag;
    }

    setupEventTracking() {
        // Track salary checks
        document.addEventListener('salaryCheckCompleted', (event) => {
            this.trackEvent('salary_check', {
                job_title: event.detail.jobTitle,
                location: event.detail.location,
                experience_level: event.detail.experienceLevel,
                is_underpaid: event.detail.isUnderpaid,
                percentile: event.detail.percentile
            });
        });

        // Track form interactions
        const form = document.getElementById('salaryForm');
        if (form) {
            form.addEventListener('submit', () => {
                this.trackEvent('form_submit', {
                    form_name: 'salary_comparison'
                });
            });
        }

        // Track page views
        this.trackPageView();
    }

    trackEvent(eventName, parameters = {}) {
        if (!this.enabled) return;

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Console logging for development
        if (this.config.environment === 'development') {
            console.log('Analytics Event:', eventName, parameters);
        }
    }

    trackPageView(pagePath = null) {
        if (!this.enabled) return;

        const path = pagePath || window.location.pathname;
        
        if (typeof gtag !== 'undefined') {
            gtag('config', this.gaId, {
                page_path: path,
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }

    trackTiming(name, value, category = 'Performance') {
        if (!this.enabled) return;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: name,
                value: value,
                event_category: category
            });
        }
    }

    trackError(error, context = '') {
        if (!this.enabled) return;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: error.message || error,
                fatal: false,
                context: context
            });
        }
    }

    // Custom events for salary checker
    trackSalaryCheck(jobTitle, salary, location, experienceLevel, result) {
        const event = new CustomEvent('salaryCheckCompleted', {
            detail: {
                jobTitle,
                salary,
                location,
                experienceLevel,
                isUnderpaid: result.isUnderpaid,
                percentile: result.percentile
            }
        });
        document.dispatchEvent(event);
    }

    trackAdClick(adSlot) {
        this.trackEvent('ad_click', {
            ad_slot: adSlot
        });
    }

    trackAPICall(apiName, success, responseTime) {
        this.trackEvent('api_call', {
            api_name: apiName,
            success: success,
            response_time: responseTime
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.analytics = null;
        this.startTime = performance.now();
        
        this.init();
    }

    init() {
        // Wait for analytics to be available
        setTimeout(() => {
            this.analytics = window.analytics;
            this.trackPageLoadTime();
            this.trackResourceTiming();
        }, 1000);
    }

    trackPageLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            
            if (this.analytics) {
                this.analytics.trackTiming('page_load', Math.round(loadTime));
            }
        });
    }

    trackResourceTiming() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.name.includes('.js') || resource.name.includes('.css')) {
                    const loadTime = resource.responseEnd - resource.requestStart;
                    
                    if (this.analytics && loadTime > 1000) { // Only track slow resources
                        this.analytics.trackTiming(
                            `resource_load_${resource.name.split('/').pop()}`,
                            Math.round(loadTime),
                            'Resource Loading'
                        );
                    }
                }
            });
        });
    }

    trackAPIResponseTime(apiName, startTime) {
        const responseTime = performance.now() - startTime;
        
        if (this.analytics) {
            this.analytics.trackTiming(
                `api_response_${apiName}`,
                Math.round(responseTime),
                'API Performance'
            );
        }
        
        return responseTime;
    }
}

// Error tracking
window.addEventListener('error', (event) => {
    if (window.analytics) {
        window.analytics.trackError(event.error, 'JavaScript Error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    if (window.analytics) {
        window.analytics.trackError(event.reason, 'Unhandled Promise Rejection');
    }
});

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new Analytics();
    window.performanceMonitor = new PerformanceMonitor();
});

// Export for use in other modules
window.Analytics = Analytics;
window.PerformanceMonitor = PerformanceMonitor;
