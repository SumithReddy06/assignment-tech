/**
 * Quick Dataset Testing Utility
 * Use this in browser console to test dataset functionality
 */

import { 
  loadDataset, 
  generateDatasetContext, 
  filterReviews 
} from './datasetLoader';

import {
  analyzeDatasetWithText,
  streamDatasetAnalysis,
  generateNPSAnalysis,
  generateSentimentAnalysis,
  generateDataQualityReport,
  getDataset
} from './datasetAnalysisService';

// Make utilities available globally for testing
window.DatasetUtils = {
  // Testing functions
  async testDatasetLoad() {
    console.log('📊 Testing dataset load...');
    const result = await loadDataset();
    if (result.success) {
      console.log('✅ Dataset loaded successfully');
      console.log('📈 Stats:', {
        rows: result.dataset.analysis.totalRows,
        countries: Object.keys(result.dataset.analysis.countryDistribution).length,
        columns: result.dataset.analysis.headers.length
      });
    } else {
      console.error('❌ Failed to load dataset:', result.error);
    }
    return result;
  },

  async testNPSAnalysis() {
    console.log('📊 Testing NPS analysis...');
    const result = await generateNPSAnalysis();
    console.log('✅ NPS Analysis Result:', result.response?.substring(0, 200) + '...');
    return result;
  },

  async testSentimentAnalysis() {
    console.log('💬 Testing sentiment analysis...');
    const result = await generateSentimentAnalysis();
    console.log('✅ Sentiment Analysis Result:', result.response?.substring(0, 200) + '...');
    return result;
  },

  getDataQuality() {
    console.log('📋 Dataset Quality Report:');
    const report = generateDataQualityReport();
    console.table(report.columnQuality);
    return report;
  },

  printDatasetInfo() {
    const dataset = getDataset();
    if (!dataset) {
      console.warn('⚠️ Dataset not loaded yet');
      return;
    }
    
    console.group('📊 Dataset Information');
    console.log('Total Reviews:', dataset.analysis.totalRows);
    console.log('Countries:', Object.keys(dataset.analysis.countryDistribution));
    console.log('Headers:', dataset.analysis.headers);
    console.log('Rating Distribution:', dataset.analysis.ratingDistribution);
    console.log('Samples with Missing Data:', dataset.analysis.samplesWithMissingData);
    console.groupEnd();
  },

  testQuery(query) {
    console.log(`🔍 Testing query: "${query}"`);
    return analyzeDatasetWithText(query);
  },

  sampleReviews(count = 3) {
    const dataset = getDataset();
    if (!dataset) {
      console.warn('⚠️ Dataset not loaded');
      return;
    }
    
    const samples = dataset.reviews.slice(0, count);
    console.table(samples.map((r, i) => ({
      '#': i + 1,
      Author: r.reviewerName,
      Country: r.country,
      Rating: r.rating,
      Title: r.title,
      Sentiment: r.sentiment,
      Preview: r.text.substring(0, 50) + '...'
    })));
  },

  filterBySentiment(sentiment) {
    const dataset = getDataset();
    if (!dataset) {
      console.warn('⚠️ Dataset not loaded');
      return;
    }
    
    const filtered = filterReviews(dataset.reviews, { sentiment });
    console.log(`Found ${filtered.length} ${sentiment} reviews`);
    console.table(filtered.slice(0, 5).map((r, i) => ({
      '#': i + 1,
      Author: r.reviewerName,
      Country: r.country,
      Title: r.title,
      Text: r.text.substring(0, 40)
    })));
    return filtered;
  },

  help() {
    console.log(`
🎯 Dataset Testing Utilities
================================

Available functions:

1. DatasetUtils.testDatasetLoad()
   - Load and validate dataset

2. DatasetUtils.testNPSAnalysis()
   - Run NPS analysis

3. DatasetUtils.testSentimentAnalysis()
   - Run sentiment analysis

4. DatasetUtils.getDataQuality()
   - Show data quality report

5. DatasetUtils.printDatasetInfo()
   - Print dataset overview

6. DatasetUtils.testQuery(query)
   - Test custom query analysis

7. DatasetUtils.sampleReviews(count)
   - Show sample reviews

8. DatasetUtils.filterBySentiment(sentiment)
   - Filter reviews by sentiment (positive/negative/neutral)

9. DatasetUtils.help()
   - Show this help message

Example usage:
> await DatasetUtils.testDatasetLoad()
> await DatasetUtils.testNPSAnalysis()
> DatasetUtils.sampleReviews(10)
> DatasetUtils.filterBySentiment('positive')
    `);
  }
};

console.log('✅ Dataset Testing Utilities loaded!');
console.log('Type DatasetUtils.help() for commands');

export default window.DatasetUtils;
