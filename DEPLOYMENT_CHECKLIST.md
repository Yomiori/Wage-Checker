# Deployment Checklist

## Pre-Deployment Setup

### 1. API Keys and Accounts
- [ ] **BLS API Key**: Register at https://www.bls.gov/developers/api_signature_v2.html
- [ ] **Google AdSense**: Apply at https://www.google.com/adsense/
- [ ] **Domain Name**: Purchase from Namecheap, GoDaddy, or Google Domains (optional)

### 2. Update Configuration Files

#### config.js
- [ ] Replace `YOUR_BLS_API_KEY_HERE` with actual BLS API key
- [ ] Replace `ca-pub-XXXXXXXXXXXXXXXXX` with actual AdSense Publisher ID
- [ ] Replace ad slot IDs with actual values from AdSense
- [ ] Update `site.url` with your actual domain

#### index.html
- [ ] Update AdSense client ID in script tags
- [ ] Update ad slot IDs in ad containers
- [ ] Add Google Analytics tracking code (optional)

### 3. File Preparation
- [ ] All files are in the project root directory
- [ ] No sensitive data in code (use environment variables)
- [ ] Test locally one final time

## Netlify Deployment Steps

### Option A: Git-based Deployment (Recommended)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/underpaid-checker.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Sign up/login with GitHub
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.` (root)
   - Click "Deploy site"

3. **Configure Environment Variables**
   - Go to Site settings > Environment variables
   - Add each variable from .env.example:
     - `BLS_API_KEY`: Your actual BLS API key
     - `GOOGLE_ADSENSE_CLIENT`: Your AdSense publisher ID
     - `ADSENSE_HEADER_SLOT`: Your header ad slot ID
     - `ADSENSE_SIDEBAR_SLOT`: Your sidebar ad slot ID
     - `ADSENSE_BOTTOM_SLOT`: Your bottom ad slot ID
     - `SITE_URL`: Your Netlify URL (initially) or custom domain

### Option B: Manual Deployment

1. **Prepare Files**
   - Update config.js with production values
   - Create a ZIP file of all project files

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Drag and drop your project folder to the deploy area
   - Wait for deployment to complete

## Domain and SSL Setup

### Using Netlify Subdomain (Free)
- [ ] Your site will be available at: `https://random-name-123456.netlify.app`
- [ ] SSL is automatically enabled
- [ ] Update config.js with this URL

### Using Custom Domain
1. **Add Domain to Netlify**
   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter your domain name

2. **Configure DNS**
   - **Option A**: Use Netlify DNS (recommended)
     - Change nameservers at your domain registrar to Netlify's
   - **Option B**: Use external DNS
     - Add CNAME record pointing to your Netlify subdomain

3. **SSL Certificate**
   - Netlify automatically provisions Let's Encrypt SSL
   - Wait 24-48 hours for full propagation

## Post-Deployment Verification

### Functionality Tests
- [ ] **Homepage loads correctly**
- [ ] **Salary input accepts various formats** (75000, 75,000, $75,000)
- [ ] **Form submission works**
- [ ] **Results display properly**
- [ ] **Mobile responsiveness**
- [ ] **All links work** (methodology page, etc.)

### API Integration Tests
- [ ] **BLS API calls work** (check browser console for errors)
- [ ] **Fallback to mock data** if API fails
- [ ] **Error handling** displays user-friendly messages

### AdSense Verification
- [ ] **Ads display correctly** (may take 24-48 hours)
- [ ] **No ad policy violations**
- [ ] **Ad placement doesn't interfere with functionality**

### Performance Tests
- [ ] **Page load speed** < 3 seconds
- [ ] **Lighthouse score** > 90
- [ ] **Mobile performance** acceptable

## Analytics and Monitoring Setup

### Google Analytics (Optional)
1. Create GA4 property at https://analytics.google.com
2. Add tracking code to HTML files
3. Set up goals for salary checks

### Search Console
1. Add site to https://search.google.com/search-console
2. Submit sitemap
3. Monitor for crawl errors

### Uptime Monitoring
- Set up monitoring with UptimeRobot or Pingdom
- Monitor main functionality endpoints

## Legal and Compliance

### Required Pages
- [ ] **Privacy Policy** (required for AdSense)
- [ ] **Terms of Service**
- [ ] **Data attribution** for government sources

### AdSense Compliance
- [ ] **Privacy Policy** mentions data collection
- [ ] **Cookie consent** (if targeting EU users)
- [ ] **Content quality** meets AdSense standards

## Troubleshooting Common Issues

### Deployment Fails
- Check netlify.toml syntax
- Verify all files are included
- Check build logs for errors

### APIs Not Working
- Verify API keys in environment variables
- Check CORS settings
- Test API endpoints directly

### Ads Not Showing
- Wait 24-48 hours after AdSense approval
- Check ad blocker detection
- Verify publisher ID is correct

### SSL Issues
- Wait 24-48 hours for propagation
- Check DNS configuration
- Contact Netlify support if needed

## Success Metrics

### Week 1 Goals
- [ ] Site is live and functional
- [ ] Basic traffic from search engines
- [ ] No critical errors in console

### Month 1 Goals
- [ ] AdSense revenue > $0
- [ ] 100+ unique visitors
- [ ] Mobile traffic > 50%

### Ongoing Maintenance
- [ ] Monitor API rate limits
- [ ] Update salary data quarterly
- [ ] Review and optimize ad performance
- [ ] Add new features based on user feedback

## Support Resources

- **Netlify Documentation**: https://docs.netlify.com/
- **BLS API Documentation**: https://www.bls.gov/developers/
- **AdSense Help**: https://support.google.com/adsense/
- **Web Performance**: https://web.dev/performance/
