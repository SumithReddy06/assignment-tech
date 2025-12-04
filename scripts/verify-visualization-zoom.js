import fs from 'fs/promises';
import path from 'path';
import { parseCSV, extractReviewData } from '../src/utils/datasetLoader.js';
import { initializeDatasetService } from '../src/utils/datasetAnalysisService.js';
import { calculateSentiment } from '../src/utils/datasetAPI.js';

async function run() {
  const csvPath = path.resolve('./public/dataset/Amazon_Reviews.csv');
  const csvText = await fs.readFile(csvPath, 'utf-8');
  const { headers, rows } = parseCSV(csvText);
  const reviews = extractReviewData(headers, rows);

  initializeDatasetService({ reviews, analysis: { totalRows: rows.length } });

  const sent = await calculateSentiment();
  console.log('calculateSentiment returned', sent);

  const viz = {
    type: 'Sentiment Distribution',
    data: [
      { name: 'Positive', value: sent.sentiment.positive },
      { name: 'Neutral', value: sent.sentiment.neutral },
      { name: 'Negative', value: sent.sentiment.negative }
    ]
  };

  const totalVals = viz.data.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
  console.log('Total viz values (should be > 0):', totalVals);
}

run().catch(e => { console.error(e); process.exit(1); });
