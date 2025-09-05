// Salary Comparison Application
class SalaryChecker {
    constructor() {
        this.form = document.getElementById('salaryForm');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultContent = document.getElementById('resultContent');
        this.submitBtn = document.getElementById('submitBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.btnText = document.querySelector('.btn-text');
        this.dataService = new GovernmentDataService();

        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupInputValidation();
    }

    setupInputValidation() {
        const salaryInput = document.getElementById('currentSalary');
        const jobTitleInput = document.getElementById('jobTitle');
        const locationInput = document.getElementById('location');

        // Format salary input with better validation
        salaryInput.addEventListener('input', (e) => {
            // Remove all non-digit characters
            let value = e.target.value.replace(/[^\d]/g, '');

            if (value) {
                const numValue = parseInt(value);
                // Allow salaries from $1,000 to $9,999,999 (7 digits)
                if (numValue >= 1000 && numValue <= 9999999) {
                    // Format with commas for readability
                    e.target.value = numValue.toLocaleString();
                    e.target.classList.remove('error');
                } else if (numValue > 0 && numValue < 1000) {
                    // Show the number but mark as error (too low)
                    e.target.value = numValue.toLocaleString();
                    e.target.classList.add('error');
                } else if (numValue > 9999999) {
                    // Show the number but mark as error (too high)
                    e.target.value = numValue.toLocaleString();
                    e.target.classList.add('error');
                } else {
                    e.target.classList.add('error');
                }
            } else {
                // Clear error state when input is empty
                e.target.classList.remove('error');
            }
        });

        // Job title validation and suggestions
        jobTitleInput.addEventListener('input', this.debounce((e) => {
            const value = e.target.value.trim();
            if (value.length >= 2) {
                e.target.classList.remove('error');
                this.showJobTitleSuggestions(value);
            } else if (value.length > 0) {
                e.target.classList.add('error');
            }
        }, 300));

        // Location validation
        locationInput.addEventListener('input', this.debounce((e) => {
            const value = e.target.value.trim();
            if (value.length >= 2) {
                e.target.classList.remove('error');
            } else if (value.length > 0) {
                e.target.classList.add('error');
            }
        }, 300));

        // Experience level validation
        const experienceLevelInput = document.getElementById('experienceLevel');
        experienceLevelInput.addEventListener('change', (e) => {
            if (e.target.value) {
                e.target.classList.remove('error');
            } else {
                e.target.classList.add('error');
            }
        });

        // Add error styling
        this.addErrorStyles();

        // Add helpful hints for salary input
        this.addSalaryHints();
    }

    addSalaryHints() {
        const salaryInput = document.getElementById('currentSalary');
        const helpText = salaryInput.parentNode.parentNode.querySelector('.form-help');

        if (helpText) {
            helpText.innerHTML = 'Enter your gross annual salary before taxes (e.g., 75,000 or 125,000)';
        }
    }

    addErrorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-input.error {
                border-color: #ef4444;
                background-color: #fef2f2;
            }
            .suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                z-index: 10;
                max-height: 200px;
                overflow-y: auto;
            }
            .suggestion-item {
                padding: 0.75rem 1rem;
                cursor: pointer;
                border-bottom: 1px solid #f3f4f6;
            }
            .suggestion-item:hover {
                background-color: #f9fafb;
            }
            .suggestion-item:last-child {
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);
    }

    showJobTitleSuggestions(input) {
        const commonJobTitles = [
            'Software Engineer', 'Software Developer', 'Web Developer', 'Data Scientist',
            'Data Analyst', 'Teacher', 'Elementary Teacher', 'High School Teacher',
            'Registered Nurse', 'Nurse Practitioner', 'Accountant', 'Financial Analyst',
            'Marketing Manager', 'Project Manager', 'Sales Representative', 'Sales Manager',
            'Human Resources Manager', 'Graphic Designer', 'Mechanical Engineer',
            'Electrical Engineer', 'Civil Engineer', 'Business Analyst', 'Product Manager'
        ];

        const matches = commonJobTitles.filter(title =>
            title.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5);

        this.displaySuggestions('jobTitle', matches);
    }

    displaySuggestions(inputId, suggestions) {
        const input = document.getElementById(inputId);
        const existingSuggestions = input.parentNode.querySelector('.suggestions');

        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        if (suggestions.length === 0) return;

        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                input.value = suggestion;
                suggestionsDiv.remove();
                input.classList.remove('error');
            });
            suggestionsDiv.appendChild(item);
        });

        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(suggestionsDiv);

        // Remove suggestions when clicking outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!input.parentNode.contains(e.target)) {
                    suggestionsDiv.remove();
                }
            }, { once: true });
        }, 100);
    }

    parseSalaryInput(salaryString) {
        if (!salaryString) return 0;

        // Remove all non-digit characters (commas, dollar signs, spaces, etc.)
        const cleanedValue = salaryString.toString().replace(/[^\d]/g, '');

        if (!cleanedValue) return 0;

        const numValue = parseInt(cleanedValue);

        // Return the parsed number, validation will happen in handleSubmit
        return isNaN(numValue) ? 0 : numValue;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const jobTitle = formData.get('jobTitle').trim();
        const currentSalary = this.parseSalaryInput(formData.get('currentSalary'));
        const location = formData.get('location').trim();
        const experienceLevel = formData.get('experienceLevel');

        // Enhanced validation
        if (!jobTitle || jobTitle.length < 2) {
            this.showError('Please enter a valid job title (at least 2 characters)');
            return;
        }

        if (!currentSalary || currentSalary < 1000 || currentSalary > 9999999) {
            this.showError('Please enter a valid salary between $1,000 and $9,999,999');
            return;
        }

        if (!location || location.length < 2) {
            this.showError('Please enter a valid location (city, state or ZIP code)');
            return;
        }

        if (!experienceLevel) {
            this.showError('Please select your experience level');
            return;
        }

        this.setLoading(true);
        
        try {
            const result = await this.checkSalary(jobTitle, currentSalary, location, experienceLevel);
            this.displayResults(result);
        } catch (error) {
            console.error('Error checking salary:', error);
            this.showError('Unable to check salary at this time. Please try again later.');
        } finally {
            this.setLoading(false);
        }
    }

    async checkSalary(jobTitle, currentSalary, location, experienceLevel) {
        try {
            // Get comprehensive salary data from government sources
            const salaryData = await this.dataService.getComprehensiveSalaryData(jobTitle, location, experienceLevel);

            const percentile = this.calculatePercentile(currentSalary, salaryData.percentiles);
            const isUnderpaid = percentile < 25; // Below 25th percentile = underpaid

            return {
                isUnderpaid,
                percentile,
                currentSalary,
                jobTitle,
                location,
                experienceLevel,
                salaryData,
                comparison: this.generateComparison(currentSalary, salaryData.percentiles)
            };
        } catch (error) {
            console.error('Error in checkSalary:', error);
            // Fallback to mock data
            const mockData = this.dataService.getMockSalaryData(jobTitle, location, experienceLevel);
            const percentile = this.calculatePercentile(currentSalary, mockData.percentiles);
            const isUnderpaid = percentile < 25;

            return {
                isUnderpaid,
                percentile,
                currentSalary,
                jobTitle,
                location,
                experienceLevel,
                salaryData: mockData,
                comparison: this.generateComparison(currentSalary, mockData.percentiles)
            };
        }
    }



    calculatePercentile(salary, percentiles) {
        if (salary <= percentiles.p10) return 10;
        if (salary <= percentiles.p25) return 25;
        if (salary <= percentiles.p50) return 50;
        if (salary <= percentiles.p75) return 75;
        if (salary <= percentiles.p90) return 90;
        return 95;
    }

    generateComparison(currentSalary, percentiles) {
        const difference25 = currentSalary - percentiles.p25;
        const differenceMedian = currentSalary - percentiles.p50;
        const difference75 = currentSalary - percentiles.p75;

        return {
            vs25th: {
                amount: Math.abs(difference25),
                isHigher: difference25 > 0,
                percentage: Math.round((Math.abs(difference25) / percentiles.p25) * 100)
            },
            vsMedian: {
                amount: Math.abs(differenceMedian),
                isHigher: differenceMedian > 0,
                percentage: Math.round((Math.abs(differenceMedian) / percentiles.p50) * 100)
            },
            vs75th: {
                amount: Math.abs(difference75),
                isHigher: difference75 > 0,
                percentage: Math.round((Math.abs(difference75) / percentiles.p75) * 100)
            }
        };
    }

    displayResults(result) {
        const { isUnderpaid, percentile, currentSalary, jobTitle, location, experienceLevel, salaryData, comparison } = result;
        
        const resultClass = isUnderpaid ? 'result-underpaid' : 'result-fair';
        const resultTitle = isUnderpaid 
            ? 'Yes, you may be underpaid' 
            : 'No, you are making average or above-average salary';
        
        const experienceLevelText = this.getExperienceLevelText(experienceLevel);
        const resultMessage = isUnderpaid
            ? `Based on government salary data for ${experienceLevelText} professionals, you earn less than 75% of people in similar roles in your area. Your salary is in the ${percentile}th percentile.`
            : `Based on government salary data for ${experienceLevelText} professionals, you are earning at or above the average salary for your position and location. Your salary is in the ${percentile}th percentile.`;

        this.resultContent.innerHTML = `
            <div class="${resultClass}">
                <h2 class="result-title">${resultTitle}</h2>
                <p class="result-details">${resultMessage}</p>
                
                <div class="salary-comparison">
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">Salary Comparison for ${experienceLevelText} ${jobTitle} in ${location}</h3>
                    <div class="comparison-item">
                        <span class="comparison-label">Your Salary:</span>
                        <span class="comparison-value">$${currentSalary.toLocaleString()}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">25th Percentile:</span>
                        <span class="comparison-value">$${salaryData.percentiles.p25.toLocaleString()}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Median (50th):</span>
                        <span class="comparison-value">$${salaryData.percentiles.p50.toLocaleString()}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">75th Percentile:</span>
                        <span class="comparison-value">$${salaryData.percentiles.p75.toLocaleString()}</span>
                    </div>
                    <div class="comparison-item">
                        <span class="comparison-label">Average (Mean):</span>
                        <span class="comparison-value">$${salaryData.meanAnnualWage.toLocaleString()}</span>
                    </div>
                    <div class="comparison-item experience-info">
                        <span class="comparison-label">Experience Level:</span>
                        <span class="comparison-value">${experienceLevelText}</span>
                    </div>
                </div>

                <div class="result-details">
                    <p><strong>Key Insights:</strong></p>
                    <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        <li>You earn ${comparison.vsMedian.isHigher ? 'more' : 'less'} than the median by $${comparison.vsMedian.amount.toLocaleString()} (${comparison.vsMedian.percentage}%)</li>
                        <li>You earn ${comparison.vs75th.isHigher ? 'more' : 'less'} than the 75th percentile by $${comparison.vs75th.amount.toLocaleString()} (${comparison.vs75th.percentage}%)</li>
                    </ul>

                    ${this.generateRecommendations(result)}

                    <div style="margin-top: 1.5rem; padding: 1rem; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                        <p style="font-size: 0.875rem; color: #0c4a6e; margin: 0;">
                            <strong>Next Steps:</strong> ${this.getNextSteps(result)}
                        </p>
                    </div>

                    <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                        <em>Data source: ${salaryData.source}</em>
                        ${salaryData.isMockData ? ' (Using estimated data - connect to government APIs for real-time data)' : ''}
                    </p>
                </div>
            </div>
        `;

        this.resultsSection.classList.remove('hidden');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
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

    showError(message) {
        this.resultContent.innerHTML = `
            <div class="result-content" style="border-left: 4px solid #ef4444;">
                <h2 style="color: #dc2626; margin-bottom: 1rem;">Error</h2>
                <p style="color: #4b5563;">${message}</p>
            </div>
        `;
        this.resultsSection.classList.remove('hidden');
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.btnText.textContent = 'Checking...';
            this.loadingSpinner.style.display = 'inline-block';
        } else {
            this.submitBtn.disabled = false;
            this.btnText.textContent = 'Check My Salary';
            this.loadingSpinner.style.display = 'none';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateRecommendations(result) {
        const { isUnderpaid, percentile, experienceLevel } = result;

        if (isUnderpaid) {
            const experienceSpecificTips = this.getExperienceSpecificTips(experienceLevel, true);
            return `
                <div style="margin-top: 1.5rem; padding: 1rem; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="color: #dc2626; font-weight: 600; margin-bottom: 0.5rem;">Recommendations for ${this.getExperienceLevelText(experienceLevel)} Salary Improvement:</p>
                    <ul style="margin-left: 1.5rem; color: #7f1d1d; font-size: 0.875rem;">
                        ${experienceSpecificTips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            const experienceSpecificTips = this.getExperienceSpecificTips(experienceLevel, false);
            return `
                <div style="margin-top: 1.5rem; padding: 1rem; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="color: #059669; font-weight: 600; margin-bottom: 0.5rem;">You're doing well for ${this.getExperienceLevelText(experienceLevel)}! Consider:</p>
                    <ul style="margin-left: 1.5rem; color: #065f46; font-size: 0.875rem;">
                        ${experienceSpecificTips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }

    getExperienceSpecificTips(experienceLevel, isUnderpaid) {
        const tips = {
            entry: {
                underpaid: [
                    'Focus on building core skills and gaining certifications',
                    'Document your learning progress and early achievements',
                    'Consider switching companies for better entry-level opportunities',
                    'Network with professionals in your field for mentorship',
                    'Look for companies known for investing in junior talent'
                ],
                fair: [
                    'Continue building your skill foundation',
                    'Seek out stretch assignments and new responsibilities',
                    'Find a mentor to guide your career development',
                    'Start building your professional network',
                    'Focus on learning rather than just earning in early career'
                ]
            },
            mid: {
                underpaid: [
                    'Research market rates for your role and experience level',
                    'Document your achievements and quantifiable impact',
                    'Consider asking for a salary review with your manager',
                    'Explore opportunities at other companies',
                    'Invest in specialized skills to increase your value'
                ],
                fair: [
                    'Continue developing your skills for future growth',
                    'Consider total compensation beyond base salary',
                    'Explore leadership or specialized roles',
                    'Build expertise in high-demand areas',
                    'Start considering your next career level'
                ]
            },
            senior: {
                underpaid: [
                    'Leverage your experience to negotiate better compensation',
                    'Highlight your leadership and mentoring contributions',
                    'Consider senior roles at companies that value experience',
                    'Explore consulting or contract opportunities',
                    'Document your strategic impact on business outcomes'
                ],
                fair: [
                    'Focus on strategic leadership and business impact',
                    'Consider executive education or advanced certifications',
                    'Explore opportunities to lead larger teams or projects',
                    'Build relationships with executive leadership',
                    'Consider transitioning to management or specialized expert roles'
                ]
            },
            expert: {
                underpaid: [
                    'Your expertise should command premium compensation',
                    'Consider executive or principal-level roles',
                    'Explore opportunities at companies that value senior talent',
                    'Consider consulting, advisory, or board positions',
                    'Negotiate for equity, bonuses, and comprehensive benefits'
                ],
                fair: [
                    'Focus on strategic vision and organizational impact',
                    'Consider C-level or VP opportunities',
                    'Explore board positions or advisory roles',
                    'Mentor the next generation of leaders',
                    'Consider starting your own venture or consulting practice'
                ]
            }
        };

        return tips[experienceLevel]?.[isUnderpaid ? 'underpaid' : 'fair'] || tips.mid[isUnderpaid ? 'underpaid' : 'fair'];
    }

    getNextSteps(result) {
        const { isUnderpaid, percentile } = result;

        if (isUnderpaid) {
            if (percentile <= 10) {
                return "Your salary is significantly below market rate. Consider immediate action to address this gap.";
            } else {
                return "Schedule a conversation with your manager about salary adjustment opportunities.";
            }
        } else {
            if (percentile >= 75) {
                return "You're earning well above average. Focus on career growth and skill development.";
            } else {
                return "You're earning fairly. Consider opportunities for advancement or skill enhancement.";
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SalaryChecker();
});

// Initialize Google AdSense ads
window.addEventListener('load', () => {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log('AdSense not loaded');
    }
});
