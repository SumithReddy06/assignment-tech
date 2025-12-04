/**
 * Quick Actions Data Generator
 * Provides hardcoded dataset-specific responses for quick action buttons
 */

/**
 * Generates NPS Curve analysis based on dataset
 */
export function generateNPSCurveData() {
  return {
    response: `📊 **NPS Curve Analysis - Last 6 Months**

Based on analysis of 2,047 Amazon reviews:

**Overall NPS Score: +22.2%**

Monthly Breakdown:
- July 2024: NPS 15% (Low activity period)
- August 2024: NPS 28% (Platform improvements noted)
- September 2024: NPS 22% (Steady performance)
- October 2024: NPS 35% (Peak satisfaction)
- November 2024: NPS 31% (Slight dip - seasonal factors)
- December 2024: NPS 42% (Strong recovery)

**Promoters (9-10 rating):** 856 reviews (41.8%)
**Passives (7-8 rating):** 789 reviews (38.5%)
**Detractors (0-6 rating):** 402 reviews (19.6%)

**Key Insights:**
✅ December shows the strongest NPS score of 42%
📈 Upward trend over the 6-month period
⚠️ Main detractor driver: Delivery delays and customer service responsiveness
✨ Top promoter driver: Product quality and competitive pricing`,
    category: "NPS Analysis",
    timestamp: new Date(),
    type: "analysis"
  };
}

/**
 * Generates Sentiment Analysis data
 */
export function generateSentimentAnalysisData() {
  return {
    response: `💬 **Sentiment Analysis - Customer Distribution**

Total Reviews Analyzed: 2,047

**Sentiment Breakdown:**

🟢 **Positive Sentiment (4-5 stars):** 1,156 reviews (56.4%)
- Very satisfied customers
- Top praise: Quality, fast delivery, good customer service
- Common phrases: "Excellent value", "Highly recommend", "Great quality"

🟡 **Neutral Sentiment (3 stars):** 489 reviews (23.9%)
- Mixed experiences
- Some features good, others need improvement
- Common phrases: "Average", "Okay", "Could be better"

🔴 **Negative Sentiment (1-2 stars):** 402 reviews (19.6%)
- Dissatisfied customers
- Main issues: Packaging problems, delivery delays, communication gaps
- Common complaints: "Poor packaging", "Delayed delivery", "No response to complaints"

**Geographic Sentiment Distribution:**

| Country | Positive | Neutral | Negative | Avg Rating |
|---------|----------|---------|----------|------------|
| US      | 52%      | 26%     | 22%      | 3.8/5     |
| UK      | 62%      | 18%     | 20%      | 3.9/5     |
| AU      | 68%      | 15%     | 17%      | 4.1/5     |
| Canada  | 58%      | 20%     | 22%      | 3.8/5     |
| Other   | 48%      | 28%     | 24%      | 3.6/5     |

**Key Findings:**
✨ Australia has the highest satisfaction rate at 68%
📊 56% of customers are promoters of the brand
⚠️ Negative sentiment primarily driven by logistics issues`,
    category: "Sentiment Analysis",
    timestamp: new Date(),
    type: "analysis"
  };
}

/**
 * Generates Product Ratings Comparison
 */
export function generateProductRatingsData() {
  return {
    response: `⭐ **Product Ratings Comparison - Best & Worst Performers**

Analysis of 2,047 reviews across product categories

**🏆 TOP PERFORMING PRODUCTS (Highest Average Ratings):**

1. **Electronics Category**
   - Average Rating: 4.2/5 stars (287 reviews)
   - Positive Reviews: 78%
   - Top Reason: Quality and reliability
   - Quote: "Worth every penny, excellent electronics"

2. **Home & Kitchen**
   - Average Rating: 4.0/5 stars (412 reviews)
   - Positive Reviews: 72%
   - Top Reason: Durability and value
   - Quote: "Great quality kitchen essentials"

3. **Books**
   - Average Rating: 3.9/5 stars (195 reviews)
   - Positive Reviews: 68%
   - Top Reason: Content quality and value
   - Quote: "Exactly what I was looking for"

**⚠️ LOWEST PERFORMING PRODUCTS (Lowest Average Ratings):**

1. **Fashion & Clothing**
   - Average Rating: 3.2/5 stars (289 reviews)
   - Positive Reviews: 45%
   - Main Issue: Size accuracy and quality inconsistency
   - Quote: "Runs very small, poor fabric quality"

2. **Sports & Outdoors**
   - Average Rating: 3.3/5 stars (156 reviews)
   - Positive Reviews: 48%
   - Main Issue: Durability concerns
   - Quote: "Broke after 2 weeks of use"

3. **Beauty & Personal Care**
   - Average Rating: 3.5/5 stars (178 reviews)
   - Positive Reviews: 52%
   - Main Issue: Product authenticity and packaging
   - Quote: "Unsure if product is authentic"

**Overall Statistics:**
- Average Rating Across All Products: 3.7/5 stars
- Highest Individual Product Rating: 4.8/5 stars
- Lowest Individual Product Rating: 1.2/5 stars
- Most Reviewed Product: Category with 412 reviews

**Recommendations:**
📈 Focus on improving Fashion & Clothing category
✅ Replicate Electronics success strategy
🔍 Implement stricter quality control for Sports & Outdoors`,
    category: "Product Analysis",
    timestamp: new Date(),
    type: "analysis"
  };
}

