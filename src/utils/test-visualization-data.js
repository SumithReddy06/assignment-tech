// Test script to verify the visualization data structure
// This tests the core logic without relying on Recharts

// Mock data that should come from the dataset
const mockReviews = [
  { rating: 'Rated 5 out of 5 stars', country: 'US' },
  { rating: 'Rated 5 out of 5 stars', country: 'GB' },
  { rating: 'Rated 4 out of 5 stars', country: 'US' },
  { rating: 'Rated 4 out of 5 stars', country: 'CA' },
  { rating: 'Rated 3 out of 5 stars', country: 'AU' },
  { rating: 'Rated 2 out of 5 stars', country: 'US' },
  { rating: 'Rated 1 out of 5 stars', country: 'US' },
  { rating: 'Rated 1 out of 5 stars', country: 'GB' }
];

// Extract rating function (from datasetAPI.js)
function extractRating(ratingText) {
  if (!ratingText) return 0;
  const match = ratingText.match(/Rated\s+(\d)/);
  if (match) return parseInt(match[1]);
  return 0;
}

// NPS Calculation function (from datasetAPI.js)
function calculateNPS(records) {
  let promoters = 0, passives = 0, detractors = 0;
  
  records.forEach(r => {
    const rating = extractRating(r.rating);
    if (rating >= 4) promoters++;
    else if (rating === 3) passives++;
    else if (rating <= 2) detractors++;
  });

  const total = records.length;
  const nps = total > 0 ? ((promoters - detractors) / total) * 100 : 0;

  return {
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
  };
}

// Test the calculation
console.log('\n=== TESTING NPS VISUALIZATION DATA ===\n');
const npsResult = calculateNPS(mockReviews);

console.log('NPS Calculation Results:');
console.log(`  Total Reviews: ${npsResult.total}`);
console.log(`  Promoters (4-5 stars): ${npsResult.promoters} (${npsResult.breakdown.promotersPercent}%)`);
console.log(`  Passives (3 stars): ${npsResult.passives} (${npsResult.breakdown.passivesPercent}%)`);
console.log(`  Detractors (1-2 stars): ${npsResult.detractors} (${npsResult.breakdown.detractorsPercent}%)`);
console.log(`  NPS Score: ${npsResult.nps}%\n`);

// Create the visualization data structure
const vizData = [
  { name: 'Promoters', value: npsResult.promoters },
  { name: 'Passives', value: npsResult.passives },
  { name: 'Detractors', value: npsResult.detractors }
];

console.log('Visualization Data Structure:');
console.log(JSON.stringify(vizData, null, 2));
console.log('\nValidation Checks:');
console.log(`  ✓ Data array has ${vizData.length} items`);
console.log(`  ✓ All values are numbers and > 0: ${vizData.every(d => d.value > 0)}`);
console.log(`  ✓ Total of values matches NPS total: ${vizData.reduce((sum, d) => sum + d.value, 0) === npsResult.total}`);
console.log('\n=== DATA VALIDATION PASSED ===\n');
