import fs from 'fs/promises';
import path from 'path';
import { parseCSV, extractReviewData } from '../src/utils/datasetLoader.js';

async function run() {
  const csvPath = path.resolve('./public/dataset/Amazon_Reviews.csv');
  const csvText = await fs.readFile(csvPath, 'utf-8');
  const { headers, rows } = parseCSV(csvText);
  const reviews = extractReviewData(headers, rows);

  // Avoid calling calculateSentiment() since it expects the dataset to be available via getDataset() in the running app.
  console.log('=== Test Dataset Script ===');
  console.log('Parsed headers:', headers.slice(0, 8));
  console.log('Parsed rows:', rows.length);
  console.log('Example review object:', reviews[0]);

  // Quick local sentiment calculation
  let positive = 0, neutral = 0, negative = 0;
  reviews.forEach(r => {
    const rating = r.rating?.match(/(\d+\.?\d*)/)?.[1];
    const n = rating ? Math.round(parseFloat(rating)) : 0;
    if (n >= 4) positive++;
    else if (n === 3) neutral++;
    else if (n <= 2 && n > 0) negative++;
  });
  const total = reviews.length;
  console.log('Sentiment local calc', { positive, neutral, negative, total });
}

run().catch(err => { console.error(err); process.exit(1); });
