# 📊 Vercel Analytics Setup Guide for SalaryCheck.us

## 🎯 Complete Integration Checklist

### **✅ Current Status: Analytics Code Already Implemented**

Your SalaryCheck.us website already has comprehensive Vercel Analytics integration:
- ✅ Analytics tracking code on all HTML pages
- ✅ Custom event tracking for salary checker
- ✅ Form submission monitoring
- ✅ Navigation and interaction tracking
- ✅ Fallback implementation for reliability

## 🚀 Step 1: Enable Analytics in Vercel Dashboard

### **Critical: This is the #1 reason analytics don't work!**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Sign in to your account

2. **Select Your Project:**
   - Find and click on your SalaryCheck.us project
   - Should be named something like "wage-checker" or "salarycheck-us"

3. **Navigate to Analytics:**
   - Click the "Analytics" tab in the project navigation
   - Look for "Web Analytics" section

4. **Enable Analytics:**
   - If you see "Enable Analytics" button, click it
   - If already enabled, you'll see analytics data or "No data yet"
   - Confirm your plan supports Analytics (most plans do)

5. **Verify Settings:**
   - Ensure "Web Analytics" is toggled ON
   - Check that the domain matches your website
   - Save any changes

## 🔧 Step 2: Verify Implementation

### **A. Check Analytics Script Loading**

Open browser console on your live site and run:
```javascript
// Check if analytics is available
console.log('Analytics available:', typeof window.va);

// Check analytics queue
console.log('Queue length:', window.vaq?.length || 0);

// Test network connectivity
fetch('/_vercel/insights/script.js')
  .then(response => console.log('Script status:', response.status))
  .catch(error => console.log('Script error:', error));
```

### **B. Use Verification Script**

1. **Add verification script to any page:**
```html
<script src="verify-analytics.js"></script>
```

2. **Or run in console:**
```javascript
// Copy and paste the verification script content
// It will automatically run comprehensive tests
```

### **C. Manual Testing**

Test event tracking:
```javascript
// Test basic tracking
window.va('track', 'test_event', {
  test: true,
  timestamp: new Date().toISOString()
});

// Test custom tracking (if fallback loaded)
if (window.AnalyticsFallback) {
  window.AnalyticsFallback.trackEvent('manual_test', {
    source: 'manual_testing'
  });
}
```

## 📊 Step 3: Configure Custom Event Tracking

### **Already Implemented Events:**

✅ **Page Views:** Automatic on all pages
✅ **Salary Checker:** Form submissions and results
✅ **Contact Forms:** Form submission tracking
✅ **Navigation:** Link clicks and page transitions
✅ **Button Clicks:** User interaction tracking
✅ **Performance:** Page load metrics

### **Event Types Being Tracked:**

1. **Salary Checker Events:**
   ```javascript
   // Automatically tracked when salary form is submitted
   {
     event: 'salary_check',
     action: 'form_submit',
     page: 'homepage',
     form_type: 'salary_checker'
   }
   ```

2. **Contact Form Events:**
   ```javascript
   // Automatically tracked when contact form is submitted
   {
     event: 'form_submission',
     form_type: 'contact',
     page: 'contact'
   }
   ```

3. **Navigation Events:**
   ```javascript
   // Automatically tracked when links are clicked
   {
     event: 'navigation',
     destination: '/about.html',
     link_text: 'About Us',
     link_type: 'navigation'
   }
   ```

## 🔍 Step 4: Troubleshoot Common Issues

### **Issue 1: No Data in Dashboard**

**Symptoms:** Analytics enabled but no data showing

**Solutions:**
1. **Wait 24-48 hours** - Analytics data has a delay
2. **Check if Analytics is actually enabled** in Vercel dashboard
3. **Verify website is getting traffic** - test with real visits
4. **Check console for errors** - look for script loading failures

### **Issue 2: Script Not Loading (404 Error)**

**Symptoms:** `/_vercel/insights/script.js` returns 404

**Solutions:**
1. **Enable Analytics in Vercel dashboard** (most common cause)
2. **Redeploy your project** after enabling Analytics
3. **Check project plan** - ensure it supports Analytics
4. **Verify domain configuration** - ensure custom domain is set up correctly

### **Issue 3: Analytics Function Not Available**

**Symptoms:** `window.va` is undefined

**Solutions:**
1. **Wait for script to load** - check after page fully loads
2. **Check for JavaScript errors** - other errors might prevent loading
3. **Verify fallback script** - analytics-fallback.js should provide backup
4. **Test on different browsers** - rule out browser-specific issues

### **Issue 4: Events Not Tracking**

**Symptoms:** Analytics works but custom events not appearing

**Solutions:**
1. **Check event syntax** - ensure proper event structure
2. **Verify event names** - use consistent naming
3. **Test manually** - send test events via console
4. **Check dashboard filters** - events might be filtered out

## 📈 Step 5: Monitor Analytics Data

### **Where to Find Data:**

1. **Vercel Dashboard:**
   - Project → Analytics tab
   - Real-time and historical data
   - Page views, unique visitors, top pages

2. **Key Metrics to Monitor:**
   - **Page Views:** Total visits to each page
   - **Unique Visitors:** Number of individual users
   - **Top Pages:** Most popular content
   - **Referrers:** Traffic sources
   - **Geographic Data:** Visitor locations
   - **Device Types:** Desktop vs mobile usage

### **Custom Events Dashboard:**

Look for these custom events in your analytics:
- `salary_check` - Salary checker usage
- `form_submission` - Contact form submissions
- `navigation` - User navigation patterns
- `button_click` - User interactions
- `pageview` - Page visits with context

## ✅ Step 6: Verification Checklist

### **Analytics Working When:**

- [ ] Analytics enabled in Vercel dashboard
- [ ] `/_vercel/insights/script.js` returns 200 status
- [ ] `window.va` function available in console
- [ ] No console errors related to analytics
- [ ] Test events can be sent successfully
- [ ] Fallback analytics functions available
- [ ] Data appears in Vercel dashboard (24-48 hours)

### **Success Indicators:**

✅ **Immediate (within minutes):**
- No console errors
- `window.va` function works
- Test events send successfully

✅ **Short-term (within hours):**
- Real-time data in Vercel dashboard
- Page views being recorded
- Custom events appearing

✅ **Long-term (within days):**
- Historical data accumulating
- User behavior patterns visible
- Conversion tracking working

## 🎯 Expected Results

### **Analytics Capabilities:**

1. **User Behavior Tracking:**
   - Page views and session duration
   - Navigation patterns and user journeys
   - Popular content identification

2. **Salary Checker Analytics:**
   - Form submission rates
   - User engagement with salary tool
   - Conversion funnel analysis

3. **Performance Monitoring:**
   - Page load times
   - User experience metrics
   - Technical performance data

4. **Business Intelligence:**
   - Traffic sources and referrers
   - Geographic user distribution
   - Device and browser usage

### **Data-Driven Optimization:**

Use analytics data to:
- Improve salary checker user experience
- Optimize page performance
- Enhance content strategy
- Increase conversion rates
- Better understand user needs

## 🆘 Emergency Support

If analytics still don't work after following this guide:

1. **Check Vercel Status:** https://vercel-status.com/
2. **Review Vercel Docs:** https://vercel.com/docs/analytics
3. **Contact Vercel Support:** Through dashboard help section
4. **Use Diagnostic Tool:** Visit `/analytics-diagnostic.html` on your site

**Your SalaryCheck.us website is ready for comprehensive analytics tracking!** 📊🚀
