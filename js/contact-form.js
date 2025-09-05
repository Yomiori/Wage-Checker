// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitContactBtn');
        this.loadingSpinner = document.getElementById('contactLoadingSpinner');
        this.btnText = document.querySelector('.btn-text');
        this.messageTextarea = document.getElementById('message');
        this.charCount = document.getElementById('charCount');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupCharacterCounter();
            this.setupFormSubmission();
        }
    }

    setupFormValidation() {
        // Real-time validation for all form fields
        const fields = ['name', 'email', 'subject', 'message'];
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });

        // Email format validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('input', () => {
                if (emailField.value && !this.isValidEmail(emailField.value)) {
                    this.showFieldError('email', 'Please enter a valid email address');
                } else {
                    this.clearFieldError('email');
                }
            });
        }
    }

    setupCharacterCounter() {
        if (this.messageTextarea && this.charCount) {
            this.messageTextarea.addEventListener('input', () => {
                const length = this.messageTextarea.value.length;
                this.charCount.textContent = length;
                
                // Change color based on character count
                if (length > 900) {
                    this.charCount.style.color = '#ef4444'; // Red
                } else if (length > 700) {
                    this.charCount.style.color = '#f59e0b'; // Orange
                } else {
                    this.charCount.style.color = '#6b7280'; // Gray
                }
                
                // Limit to 1000 characters
                if (length > 1000) {
                    this.messageTextarea.value = this.messageTextarea.value.substring(0, 1000);
                    this.charCount.textContent = '1000';
                }
            });
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    async handleFormSubmit() {
        // Validate all fields before submission
        if (!this.validateAllFields()) {
            this.showError('Please fix the errors above before submitting.');
            return;
        }

        this.setLoading(true);

        try {
            // Get form data
            const formData = new FormData(this.form);
            
            // Track form submission
            if (window.analytics) {
                window.analytics.trackEvent('contact_form_submit', {
                    subject: formData.get('subject'),
                    has_job_title: !!formData.get('jobTitle'),
                    has_location: !!formData.get('location')
                });
            }

            // Submit to Netlify
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                this.showSuccess();
                // Redirect to success page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/contact-success.html';
                }, 2000);
            } else {
                throw new Error('Form submission failed');
            }

        } catch (error) {
            console.error('Contact form error:', error);
            this.showError('Failed to send message. Please try again or email us directly at Yomiori.Ventures@gmail.com');
            
            // Track error
            if (window.analytics) {
                window.analytics.trackError(error, 'Contact Form Submission');
            }
        } finally {
            this.setLoading(false);
        }
    }

    validateAllFields() {
        let isValid = true;
        const requiredFields = ['name', 'email', 'subject', 'message'];
        
        requiredFields.forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const value = field.value.trim();
        
        // Clear previous errors
        this.clearFieldError(fieldName);
        
        // Required field validation
        if (!value) {
            this.showFieldError(fieldName, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        // Specific field validations
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    this.showFieldError(fieldName, 'Name must be at least 2 characters');
                    return false;
                }
                break;
                
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    this.showFieldError(fieldName, 'Message must be at least 10 characters');
                    return false;
                }
                if (value.length > 1000) {
                    this.showFieldError(fieldName, 'Message must be less than 1000 characters');
                    return false;
                }
                break;
        }

        return true;
    }

    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const field = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (field) {
            field.classList.add('error');
        }
    }

    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const field = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        if (field) {
            field.classList.remove('error');
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.btnText.textContent = 'Sending...';
            this.loadingSpinner.style.display = 'inline-block';
        } else {
            this.submitBtn.disabled = false;
            this.btnText.textContent = 'Send Message';
            this.loadingSpinner.style.display = 'none';
        }
    }

    showSuccess() {
        const messagesContainer = document.getElementById('formMessages');
        const successMessage = document.getElementById('successMessage');
        
        if (messagesContainer && successMessage) {
            messagesContainer.classList.remove('hidden');
            successMessage.classList.remove('hidden');
            
            // Scroll to success message
            messagesContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showError(message) {
        const messagesContainer = document.getElementById('formMessages');
        const errorMessage = document.getElementById('errorMessage');
        
        if (messagesContainer && errorMessage) {
            messagesContainer.classList.remove('hidden');
            errorMessage.classList.remove('hidden');
            
            // Update error message text
            const errorText = errorMessage.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
            
            // Scroll to error message
            messagesContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Export for global use
window.ContactForm = ContactForm;