/**
 * Generates Category Performance Data
 */
export function generateCategoryPerformanceData(isAdmin = false) {
  const baseResponse = `📊 **Category Performance Metrics - Comprehensive Analysis**

**Category-wise Performance Breakdown:**

| Category | Reviews | Avg Rating | NPS % | Growth | Status |
|----------|---------|-----------|-------|--------|--------|
| Electronics | 287 | 4.2 ⭐ | 52% | +12% | 🟢 Excellent |
| Home & Kitchen | 412 | 4.0 ⭐ | 45% | +8% | 🟢 Good |
| Books | 195 | 3.9 ⭐ | 42% | +5% | 🟡 Fair |
| Sports & Outdoors | 156 | 3.3 ⭐ | 28% | -3% | 🔴 Needs Work |
| Fashion & Clothing | 289 | 3.2 ⭐ | 25% | -8% | 🔴 Critical |
| Beauty & Personal Care | 178 | 3.5 ⭐ | 33% | +2% | 🟡 Fair |
| Toys & Games | 234 | 3.8 ⭐ | 40% | +10% | 🟢 Good |
| Food & Grocery | 296 | 3.9 ⭐ | 44% | +6% | 🟢 Good |

**Top Insights:**
🏆 Electronics leading with 4.2★ and +12% growth
⚠️ Fashion showing decline with 3.2★ and -8% trend
📈 Home & Kitchen most reviewed category (412 reviews)

**Performance Drivers:**
✅ High NPS correlates with: Quality, fast delivery, good packaging
❌ Low NPS correlates with: Delays, poor quality, sizing issues`;

  const adminResponse = baseResponse + `

**ADMIN ONLY - STRATEGIC INSIGHTS:**

**Team Performance by Category:**
- Electronics Team Lead: John Analyst (87% satisfaction score)
- Fashion Team Lead: Sarah Analytics (62% satisfaction - needs coaching)
- Home & Kitchen: Mike Reviewer (92% satisfaction score)

**Inventory Health:**
- Electronics: Stock level 94% (Optimal)
- Fashion: Stock level 71% (Low - reorder needed)
- Home & Kitchen: Stock level 88% (Good)

**Revenue Impact by Category:**
- Electronics: $234K monthly (↑18%)
- Home & Kitchen: $189K monthly (↑6%)
- Fashion: $145K monthly (↓12%)

**Action Items:**
1. Implement fashion quality improvement program
2. Increase Sports inventory (demand up 15%)
3. Expand Electronics product line (highest ROI)
4. Review supplier agreements for Fashion category`;

  return {
    response: isAdmin ? adminResponse : baseResponse,
    category: "Category Analysis",
    timestamp: new Date(),
    type: "analysis"
  };
}

/**
 * Generates Team Analytics (Admin Only)
 */
export function generateTeamAnalyticsData() {
  return {
    response: `👥 **Team Analytics & Performance Metrics**

**Team Member Activity:**

| Analyst | Reports Generated | Avg Response Time | Accuracy | Status |
|---------|-------------------|------------------|----------|--------|
| John D. | 34 | 2.3s | 94% | 🟢 Active |
| Sarah M. | 28 | 2.8s | 91% | 🟢 Active |
| Mike R. | 42 | 2.1s | 96% | 🟢 Active |
| Lisa P. | 19 | 3.2s | 88% | 🟡 Below Avg |
| David C. | 15 | 3.8s | 82% | 🔴 Needs Support |

**Key Metrics:**
📊 Total Reports Generated This Month: 138
⏱️ Average Response Time: 2.4 seconds
✅ Team Accuracy Score: 90.2%
📈 Month-over-Month Growth: +12%

**Performance Highlights:**
🏆 Mike R. leading with 42 reports and 96% accuracy
⚠️ David C. needs performance improvement plan
📈 Team generating 25% more reports than last month

**Workload Distribution:**
- Reports in Queue: 8
- Average Processing Time: 2.4s
- Peak Activity: 3-5 PM daily
- Weekend Requests: 12 pending

**Recommendations:**
1. Provide additional training to David C.
2. Celebrate Mike R.'s performance excellence
3. Consider workload redistribution
4. Implement peer review process`,
    category: "Team Analytics",
    timestamp: new Date(),
    type: "admin-analysis"
  };
}

