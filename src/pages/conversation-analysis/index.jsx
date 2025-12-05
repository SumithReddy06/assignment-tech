import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '../../components/navigation/NavigationSidebar';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import NavigationBreadcrumb from '../../components/navigation/NavigationBreadcrumb';
import ConversationThread from './components/ConversationThread';
import QueryInput from './components/QueryInput';
import VisualizationPanel from './components/VisualizationPanel';
import Icon from '../../components/AppIcon';
import { streamReviewAnalysis, handleGeminiError } from '../../utils/geminiService';
import { loadDataset } from '../../utils/datasetLoader';
import { initializeDatasetService, streamDatasetAnalysis, getDataset } from '../../utils/datasetAnalysisService';
import { 
  getRecentConversations, 
  searchConversations,
  saveFullConversationThread
} from '../../utils/mongoDBService';
import {
  filterDatasetRecords,
  calculateNPS,
  calculateSentiment,
  getCategoryStats,
  searchReviews,
  getRatingDistribution,
  getCountryStats
} from '../../utils/datasetAPI';

const ConversationAnalysis = () => {
  const location = useLocation();
  const [userRole] = useState(localStorage.getItem('userRole') || 'Analyst');
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('currentSessionId');
    if (saved) return saved;
    const newId = `session_${Date.now()}`;
    localStorage.setItem('currentSessionId', newId);
    return newId;
  });
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Welcome to ReviewChat Analytics! I'm your AI assistant for analyzing Amazon product reviews.\n\nI can help you with:\n• NPS curve analysis and trends\n• Customer satisfaction metrics\n• Sentiment analysis (happy/unhappy customers)\n• Product rating comparisons\n• Detailed insights on rating patterns\n\nWhat would you like to analyze today?`,
      timestamp: new Date('2025-12-03T11:30:00'),
      traceId: 'trace_001_init'
    }
  ]);

  const [visualizations, setVisualizations] = useState(() => {
    try {
      const saved = localStorage.getItem('conversationVisualizations');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const suggestedQueries = [];

  // Save visualizations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('conversationVisualizations', JSON.stringify(visualizations));
  }, [visualizations]);

  // Save messages to localStorage whenever they change (for sidebar to read)
  useEffect(() => {
    localStorage.setItem('conversationMessages', JSON.stringify(messages));
    // Dispatch custom event for real-time sidebar update
    window.dispatchEvent(new CustomEvent('messagesUpdated', { detail: { count: messages.length } }));
  }, [messages]);

  // Save full conversation thread to MongoDB (debounced to avoid too many requests)
  useEffect(() => {
    const saveTimer = setTimeout(async () => {
      if (messages.length > 1) { // Only save if there are messages beyond welcome message
        try {
          const firstUserMsg = messages.find(m => m.role === 'user');
          const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
          
          if (firstUserMsg && lastAssistantMsg) {
            console.log('💾 Auto-saving conversation thread to MongoDB...');
            const result = await saveFullConversationThread(
              messages,
              visualizations,
              firstUserMsg.content.substring(0, 100),
              lastAssistantMsg.content.substring(0, 200),
              'Analysis'
            );
            if (result?.id) {
              setCurrentConversationId(result.id);
            }
          }
        } catch (error) {
          console.error('Error auto-saving conversation:', error);
        }
      }
    }, 3000); // Save 3 seconds after last message change

    return () => clearTimeout(saveTimer);
  }, [messages, visualizations]);

  // Load passed conversation on mount
  useEffect(() => {
    const loadPassedConversation = async () => {
      try {
        // Load dataset first
        const result = await loadDataset();
        if (result && result.success) {
          initializeDatasetService(result.dataset);
        }

        // Check if reset flag is set - start fresh conversation
        if (location?.state?.resetConversation) {
          setMessages([
            {
              id: 1,
              role: 'assistant',
              content: `Welcome to ReviewChat Analytics! I'm your AI assistant for analyzing Amazon product reviews.\n\nI can help you with:\n• NPS curve analysis and trends\n• Customer satisfaction metrics\n• Sentiment analysis (happy/unhappy customers)\n• Product rating comparisons\n• Detailed insights on rating patterns\n\nWhat would you like to analyze today?`,
              timestamp: new Date(),
              traceId: 'trace_001_init'
            }
          ]);
          setVisualizations([]);
          return;
        }

        // Check if conversation was passed via navigation
        if (location?.state?.conversationId) {
          const allConversations = await getRecentConversations(100);
          const passedConv = allConversations.find(c => c.id === location?.state?.conversationId);
          
          if (passedConv) {
            // Add user message
            const userMsg = {
              id: messages.length + 1,
              role: 'user',
              content: passedConv.query,
              timestamp: new Date(passedConv.timestamp),
              traceId: `trace_${Date.now()}`
            };
            
            // Add assistant response
            const assistantMsg = {
              id: messages.length + 2,
              role: 'assistant',
              content: passedConv.response,
              timestamp: new Date(),
              traceId: `trace_${Date.now()}_response`
            };
            
            setMessages([
              messages[0], // Keep welcome message
              userMsg,
              assistantMsg
            ]);
          }
        }
      } catch (error) {
        console.error('Error loading passed conversation:', error);
      }
    };

    loadPassedConversation();
  }, [location?.state?.conversationId]);

  const handleSendQuery = async (query, attachments) => {
    const userMessage = {
      id: messages?.length + 1,
      role: 'user',
      content: query,
      timestamp: new Date(),
      attachments: attachments?.length > 0 ? attachments : undefined
    };

    setMessages([...messages, userMessage]);
    setIsProcessing(true);

    const assistantMessageId = messages?.length + 2;
    let accumulatedResponse = '';
    let newVisualizations = [];
    
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      traceId: `trace_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const lowerQuery = query?.toLowerCase();

      // Determine what data to fetch based on query - more flexible matching
      if (lowerQuery?.includes('nps') || lowerQuery?.includes('promoter') || lowerQuery?.includes('detractor')) {
        const npsData = await calculateNPS();
        const categoryStats = await getCategoryStats();
        
        accumulatedResponse = `📊 **NPS Analysis**\n\n`;
        accumulatedResponse += `Overall NPS: **${npsData.nps}%**\n\n`;
        accumulatedResponse += `**Breakdown:**\n`;
        accumulatedResponse += `- Promoters: ${npsData.promoters} (${npsData.breakdown.promotersPercent}%)\n`;
        accumulatedResponse += `- Passives: ${npsData.passives} (${npsData.breakdown.passivesPercent}%)\n`;
        accumulatedResponse += `- Detractors: ${npsData.detractors} (${npsData.breakdown.detractorsPercent}%)\n`;
        accumulatedResponse += `- Total Responses: ${npsData.total}\n\n`;

        newVisualizations = [{
          type: 'NPS Score',
          data: [
            { name: 'Promoters', value: npsData.promoters },
            { name: 'Passives', value: npsData.passives },
            { name: 'Detractors', value: npsData.detractors }
          ]
        }];

      } else if (lowerQuery?.includes('sentiment') || lowerQuery?.includes('happy') || lowerQuery?.includes('unhappy') || lowerQuery?.includes('satisfaction') || lowerQuery?.includes('rating')) {
        const sentimentData = await calculateSentiment();
        const distribution = await getRatingDistribution();
        
        accumulatedResponse = `💬 **Sentiment Analysis**\n\n`;
        accumulatedResponse += `- Positive: **${sentimentData.sentiment.positive}%** (${sentimentData.breakdown.positive} reviews)\n`;
        accumulatedResponse += `- Neutral: **${sentimentData.sentiment.neutral}%** (${sentimentData.breakdown.neutral} reviews)\n`;
        accumulatedResponse += `- Negative: **${sentimentData.sentiment.negative}%** (${sentimentData.breakdown.negative} reviews)\n\n`;
        accumulatedResponse += `**Rating Distribution:**\n`;
        Object.entries(distribution.distribution).forEach(([rating, count]) => {
          accumulatedResponse += `- ${rating} Stars: ${count} reviews\n`;
        });

        newVisualizations = [{
          type: 'Sentiment Distribution',
          data: [
            { name: 'Positive', value: sentimentData.sentiment.positive },
            { name: 'Neutral', value: sentimentData.sentiment.neutral },
            { name: 'Negative', value: sentimentData.sentiment.negative }
          ]
        }];

      } else if (lowerQuery?.includes('rating') && (lowerQuery?.includes('comparison') || lowerQuery?.includes('compare') || lowerQuery?.includes('product'))) {
        const categoryStats = await getCategoryStats();
        
        accumulatedResponse = `⭐ **Product Rating Comparisons**\n\n`;
        accumulatedResponse += `**Total Categories: ${categoryStats.totalCategories}**\n\n`;
        
        const sortedCats = Object.entries(categoryStats.categories)
          .sort((a, b) => b[1].avgRating - a[1].avgRating);
        
        accumulatedResponse += `**Highest Rated:**\n`;
        sortedCats.slice(0, 3).forEach(([cat, stats]) => {
          accumulatedResponse += `- ${cat}: ${stats.avgRating}⭐ (${stats.count} reviews)\n`;
        });
        
        accumulatedResponse += `\n**Lowest Rated:**\n`;
        sortedCats.slice(-3).forEach(([cat, stats]) => {
          accumulatedResponse += `- ${cat}: ${stats.avgRating}⭐ (${stats.count} reviews)\n`;
        });

        newVisualizations = [{
          type: 'Rating Analysis',
          data: sortedCats.map(([cat, stats]) => ({
            product: cat,
            rating: stats.avgRating,
            count: stats.count
          }))
        }];

      } else if (lowerQuery?.includes('category') || lowerQuery?.includes('product') || lowerQuery?.includes('top') || lowerQuery?.includes('best') || lowerQuery?.includes('worst')) {
        const categoryStats = await getCategoryStats();
        
        accumulatedResponse = `📦 **Category Performance Analysis**\n\n`;
        accumulatedResponse += `**Total Categories: ${categoryStats.totalCategories}**\n\n`;
        
        const sortedCats = Object.entries(categoryStats.categories)
          .sort((a, b) => b[1].avgRating - a[1].avgRating);
        
        accumulatedResponse += `**Top Performers:**\n`;
        sortedCats.slice(0, 3).forEach(([cat, stats]) => {
          accumulatedResponse += `- ${cat}: ${stats.avgRating}⭐ (${stats.count} reviews)\n`;
        });
        
        accumulatedResponse += `\n**Bottom Performers:**\n`;
        sortedCats.slice(-3).forEach(([cat, stats]) => {
          accumulatedResponse += `- ${cat}: ${stats.avgRating}⭐ (${stats.count} reviews)\n`;
        });

        newVisualizations = [{
          type: 'Category Ratings',
          data: sortedCats.map(([cat, stats]) => ({
            name: cat,
            rating: stats.avgRating,
            count: stats.count
          }))
        }];

      } else if (lowerQuery?.includes('country') || lowerQuery?.includes('region') || lowerQuery?.includes('geographic')) {
        const countryStats = await getCountryStats();
        
        accumulatedResponse = `🌍 **Country-wise Statistics**\n\n`;
        accumulatedResponse += `**Total Countries: ${countryStats.totalCountries}**\n\n`;
        
        const sortedCountries = Object.entries(countryStats.countries)
          .sort((a, b) => b[1].count - a[1].count);
        
        sortedCountries.forEach(([country, stats]) => {
          accumulatedResponse += `- ${country}: ${stats.avgRating}⭐ (${stats.count} reviews)\n`;
        });

        newVisualizations = [{
          type: 'Country Stats',
          data: sortedCountries.map(([country, stats]) => ({
            name: country,
            rating: stats.avgRating,
            count: stats.count
          }))
        }];

      } else {
        // Default to sentiment analysis if no specific query matches
        const sentimentData = await calculateSentiment();
        const distribution = await getRatingDistribution();
        
        accumulatedResponse = `💬 **Sentiment Analysis**\n\n`;
        accumulatedResponse += `- Positive: **${sentimentData.sentiment.positive}%** (${sentimentData.breakdown.positive} reviews)\n`;
        accumulatedResponse += `- Neutral: **${sentimentData.sentiment.neutral}%** (${sentimentData.breakdown.neutral} reviews)\n`;
        accumulatedResponse += `- Negative: **${sentimentData.sentiment.negative}%** (${sentimentData.breakdown.negative} reviews)\n\n`;
        accumulatedResponse += `**Rating Distribution:**\n`;
        Object.entries(distribution.distribution).forEach(([rating, count]) => {
          accumulatedResponse += `- ${rating} Stars: ${count} reviews\n`;
        });

        newVisualizations = [{
          type: 'Sentiment Distribution',
          data: [
            { name: 'Positive', value: sentimentData.sentiment.positive },
            { name: 'Neutral', value: sentimentData.sentiment.neutral },
            { name: 'Negative', value: sentimentData.sentiment.negative }
          ]
        }];
      }

      // Update message with content and visualizations
      setMessages(prev => 
        prev?.map(msg => 
          msg?.id === assistantMessageId 
            ? { 
                ...msg, 
                content: accumulatedResponse || 'Analysis completed',
                visualizations: newVisualizations?.map(v => ({ type: v?.type }))
              }
            : msg
        )
      );

      if (newVisualizations?.length > 0) {
        const sumValues = (data) => (data || []).reduce((sum, d) => sum + (parseFloat(d?.value || d?.rating || d?.satisfied || 0) || 0), 0);
        const allEmpty = newVisualizations.every(v => sumValues(v?.data) <= 0);

        console.log('📊 Visualizations created:', newVisualizations);
        console.log('📊 Sum values per viz:', newVisualizations.map(v => ({
          type: v.type,
          dataLength: v.data?.length,
          sum: sumValues(v.data),
          data: v.data
        })));
        console.log('Data structure:', JSON.stringify(newVisualizations[0], null, 2));
        console.log('All empty?', allEmpty);

        if (allEmpty) {
          console.warn('⚠️ Visualization data is empty (all zero values) - not setting visualizations');
          // Still set visualizations even if empty so user knows analysis ran
          setVisualizations(newVisualizations);
        } else {
          console.log('✅ Setting visualizations with data');
          setVisualizations(newVisualizations);
        }
      } else {
        console.log('ℹ️ No visualizations generated for this query');
      }

    } catch (error) {
      console.error('Error in conversation:', error);
      
      const errorMessage = handleGeminiError(error);
      
      setMessages(prev => 
        prev?.map(msg => 
          msg?.id === assistantMessageId 
            ? { 
                ...msg, 
                content: `I apologize, but I encountered an error: ${errorMessage}\n\nPlease try rephrasing your query or try again in a moment.`
              }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportMessage = (message) => {
    try {
      const text = message?.content || '';
      const element = document.createElement('a');
      const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `message_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error exporting message:', error);
      alert('Failed to export message');
    }
  };

  const handleExportVisualization = (visualization) => {
    try {
      if (!visualization) {
        alert('No visualization to export');
        return;
      }

      // Create CSV data from visualization
      const csvContent = generateCSVFromVisualization(visualization);
      
      // Create a blob and download
      const element = document.createElement('a');
      const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${visualization?.type}_${Date.now()}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      alert(`${visualization?.type} exported successfully!`);
    } catch (error) {
      console.error('Error exporting visualization:', error);
      alert('Failed to export visualization');
    }
  };

  const generateCSVFromVisualization = (visualization) => {
    if (!visualization || !visualization.data) {
      return '';
    }

    const title = `${visualization.type} Data Export\n`;
    const timestamp = `Exported: ${new Date().toLocaleString()}\n\n`;
    
    // Create headers from the data keys
    const data = visualization.data;
    if (data.length === 0) return title + timestamp;

    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');
    
    // Create data rows
    const dataRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );

    return title + timestamp + headerRow + '\n' + dataRows.join('\n');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <NavigationSidebar userRole={userRole} />
        
        <div className="main-content">
          <NavigationBreadcrumb />
          
          {/* Compact Header Section */}
          <div className="mb-4 pb-2 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <Icon name="MessageCircle" size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Conversation Analysis</h1>
                  <p className="text-xs text-muted-foreground">AI-powered Amazon review analysis</p>
                </div>
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-success/20 border border-success/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium text-success">Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversation Panel - 2/3 width */}
            <div className="lg:col-span-2 flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              {/* Header */}
              <div className="px-5 py-3 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-success animate-pulse shadow-lg shadow-success/50" />
                    <div>
                      <h2 className="text-sm font-bold text-foreground">Conversation</h2>
                      <p className="text-xs text-muted-foreground">{messages?.length} messages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-foreground border border-border/50">
                      {isProcessing ? '⏳ Processing' : '✓ Ready'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden min-h-0">
                <ConversationThread 
                  messages={messages} 
                  onExportMessage={handleExportMessage}
                />
              </div>
              
              {/* Input */}
              <div className="border-t border-border/50 flex-shrink-0">
                <QueryInput 
                  onSendQuery={handleSendQuery}
                  isProcessing={isProcessing}
                  suggestedQueries={suggestedQueries}
                />
              </div>
            </div>

            {/* Visualization Panel - 1/3 width */}
            <div className="flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="px-5 py-3 border-b border-border/50 bg-gradient-to-r from-accent/5 to-secondary/5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Icon name="BarChart3" size={16} className="text-accent" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">Visualizations</h2>
                      <p className="text-xs text-muted-foreground">{visualizations?.length} charts</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden min-h-0">
                <VisualizationPanel 
                  visualizations={visualizations}
                  onExportVisualization={handleExportVisualization}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ConversationAnalysis;