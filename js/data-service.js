// Government Data Service for Salary Information
class GovernmentDataService {
    constructor() {
        // Get configuration from config.js or environment
        this.config = window.CONFIG || {};
        this.blsApiKey = this.config.apis?.bls?.apiKey || null;
        this.baseUrls = {
            bls: this.config.apis?.bls?.baseUrl || 'https://api.bls.gov/publicAPI/v2/timeseries/data/',
            census: 'https://api.census.gov/data',
            // Add other government API endpoints
        };

        // Check if we should use mock data
        this.useMockData = this.config.features?.enableMockData || !this.blsApiKey;

        // Experience level multipliers for salary adjustments
        this.experienceMultipliers = {
            entry: 0.75,    // Entry level: 25% below average
            mid: 1.0,       // Mid-level: baseline
            senior: 1.35,   // Senior: 35% above average
            expert: 1.65    // Expert/Lead: 65% above average
        };
        
        // BLS Occupational Employment Statistics (OES) codes
        this.occupationCodes = {
            'software engineer': '15-1252',
            'software developer': '15-1252',
            'web developer': '15-1254',
            'data scientist': '15-2051',
            'data analyst': '15-2041',
            'teacher': '25-2031',
            'elementary teacher': '25-2021',
            'high school teacher': '25-2031',
            'nurse': '29-1141',
            'registered nurse': '29-1141',
            'accountant': '13-2011',
            'marketing manager': '11-2021',
            'project manager': '11-9199',
            'sales representative': '41-4012',
            'financial analyst': '13-2051',
            'human resources': '13-1071',
            'graphic designer': '27-1024',
            'mechanical engineer': '17-2141',
            'electrical engineer': '17-2071',
            'civil engineer': '17-2051'
        };

        // State and metro area codes for location-based salary data
        this.locationCodes = {
            'alabama': '01',
            'alaska': '02',
            'arizona': '04',
            'arkansas': '05',
            'california': '06',
            'colorado': '08',
            'connecticut': '09',
            'delaware': '10',
            'florida': '12',
            'georgia': '13',
            // Add more states...
            
            // Major metro areas
            'new york': 'M35620',
            'los angeles': 'M31080',
            'chicago': 'M16980',
            'dallas': 'M19100',
            'houston': 'M26420',
            'washington dc': 'M47900',
            'miami': 'M33100',
            'philadelphia': 'M37980',
            'atlanta': 'M12060',
            'boston': 'M14460',
            'san francisco': 'M41860',
            'phoenix': 'M38060',
            'riverside': 'M40140',
            'detroit': 'M19820',
            'seattle': 'M42660'
        };
    }

    /**
     * Get salary data from Bureau of Labor Statistics
     * @param {string} jobTitle - The job title to search for
     * @param {string} location - The location (state or metro area)
     * @returns {Promise<Object>} Salary data object
     */
    async getBLSSalaryData(jobTitle, location) {
        try {
            const occupationCode = this.findOccupationCode(jobTitle);
            const locationCode = this.findLocationCode(location);
            
            if (!occupationCode) {
                throw new Error(`Occupation code not found for: ${jobTitle}`);
            }

            // Construct BLS series ID for Occupational Employment Statistics
            // Format: OEUS[Area][Industry][Occupation][Data Type]
            // Data Type: 04 = Mean annual wage, 03 = Median annual wage
            const seriesId = `OEUS${locationCode}000000${occupationCode}04`;
            
            const response = await this.fetchBLSData([seriesId]);
            
            if (response && response.Results && response.Results.series[0]) {
                const data = response.Results.series[0].data[0]; // Most recent year
                const meanWage = parseFloat(data.value);
                
                return {
                    meanAnnualWage: meanWage,
                    year: data.year,
                    period: data.period,
                    source: 'Bureau of Labor Statistics - Occupational Employment Statistics',
                    occupationCode,
                    locationCode,
                    seriesId
                };
            }
            
            throw new Error('No data found in BLS response');
            
        } catch (error) {
            console.error('Error fetching BLS data:', error);
            // Fallback to mock data if API fails
            return this.getMockSalaryData(jobTitle, location);
        }
    }

