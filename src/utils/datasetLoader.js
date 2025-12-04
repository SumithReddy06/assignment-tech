/**
 * Dataset Loader - Loads and parses the Amazon Reviews CSV dataset
 * Handles missing/empty columns and provides statistical analysis
 */

/**
 * Parses CSV text into structured data
 * Handles quoted fields and empty values
 */
export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return { headers: [], rows: [] };

  // Parse header
  const headers = parseCSVLine(lines[0]);

  // Parse rows
  const rows = [];
  let currentLine = '';
  
  for (let i = 1; i < lines.length; i++) {
    currentLine += lines[i];
    
    // Check if line is complete (even number of quotes)
    if ((currentLine.match(/"/g) || []).length % 2 === 0) {
      const values = parseCSVLine(currentLine);
      if (values.length > 0 && values.some(v => v.trim())) {
        rows.push(values);
      }
      currentLine = '';
    } else {
      currentLine += '\n';
    }
  }

  return { headers, rows };
}

/**
 * Parses a single CSV line handling quoted fields
 */
export function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Normalizes row data into an object with headers as keys
 */
export function normalizeRow(headers, values) {
  const row = {};
  headers.forEach((header, index) => {
    row[header] = values[index] || '';
  });
  return row;
}

/**
 * Analyzes the dataset structure and content
 */
export function analyzeDataset(headers, rows) {
  const analysis = {
    totalRows: rows.length,
    headers: headers,
    columnStats: {},
    ratingDistribution: {},
    countryDistribution: {},
    samplesWithMissingData: 0,
  };

  // Initialize column stats
  headers.forEach(header => {
    analysis.columnStats[header] = {
      filled: 0,
      empty: 0,
      uniqueValues: new Set(),
    };
  });

  // Initialize rating distribution
  for (let i = 1; i <= 5; i++) {
    analysis.ratingDistribution[`${i} star`] = 0;
  }

  // Analyze each row
  rows.forEach(values => {
    let hasMissing = false;

    headers.forEach((header, index) => {
      const value = values[index] || '';
      const isEmpty = !value || value.trim() === '';

      if (isEmpty) {
        analysis.columnStats[header].empty++;
        hasMissing = true;
      } else {
        analysis.columnStats[header].filled++;
        analysis.columnStats[header].uniqueValues.add(value);
      }

      // Track rating distribution
      if (header === 'Rating' && value) {
        const rating = extractRatingNumber(value);
        if (rating && analysis.ratingDistribution[`${rating} star`] !== undefined) {
          analysis.ratingDistribution[`${rating} star`]++;
        }
      }

      // Track country distribution
      if (header === 'Country' && value) {
        analysis.countryDistribution[value] = (analysis.countryDistribution[value] || 0) + 1;
      }
    });

    if (hasMissing) {
      analysis.samplesWithMissingData++;
    }
  });

  // Convert Sets to counts for unique values
  headers.forEach(header => {
    analysis.columnStats[header].uniqueCount = analysis.columnStats[header].uniqueValues.size;
    delete analysis.columnStats[header].uniqueValues;
  });

  return analysis;
}

/**
 * Extracts numeric rating from text like "Rated 5 out of 5 stars"
 */
export function extractRatingNumber(ratingText) {
  const match = ratingText?.match(/Rated\s+(\d)/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Calculates sentiment from rating
 */
export function getRatingSentiment(ratingText) {
  const rating = extractRatingNumber(ratingText);
  if (!rating) return 'unknown';
  if (rating >= 4) return 'positive';
  if (rating === 3) return 'neutral';
  return 'negative';
}

/**
 * Calculates NPS category from rating
 */
export function getNPSCategory(ratingText) {
  const rating = extractRatingNumber(ratingText);
  if (!rating) return 'unknown';
  if (rating >= 9) return 'promoter';
  if (rating >= 7) return 'passive';
  return 'detractor';
}

/**
 * Converts rows to review objects for analysis
 */
export function extractReviewData(headers, rows) {
  return rows.map(values => {
    const review = normalizeRow(headers, values);
    return {
      reviewerName: review['Reviewer Name'] || 'Anonymous',
      country: review['Country'] || 'Unknown',
      reviewCount: review['Review Count'] || '0',
      reviewDate: review['Review Date'] || '',
      rating: review['Rating'] || '',
      title: review['Review Title'] || '',
      text: review['Review Text'] || '',
      dateOfExperience: review['Date of Experience'] || '',
      sentiment: getRatingSentiment(review['Rating'] || ''),
      npsCategory: getNPSCategory(review['Rating'] || ''),
    };
  });
}

/**
 * Main dataset loader function
 */
export async function loadDataset() {
  try {
    // For frontend, we'll load from the public folder
    const response = await fetch('/dataset/Amazon_Reviews.csv');
    if (!response.ok) {
      throw new Error(`Failed to load dataset: ${response.statusText}`);
    }

    const csvText = await response.text();
    const { headers, rows } = parseCSV(csvText);

    if (rows.length === 0) {
      throw new Error('Dataset is empty');
    }

    const analysis = analyzeDataset(headers, rows);
    const reviews = extractReviewData(headers, rows);

    return {
      success: true,
      dataset: {
        headers,
        rows,
        reviews,
        analysis,
      },
      metadata: {
        loadedAt: new Date().toISOString(),
        totalReviews: rows.length,
        headers: headers,
        hasImages: false,
      },
    };
  } catch (error) {
    console.error('Error loading dataset:', error);
    return {
      success: false,
      error: error.message,
      dataset: null,
    };
  }
}

/**
 * Generates dataset-specific context for AI analysis
 */
export function generateDatasetContext(analysis, reviews) {
  const ratingStats = Object.entries(analysis.ratingDistribution).map(
    ([rating, count]) => `${rating}: ${count} reviews (${((count / analysis.totalRows) * 100).toFixed(1)}%)`
  ).join(', ');

  const countryStats = Object.entries(analysis.countryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => `${country}: ${count}`)
    .join(', ');

  const missingDataPercent = ((analysis.samplesWithMissingData / analysis.totalRows) * 100).toFixed(1);

  return {
    datasetSize: analysis.totalRows,
    coverageMetrics: {
      ratingDistribution: ratingStats,
      topCountries: countryStats,
      samplesWithMissingFields: `${analysis.samplesWithMissingData} (${missingDataPercent}%)`,
    },
    availableColumns: analysis.headers,
    dataQuality: {
      columnFillRates: Object.fromEntries(
        Object.entries(analysis.columnStats).map(([col, stats]) => [
          col,
          `${((stats.filled / analysis.totalRows) * 100).toFixed(1)}%`,
        ])
      ),
    },
    sampleInsights: {
      totalReviews: analysis.totalRows,
      countries: Object.keys(analysis.countryDistribution).length,
      avgReviewsPerUser: (reviews.reduce((sum, r) => {
        const count = parseInt(r.reviewCount?.split(' ')?.[0] || '0');
        return sum + count;
      }, 0) / analysis.totalRows).toFixed(2),
    },
  };
}

/**
 * Filters reviews based on query parameters
 */
export function filterReviews(reviews, filters = {}) {
  return reviews.filter(review => {
    if (filters.country && review.country !== filters.country) return false;
    if (filters.sentiment && review.sentiment !== filters.sentiment) return false;
    if (filters.npsCategory && review.npsCategory !== filters.npsCategory) return false;
    if (filters.minRating && !filters.maxRating) {
      const rating = extractRatingNumber(review.rating);
      if (rating && rating < filters.minRating) return false;
    }
    if (filters.maxRating && !filters.minRating) {
      const rating = extractRatingNumber(review.rating);
      if (rating && rating > filters.maxRating) return false;
    }
    return true;
  });
}

export default {
  loadDataset,
  generateDatasetContext,
  filterReviews,
  parseCSV,
  normalizeRow,
  analyzeDataset,
  extractReviewData,
  extractRatingNumber,
};
