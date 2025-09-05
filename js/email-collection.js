// Email Collection & Lead Generation System
class EmailCollection {
    constructor() {
        this.config = window.CONFIG || {};
        this.emailCollected = localStorage.getItem('emailCollected') === 'true';
        this.leadMagnets = {
            salaryReport: {
                title: '📊 Get Your Personalized Salary Report',
                description: 'Receive a detailed PDF report with salary trends, negotiation tips, and career insights for your role.',
                buttonText: 'Get Free Report'
            },
            salaryAlerts: {
                title: '🔔 Salary Update Alerts',
                description: 'Get notified when salary data changes in your area or new opportunities arise.',
                buttonText: 'Enable Alerts'
            },
            careerGuide: {
                title: '🚀 Career Advancement Guide',
                description: 'Download our comprehensive guide to advancing your career and increasing your salary.',
                buttonText: 'Download Guide'
            }
        };
        
        this.init();
    }

    init() {
        this.setupEmailPrompts();
        this.addEmailStyles();
    }

    setupEmailPrompts() {
        // Show email collection after salary check
        document.addEventListener('salaryCheckCompleted', (event) => {
            if (!this.emailCollected) {
                setTimeout(() => {
                    this.showEmailPrompt(event.detail);
                }, 5000); // Show after 5 seconds
            }
        });

        // Show exit-intent popup
        this.setupExitIntent();
    }

    showEmailPrompt(salaryResult) {
        const { isUnderpaid, jobTitle, percentile, experienceLevel } = salaryResult;

        let leadMagnet;
        if (isUnderpaid) {
            if (experienceLevel === 'entry') {
                leadMagnet = {
                    ...this.leadMagnets.careerGuide,
                    title: '🚀 Entry-Level Career Advancement Guide',
                    description: 'Get our comprehensive guide to advancing your early career and increasing your entry-level salary.'
                };
            } else if (experienceLevel === 'expert') {
                leadMagnet = {
                    ...this.leadMagnets.careerGuide,
                    title: '💼 Executive Compensation Strategy Guide',
                    description: 'Learn advanced strategies for negotiating executive-level compensation and benefits.'
                };
            } else {
                leadMagnet = this.leadMagnets.careerGuide;
            }
        } else if (percentile >= 75) {
            leadMagnet = this.leadMagnets.salaryAlerts;
        } else {
            leadMagnet = this.leadMagnets.salaryReport;
        }

        this.createEmailModal(leadMagnet, salaryResult);
    }

