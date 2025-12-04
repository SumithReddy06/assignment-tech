/**
 * Dataset API Service - Provides endpoints for data filtering and calculations
 * Simulates API responses with actual dataset processing
 */

import { getDataset } from './datasetAnalysisService';

/**
 * Extract numeric rating from various formats
 */
function extractRating(ratingText) {
  if (!ratingText) return 0;
  
  // Try different formats
  // Format 1: "Rated X out of 5 stars"
  let match = ratingText.match(/Rated\s+(\d)/);
  if (match) return parseInt(match[1]);
  
  // Format 2: Just a number "4.5" or "5"
  match = ratingText.match(/(\d+\.?\d*)/);
  if (match) {
    const rating = parseFloat(match[1]);
    return Math.round(rating); // Round to nearest integer
  }
  
  return 0;
}

/**
 * Filter dataset records based on criteria
 */
export async function filterDatasetRecords(filterCriteria = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataset = getDataset();
        if (!dataset || !dataset.reviews) {
          resolve({ success: false, records: [], total: 0 });
          return;
        }

        let filtered = [...dataset.reviews];

        // Filter by category
        if (filterCriteria.category) {
          filtered = filtered.filter(r => 
            r.Product_category?.toLowerCase() === filterCriteria.category.toLowerCase()
          );
        }

        // Filter by rating range
        if (filterCriteria.minRating !== undefined && filterCriteria.maxRating !== undefined) {
          filtered = filtered.filter(r => {
            const rating = parseInt(r.rating) || 0;
            return rating >= filterCriteria.minRating && rating <= filterCriteria.maxRating;
          });
        }

        // Filter by country
        if (filterCriteria.country) {
          filtered = filtered.filter(r => 
            r.country?.toLowerCase() === filterCriteria.country.toLowerCase()
          );
        }

        // Filter by sentiment
        if (filterCriteria.sentiment) {
          filtered = filtered.filter(r => {
            const rating = parseInt(r.rating) || 0;
            if (filterCriteria.sentiment === 'positive') return rating >= 4;
            if (filterCriteria.sentiment === 'neutral') return rating === 3;
            if (filterCriteria.sentiment === 'negative') return rating <= 2;
            return true;
          });
        }

        // Remove incomplete records
        filtered = filtered.filter(r => 
          r.text && r.country && r.rating
        );

        // Apply limit
        const limit = filterCriteria.limit || 100;
        const offset = filterCriteria.offset || 0;
        const paginated = filtered.slice(offset, offset + limit);

        resolve({
          success: true,
          records: paginated,
          total: filtered.length,
          returned: paginated.length,
          filterCriteria
        });
      } catch (error) {
        console.error('Error filtering records:', error);
        resolve({ success: false, records: [], total: 0, error: error.message });
      }
    }, 300); // Simulate API latency
  });
}

/**
 * Calculate NPS for filtered records
 */
export async function calculateNPS(filterCriteria = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataset = getDataset();
        if (!dataset || !dataset.reviews) {
          resolve({ success: false, nps: 0, breakdown: {} });
          return;
        }

        let records = [...dataset.reviews];

        // Apply filters
        if (filterCriteria.category) {
          records = records.filter(r => 
            r.Product_category?.toLowerCase() === filterCriteria.category.toLowerCase()
          );
        }
        if (filterCriteria.country) {
          records = records.filter(r => 
            r.country?.toLowerCase() === filterCriteria.country.toLowerCase()
          );
        }

        records = records.filter(r => r.rating);

        // Calculate NPS based on rating (1-5 star scale)
        // In NPS context: 4-5 stars = Promoters, 3 stars = Passives, 1-2 stars = Detractors
        let promoters = 0, passives = 0, detractors = 0;
        records.forEach(r => {
          const rating = extractRating(r.rating);
          if (rating >= 4) promoters++;
          else if (rating === 3) passives++;
          else if (rating <= 2) detractors++;
        });

        const total = records.length;
        const nps = total > 0 ? ((promoters - detractors) / total) * 100 : 0;

        resolve({
          success: true,
          nps: parseFloat(nps.toFixed(2)),
          promoters,
          passives,
          detractors,
          total,
          breakdown: {
            promotersPercent: parseFloat(((promoters / total) * 100).toFixed(2)),
            passivesPercent: parseFloat(((passives / total) * 100).toFixed(2)),
            detractorsPercent: parseFloat(((detractors / total) * 100).toFixed(2))
          }
        });
      } catch (error) {
        console.error('Error calculating NPS:', error);
        resolve({ success: false, nps: 0, error: error.message });
      }
    }, 500);
  });
}

/**
 * Calculate sentiment distribution
 */
