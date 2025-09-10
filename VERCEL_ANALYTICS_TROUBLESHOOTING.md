# 🔧 Vercel Analytics Troubleshooting Guide for SalaryCheck.us

## 🎯 Common Issues & Solutions

### **Issue 1: Vercel Analytics Script Not Loading**

#### **Symptoms:**
- `/_vercel/insights/script.js` returns 404 error
- No analytics data in Vercel dashboard
- Console error: "Failed to load resource"

#### **Solutions:**

**A. Enable Analytics in Vercel Dashboard:**
1. Go to your Vercel project dashboard
2. Click "Analytics" tab
3. Click "Enable Analytics" if not already enabled
4. Redeploy your project

**B. Check Project Settings:**
1. Go to Project Settings → General
2. Verify "Analytics" is enabled
3. Check if you're on a plan that supports Analytics

### **Issue 2: ES6 Module Import Errors**

#### **Symptoms:**
- Console error: "Failed to resolve module specifier"
- Analytics modules not loading
- `import` statements failing

#### **Solutions:**

**A. Check File Paths:**
```javascript
// Correct relative paths
import { inject } from "./js/analytics-simple.js";
import { analytics, inject } from "./js/analytics-module.js";
```

**B. Verify MIME Types:**
- Ensure `.js` files are served with `text/javascript` MIME type
- Check Vercel serves ES6 modules correctly

### **Issue 3: Analytics Not Initializing**

#### **Symptoms:**
- No `window.va` function available
- Analytics events not firing
- No data in dashboard

#### **Solutions:**

**A. Check Script Loading Order:**
```html
<!-- Correct order -->
<script type="module">
  import { inject } from "./js/analytics-simple.js";
  await inject();
</script>

<!-- Fallback for older browsers -->
<script nomodule defer src="/_vercel/insights/script.js"></script>
```

**B. Verify Analytics Queue:**
```javascript
// Check if analytics is working
console.log('Analytics available:', typeof window.va);
console.log('Analytics queue:', window.vaq);
```

## 🔍 Diagnostic Steps

### **Step 1: Check Vercel Deployment Status**

1. **Verify Deployment:**
   - Go to Vercel dashboard
   - Check latest deployment status
   - Ensure deployment completed successfully

2. **Check Domain Configuration:**
   - Verify custom domain is properly configured
   - Ensure SSL certificate is active
   - Check DNS settings

### **Step 2: Test Analytics Script Availability**

**Browser Console Test:**
```javascript
// Test 1: Check if analytics script loads
fetch('/_vercel/insights/script.js')
  .then(response => {
    console.log('Analytics script status:', response.status);
    return response.text();
  })
  .then(text => {
    console.log('Script loaded:', text.length > 0);
  })
  .catch(error => {
    console.error('Analytics script failed:', error);
  });

// Test 2: Check analytics initialization
setTimeout(() => {
  console.log('Window.va available:', typeof window.va);
  console.log('Analytics queue:', window.vaq?.length || 0);
}, 2000);
```

### **Step 3: Verify ES6 Module Loading**

**Browser Console Test:**
```javascript
// Test module loading
import('./js/analytics-simple.js')
  .then(module => {
    console.log('Analytics module loaded:', module);
    return module.inject();
  })
  .then(() => {
    console.log('Analytics injected successfully');
  })
  .catch(error => {
    console.error('Module loading failed:', error);
  });
```

### **Step 4: Check Network Requests**

**Browser DevTools:**
1. Open DevTools → Network tab
2. Reload page
3. Look for:
   - `/_vercel/insights/script.js` (should return 200)
   - `analytics-simple.js` and `analytics-module.js` (should return 200)
   - Any failed requests or CORS errors

### **Step 5: Verify Analytics Events**

**Test Event Tracking:**
```javascript
// Manual event test
if (window.va) {
  window.va('track', 'test_event', {
    test: true,
    timestamp: new Date().toISOString()
  });
  console.log('Test event sent');
} else {
  console.error('Analytics not available');
}
```

## 🚀 Quick Fixes

### **Fix 1: Force Analytics Reload**

Add to any HTML page for testing:
```html
<script>
  // Force reload analytics
  window.addEventListener('load', () => {
    if (!window.va) {
      console.log('Manually loading analytics...');
      const script = document.createElement('script');
      script.src = '/_vercel/insights/script.js';
      script.onload = () => console.log('Analytics loaded manually');
      script.onerror = () => console.error('Manual analytics load failed');
      document.head.appendChild(script);
    }
  });
</script>
```

### **Fix 2: Debug Analytics State**

Add debug information:
```html
<script>
  // Debug analytics state
  setInterval(() => {
    console.log('Analytics Debug:', {
      va_available: typeof window.va,
      queue_length: window.vaq?.length || 0,
      script_loaded: !!document.querySelector('script[src*="insights"]'),
      timestamp: new Date().toISOString()
    });
  }, 5000);
</script>
```

### **Fix 3: Fallback Analytics Implementation**

If ES6 modules fail, use direct implementation:
```html
<script>
  // Direct analytics implementation
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  
  // Load script directly
  if (!document.querySelector('script[src*="insights"]')) {
    const script = document.createElement('script');
    script.src = '/_vercel/insights/script.js';
    script.defer = true;
    document.head.appendChild(script);
  }
  
  // Track page view
  window.va('track', 'pageview', {
    page: window.location.pathname,
    title: document.title
  });
</script>
```

## 📋 Checklist for Working Analytics

- [ ] Vercel Analytics enabled in dashboard
- [ ] Project deployed successfully
- [ ] Custom domain configured correctly
- [ ] `/_vercel/insights/script.js` returns 200 status
- [ ] ES6 modules loading without errors
- [ ] `window.va` function available
- [ ] Analytics events firing in console
- [ ] Data appearing in Vercel dashboard (may take 24-48 hours)

## 🆘 Emergency Fallback

If all else fails, use this simple implementation:
```html
<script defer src="/_vercel/insights/script.js"></script>
<script>
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
</script>
```
