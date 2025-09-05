// Affiliate Marketing System
class AffiliateMarketing {
    constructor() {
        this.config = window.CONFIG || {};
        this.affiliateLinks = {
            // Career Development
            coursera: {
                url: 'https://www.coursera.org/browse/business?irclickid=YOUR_AFFILIATE_ID',
                title: 'Professional Courses',
                description: 'Boost your skills with certified online courses',
                category: 'education'
            },
            udemy: {
                url: 'https://www.udemy.com/courses/business/?ranMID=39197&ranEAID=YOUR_AFFILIATE_ID',
                title: 'Career Skills Training',
                description: 'Learn in-demand skills to increase your salary',
                category: 'education'
            },
            
            // Resume & Job Search
            resumeGenius: {
                url: 'https://resumegenius.com/?affiliate=YOUR_AFFILIATE_ID',
                title: 'Professional Resume Builder',
                description: 'Create a winning resume to land higher-paying jobs',
                category: 'career'
            },
            linkedin: {
                url: 'https://www.linkedin.com/premium/?trk=YOUR_AFFILIATE_ID',
                title: 'LinkedIn Premium',
                description: 'Access premium job search and networking features',
                category: 'career'
            },
            
            // Financial Tools
            mint: {
                url: 'https://www.mint.com/?utm_source=YOUR_AFFILIATE_ID',
                title: 'Budget & Salary Tracking',
                description: 'Track your income and plan for salary negotiations',
                category: 'finance'
            },
            creditKarma: {
                url: 'https://www.creditkarma.com/?utm_source=YOUR_AFFILIATE_ID',
                title: 'Credit Score Monitoring',
                description: 'Better credit = better job opportunities',
                category: 'finance'
            },
            
            // Books & Resources
            amazon: {
                url: 'https://amazon.com/dp/B08BNPQZJ7?tag=YOUR_AMAZON_ASSOCIATE_ID',
                title: 'Salary Negotiation Books',
                description: 'Learn proven strategies to negotiate higher pay',
                category: 'books'
            }
        };
        
        this.init();
    }

    init() {
        this.setupContextualRecommendations();
        this.trackClicks();
    }

    setupContextualRecommendations() {
        // Show relevant affiliate products based on salary results
        document.addEventListener('salaryCheckCompleted', (event) => {
            const result = event.detail;
            this.showRelevantProducts(result);
        });
    }

    showRelevantProducts(result) {
        const { isUnderpaid, percentile, jobTitle, experienceLevel } = result;

        let recommendations = [];

        if (isUnderpaid) {
            // Show career improvement products based on experience level
            if (experienceLevel === 'entry') {
                recommendations = [
                    this.affiliateLinks.coursera,
                    this.affiliateLinks.udemy,
                    this.affiliateLinks.resumeGenius
                ];
            } else if (experienceLevel === 'expert') {
                recommendations = [
                    this.affiliateLinks.linkedin,
                    this.affiliateLinks.amazon,
                    this.affiliateLinks.mint
                ];
            } else {
                recommendations = [
                    this.affiliateLinks.coursera,
                    this.affiliateLinks.resumeGenius,
                    this.affiliateLinks.linkedin
                ];
            }
        } else {
            // Show financial management and growth products
            if (experienceLevel === 'entry') {
                recommendations = [
                    this.affiliateLinks.udemy,
                    this.affiliateLinks.mint,
                    this.affiliateLinks.coursera
                ];
            } else {
                recommendations = [
                    this.affiliateLinks.mint,
                    this.affiliateLinks.creditKarma,
                    this.affiliateLinks.linkedin
                ];
            }
        }

        this.displayRecommendations(recommendations);
    }

    displayRecommendations(products) {
        const container = document.getElementById('affiliateRecommendations');
        if (!container) {
            this.createRecommendationsContainer();
        }

        const html = `
            <div class="affiliate-section">
                <h3 style="color: #1f2937; margin-bottom: 1rem;">Recommended for You</h3>
                <div class="affiliate-grid">
                    ${products.slice(0, 3).map(product => `
                        <div class="affiliate-card">
                            <h4 class="affiliate-title">${product.title}</h4>
                            <p class="affiliate-description">${product.description}</p>
                            <a href="${product.url}" 
                               class="affiliate-button"
                               target="_blank"
                               rel="noopener"
                               data-affiliate="${product.category}"
                               onclick="affiliateMarketing.trackClick('${product.category}', '${product.title}')">
                                Learn More →
                            </a>
                        </div>
                    `).join('')}
                </div>
                <p class="affiliate-disclosure">
                    <small>* We may earn a commission from purchases made through these links at no cost to you.</small>
                </p>
            </div>
        `;

        document.getElementById('affiliateRecommendations').innerHTML = html;
    }

    createRecommendationsContainer() {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            const container = document.createElement('div');
            container.id = 'affiliateRecommendations';
            container.className = 'affiliate-recommendations';
            resultsSection.appendChild(container);
        }
    }

    trackClick(category, productTitle) {
        // Track affiliate clicks for analytics
        if (window.analytics) {
            window.analytics.trackEvent('affiliate_click', {
                category: category,
                product: productTitle
            });
        }
        
        console.log(`Affiliate click: ${category} - ${productTitle}`);
    }

    // Add CSS for affiliate cards
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .affiliate-recommendations {
                margin-top: 2rem;
                padding: 2rem;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
            }
            
            .affiliate-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .affiliate-card {
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .affiliate-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .affiliate-title {
                color: #1f2937;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .affiliate-description {
                color: #6b7280;
                font-size: 0.9rem;
                margin-bottom: 1rem;
                line-height: 1.5;
            }
            
            .affiliate-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 500;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            }
            
            .affiliate-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
            }
            
            .affiliate-disclosure {
                text-align: center;
                color: #6b7280;
                font-style: italic;
                margin-top: 1rem;
            }
            
            @media (max-width: 768px) {
                .affiliate-grid {
                    grid-template-columns: 1fr;
                }
                
                .affiliate-recommendations {
                    padding: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize affiliate marketing
document.addEventListener('DOMContentLoaded', () => {
    window.affiliateMarketing = new AffiliateMarketing();
    window.affiliateMarketing.addStyles();
});

// Export for global use
window.AffiliateMarketing = AffiliateMarketing;
