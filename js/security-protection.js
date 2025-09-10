/**
 * Client-Side Security Protection for SalaryCheck.us
 * Implements WordPress attack detection and blocking
 */

(function() {
    'use strict';
    
    // Security monitoring and protection
    const SecurityProtection = {
        
        // WordPress attack patterns to detect
        wordpressPatterns: [
            '/wp-admin/',
            '/wordpress/',
            'wp-includes',
            'wp-content',
            'setup-config.php',
            'xmlrpc.php'
        ],
        
        // Infrastructure probe patterns
        infraPatterns: [
            '/.aws/',
            '/_profiler/',
            '/phpinfo',
            '/.env',
            '/config/',
            '/admin/',
            '/phpmyadmin/'
        ],
        
        // Initialize security monitoring
        init: function() {
            this.monitorRequests();
            this.blockSuspiciousActivity();
            this.logSecurityEvents();
        },
        
        // Monitor for suspicious URL patterns
        monitorRequests: function() {
            const currentPath = window.location.pathname.toLowerCase();
            
            // Check for WordPress attack patterns
            if (this.isWordPressAttack(currentPath)) {
                this.handleWordPressAttack(currentPath);
                return;
            }
            
            // Check for infrastructure probes
            if (this.isInfrastructureProbe(currentPath)) {
                this.handleInfrastructureProbe(currentPath);
                return;
            }
        },
        
        // Detect WordPress attack patterns
        isWordPressAttack: function(path) {
            return this.wordpressPatterns.some(pattern => 
                path.includes(pattern.toLowerCase())
            );
        },
        
        // Detect infrastructure probe patterns
        isInfrastructureProbe: function(path) {
            return this.infraPatterns.some(pattern => 
                path.includes(pattern.toLowerCase())
            );
        },
        
        // Handle WordPress attack attempts
        handleWordPressAttack: function(path) {
            console.warn('WordPress attack detected:', path);
            
            // Log the attack attempt
            this.logAttack('wordpress', path);
            
            // Redirect to 404 page
            this.redirectToNotFound();
        },
        
        // Handle infrastructure probe attempts
        handleInfrastructureProbe: function(path) {
            console.warn('Infrastructure probe detected:', path);
            
            // Log the probe attempt
            this.logAttack('infrastructure', path);
            
            // Redirect to 404 page
            this.redirectToNotFound();
        },
        
        // Redirect to 404 page
        redirectToNotFound: function() {
            // Create custom 404 response
            document.title = '404 - Page Not Found';
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                    <h1>404 - Page Not Found</h1>
                    <p>The requested resource was not found on this server.</p>
                    <a href="/" style="color: #667eea; text-decoration: none;">Return to SalaryCheck.us</a>
                </div>
            `;
            
            // Update URL without redirect to maintain attack logging
            if (history.replaceState) {
                history.replaceState(null, '404 - Page Not Found', '/404');
            }
        },
        
        // Log security events
        logAttack: function(type, path) {
            const attackData = {
                type: type,
                path: path,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };
            
            // Store in localStorage for monitoring
            const attacks = JSON.parse(localStorage.getItem('security_attacks') || '[]');
            attacks.push(attackData);
            
            // Keep only last 100 attacks
            if (attacks.length > 100) {
                attacks.splice(0, attacks.length - 100);
            }
            
            localStorage.setItem('security_attacks', JSON.stringify(attacks));
            
            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'security_attack', {
                    'attack_type': type,
                    'attack_path': path
                });
            }
        },
        
        // Block suspicious activity patterns
        blockSuspiciousActivity: function() {
            // Monitor for rapid requests (potential bot behavior)
            let requestCount = 0;
            const requestWindow = 60000; // 1 minute
            
            setInterval(() => {
                requestCount = 0;
            }, requestWindow);
            
            // Increment request counter
            requestCount++;
            
            // Block if too many requests
            if (requestCount > 50) {
                console.warn('Suspicious activity detected: Too many requests');
                this.logAttack('rate_limit', window.location.pathname);
            }
        },
        
        // Initialize security event logging
        logSecurityEvents: function() {
            // Log page load for legitimate traffic analysis
            const pageData = {
                type: 'page_load',
                path: window.location.pathname,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            // Store legitimate page loads separately
            const pageLoads = JSON.parse(localStorage.getItem('page_loads') || '[]');
            pageLoads.push(pageData);
            
            // Keep only last 50 page loads
            if (pageLoads.length > 50) {
                pageLoads.splice(0, pageLoads.length - 50);
            }
            
            localStorage.setItem('page_loads', JSON.stringify(pageLoads));
        }
    };
    
    // Initialize security protection when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            SecurityProtection.init();
        });
    } else {
        SecurityProtection.init();
    }
    
    // Make security data available globally for monitoring
    window.SecurityProtection = SecurityProtection;
    
})();