    /**
     * Fetch data from BLS API
     * @param {Array<string>} seriesIds - Array of BLS series IDs
     * @returns {Promise<Object>} BLS API response
     */
    async fetchBLSData(seriesIds) {
        const url = this.baseUrls.bls;
        const payload = {
            seriesid: seriesIds,
            startyear: '2022',
            endyear: '2023',
            registrationkey: this.blsApiKey
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`BLS API error: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Find occupation code for a given job title
     * @param {string} jobTitle - The job title
     * @returns {string|null} The occupation code
     */
    findOccupationCode(jobTitle) {
        const normalizedTitle = jobTitle.toLowerCase().trim();
        
        // Direct match
        if (this.occupationCodes[normalizedTitle]) {
            return this.occupationCodes[normalizedTitle];
        }
        
        // Partial match
        for (const [key, code] of Object.entries(this.occupationCodes)) {
            if (normalizedTitle.includes(key) || key.includes(normalizedTitle.split(' ')[0])) {
                return code;
            }
        }
        
        return null;
    }

    /**
     * Find location code for a given location
     * @param {string} location - The location string
     * @returns {string} The location code (defaults to national if not found)
     */
    findLocationCode(location) {
        const normalizedLocation = location.toLowerCase().trim();
        
        // Check for metro areas first (more specific)
        for (const [key, code] of Object.entries(this.locationCodes)) {
            if (code.startsWith('M') && normalizedLocation.includes(key)) {
                return code.substring(1); // Remove 'M' prefix for API
            }
        }
        
        // Check for states
        for (const [key, code] of Object.entries(this.locationCodes)) {
            if (!code.startsWith('M') && normalizedLocation.includes(key)) {
                return code + '0000'; // State code format
            }
        }
        
        // Default to national data
        return '0000000';
    }

    /**
     * Get comprehensive salary data including percentiles
     * @param {string} jobTitle - The job title
     * @param {string} location - The location
     * @param {string} experienceLevel - The experience level (entry, mid, senior, expert)
     * @returns {Promise<Object>} Comprehensive salary data
     */
    async getComprehensiveSalaryData(jobTitle, location, experienceLevel = 'mid') {
        try {
            const blsData = await this.getBLSSalaryData(jobTitle, location);

            // Apply experience level multiplier
            const experienceMultiplier = this.experienceMultipliers[experienceLevel] || 1.0;
            const adjustedMeanWage = Math.round(blsData.meanAnnualWage * experienceMultiplier);

            // Calculate estimated percentiles based on experience-adjusted mean wage
            const estimatedPercentiles = {
                p10: Math.round(adjustedMeanWage * 0.65),
                p25: Math.round(adjustedMeanWage * 0.80),
                p50: Math.round(adjustedMeanWage * 0.95), // Median is typically slightly below mean
                p75: Math.round(adjustedMeanWage * 1.15),
                p90: Math.round(adjustedMeanWage * 1.40),
                mean: adjustedMeanWage
            };

            return {
                ...blsData,
                meanAnnualWage: adjustedMeanWage,
                percentiles: estimatedPercentiles,
                jobTitle,
                location,
                experienceLevel,
                experienceMultiplier,
                lastUpdated: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error getting comprehensive salary data:', error);
            return this.getMockSalaryData(jobTitle, location, experienceLevel);
        }
    }

    /**
     * Mock salary data for fallback when APIs are unavailable
     * @param {string} jobTitle - The job title
     * @param {string} location - The location
     * @param {string} experienceLevel - The experience level
     * @returns {Object} Mock salary data
     */
    getMockSalaryData(jobTitle, location, experienceLevel = 'mid') {
        const baseSalaries = {
            'software engineer': 95000,
            'software developer': 90000,
            'web developer': 75000,
            'data scientist': 110000,
            'data analyst': 70000,
            'teacher': 50000,
            'nurse': 75000,
            'accountant': 65000,
            'marketing manager': 80000,
            'project manager': 85000,
            'sales representative': 55000,
            'financial analyst': 75000
        };

        const locationMultipliers = {
            'new york': 1.3,
            'san francisco': 1.4,
            'los angeles': 1.2,
            'chicago': 1.1,
            'austin': 1.05,
            'seattle': 1.15,
            'boston': 1.2,
            'washington': 1.15,
            'denver': 1.0,
            'atlanta': 0.95,
            'phoenix': 0.9,
            'dallas': 0.95,
            'miami': 0.95
        };

        const normalizedTitle = jobTitle.toLowerCase();
        const normalizedLocation = location.toLowerCase();
        
        let baseSalary = 70000; // Default
        for (const [key, salary] of Object.entries(baseSalaries)) {
            if (normalizedTitle.includes(key) || key.includes(normalizedTitle.split(' ')[0])) {
                baseSalary = salary;
                break;
            }
        }

        let multiplier = 1.0;
        for (const [key, mult] of Object.entries(locationMultipliers)) {
            if (normalizedLocation.includes(key)) {
                multiplier = mult;
                break;
            }
        }

        // Apply experience level multiplier
        const experienceMultiplier = this.experienceMultipliers[experienceLevel] || 1.0;
        const adjustedMean = Math.round(baseSalary * multiplier * experienceMultiplier);

        return {
            meanAnnualWage: adjustedMean,
            percentiles: {
                p10: Math.round(adjustedMean * 0.65),
                p25: Math.round(adjustedMean * 0.80),
                p50: Math.round(adjustedMean * 0.95),
                p75: Math.round(adjustedMean * 1.15),
                p90: Math.round(adjustedMean * 1.40),
                mean: adjustedMean
            },
            year: '2023',
            source: 'Based on Bureau of Labor Statistics salary patterns and government data',
            jobTitle,
            location,
            experienceLevel,
            experienceMultiplier,
            lastUpdated: new Date().toISOString(),
            isMockData: true
        };
    }

    /**
     * Validate and normalize job title input
     * @param {string} jobTitle - Raw job title input
     * @returns {string} Normalized job title
     */
    normalizeJobTitle(jobTitle) {
        return jobTitle.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove special characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    /**
     * Validate and normalize location input
     * @param {string} location - Raw location input
     * @returns {string} Normalized location
     */
    normalizeLocation(location) {
        return location.toLowerCase()
            .replace(/[^\w\s,]/g, '') // Remove special characters except commas
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }
}

// Export for use in main application
window.GovernmentDataService = GovernmentDataService;
