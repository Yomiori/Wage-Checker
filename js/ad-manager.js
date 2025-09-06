// Ad Management System
class AdManager {
  constructor() {
    this.adConfig = {
      enabled: true,
      provider: "google-adsense", // or 'demo' for testing
      publisherId: "ca-pub-XXXXXXXXXX", // Replace with your real AdSense publisher ID
      adSlots: {
        header: {
          id: "XXXXXXXXXX", // Replace with your header ad slot ID
          sizes: [
            [728, 90],
            [320, 50],
          ], // Leaderboard + Mobile banner
          responsive: true,
        },
        sidebar: {
          id: "XXXXXXXXXX", // Replace with your sidebar ad slot ID
          sizes: [
            [300, 250],
            [336, 280],
          ], // Medium rectangle + Large rectangle
          responsive: true,
        },
        results: {
          id: "XXXXXXXXXX", // Replace with your results ad slot ID
          sizes: [
            [728, 90],
            [320, 100],
          ], // Leaderboard + Mobile banner
          responsive: true,
        },
        footer: {
          id: "XXXXXXXXXX", // Replace with your footer ad slot ID
          sizes: [
            [728, 90],
            [320, 50],
          ], // Leaderboard + Mobile banner
          responsive: true,
        },
      },
      // AdSense optimization settings
      autoAds: true, // Enable Auto ads for additional revenue
      pageLevel: true, // Enable page-level ads
      delayLoad: 1000, // Delay ad loading for better Core Web Vitals
    };

    this.demoAds = [
      {
        title: "Career Development Courses",
        description:
          "Boost your skills with online courses. Get certified and increase your earning potential.",
        url: "#",
        image:
          "https://via.placeholder.com/300x250/4f46e5/ffffff?text=Career+Courses",
      },
      {
        title: "Resume Writing Services",
        description:
          "Professional resume writing to help you land your dream job and negotiate better salary.",
        url: "#",
        image:
          "https://via.placeholder.com/300x250/059669/ffffff?text=Resume+Help",
      },
      {
        title: "Salary Negotiation Guide",
        description:
          "Learn proven strategies to negotiate higher salaries and better benefits packages.",
        url: "#",
        image:
          "https://via.placeholder.com/728x90/dc2626/ffffff?text=Salary+Negotiation",
      },
      {
        title: "Job Search Platform",
        description:
          "Find high-paying jobs in your area. Connect with top employers and recruiters.",
        url: "#",
        image:
          "https://via.placeholder.com/728x90/7c3aed/ffffff?text=Job+Search",
      },
    ];

    this.init();
  }

  init() {
    if (this.adConfig.enabled) {
      if (this.adConfig.provider === "google-adsense") {
        this.initializeAdSense();
      }
      this.loadAds();
      this.setupAdRefresh();
      this.setupResultsAds();
    }
  }