    createEmailModal(leadMagnet, salaryResult) {
        const modal = document.createElement('div');
        modal.className = 'email-modal-overlay';
        modal.innerHTML = `
            <div class="email-modal">
                <div class="email-header">
                    <h2>${leadMagnet.title}</h2>
                    <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="email-content">
                    <div class="lead-magnet-preview">
                        <div class="preview-icon">📄</div>
                        <p class="lead-description">${leadMagnet.description}</p>
                    </div>
                    
                    <form class="email-form" onsubmit="emailCollection.handleEmailSubmit(event)">
                        <div class="form-group">
                            <input 
                                type="email" 
                                id="userEmail" 
                                placeholder="Enter your email address"
                                class="email-input"
                                required
                            >
                        </div>
                        
                        <div class="form-group">
                            <input 
                                type="text" 
                                id="userName" 
                                placeholder="Your first name (optional)"
                                class="email-input"
                            >
                        </div>
                        
                        <button type="submit" class="email-submit-btn">
                            ${leadMagnet.buttonText}
                        </button>
                        
                        <div class="email-benefits">
                            <h4>What you'll get:</h4>
                            <ul>
                                <li>✅ Personalized salary insights</li>
                                <li>✅ Industry trend updates</li>
                                <li>✅ Career advancement tips</li>
                                <li>✅ Negotiation strategies</li>
                            </ul>
                        </div>
                        
                        <p class="privacy-note">
                            🔒 We respect your privacy. Unsubscribe anytime. No spam, ever.
                        </p>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Track email prompt view
        if (window.analytics) {
            window.analytics.trackEvent('email_prompt_shown', {
                lead_magnet: leadMagnet.title,
                trigger: 'salary_check_completed'
            });
        }
    }

    handleEmailSubmit(event) {
        event.preventDefault();
        
        const email = document.getElementById('userEmail').value;
        const name = document.getElementById('userName').value;
        
        // Validate email
        if (!this.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Track email collection
        if (window.analytics) {
            window.analytics.trackEvent('email_collected', {
                email_domain: email.split('@')[1],
                has_name: !!name
            });
        }

        // Store email (in real app, send to your email service)
        this.storeEmail(email, name);
        
        // Mark as collected
        localStorage.setItem('emailCollected', 'true');
        this.emailCollected = true;
        
        // Show success message
        this.showSuccessMessage();
        
        // Close modal
        setTimeout(() => {
            document.querySelector('.email-modal-overlay')?.remove();
        }, 2000);
    }

    storeEmail(email, name) {
        // In a real app, integrate with:
        // - Mailchimp API
        // - ConvertKit API  
        // - Klaviyo API
        // - Your own backend
        
        console.log('Email collected:', { email, name, timestamp: new Date() });
        
        // Demo: Show integration options
        const integrationInfo = `
📧 Email Integration Options:

1. Mailchimp (Popular)
   - Easy automation
   - Good templates
   - Free tier: 2,000 contacts

2. ConvertKit (Creator-focused)
   - Advanced automation
   - Good for courses/products
   - Free tier: 1,000 subscribers

3. Klaviyo (E-commerce)
   - Advanced segmentation
   - Great analytics
   - Free tier: 250 contacts

4. Custom Backend
   - Full control
   - Integrate with your database
   - Send via SendGrid/AWS SES

Collected: ${email} ${name ? `(${name})` : ''}
        `;
        
        // Store locally for demo
        const emails = JSON.parse(localStorage.getItem('collectedEmails') || '[]');
        emails.push({ email, name, timestamp: new Date().toISOString() });
        localStorage.setItem('collectedEmails', JSON.stringify(emails));
    }

    showSuccessMessage() {
        const modal = document.querySelector('.email-modal');
        if (modal) {
            modal.innerHTML = `
                <div class="success-content">
                    <div class="success-icon">🎉</div>
                    <h2>Thank You!</h2>
                    <p>Your personalized salary report will be sent to your email shortly.</p>
                    <p>Check your inbox (and spam folder) in the next few minutes.</p>
                </div>
            `;
        }
    }

    setupExitIntent() {
        let exitIntentShown = false;
        
        document.addEventListener('mouseleave', (event) => {
            if (event.clientY <= 0 && !exitIntentShown && !this.emailCollected) {
                exitIntentShown = true;
                this.showExitIntentPopup();
            }
        });
    }

    showExitIntentPopup() {
        const popup = document.createElement('div');
        popup.className = 'exit-intent-popup';
        popup.innerHTML = `
            <div class="exit-popup-content">
                <h3>Wait! Don't miss out on salary insights 📊</h3>
                <p>Get weekly salary updates and career tips delivered to your inbox.</p>
                <form class="exit-email-form" onsubmit="emailCollection.handleExitEmailSubmit(event)">
                    <input type="email" placeholder="Your email" class="exit-email-input" required>
                    <button type="submit" class="exit-submit-btn">Get Updates</button>
                </form>
                <button class="exit-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            popup.remove();
        }, 10000);
    }

    handleExitEmailSubmit(event) {
        event.preventDefault();
        const email = event.target.querySelector('.exit-email-input').value;
        
        if (this.isValidEmail(email)) {
            this.storeEmail(email, '');
            localStorage.setItem('emailCollected', 'true');
            
            // Show success and close
            event.target.innerHTML = '<p style="color: #059669; text-align: center;">✅ Subscribed! Thank you!</p>';
            setTimeout(() => {
                document.querySelector('.exit-intent-popup')?.remove();
            }, 2000);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    addEmailStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .email-modal-overlay {
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
            
            .email-modal {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                animation: slideUp 0.3s ease;
            }
            
            .email-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .email-header h2 {
                color: #1f2937;
                margin: 0;
                font-size: 1.5rem;
            }
            
            .close-modal {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #6b7280;
            }
            
            .email-content {
                padding: 2rem;
            }
            
            .lead-magnet-preview {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .preview-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .lead-description {
                color: #4b5563;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            
            .email-form {
                max-width: 400px;
                margin: 0 auto;
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            .email-input {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.2s ease;
            }
            
            .email-input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .email-submit-btn {
                width: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .email-submit-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .email-benefits {
                margin: 2rem 0;
                padding: 1.5rem;
                background: #f8fafc;
                border-radius: 8px;
            }
            
            .email-benefits h4 {
                color: #1f2937;
                margin-bottom: 1rem;
            }
            
            .email-benefits ul {
                list-style: none;
                padding: 0;
            }
            
            .email-benefits li {
                padding: 0.25rem 0;
                color: #4b5563;
            }
            
            .privacy-note {
                text-align: center;
                color: #6b7280;
                font-size: 0.9rem;
                margin-top: 1rem;
            }
            
            .success-content {
                text-align: center;
                padding: 3rem 2rem;
            }
            
            .success-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .exit-intent-popup {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                z-index: 1001;
                animation: slideInRight 0.3s ease;
                max-width: 350px;
            }
            
            .exit-popup-content {
                padding: 1.5rem;
                position: relative;
            }
            
            .exit-popup-content h3 {
                color: #1f2937;
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            
            .exit-popup-content p {
                color: #6b7280;
                margin-bottom: 1rem;
                font-size: 0.9rem;
            }
            
            .exit-email-form {
                display: flex;
                gap: 0.5rem;
            }
            
            .exit-email-input {
                flex: 1;
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            .exit-submit-btn {
                background: #667eea;
                color: white;
                border: none;
                padding: 0.75rem 1rem;
                border-radius: 6px;
                font-size: 0.9rem;
                cursor: pointer;
                white-space: nowrap;
            }
            
            .exit-close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            
            @media (max-width: 768px) {
                .email-modal {
                    margin: 1rem;
                    max-width: none;
                }
                
                .exit-intent-popup {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Admin function to view collected emails
    viewCollectedEmails() {
        const emails = JSON.parse(localStorage.getItem('collectedEmails') || '[]');
        console.table(emails);
        return emails;
    }
}

// Initialize email collection
document.addEventListener('DOMContentLoaded', () => {
    window.emailCollection = new EmailCollection();
});

// Export for global use
window.EmailCollection = EmailCollection;
