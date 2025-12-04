/**
 * Dataset Analysis Service
 * Integrates loaded dataset with Gemini AI for specialized analysis
 */

import { generateText, streamText, chatWithHistory, handleGeminiError, getSafetySettings } from './geminiService';
import { generateDatasetContext, filterReviews, extractRatingNumber } from './datasetLoader';

let globalDataset = null;

/**
 * Initialize the dataset service with loaded data
 */
export function initializeDatasetService(dataset) {
  globalDataset = dataset;
  console.log(`✅ Dataset service initialized with ${dataset.analysis.totalRows} reviews`);
}

/**
 * Gets the current dataset
 */
export function getDataset() {
  return globalDataset;
}

/**
 * Builds a dataset-aware prompt for analysis
 */
function buildDatasetAwarePrompt(userQuery, datasetContext, relevantReviews = []) {
  const systemPrompt = `You are ReviewChat Analytics AI, a specialized analyst for Amazon product reviews.

DATASET INFORMATION:
- Total Reviews Analyzed: ${datasetContext.datasetSize}
- Geographic Coverage: ${datasetContext.coverageMetrics.topCountries}
- Available Data Fields: ${datasetContext.availableColumns.join(', ')}
- Data Quality: Reviews with complete data: ${100 - parseFloat(datasetContext.coverageMetrics.samplesWithMissingFields.split('(')[1])}%

RATING DISTRIBUTION IN DATASET:
${datasetContext.coverageMetrics.ratingDistribution}

KEY METRICS:
- Countries Represented: ${datasetContext.sampleInsights.countries}
- Average Reviews per Reviewer: ${datasetContext.sampleInsights.avgReviewsPerUser}

IMPORTANT INSTRUCTIONS:
1. Base all analysis ONLY on the actual dataset provided
2. Mention specific statistics from the dataset when answering
3. Reference actual review examples when relevant
4. Be transparent about data limitations (missing fields, regional biases, etc.)
5. Provide specific numbers and percentages from the dataset
6. Flag if a question cannot be answered due to missing data`;

  let fullPrompt = `${systemPrompt}\n\nUSER QUERY: ${userQuery}\n\nProvide detailed analysis:`;

  if (relevantReviews.length > 0) {
    fullPrompt += `\n\nRELEVANT DATASET SAMPLES (${relevantReviews.length} samples):\n`;
    relevantReviews.slice(0, 5).forEach((review, index) => {
      fullPrompt += `\n${index + 1}. [${review.rating}] "${review.title}"\n   Author: ${review.reviewerName} (${review.country})\n   Review: ${review.text.substring(0, 200)}...`;
    });
  }

  return fullPrompt;
}

/**
 * Analyzes dataset with text generation
 */
export async function analyzeDatasetWithText(query) {
  if (!globalDataset) {
    return {
      error: 'Dataset not initialized',
      response: 'Please load the dataset first',
    };
  }

  try {
    const datasetContext = generateDatasetContext(
      globalDataset.analysis,
      globalDataset.reviews
    );

    // Extract relevant reviews based on query
    let relevantReviews = globalDataset.reviews;
    
    // Simple keyword matching for filtering
    const queryLower = query.toLowerCase();
    if (queryLower.includes('positive') || queryLower.includes('happy')) {
      relevantReviews = filterReviews(globalDataset.reviews, { sentiment: 'positive' });
    } else if (queryLower.includes('negative') || queryLower.includes('unhappy')) {
      relevantReviews = filterReviews(globalDataset.reviews, { sentiment: 'negative' });
    }

    const prompt = buildDatasetAwarePrompt(query, datasetContext, relevantReviews);
    const response = await generateText(prompt);

    return {
      success: true,
      response,
      datasetStats: {
        totalReviews: globalDataset.analysis.totalRows,
        relevantReviewsAnalyzed: relevantReviews.length,
        datasetCoverage: datasetContext.coverageMetrics,
      },
    };
  } catch (error) {
    console.error('Dataset analysis error:', error);
    return {
      success: false,
      error: handleGeminiError(error),
      response: null,
    };
  }
}

/**
 * Streams dataset analysis with real-time updates
 */
export async function streamDatasetAnalysis(query, onChunk) {
  if (!globalDataset) {
    onChunk('Error: Dataset not initialized. Please load the dataset first.');
    return;
  }

  try {
    const datasetContext = generateDatasetContext(
      globalDataset.analysis,
      globalDataset.reviews
    );

    // Extract relevant reviews
    let relevantReviews = globalDataset.reviews;
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('positive') || queryLower.includes('happy')) {
      relevantReviews = filterReviews(globalDataset.reviews, { sentiment: 'positive' });
    } else if (queryLower.includes('negative') || queryLower.includes('unhappy')) {
      relevantReviews = filterReviews(globalDataset.reviews, { sentiment: 'negative' });
    }

    const prompt = buildDatasetAwarePrompt(query, datasetContext, relevantReviews);

    await streamText(prompt, onChunk);
  } catch (error) {
    console.error('Stream analysis error:', error);
    onChunk(`\n\nError: ${handleGeminiError(error)}`);
  }
}