export async function calculateSentiment(filterCriteria = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataset = getDataset();
        if (!dataset || !dataset.reviews) {
          resolve({ success: false, sentiment: {} });
          return;
        }

        let records = [...dataset.reviews];

        // Apply filters
        if (filterCriteria.category) {
          records = records.filter(r => 
            r.Product_category?.toLowerCase() === filterCriteria.category.toLowerCase()
          );
        }

        // Filter by rating and presence of a text/title (some datasets may not have a numeric review_id field)
        records = records.filter(r => r.rating && (r.review_id || r.text || r.title));

        // Calculate sentiment based on rating (since sentiment column may not exist)
        let positive = 0, neutral = 0, negative = 0;
        records.forEach(r => {
          const rating = extractRating(r.rating);
          if (rating >= 4) positive++;
          else if (rating === 3) neutral++;
          else if (rating <= 2) negative++;
        });

        const total = records.length;

        resolve({
          success: true,
          sentiment: {
            positive: total > 0 ? parseFloat(((positive / total) * 100).toFixed(2)) : 0,
            neutral: total > 0 ? parseFloat(((neutral / total) * 100).toFixed(2)) : 0,
            negative: total > 0 ? parseFloat(((negative / total) * 100).toFixed(2)) : 0
          },
          breakdown: {
            positive,
            neutral,
            negative,
            total
          }
        });
      } catch (error) {
        console.error('Error calculating sentiment:', error);
        resolve({ success: false, sentiment: {}, error: error.message });
      }
    }, 400);
  });
}

/**
 * Get category statistics
 */
export async function getCategoryStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataset = getDataset();
        if (!dataset || !dataset.reviews) {
          resolve({ success: false, categories: {} });
          return;
        }

        const records = dataset.reviews.filter(r => r.rating);
        const categories = {};

        records.forEach(r => {
          // Use Product_category if available, otherwise default
          const cat = r.Product_category || 'Other Products';
          if (!categories[cat]) {
            categories[cat] = { count: 0, totalRating: 0, avgRating: 0 };
          }
          categories[cat].count++;
          categories[cat].totalRating += extractRating(r.rating);
        });

        // Calculate averages and ensure valid data
        Object.keys(categories).forEach(cat => {
          const count = categories[cat].count;
          categories[cat].avgRating = count > 0 ? parseFloat(
            (categories[cat].totalRating / count).toFixed(2)
          ) : 0;
        });

        resolve({
          success: true,
          categories,
          totalCategories: Object.keys(categories).length
        });
      } catch (error) {
        console.error('Error getting category stats:', error);
        resolve({ success: false, categories: {}, error: error.message });
      }
    }, 400);
  });
}

/**
 * Search reviews
 */
export async function searchReviews(searchTerm, filterCriteria = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataset = getDataset();
        if (!dataset || !dataset.reviews) {
          resolve({ success: false, results: [] });
          return;
        }

        const term = searchTerm.toLowerCase();
        let results = dataset.reviews.filter(r => {
          const text = (r.text || '').toLowerCase();
          const title = (r.title || '').toLowerCase();
          return text.includes(term) || title.includes(term);
        });

        // Apply filters
        if (filterCriteria.category) {
          results = results.filter(r => 
            r.Product_category?.toLowerCase() === filterCriteria.category.toLowerCase()
          );
        }

        // Limit results
        const limit = filterCriteria.limit || 20;
        results = results.slice(0, limit);

        resolve({
          success: true,
          results,
          total: results.length,
          searchTerm
        });
      } catch (error) {
        console.error('Error searching reviews:', error);
        resolve({ success: false, results: [], error: error.message });
      }
    }, 400);
  });
}

/**
 * Get rating distribution
 */
export async function getRatingDistribution(filterCriteria = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataset = getDataset();
        if (!dataset || !dataset.reviews) {
          resolve({ success: false, distribution: {} });
          return;
        }

        let records = [...dataset.reviews];

        // Apply filters
        if (filterCriteria.category) {
          records = records.filter(r => 
            r.Product_category?.toLowerCase() === filterCriteria.category.toLowerCase()
          );
        }

        records = records.filter(r => r.rating);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        records.forEach(r => {
          const rating = extractRating(r.rating);
          if (rating > 0 && rating <= 5) {
            distribution[rating] = (distribution[rating] || 0) + 1;
          }
        });

        resolve({
          success: true,
          distribution,
          total: records.length
        });
      } catch (error) {
        console.error('Error getting rating distribution:', error);
        resolve({ success: false, distribution: {}, error: error.message });
      }
    }, 400);
  });
}

/**
 * Get country-wise statistics
 */
export async function getCountryStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataset = getDataset();
        if (!dataset || !dataset.reviews) {
          resolve({ success: false, countries: {} });
          return;
        }

        const records = dataset.reviews.filter(r => r.rating && r.country);
        const countries = {};

        records.forEach(r => {
          const country = r.country;
          if (!countries[country]) {
            countries[country] = { count: 0, totalRating: 0, avgRating: 0 };
          }
          countries[country].count++;
          countries[country].totalRating += extractRating(r.rating);
        });

        // Calculate averages
        Object.keys(countries).forEach(country => {
          countries[country].avgRating = parseFloat(
            (countries[country].totalRating / countries[country].count).toFixed(2)
          );
        });

        resolve({
          success: true,
          countries,
          totalCountries: Object.keys(countries).length
        });
      } catch (error) {
        console.error('Error getting country stats:', error);
        resolve({ success: false, countries: {}, error: error.message });
      }
    }, 400);
  });
}
