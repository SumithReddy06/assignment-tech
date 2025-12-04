import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '../../components/navigation/NavigationSidebar';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import NavigationBreadcrumb from '../../components/navigation/NavigationBreadcrumb';
import QuickActionPanel from '../../components/navigation/QuickActionPanel';

import Button from '../../components/ui/Button';
import ReportFilters from './components/ReportFilters';
import ReportCard from './components/ReportCard';
import RecentReportsPanel from './components/RecentReportsPanel';
import SavedTemplatesPanel from './components/SavedTemplatesPanel';
import BulkActionsBar from './components/BulkActionsBar';
import ReportViewModal from './components/ReportViewModal';
import { loadDataset } from '../../utils/datasetLoader';
import { initializeDatasetService, getDataset } from '../../utils/datasetAnalysisService';
import {
  calculateNPS,
  calculateSentiment,
  getCategoryStats,
  getRatingDistribution,
  getCountryStats
} from '../../utils/datasetAPI';

const HistoricalReports = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [selectedReports, setSelectedReports] = useState([]);
  const [viewingReport, setViewingReport] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [filteredReportsCount, setFilteredReportsCount] = useState(0);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    // Analysts can view but have restricted access compared to admins
  }, []);

  // Generate real-time reports from dataset
  useEffect(() => {
    const generateRealTimeReports = async () => {
      setIsGenerating(true);
      try {
        // Load and initialize dataset
        const datasetResult = await loadDataset();
        if (!datasetResult || !datasetResult.success) {
          console.error('Failed to load dataset');
          setIsGenerating(false);
          return;
        }

        initializeDatasetService(datasetResult.dataset);
        const dataset = getDataset();

        // Generate NPS reports for each category
        const categoryStats = await getCategoryStats();
        const npsResult = await calculateNPS();
        const sentimentResult = await calculateSentiment();
        const ratingDistribution = await getRatingDistribution();
        const countryStats = await getCountryStats();

        const reports = [];
        const now = new Date();
        let reportId = 1;

        // 1. Overall NPS Analysis Report
        if (npsResult.success) {
          reports.push({
            id: reportId++,
            title: `Overall NPS Analysis - ${now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
            type: "nps-analysis",
            typeLabel: "NPS Analysis",
            category: "All Categories",
            summary: `Comprehensive NPS analysis showing ${npsResult.nps.toFixed(0)} NPS score with ${npsResult.breakdown.promotersPercent.toFixed(1)}% promoters. ${npsResult.breakdown.detractorsPercent.toFixed(1)}% are detractors requiring attention.`,
            thumbnail: "https://images.unsplash.com/photo-1713801129175-8e60c67e0412",
            thumbnailAlt: "Analytics dashboard showing NPS metrics",
            createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            createdBy: userRole === 'Administrator' ? "System Admin" : "Analytics Engine",
            dataPoints: npsResult.total,
            tags: ["Real-time", "NPS", "Overall"],
            parameters: [
              { label: "NPS Score", value: npsResult.nps.toFixed(0) },
              { label: "Promoters", value: `${npsResult.breakdown.promotersPercent.toFixed(1)}%` },
              { label: "Passives", value: `${npsResult.breakdown.passivesPercent.toFixed(1)}%` },
              { label: "Detractors", value: `${npsResult.breakdown.detractorsPercent.toFixed(1)}%` }
            ],
            insights: [
              {
                title: `NPS Score: ${npsResult.nps.toFixed(0)}`,
                description: `Current NPS score is ${npsResult.nps.toFixed(0)} based on ${npsResult.total} reviews analyzed across all categories.`
              },
              {
                title: "Promoter Base Analysis",
                description: `${npsResult.breakdown.promotersPercent.toFixed(1)}% of customers are promoters (rating 4-5), indicating strong satisfaction levels.`
              },
              {
                title: "Detractor Concerns",
                description: `${npsResult.breakdown.detractorsPercent.toFixed(1)}% are detractors (rating 1-2), representing areas for improvement and customer retention focus.`
              }
            ]
          });
        }

        // 2. Sentiment Analysis Report
        if (sentimentResult.success) {
          reports.push({
            id: reportId++,
            title: `Sentiment Distribution Analysis - ${now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
            type: "sentiment-analysis",
            typeLabel: "Sentiment Analysis",
            category: "All Categories",
            summary: `Sentiment analysis shows ${sentimentResult.sentiment.positive.toFixed(1)}% positive reviews with ${sentimentResult.sentiment.negative.toFixed(1)}% negative sentiment. Overall satisfaction trends positive.`,
            thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_10037bb68-1764661946287.png",
            thumbnailAlt: "Sentiment analysis visualization",
            createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            createdBy: userRole === 'Administrator' ? "System Admin" : "Analytics Engine",
            dataPoints: sentimentResult.breakdown.total,
            tags: ["Real-time", "Sentiment", "Analysis"],
            parameters: [
              { label: "Positive", value: `${sentimentResult.sentiment.positive.toFixed(1)}%` },
              { label: "Neutral", value: `${sentimentResult.sentiment.neutral.toFixed(1)}%` },
              { label: "Negative", value: `${sentimentResult.sentiment.negative.toFixed(1)}%` },
              { label: "Total Reviews", value: sentimentResult.breakdown.total.toString() }
            ],
            insights: [
              {
                title: "Positive Sentiment Dominance",
                description: `${sentimentResult.sentiment.positive.toFixed(1)}% of reviews display positive sentiment, indicating overall customer satisfaction.`
              },
              {
                title: "Neutral Feedback Proportion",
                description: `${sentimentResult.sentiment.neutral.toFixed(1)}% show neutral sentiment, representing customers with mixed experiences.`
              },
              {
                title: "Negative Sentiment Areas",
                description: `${sentimentResult.sentiment.negative.toFixed(1)}% negative sentiment requires investigation into product/service pain points.`
              }
            ]
          });
        }

        // 3. Rating Distribution Report
        if (ratingDistribution.success) {
          reports.push({
            id: reportId++,
            title: `Rating Distribution Analysis - ${now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
            type: "rating-breakdown",
            typeLabel: "Rating Breakdown",
            category: "All Categories",
            summary: `Rating analysis shows distribution across 1-5 star scale with ${ratingDistribution.distribution[5]} five-star reviews and ${ratingDistribution.distribution[1]} one-star reviews.`,
            thumbnail: "https://images.unsplash.com/photo-1610622930069-177b599953eb",
            thumbnailAlt: "Rating distribution chart",
            createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            createdBy: userRole === 'Administrator' ? "System Admin" : "Analytics Engine",
            dataPoints: ratingDistribution.total,
            tags: ["Real-time", "Ratings", "Distribution"],
            parameters: [
              { label: "5-Star Reviews", value: ratingDistribution.distribution[5].toString() },
              { label: "4-Star Reviews", value: ratingDistribution.distribution[4].toString() },
              { label: "3-Star Reviews", value: ratingDistribution.distribution[3].toString() },
              { label: "Total Reviews", value: ratingDistribution.total.toString() }
            ],
            insights: [
              {
                title: "Five-Star Distribution",
                description: `${ratingDistribution.distribution[5]} reviews rated 5 stars, representing ${((ratingDistribution.distribution[5] / ratingDistribution.total) * 100).toFixed(1)}% of total feedback.`
              },
              {
                title: "Quality Tier Analysis",
                description: `${((ratingDistribution.distribution[4] + ratingDistribution.distribution[5]) / ratingDistribution.total * 100).toFixed(1)}% of reviews are 4-5 stars, indicating high satisfaction levels.`
              },
              {
                title: "Low Rating Concerns",
                description: `${ratingDistribution.distribution[1]} one-star reviews present critical feedback areas requiring immediate attention.`
              }
            ]
          });
        }

        // 4. Category Performance Reports
        if (categoryStats.success && categoryStats.categories) {
          Object.entries(categoryStats.categories).slice(0, 3).forEach((entry) => {
            const [categoryName, stats] = entry;
            reports.push({
              id: reportId++,
              title: `Category Performance - ${categoryName}`,
              type: "rating-breakdown",
              typeLabel: "Category Analysis",
              category: categoryName,
              summary: `${categoryName} category analysis showing average rating of ${stats.avgRating.toFixed(1)}/5.0 based on ${stats.count} customer reviews.`,
              thumbnail: "https://images.unsplash.com/photo-1649065709781-02a3b9dc3226",
              thumbnailAlt: `${categoryName} category analytics`,
              createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
              createdBy: userRole === 'Administrator' ? "System Admin" : "Analytics Engine",
              dataPoints: stats.count,
              tags: ["Real-time", categoryName, "Category"],
              parameters: [
                { label: "Category", value: categoryName },
                { label: "Avg Rating", value: stats.avgRating.toFixed(1) },
                { label: "Review Count", value: stats.count.toString() },
                { label: "Total Ratings", value: stats.totalRating.toString() }
              ],
              insights: [
                {
                  title: "Average Performance",
                  description: `${categoryName} products average ${stats.avgRating.toFixed(1)} out of 5 stars.`
                },
                {
                  title: "Customer Base Size",
                  description: `${stats.count} verified customer reviews for this category provide reliable performance metrics.`
                },
                {
                  title: "Category Positioning",
                  description: `Rating of ${stats.avgRating.toFixed(1)} positions this category in the ${stats.avgRating >= 4.0 ? 'high' : stats.avgRating >= 3.0 ? 'medium' : 'low'} satisfaction tier.`
                }
              ]
            });
          });
        }

        // 5. Geographic Analysis Report
        if (countryStats.success && countryStats.countries) {
          const topCountries = Object.entries(countryStats.countries)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 1);

          topCountries.forEach((entry) => {
            const [countryName, stats] = entry;
            reports.push({
              id: reportId++,
              title: `Regional Performance - ${countryName}`,
              type: "product-comparison",
              typeLabel: "Geographic Analysis",
              category: countryName,
              summary: `${countryName} market analysis with ${stats.count} reviews and average rating of ${stats.avgRating.toFixed(1)}/5.0, representing key market performance.`,
              thumbnail: "https://images.unsplash.com/photo-1697365958155-2e954aac4fd5",
              thumbnailAlt: `${countryName} market analysis`,
              createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
              createdBy: userRole === 'Administrator' ? "System Admin" : "Analytics Engine",
              dataPoints: stats.count,
              tags: ["Real-time", countryName, "Geographic"],
              parameters: [
                { label: "Country", value: countryName },
                { label: "Avg Rating", value: stats.avgRating.toFixed(1) },
                { label: "Review Count", value: stats.count.toString() },
                { label: "Market Share", value: `${((stats.count / dataset.analysis.totalRows) * 100).toFixed(1)}%` }
              ],
              insights: [
                {
                  title: "Regional Market Size",
                  description: `${countryName} represents ${((stats.count / dataset.analysis.totalRows) * 100).toFixed(1)}% of total market reviews.`
                },
                {
                  title: "Regional Satisfaction",
                  description: `${countryName} customers give average rating of ${stats.avgRating.toFixed(1)}/5.0 stars.`
                },
                {
                  title: "Market Growth Potential",
                  description: `With ${stats.count} reviews, ${countryName} is a ${stats.count > 5000 ? 'major' : 'growing'} market opportunity.`
                }
              ]
            });
          });
        }

        setGeneratedReports(reports);
        setFilteredReportsCount(reports.length);
      } catch (error) {
        console.error('Error generating reports:', error);
        setGeneratedReports([]);
      } finally {
        setIsGenerating(false);
      }
    };

    generateRealTimeReports();
  }, [userRole]);

  const mockReports = generatedReports;

  // OLD_MOCK_DELETED [
  const _oldMockReports = [
  {
    id: 1,
    title: "Q4 2024 Electronics NPS Analysis - Premium Headphones Category",
    type: "nps-analysis",
    typeLabel: "NPS Analysis",
    category: "Electronics",
    summary: "Comprehensive NPS analysis revealing 68% promoter score with strong satisfaction in audio quality and comfort. Key detractors cite battery life concerns and premium pricing.",
    thumbnail: "https://images.unsplash.com/photo-1713801129175-8e60c67e0412",
    thumbnailAlt: "Modern wireless headphones with sleek black design displayed on white surface with audio waveform visualization in background",
    createdAt: new Date('2024-12-02T14:30:00'),
    createdBy: "Sarah Johnson",
    dataPoints: 15847,
    tags: ["Q4-2024", "Premium", "Audio"],
    parameters: [
    { label: "Date Range", value: "Oct 1 - Dec 1, 2024" },
    { label: "Products", value: "23 SKUs" },
    { label: "Review Count", value: "15,847" },
    { label: "NPS Score", value: "68" }],

    insights: [
    {
      title: "Strong Audio Quality Satisfaction",
      description: "87% of reviewers praised sound quality with specific mentions of bass response and clarity across all frequency ranges."
    },
    {
      title: "Battery Life Concerns",
      description: "32% of detractors mentioned battery performance below expectations, particularly for active noise cancellation usage."
    },
    {
      title: "Premium Pricing Perception",
      description: "Price-to-value ratio questioned by 28% of neutral respondents, suggesting competitive pressure in premium segment."
    }]

  },
  {
    id: 2,
    title: "November 2024 Sentiment Analysis - Smart Home Devices",
    type: "sentiment-analysis",
    typeLabel: "Sentiment Analysis",
    category: "Electronics",
    summary: "Positive sentiment dominates at 72% with strong appreciation for ease of setup and integration. Negative sentiment primarily around connectivity issues and app functionality.",
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_10037bb68-1764661946287.png",
    thumbnailAlt: "Modern smart home control panel mounted on white wall showing temperature and lighting controls with smartphone interface",
    createdAt: new Date('2024-12-01T09:15:00'),
    createdBy: "Michael Chen",
    dataPoints: 8932,
    tags: ["November-2024", "IoT", "Smart-Home"],
    parameters: [
    { label: "Date Range", value: "Nov 1 - Nov 30, 2024" },
    { label: "Products", value: "15 SKUs" },
    { label: "Review Count", value: "8,932" },
    { label: "Positive Sentiment", value: "72%" }],

    insights: [
    {
      title: "Setup Experience Excellence",
      description: "89% of positive reviews highlighted quick and intuitive installation process with clear mobile app guidance."
    },
    {
      title: "Connectivity Reliability Issues",
      description: "WiFi connection stability mentioned in 41% of negative reviews, particularly affecting remote access features."
    },
    {
      title: "App Functionality Gaps",
      description: "Mobile app performance and feature requests appeared in 35% of neutral/negative feedback, indicating improvement opportunities."
    }]

  },
  {
    id: 3,
    title: "Kitchen Appliances Rating Breakdown - Blender Category Analysis",
    type: "rating-breakdown",
    typeLabel: "Rating Breakdown",
    category: "Home & Kitchen",
    summary: "Average 4.3/5 rating with bimodal distribution. 5-star reviews emphasize power and durability, while 1-2 star reviews focus on noise levels and cleaning difficulty.",
    thumbnail: "https://images.unsplash.com/photo-1610622930069-177b599953eb",
    thumbnailAlt: "High-powered kitchen blender with stainless steel base and glass pitcher filled with fresh green smoothie ingredients on marble countertop",
    createdAt: new Date('2024-11-28T16:45:00'),
    createdBy: "Emily Rodriguez",
    dataPoints: 12456,
    tags: ["Kitchen", "Appliances", "Q4-2024"],
    parameters: [
    { label: "Date Range", value: "Sep 1 - Nov 28, 2024" },
    { label: "Products", value: "8 SKUs" },
    { label: "Review Count", value: "12,456" },
    { label: "Avg Rating", value: "4.3/5.0" }],

    insights: [
    {
      title: "Power Performance Satisfaction",
      description: "5-star reviews consistently mention motor power and ability to blend tough ingredients like frozen fruits and ice."
    },
    {
      title: "Noise Level Complaints",
      description: "Operational noise cited in 67% of 1-2 star reviews, with specific mentions of early morning usage concerns."
    },
    {
      title: "Cleaning Complexity",
      description: "Blade assembly cleaning difficulty mentioned in 45% of lower-rated reviews, suggesting design improvement opportunity."
    }]

  },
  {
    id: 4,
    title: "October 2024 Product Comparison - Wireless Earbuds Market Leaders",
    type: "product-comparison",
    typeLabel: "Product Comparison",
    category: "Electronics",
    summary: "Comparative analysis of top 5 wireless earbud brands showing clear differentiation in battery life, sound quality, and price positioning. Brand A leads in overall satisfaction.",
    thumbnail: "https://images.unsplash.com/photo-1697365958155-2e954aac4fd5",
    thumbnailAlt: "Five different wireless earbuds models arranged in a row on wooden surface showing various colors and designs with charging cases",
    createdAt: new Date('2024-11-25T11:20:00'),
    createdBy: "David Park",
    dataPoints: 23891,
    tags: ["Comparison", "Wireless", "Audio"],
    parameters: [
    { label: "Date Range", value: "Oct 1 - Oct 31, 2024" },
    { label: "Products", value: "5 Brands" },
    { label: "Review Count", value: "23,891" },
    { label: "Comparison Type", value: "Multi-brand" }],

    insights: [
    {
      title: "Battery Life Leadership",
      description: "Brand A achieves 32-hour total battery life with case, 8 hours ahead of nearest competitor, driving 23% higher satisfaction."
    },
    {
      title: "Sound Quality Parity",
      description: "Top 3 brands show minimal differentiation in audio quality ratings, suggesting feature parity in premium segment."
    },
    {
      title: "Price-Value Positioning",
      description: "Mid-tier pricing ($80-120) shows highest satisfaction-to-price ratio, with premium ($200+) facing value perception challenges."
    }]

  },
  {
    id: 5,
    title: "2024 Annual Trend Analysis - Sustainable Product Preferences",
    type: "trend-analysis",
    typeLabel: "Trend Analysis",
    category: "Home & Kitchen",
    summary: "Year-over-year analysis showing 156% increase in sustainability-related review mentions. Eco-friendly packaging and materials becoming key purchase drivers.",
    thumbnail: "https://images.unsplash.com/photo-1633878353628-5fc8b983325c",
    thumbnailAlt: "Eco-friendly kitchen products including bamboo utensils and reusable containers arranged on natural wood surface with green plant leaves",
    createdAt: new Date('2024-11-20T13:00:00'),
    createdBy: "Sarah Johnson",
    dataPoints: 45678,
    tags: ["Annual", "Sustainability", "Trends"],
    parameters: [
    { label: "Date Range", value: "Jan 1 - Nov 20, 2024" },
    { label: "Products", value: "127 SKUs" },
    { label: "Review Count", value: "45,678" },
    { label: "Trend Period", value: "12 months" }],

    insights: [
    {
      title: "Sustainability Mention Growth",
      description: "Eco-friendly, sustainable, and recyclable keywords increased 156% YoY, appearing in 34% of all 2024 reviews vs 13% in 2023."
    },
    {
      title: "Packaging Impact on Ratings",
      description: "Products with sustainable packaging average 0.4 stars higher ratings, with 28% of reviewers specifically praising eco-conscious packaging."
    },
    {
      title: "Material Transparency Demand",
      description: "67% increase in questions about material sourcing and manufacturing processes, indicating growing consumer awareness and expectations."
    }]

  },
  {
    id: 6,
    title: "Sports Equipment NPS Analysis - Fitness Tracker Category",
    type: "nps-analysis",
    typeLabel: "NPS Analysis",
    category: "Sports & Outdoors",
    summary: "NPS score of 62 with strong promoter base praising accuracy and battery life. Detractors primarily concerned with app synchronization and customer support response times.",
    thumbnail: "https://images.unsplash.com/photo-1575054092299-4a300e7a2511",
    thumbnailAlt: "Modern fitness tracker smartwatch with black band displaying heart rate and step count on bright OLED screen during outdoor workout",
    createdAt: new Date('2024-11-15T10:30:00'),
    createdBy: "Michael Chen",
    dataPoints: 9834,
    tags: ["Fitness", "Wearables", "Q4-2024"],
    parameters: [
    { label: "Date Range", value: "Sep 1 - Nov 15, 2024" },
    { label: "Products", value: "12 SKUs" },
    { label: "Review Count", value: "9,834" },
    { label: "NPS Score", value: "62" }],

    insights: [
    {
      title: "Tracking Accuracy Praised",
      description: "91% of promoters highlighted step counting and heart rate monitoring accuracy, with specific mentions of GPS precision during outdoor activities."
    },
    {
      title: "App Sync Frustrations",
      description: "Bluetooth connectivity and data synchronization issues mentioned in 52% of detractor reviews, impacting overall user experience."
    },
    {
      title: "Support Response Delays",
      description: "Customer service response time concerns in 38% of negative feedback, with average wait times exceeding user expectations."
    }]

  }];


  const mockRecentReports = generatedReports.slice(0, 4);

  const mockTemplates = [
  {
    id: 1,
    name: "Real-time NPS Standard",
    type: "nps-analysis",
    description: "Continuous NPS analysis with latest satisfaction metrics and trend comparison",
    parameters: ["Date Range: Real-time", "Min Reviews: Auto", "Categories: All"],
    usageCount: 24
  },
  {
    id: 2,
    name: "Quarterly Sentiment Deep Dive",
    type: "sentiment-analysis",
    description: "Comprehensive sentiment analysis with real-time emotion detection",
    parameters: ["Date Range: Real-time", "Sentiment Depth: Advanced", "Topics: Auto-detect"],
    usageCount: 12
  },
  {
    id: 3,
    name: "Product Launch Analysis",
    type: "rating-breakdown",
    description: "Real-time category performance analysis with benchmarking",
    parameters: ["Date Range: Current", "Comparison: Category avg", "Alerts: Enabled"],
    usageCount: 8
  }];


  useEffect(() => {
    setFilteredReportsCount(mockReports?.length);
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...mockReports];

    if (filters?.searchQuery) {
      filtered = filtered?.filter((report) =>
      report?.title?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase()) ||
      report?.summary?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase())
      );
    }

    if (filters?.category !== 'all') {
      filtered = filtered?.filter((report) =>
      report?.category?.toLowerCase()?.replace(/\s+/g, '-') === filters?.category
      );
    }

    if (filters?.reportType !== 'all') {
      filtered = filtered?.filter((report) => report?.type === filters?.reportType);
    }

    setFilteredReportsCount(filtered?.length);
  };

  const handleReportSelect = (reportId, isSelected) => {
    setSelectedReports((prev) =>
    isSelected ?
    [...prev, reportId] :
    prev?.filter((id) => id !== reportId)
    );
  };

  const handleSelectAll = () => {
    if (selectedReports?.length === mockReports?.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(mockReports?.map((r) => r?.id));
    }
  };

  const handleViewReport = (report) => {
    setViewingReport(report);
  };

  const handleExportReport = (report) => {
    console.log('Exporting report:', report?.title);
  };

  const handleDeleteReport = (report) => {
    console.log('Deleting report:', report?.title);
  };

  const handleRerunAnalysis = (report) => {
    console.log('Rerunning analysis for:', report?.title);
    navigate('/conversation-analysis');
  };

  const handleExportSelected = () => {
    console.log('Exporting selected reports:', selectedReports);
  };

  const handleCompareSelected = () => {
    console.log('Comparing selected reports:', selectedReports);
  };

  const handleDeleteSelected = () => {
    console.log('Deleting selected reports:', selectedReports);
    setSelectedReports([]);
  };

  const handleTemplateUse = (template) => {
    console.log('Using template:', template?.name);
    navigate('/conversation-analysis');
  };

  const handleTemplateDelete = (template) => {
    console.log('Deleting template:', template?.name);
  };

  const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' }];


  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <NavigationSidebar userRole={userRole} />
        <QuickActionPanel userRole={userRole} />

        <main className="main-content">
          <NavigationBreadcrumb />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-semibold text-foreground">Historical Reports</h1>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => navigate('/conversation-analysis', { state: { resetConversation: true } })}>

                New Analysis
              </Button>
            </div>
            <p className="text-muted-foreground">
              View, search, and manage your previously generated analysis reports and visualizations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ReportFilters
                onFilterChange={handleFilterChange}
                resultsCount={filteredReportsCount} />


              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">

                      <input
                        type="checkbox"
                        checked={selectedReports?.length === mockReports?.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2" />

                      <span>Select All</span>
                    </button>

                    {selectedReports?.length > 0 &&
                    <span className="text-sm text-muted-foreground">
                        {selectedReports?.length} selected
                      </span>
                    }
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e?.target?.value)}
                      className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">

                      {sortOptions?.map((option) =>
                      <option key={option?.value} value={option?.value}>
                          {option?.label}
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockReports?.map((report) =>
                  <ReportCard
                    key={report?.id}
                    report={report}
                    onView={handleViewReport}
                    onExport={handleExportReport}
                    onDelete={handleDeleteReport}
                    onRerun={handleRerunAnalysis}
                    isSelected={selectedReports?.includes(report?.id)}
                    onSelect={handleReportSelect} />

                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <RecentReportsPanel
                recentReports={mockRecentReports}
                onReportClick={handleViewReport} />


              <SavedTemplatesPanel
                templates={mockTemplates}
                onTemplateUse={handleTemplateUse}
                onTemplateDelete={handleTemplateDelete} />

            </div>
          </div>
        </main>

        <BulkActionsBar
          selectedCount={selectedReports?.length}
          onExportSelected={handleExportSelected}
          onCompareSelected={handleCompareSelected}
          onDeleteSelected={handleDeleteSelected}
          onClearSelection={() => setSelectedReports([])} />


        {viewingReport &&
        <ReportViewModal
          report={viewingReport}
          onClose={() => setViewingReport(null)}
          onExport={handleExportReport}
          onRerun={handleRerunAnalysis} />

        }
      </div>
    </SidebarProvider>);

};

export default HistoricalReports;