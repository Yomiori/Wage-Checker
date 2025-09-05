// Production Configuration
// This file contains production settings that will be used when deploying

const CONFIG = {
    // Environment
    environment: 'production', // Change to 'development' for local testing
    
    // API Configuration (Not needed for mock data deployment)
    apis: {
        bls: {
            apiKey: null, // No API key needed for mock data
            baseUrl: 'https://api.bls.gov/publicAPI/v2/timeseries/data/',
            rateLimit: 500
        }
    },
    
    // Google AdSense Configuration
    adsense: {
        publisherId: 'ca-pub-YOUR_PUBLISHER_ID_HERE', // Replace after AdSense approval
        adSlots: {
            header: 'YOUR_HEADER_SLOT_ID',
            sidebar: 'YOUR_SIDEBAR_SLOT_ID',
            bottom: 'YOUR_BOTTOM_SLOT_ID'
        },
        enabled: true // Enable after getting AdSense approval
    },
    
    // Analytics Configuration
    analytics: {
        // Google Analytics 4 Measurement ID (optional)
        googleAnalyticsId: process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
        enabled: true
    },
    
    // Site Configuration
    site: {
        name: 'Am I Underpaid?',
        description: 'Compare your salary with government data to determine if you\'re underpaid',
        url: 'https://localhost:3000', // Will be updated after deployment
        author: 'Underpaid Checker Team',
        keywords: ['salary', 'comparison', 'underpaid', 'wages', 'government-data', 'career']
    },
    
    // Feature Flags
    features: {
        enableMockData: true, // Using high-quality mock data (no API key needed)
        enableAdBlockerDetection: true,
        enableJobTitleSuggestions: true,
        enableSalaryValidation: true
    },
    
    // Performance Settings
    performance: {
        enableCaching: true,
        cacheTimeout: 3600000, // 1 hour in milliseconds
        enableCompression: true
    },
    
    // Security Settings
    security: {
        enableCSP: true, // Content Security Policy
        enableHTTPS: true,
        enableCORS: false // Not needed for static site
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

// Helper function to get configuration values
function getConfig(path) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    
    return value;
}

// Make helper available globally
if (typeof window !== 'undefined') {
    window.getConfig = getConfig;
}

// Environment-specific overrides
if (CONFIG.environment === 'development') {
    // Development overrides
    CONFIG.features.enableMockData = true;
    CONFIG.adsense.enabled = false; // Disable ads in development
    CONFIG.analytics.enabled = false;
}

// Validation function to check if all required config is set
function validateConfig() {
    const errors = [];
    
    if (CONFIG.environment === 'production') {
        if (!CONFIG.apis.bls.apiKey || CONFIG.apis.bls.apiKey === 'YOUR_BLS_API_KEY_HERE') {
            errors.push('BLS API key is not configured');
        }
        
        if (!CONFIG.adsense.publisherId || CONFIG.adsense.publisherId === 'ca-pub-XXXXXXXXXXXXXXXXX') {
            errors.push('Google AdSense Publisher ID is not configured');
        }
        
        if (!CONFIG.site.url || CONFIG.site.url === 'https://your-domain.com') {
            errors.push('Site URL is not configured');
        }
    }
    
    return errors;
}

// Auto-validate on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        const errors = validateConfig();
        if (errors.length > 0) {
            console.warn('Configuration issues found:', errors);
        }
    });
}

// Export validation function
if (typeof window !== 'undefined') {
    window.validateConfig = validateConfig;
}