/**
 * Generates NPS analysis from the dataset
 */
export async function generateNPSAnalysis(category = null) {
  if (!globalDataset) {
    return { error: 'Dataset not initialized' };
  }

  const reviews = category ? 
    filterReviews(globalDataset.reviews, { country: category }) :
    globalDataset.reviews;

  const promoters = reviews.filter(r => r.npsCategory === 'promoter').length;
  const passives = reviews.filter(r => r.npsCategory === 'passive').length;
  const detractors = reviews.filter(r => r.npsCategory === 'detractor').length;

  const nps = ((promoters - detractors) / reviews.length * 100).toFixed(2);

  const query = `Based on our dataset analysis of ${reviews.length} reviews, calculate and explain the NPS insights. 
  Promoters: ${promoters} (${((promoters/reviews.length)*100).toFixed(1)}%)
  Passives: ${passives} (${((passives/reviews.length)*100).toFixed(1)}%)
  Detractors: ${detractors} (${((detractors/reviews.length)*100).toFixed(1)}%)
  NPS Score: ${nps}
  
  Provide insights on what's driving satisfaction and dissatisfaction.`;

  return analyzeDatasetWithText(query);
}

/**
 * Generates sentiment analysis from dataset
 */
export async function generateSentimentAnalysis(country = null) {
  if (!globalDataset) {
    return { error: 'Dataset not initialized' };
  }

  const reviews = country ?
    filterReviews(globalDataset.reviews, { country }) :
    globalDataset.reviews;

  const positiveCount = reviews.filter(r => r.sentiment === 'positive').length;
  const neutralCount = reviews.filter(r => r.sentiment === 'neutral').length;
  const negativeCount = reviews.filter(r => r.sentiment === 'negative').length;

  const query = `Analyze the sentiment distribution in our dataset:
  Positive: ${positiveCount} (${((positiveCount/reviews.length)*100).toFixed(1)}%)
  Neutral: ${neutralCount} (${((neutralCount/reviews.length)*100).toFixed(1)}%)
  Negative: ${negativeCount} (${((negativeCount/reviews.length)*100).toFixed(1)}%)
  
  Identify key themes in positive vs negative reviews and provide actionable insights.`;

  return analyzeDatasetWithText(query);
}

/**
 * Finds and analyzes top-rated products/reviews
 */
export async function analyzeTopReviews(count = 5) {
  if (!globalDataset) {
    return { error: 'Dataset not initialized' };
  }

  const sorted = [...globalDataset.reviews].sort((a, b) => {
    const ratingA = extractRatingNumber(a.rating) || 0;
    const ratingB = extractRatingNumber(b.rating) || 0;
    return ratingB - ratingA;
  });

  const topReviews = sorted.slice(0, count);

  const query = `Analyze these top-rated reviews from our dataset and identify common patterns:
  ${topReviews.map((r, i) => `${i + 1}. (${r.rating}) "${r.title}" - ${r.text.substring(0, 150)}`).join('\n\n')}
  
  What are the key success factors driving high ratings?`;

  return analyzeDatasetWithText(query);
}

/**
 * Analyzes reviews by country
 */
export async function analyzeByCountry() {
  if (!globalDataset) {
    return { error: 'Dataset not initialized' };
  }

  const countryStats = globalDataset.analysis.countryDistribution;
  const countryList = Object.entries(countryStats)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => `${country}: ${count} reviews`)
    .join(', ');

  const query = `Analyze the geographic distribution of reviews and identify regional patterns:
  ${countryList}
  
  Are there significant differences in review sentiment or rating patterns between regions?`;

  return analyzeDatasetWithText(query);
}

/**
 * Generates data quality report
 */
export function generateDataQualityReport() {
  if (!globalDataset) {
    return { error: 'Dataset not initialized' };
  }

  const columnStats = globalDataset.analysis.columnStats;
  const report = {
    totalRecords: globalDataset.analysis.totalRows,
    recordsWithMissingData: globalDataset.analysis.samplesWithMissingData,
    completionRate: (((globalDataset.analysis.totalRows - globalDataset.analysis.samplesWithMissingData) / globalDataset.analysis.totalRows) * 100).toFixed(2) + '%',
    columnQuality: {},
  };

  Object.entries(columnStats).forEach(([col, stats]) => {
    report.columnQuality[col] = {
      filled: stats.filled,
      empty: stats.empty,
      fillRate: (((stats.filled) / globalDataset.analysis.totalRows) * 100).toFixed(2) + '%',
      uniqueValues: stats.uniqueCount,
    };
  });

  return report;
}

export default {
  initializeDatasetService,
  getDataset,
  analyzeDatasetWithText,
  streamDatasetAnalysis,
  generateNPSAnalysis,
  generateSentimentAnalysis,
  analyzeTopReviews,
  analyzeByCountry,
  generateDataQualityReport,
};