/**
 * Generates Data Audit Log
 */
export function generateAuditLogData() {
  return {
    response: `🔐 **System Audit Log & Data Access Report**

**Recent System Activities (Last 30 Days):**

**Data Access Events: 487**
- Read Operations: 412 (84.6%)
- Write Operations: 45 (9.2%)
- Modification Events: 30 (6.2%)

**User Access Breakdown:**
| User | Access Type | Count | Last Access |
|------|------------|-------|------------|
| analyst@reviewchat.com | Read | 234 | Dec 4, 2:15 PM |
| admin@reviewchat.com | Full | 156 | Dec 4, 1:45 PM |
| john@reviewchat.com | Read | 89 | Dec 3, 11:20 AM |
| sarah@reviewchat.com | Read | 8 | Dec 2, 4:30 PM |

**Data Export Log:**
- Total Exports: 23
- Most Common Format: CSV (18 exports)
- Total Data Exported: 1.2 GB
- Highest Volume Export: 450 MB (Dec 1)

**Security Events:**
✅ No suspicious activities detected
🔒 All data transfers encrypted (256-bit SSL)
📝 All modifications logged and timestamped

**Recent Modifications:**
1. Dec 4, 2:45 PM - Dataset refresh by admin@reviewchat.com
2. Dec 3, 11:30 AM - Report template update
3. Dec 2, 9:15 AM - User permission adjustment
4. Dec 1, 4:20 PM - System configuration change

**Compliance Status:**
✅ GDPR Compliant: Yes
✅ SOC 2 Requirements: Met
✅ Data Retention Policy: Enforced
✅ Access Control: Verified

**Alerts:**
- 0 Critical alerts
- 0 Warning alerts
- 2 Info-level events (routine maintenance)`,
    category: "Audit Log",
    timestamp: new Date(),
    type: "admin-analysis"
  };
}

/**
 * Generates System Health Check
 */
export function generateSystemHealthData() {
  return {
    response: `🏥 **System Health Check Report**

**System Status: 🟢 HEALTHY**

**Performance Metrics:**

| Metric | Value | Status | Threshold |
|--------|-------|--------|-----------|
| CPU Usage | 34% | 🟢 Good | < 70% |
| Memory Usage | 52% | 🟢 Good | < 80% |
| Database Load | 42% | 🟢 Good | < 75% |
| API Response Time | 245ms | 🟢 Good | < 500ms |
| Cache Hit Rate | 87% | 🟢 Excellent | > 80% |
| Uptime | 99.8% | 🟢 Excellent | > 99% |

**Service Status:**
✅ API Server: Running (Online for 45 days)
✅ Database: Operational (2.4GB used of 10GB)
✅ Cache Layer: Active (Redis, 512MB allocated)
✅ File Storage: Healthy (8.2GB used of 100GB)
✅ Queue Service: Active (12 jobs pending)

**Network Health:**
- Inbound Bandwidth: 124 Mbps (Avg: 156 Mbps)
- Outbound Bandwidth: 89 Mbps (Avg: 102 Mbps)
- Packet Loss: 0.02% (Excellent)
- DNS Resolution: 2ms average

**Recent Issues (Last 7 Days):**
⚠️ Dec 2, 3:45 PM - Brief spike in response time (resolved in 2 min)
✅ Dec 1, 11:20 AM - Maintenance window (completed successfully)

**Backup Status:**
- Last Backup: Dec 4, 2:00 AM (Completed)
- Backup Size: 2.8 GB
- Recovery Time: ~45 minutes
- Backup Frequency: Daily

**Upcoming Maintenance:**
📅 Dec 8: Non-critical updates (Scheduled 2-3 AM UTC)
📅 Dec 15: Security patches (Planned downtime: 15 min)

**Recommendations:**
1. Database optimization recommended (40% fragmentation)
2. Cache tuning could improve hit rate to 90%+
3. Load balancer showing healthy distribution
4. All critical systems operating nominally

**Overall System Score: 9.4/10 🌟**`,
    category: "System Health",
    timestamp: new Date(),
    type: "admin-analysis"
  };
}

/**
 * Main function to get quick action data
 */
export function getQuickActionResponse(actionId, userRole = 'Analyst') {
  const responses = {
    'nps-curve': generateNPSCurveData,
    'sentiment-analysis': generateSentimentAnalysisData,
    'product-ratings': generateProductRatingsData,
    'category-comparison': () => generateCategoryPerformanceData(userRole === 'Administrator'),
    'team-analytics': generateTeamAnalyticsData,
    'data-audit': generateAuditLogData,
    'system-health': generateSystemHealthData,
  };

  const generator = responses[actionId];
  if (generator) {
    return generator();
  }

  return {
    response: `Query for action: ${actionId}`,
    category: "Analysis",
    timestamp: new Date(),
    type: "analysis"
  };
}
