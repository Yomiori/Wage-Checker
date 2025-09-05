// Premium Features System
class PremiumFeatures {
    constructor() {
        this.config = window.CONFIG || {};
        this.isPremium = this.checkPremiumStatus();
        this.features = {
            free: [
                'Basic salary comparison',
                'Government data access',
                'Mobile responsive design'
            ],
            premium: [
                'Detailed salary trends',
                'Industry-specific comparisons',
                'Career progression insights',
                'Salary negotiation tips',
                'Ad-free experience',
                'Export salary reports',
                'Email alerts for salary updates',
                'Advanced location filtering'
            ]
        };
        
        this.pricing = {
            monthly: 9.99,
            yearly: 99.99, // 2 months free
            lifetime: 199.99
        };
        
        this.init();
    }

    init() {
        this.setupPremiumPrompts();
        this.addPremiumStyles();
        if (!this.isPremium) {
            this.showPremiumFeatures();
        }
    }

    checkPremiumStatus() {
        // Check if user has premium (localStorage for demo)
        return localStorage.getItem('premiumUser') === 'true';
    }

    setupPremiumPrompts() {
        // Show premium prompts after salary check
        document.addEventListener('salaryCheckCompleted', (event) => {
            if (!this.isPremium) {
                setTimeout(() => {
                    this.showPremiumPrompt(event.detail);
                }, 3000); // Show after 3 seconds
            }
        });
    }

    showPremiumPrompt(salaryResult) {
        const { isUnderpaid, jobTitle, experienceLevel } = salaryResult;
        const experienceLevelText = this.getExperienceLevelText(experienceLevel);

        let message = '';
        if (isUnderpaid) {
            message = `Want detailed strategies to increase your ${experienceLevelText} ${jobTitle} salary? Get personalized career insights with Premium.`;
        } else {
            message = `Discover advanced salary trends and career progression paths for ${experienceLevelText} ${jobTitle} professionals with Premium features.`;
        }

        this.createPremiumModal(message);
    }

    getExperienceLevelText(experienceLevel) {
        const experienceLevels = {
            entry: 'Entry Level',
            mid: 'Mid-Level',
            senior: 'Senior Level',
            expert: 'Expert/Lead'
        };
        return experienceLevels[experienceLevel] || 'Mid-Level';
    }

