# Deployment Configuration Guide

## Pre-Deployment Checklist

### 1. API Configuration
- [ ] Obtain Bureau of Labor Statistics API key from: https://www.bls.gov/developers/api_signature_v2.html
- [ ] Update `js/data-service.js` with your BLS API key:
  ```javascript
  this.blsApiKey = 'YOUR_ACTUAL_BLS_API_KEY';
  ```

### 2. Google AdSense Setup
- [ ] Create Google AdSense account
- [ ] Get approved for AdSense
- [ ] Replace placeholder publisher ID in `index.html` and `methodology.html`:
  ```html
  data-ad-client="ca-pub-YOUR_ACTUAL_PUBLISHER_ID"
  data-ad-slot="YOUR_ACTUAL_AD_SLOT_ID"
  ```

### 3. Analytics Setup (Optional)
- [ ] Set up Google Analytics
- [ ] Add tracking code to all HTML files
- [ ] Configure goal tracking for salary checks

### 4. Domain and SSL
- [ ] Purchase domain name
- [ ] Set up SSL certificate (required for AdSense)
- [ ] Update `package.json` homepage URL

## Hosting Options

### Option 1: Static Hosting (Recommended)
**Netlify (Free tier available)**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.` (root)
4. Environment variables: Add BLS API key

**Vercel (Free tier available)**
1. Import from GitHub
2. Framework preset: Other
3. Build command: `npm run build`
4. Output directory: `.`

**GitHub Pages (Free)**
1. Enable GitHub Pages in repository settings
2. Source: Deploy from branch (main)
3. Note: Limited to static content only

### Option 2: Traditional Web Hosting
**Requirements:**
- HTTPS support (required for AdSense)
- Support for static files
- Optional: Node.js support for server-side features

**Popular providers:**
- Hostinger
- SiteGround
- Bluehost
- DigitalOcean

## Environment Variables

Create a `.env` file for local development:
```
BLS_API_KEY=your_bls_api_key_here
GOOGLE_ADSENSE_CLIENT=ca-pub-your_publisher_id
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Performance Optimization

### 1. Image Optimization
- Compress any images used
- Use WebP format when possible
- Implement lazy loading

### 2. CSS/JS Minification
```bash
# Install minification tools
npm install -g clean-css-cli uglify-js

# Minify CSS
cleancss -o styles.min.css styles.css

# Minify JavaScript
uglifyjs js/app.js js/data-service.js js/ad-manager.js -o js/bundle.min.js
```

### 3. CDN Setup
- Use CloudFlare or similar CDN
- Enable caching for static assets
- Configure compression

## Security Considerations

### 1. API Key Security
- Never commit API keys to version control
- Use environment variables in production
- Implement rate limiting if needed

### 2. Content Security Policy
Add to HTML head:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://api.bls.gov;">
```

### 3. HTTPS Enforcement
Ensure all external resources use HTTPS:
- Google Fonts: ✓
- Google AdSense: ✓
- BLS API: ✓

## Monitoring and Analytics

### 1. Error Tracking
Consider implementing:
- Sentry for error tracking
- LogRocket for user session recording

### 2. Performance Monitoring
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### 3. AdSense Performance
- Monitor ad revenue in AdSense dashboard
- A/B test ad placements
- Track ad click-through rates

## Legal Requirements

### 1. Privacy Policy
Required for AdSense monetization. Include:
- Data collection practices
- Cookie usage
- Third-party services (Google AdSense, Analytics)
- User rights and contact information

### 2. Terms of Service
Include disclaimers about:
- Data accuracy limitations
- Informational purpose only
- No guarantee of results

### 3. Data Attribution
Properly credit data sources:
- Bureau of Labor Statistics
- Other government databases used

## Backup and Maintenance

### 1. Regular Backups
- Automated daily backups of all files
- Database backups if using dynamic data
- Version control with Git

### 2. Updates
- Monitor BLS API for changes
- Update salary data regularly
- Keep dependencies updated

### 3. Monitoring
- Set up uptime monitoring
- Monitor API rate limits
- Track error rates

## Launch Checklist

### Pre-Launch
- [ ] All APIs configured and tested
- [ ] AdSense ads displaying correctly
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] Performance optimization applied
- [ ] Legal pages created (Privacy, Terms)
- [ ] Analytics tracking implemented

### Launch Day
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] All redirects working
- [ ] Submit to Google Search Console
- [ ] Submit sitemap
- [ ] Social media announcement

### Post-Launch
- [ ] Monitor error logs
- [ ] Check ad performance
- [ ] Gather user feedback
- [ ] Plan feature updates
- [ ] SEO optimization

## Troubleshooting Common Issues

### 1. AdSense Not Showing
- Verify publisher ID is correct
- Check ad blocker detection
- Ensure HTTPS is enabled
- Wait 24-48 hours for approval

### 2. BLS API Errors
- Verify API key is valid
- Check rate limits (500 requests/day for free tier)
- Implement fallback to mock data

### 3. Performance Issues
- Enable compression
- Optimize images
- Use CDN
- Minimize HTTP requests

## Support and Documentation

- BLS API Documentation: https://www.bls.gov/developers/api_signature_v2.html
- Google AdSense Help: https://support.google.com/adsense
- Web Performance Best Practices: https://web.dev/performance/

## Contact Information

For technical support or questions about deployment:
- Create an issue in the GitHub repository
- Check the README.md for additional information
- Review the methodology page for data accuracy questions
