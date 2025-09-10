/**
 * Vercel Analytics Verification Script for SalaryCheck.us
 * Run this in browser console to verify analytics functionality
 */

(function() {
    'use strict';
    
    console.log('🔍 Starting Vercel Analytics Verification...');
    
    // Test 1: Check if window.va is available
    function testAnalyticsAvailability() {
        console.log('\n📊 Test 1: Analytics Availability');
        
        if (typeof window.va === 'function') {
            console.log('✅ window.va function is available');
            return true;
        } else {
            console.log('❌ window.va function is NOT available');
            console.log('   Current type:', typeof window.va);
            return false;
        }
    }
    
    // Test 2: Check analytics queue
    function testAnalyticsQueue() {
        console.log('\n📋 Test 2: Analytics Queue');
        
        if (window.vaq && Array.isArray(window.vaq)) {
            console.log('✅ Analytics queue exists');
            console.log('   Queue length:', window.vaq.length);
            return true;
        } else {
            console.log('❌ Analytics queue not found');
            return false;
        }
    }
    
    // Test 3: Check Vercel script loading
    function testVercelScript() {
        console.log('\n🌐 Test 3: Vercel Script Loading');
        
        const vercelScript = document.querySelector('script[src*="_vercel/insights"]');
        if (vercelScript) {
            console.log('✅ Vercel insights script found in DOM');
            console.log('   Script src:', vercelScript.src);
            return true;
        } else {
            console.log('❌ Vercel insights script NOT found in DOM');
            return false;
        }
    }
    
    // Test 4: Test network connectivity to Vercel Analytics
    async function testNetworkConnectivity() {
        console.log('\n🌍 Test 4: Network Connectivity');
        
        try {
            const response = await fetch('/_vercel/insights/script.js', { method: 'HEAD' });
            if (response.ok) {
                console.log('✅ Vercel Analytics script accessible');
                console.log('   Status:', response.status);
                return true;
            } else {
                console.log('❌ Vercel Analytics script not accessible');
                console.log('   Status:', response.status);
                return false;
            }
        } catch (error) {
            console.log('❌ Network error accessing Vercel Analytics');
            console.log('   Error:', error.message);
            return false;
        }
    }
    
    // Test 5: Test event tracking
    function testEventTracking() {
        console.log('\n🎯 Test 5: Event Tracking');
        
        if (typeof window.va === 'function') {
            try {
                window.va('track', 'verification_test', {
                    test_type: 'manual_verification',
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname
                });
                console.log('✅ Test event sent successfully');
                return true;
            } catch (error) {
                console.log('❌ Error sending test event');
                console.log('   Error:', error.message);
                return false;
            }
        } else {
            console.log('❌ Cannot test event tracking - window.va not available');
            return false;
        }
    }
    
    // Test 6: Check fallback analytics
    function testFallbackAnalytics() {
        console.log('\n🔄 Test 6: Fallback Analytics');
        
        if (window.AnalyticsFallback) {
            console.log('✅ Fallback analytics available');
            console.log('   Available methods:', Object.keys(window.AnalyticsFallback));
            return true;
        } else {
            console.log('⚠️  Fallback analytics not loaded yet');
            return false;
        }
    }
    
    // Test 7: Test custom tracking functions
    function testCustomTracking() {
        console.log('\n🎨 Test 7: Custom Tracking Functions');
        
        let passed = 0;
        let total = 0;
        
        // Test salary check tracking
        total++;
        if (window.AnalyticsFallback && typeof window.AnalyticsFallback.trackSalaryCheck === 'function') {
            console.log('✅ trackSalaryCheck function available');
            passed++;
        } else {
            console.log('❌ trackSalaryCheck function not available');
        }
        
        // Test form submission tracking
        total++;
        if (window.AnalyticsFallback && typeof window.AnalyticsFallback.trackFormSubmission === 'function') {
            console.log('✅ trackFormSubmission function available');
            passed++;
        } else {
            console.log('❌ trackFormSubmission function not available');
        }
        
        // Test navigation tracking
        total++;
        if (window.AnalyticsFallback && typeof window.AnalyticsFallback.trackNavigation === 'function') {
            console.log('✅ trackNavigation function available');
            passed++;
        } else {
            console.log('❌ trackNavigation function not available');
        }
        
        console.log(`   Custom tracking: ${passed}/${total} functions available`);
        return passed === total;
    }
    
    // Run all tests
    async function runAllTests() {
        console.log('🚀 Running Comprehensive Analytics Verification\n');
        
        const results = {
            analyticsAvailable: testAnalyticsAvailability(),
            queueExists: testAnalyticsQueue(),
            scriptLoaded: testVercelScript(),
            networkConnected: await testNetworkConnectivity(),
            eventTracking: testEventTracking(),
            fallbackAnalytics: testFallbackAnalytics(),
            customTracking: testCustomTracking()
        };
        
        // Summary
        console.log('\n📊 VERIFICATION SUMMARY');
        console.log('========================');
        
        const passed = Object.values(results).filter(Boolean).length;
        const total = Object.keys(results).length;
        
        Object.entries(results).forEach(([test, result]) => {
            const status = result ? '✅' : '❌';
            const testName = test.replace(/([A-Z])/g, ' $1').toLowerCase();
            console.log(`${status} ${testName}`);
        });
        
        console.log(`\n🎯 Overall Score: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            console.log('🎉 ALL TESTS PASSED! Analytics is working correctly.');
        } else if (passed >= total - 2) {
            console.log('⚠️  Most tests passed. Minor issues detected.');
        } else {
            console.log('❌ Multiple issues detected. Check Vercel Analytics settings.');
        }
        
        // Recommendations
        console.log('\n💡 RECOMMENDATIONS');
        console.log('==================');
        
        if (!results.analyticsAvailable) {
            console.log('• Enable Analytics in Vercel project dashboard');
            console.log('• Check if analytics script is loading properly');
        }
        
        if (!results.networkConnected) {
            console.log('• Verify Analytics is enabled in Vercel dashboard');
            console.log('• Check if /_vercel/insights/script.js returns 200 status');
        }
        
        if (!results.fallbackAnalytics) {
            console.log('• Wait for analytics-fallback.js to load completely');
            console.log('• Check browser console for loading errors');
        }
        
        console.log('\n🔗 Next Steps:');
        console.log('• Visit Vercel dashboard to enable Analytics if needed');
        console.log('• Monitor analytics data (appears in 24-48 hours)');
        console.log('• Test salary checker and form submissions');
        
        return results;
    }
    
    // Auto-run tests when script loads
    setTimeout(runAllTests, 2000);
    
    // Make verification function available globally
    window.verifyAnalytics = runAllTests;
    
    console.log('💡 Run verifyAnalytics() anytime to re-test analytics functionality');
    
})();