    createPremiumModal(message) {
        const modal = document.createElement('div');
        modal.className = 'premium-modal-overlay';
        modal.innerHTML = `
            <div class="premium-modal">
                <div class="premium-header">
                    <h2>🚀 Unlock Premium Features</h2>
                    <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="premium-content">
                    <p class="premium-message">${message}</p>
                    
                    <div class="features-comparison">
                        <div class="feature-column">
                            <h3>Free</h3>
                            <ul>
                                ${this.features.free.map(feature => `<li>✓ ${feature}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="feature-column premium-column">
                            <h3>Premium</h3>
                            <ul>
                                ${this.features.free.map(feature => `<li>✓ ${feature}</li>`).join('')}
                                ${this.features.premium.map(feature => `<li>⭐ ${feature}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="pricing-options">
                        <div class="pricing-card" data-plan="monthly">
                            <h4>Monthly</h4>
                            <div class="price">$${this.pricing.monthly}/mo</div>
                            <button class="upgrade-btn" onclick="premiumFeatures.selectPlan('monthly')">
                                Start Free Trial
                            </button>
                        </div>
                        
                        <div class="pricing-card popular" data-plan="yearly">
                            <div class="popular-badge">Most Popular</div>
                            <h4>Yearly</h4>
                            <div class="price">$${this.pricing.yearly}/yr</div>
                            <div class="savings">Save $${(this.pricing.monthly * 12 - this.pricing.yearly).toFixed(2)}</div>
                            <button class="upgrade-btn" onclick="premiumFeatures.selectPlan('yearly')">
                                Start Free Trial
                            </button>
                        </div>
                        
                        <div class="pricing-card" data-plan="lifetime">
                            <h4>Lifetime</h4>
                            <div class="price">$${this.pricing.lifetime}</div>
                            <div class="savings">One-time payment</div>
                            <button class="upgrade-btn" onclick="premiumFeatures.selectPlan('lifetime')">
                                Buy Now
                            </button>
                        </div>
                    </div>
                    
                    <p class="trial-info">
                        🎁 <strong>7-day free trial</strong> • Cancel anytime • No hidden fees
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Track premium prompt view
        if (window.analytics) {
            window.analytics.trackEvent('premium_prompt_shown', {
                trigger: 'salary_check_completed'
            });
        }
    }

    selectPlan(planType) {
        // Track plan selection
        if (window.analytics) {
            window.analytics.trackEvent('premium_plan_selected', {
                plan: planType,
                price: this.pricing[planType]
            });
        }

        // In a real app, integrate with Stripe, PayPal, etc.
        this.redirectToPayment(planType);
    }

    redirectToPayment(planType) {
        // Demo: Show payment integration options
        alert(`
🚀 Payment Integration Options:

1. Stripe Checkout (Recommended)
   - Easy integration
   - Handles subscriptions
   - Global payment methods

2. PayPal Subscriptions
   - Trusted by users
   - Good for international

3. Gumroad (Simple)
   - No monthly fees
   - Good for digital products

Selected Plan: ${planType} - $${this.pricing[planType]}

Next: Integrate your preferred payment processor!
        `);
        
        // Close modal
        document.querySelector('.premium-modal-overlay')?.remove();
    }

    showPremiumFeatures() {
        // Add premium teasers throughout the app
        this.addPremiumTeasers();
    }

    addPremiumTeasers() {
        // Add premium feature hints in results
        document.addEventListener('salaryCheckCompleted', () => {
            setTimeout(() => {
                this.addResultsTeasers();
            }, 1000);
        });
    }

    addResultsTeasers() {
        const resultsContainer = document.getElementById('resultContent');
        if (resultsContainer && !this.isPremium) {
            const teaser = document.createElement('div');
            teaser.className = 'premium-teaser';
            teaser.innerHTML = `
                <div class="teaser-content">
                    <h4>🔒 Want More Insights?</h4>
                    <ul class="teaser-features">
                        <li>📈 5-year salary trend analysis</li>
                        <li>🎯 Personalized career recommendations</li>
                        <li>📊 Industry-specific comparisons</li>
                        <li>💡 Salary negotiation strategies</li>
                    </ul>
                    <button class="teaser-upgrade-btn" onclick="premiumFeatures.showPremiumPrompt({isUnderpaid: false, jobTitle: 'your role'})">
                        Upgrade to Premium →
                    </button>
                </div>
            `;
            resultsContainer.appendChild(teaser);
        }
    }

    addPremiumStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .premium-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .premium-modal {
                background: white;
                border-radius: 16px;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                animation: slideUp 0.3s ease;
            }
            
            .premium-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .close-modal {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #6b7280;
            }
            
            .premium-content {
                padding: 2rem;
            }
            
            .premium-message {
                font-size: 1.1rem;
                color: #374151;
                margin-bottom: 2rem;
                text-align: center;
            }
            
            .features-comparison {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .feature-column {
                padding: 1.5rem;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            
            .premium-column {
                border-color: #667eea;
                background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
            }
            
            .feature-column h3 {
                margin-bottom: 1rem;
                color: #1f2937;
            }
            
            .feature-column ul {
                list-style: none;
                padding: 0;
            }
            
            .feature-column li {
                padding: 0.5rem 0;
                color: #4b5563;
            }
            
            .pricing-options {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .pricing-card {
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 1.5rem;
                text-align: center;
                position: relative;
                transition: all 0.2s ease;
            }
            
            .pricing-card:hover {
                border-color: #667eea;
                transform: translateY(-2px);
            }
            
            .pricing-card.popular {
                border-color: #667eea;
                background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
            }
            
            .popular-badge {
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                background: #667eea;
                color: white;
                padding: 0.25rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .price {
                font-size: 2rem;
                font-weight: 700;
                color: #1f2937;
                margin: 1rem 0;
            }
            
            .savings {
                color: #059669;
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .upgrade-btn {
                width: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .upgrade-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .trial-info {
                text-align: center;
                color: #6b7280;
                font-size: 0.9rem;
            }
            
            .premium-teaser {
                margin-top: 2rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 12px;
                border: 1px solid #f59e0b;
            }
            
            .teaser-content h4 {
                color: #92400e;
                margin-bottom: 1rem;
            }
            
            .teaser-features {
                list-style: none;
                padding: 0;
                margin-bottom: 1rem;
            }
            
            .teaser-features li {
                padding: 0.25rem 0;
                color: #78350f;
            }
            
            .teaser-upgrade-btn {
                background: #f59e0b;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .premium-modal {
                    margin: 1rem;
                    max-width: none;
                }
                
                .features-comparison {
                    grid-template-columns: 1fr;
                }
                
                .pricing-options {
                    grid-template-columns: 1fr;
                }
                
                .premium-content {
                    padding: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize premium features
document.addEventListener('DOMContentLoaded', () => {
    window.premiumFeatures = new PremiumFeatures();
});

// Export for global use
window.PremiumFeatures = PremiumFeatures;