  // Initialize Google AdSense with proper optimization
  initializeAdSense() {
    // Load AdSense script asynchronously for better performance
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adConfig.publisherId}`;
    script.crossOrigin = "anonymous";

    // Add error handling
    script.onerror = () => {
      console.warn("AdSense failed to load, falling back to demo ads");
      this.adConfig.provider = "demo";
      this.loadAds();
    };

    document.head.appendChild(script);

    // Enable Auto ads if configured
    if (this.adConfig.autoAds) {
      this.enableAutoAds();
    }
  }

  // Enable Google Auto ads for additional revenue
  enableAutoAds() {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({
      google_ad_client: this.adConfig.publisherId,
      enable_page_level_ads: this.adConfig.pageLevel,
    });
  }

  setupResultsAds() {
    // Show ads after salary results are displayed
    document.addEventListener("salaryCheckCompleted", () => {
      this.showResultsAds();
    });
  }

  showResultsAds() {
    // Add ads to results section for higher engagement
    const resultsSection = document.querySelector(".results-section");
    if (resultsSection && !resultsSection.querySelector(".results-ad")) {
      const adContainer = document.createElement("div");
      adContainer.className = "results-ad ad-space";
      adContainer.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${this.adConfig.publisherId}"
                     data-ad-slot="${
                       this.adConfig.adSlots.results?.id || "XXXXXXXXXX"
                     }"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
      resultsSection.appendChild(adContainer);

      // Push ad if Google AdSense is loaded
      if (window.adsbygoogle) {
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }

  loadAds() {
    if (this.adConfig.provider === "google-adsense") {
      this.loadGoogleAdsense();
    } else {
      this.loadDemoAds();
    }
  }

  loadGoogleAdsense() {
    // Check if AdSense is available
    if (typeof adsbygoogle !== "undefined") {
      try {
        // Initialize existing ad slots
        const adSlots = document.querySelectorAll(".adsbygoogle");
        adSlots.forEach((slot) => {
          if (!slot.dataset.adsbygoogleStatus) {
            (adsbygoogle = window.adsbygoogle || []).push({});
          }
        });
      } catch (error) {
        console.log("AdSense not available, loading demo ads");
        this.loadDemoAds();
      }
    } else {
      console.log("AdSense not loaded, using demo ads");
      this.loadDemoAds();
    }
  }

  loadDemoAds() {
    // Load demo ads for development/testing
    this.loadHeaderAd();
    this.loadSidebarAd();
    this.loadBottomAd();
  }

  loadHeaderAd() {
    const headerAd = document.querySelector(".header-ad");
    if (headerAd) {
      const ad = this.demoAds[2]; // Banner ad
      headerAd.innerHTML = `
                <div style="background: linear-gradient(135deg, ${this.getRandomColor()}, ${this.getRandomColor()}); 
                           color: white; padding: 1rem; border-radius: 8px; text-align: center;">
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${
                      ad.title
                    }</h3>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${
                      ad.description
                    }</p>
                    <small style="opacity: 0.7; font-size: 0.75rem;">Advertisement</small>
                </div>
            `;
    }
  }

  loadSidebarAd() {
    const sidebarAd = document.querySelector(".sidebar-ad");
    if (sidebarAd) {
      const ad = this.demoAds[0];
      sidebarAd.innerHTML = `
                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; height: 100%;">
                    <div style="background: ${this.getRandomColor()}; color: white; padding: 1rem; text-align: center;">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${
                          ad.title
                        }</h4>
                        <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">${
                          ad.description
                        }</p>
                    </div>
                    <div style="padding: 0.75rem; text-align: center;">
                        <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; 
                                     border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                            Learn More
                        </button>
                        <div style="margin-top: 0.5rem;">
                            <small style="color: #6b7280; font-size: 0.7rem;">Advertisement</small>
                        </div>
                    </div>
                </div>
            `;
    }
  }

  loadBottomAd() {
    const bottomAd = document.querySelector(".bottom-ad");
    if (bottomAd) {
      const ad = this.demoAds[3];
      bottomAd.innerHTML = `
                <div style="background: linear-gradient(135deg, ${this.getRandomColor()}, ${this.getRandomColor()}); 
                           color: white; padding: 1rem; border-radius: 8px; text-align: center;">
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${
                      ad.title
                    }</h3>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${
                      ad.description
                    }</p>
                    <small style="opacity: 0.7; font-size: 0.75rem;">Advertisement</small>
                </div>
            `;
    }
  }

  getRandomColor() {
    const colors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#38f9d7",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  setupAdRefresh() {
    // Refresh ads every 30 seconds for demo purposes
    if (this.adConfig.provider === "demo") {
      setInterval(() => {
        this.loadDemoAds();
      }, 30000);
    }
  }

  // Method to track ad performance (for analytics)
  trackAdClick(adSlot, adId) {
    console.log(`Ad clicked: ${adSlot} - ${adId}`);
    // In production, send to analytics service
    if (typeof gtag !== "undefined") {
      gtag("event", "ad_click", {
        ad_slot: adSlot,
        ad_id: adId,
      });
    }
  }

  // Method to handle ad blocking detection
  detectAdBlocker() {
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    testAd.style.position = "absolute";
    testAd.style.left = "-10000px";
    document.body.appendChild(testAd);

    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);

      if (isBlocked) {
        this.handleAdBlocker();
      }
    }, 100);
  }

  handleAdBlocker() {
    // Show message to users with ad blockers
    const adSpaces = document.querySelectorAll(".ad-space");
    adSpaces.forEach((space) => {
      space.innerHTML = `
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; 
                           padding: 1rem; text-align: center; color: #dc2626;">
                    <p style="margin: 0; font-size: 0.875rem;">
                        <strong>Ad Blocker Detected</strong><br>
                        Please consider disabling your ad blocker to support this free service.
                    </p>
                </div>
            `;
    });
  }

  // Method to update ad configuration
  updateConfig(newConfig) {
    this.adConfig = { ...this.adConfig, ...newConfig };
    this.loadAds();
  }

  // Method to disable ads (for premium users, etc.)
  disableAds() {
    this.adConfig.enabled = false;
    const adSpaces = document.querySelectorAll(".ad-space");
    adSpaces.forEach((space) => {
      space.style.display = "none";
    });
  }

  // Method to enable ads
  enableAds() {
    this.adConfig.enabled = true;
    const adSpaces = document.querySelectorAll(".ad-space");
    adSpaces.forEach((space) => {
      space.style.display = "block";
    });
    this.loadAds();
  }
}

// Initialize ad manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.adManager = new AdManager();

  // Detect ad blockers after a short delay
  setTimeout(() => {
    window.adManager.detectAdBlocker();
  }, 1000);
});

// Export for use in other scripts
window.AdManager = AdManager;
