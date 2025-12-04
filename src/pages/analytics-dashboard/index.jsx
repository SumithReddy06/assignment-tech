import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '../../components/navigation/NavigationSidebar';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import NavigationBreadcrumb from '../../components/navigation/NavigationBreadcrumb';
import MetricCard from './components/MetricCard';
import ConversationHistory from './components/ConversationHistory';
import QueryInterface from './components/QueryInterface';
import QuickActionButtons from './components/QuickActionButtons';
import ActivityFeed from './components/ActivityFeed';
import { loadDataset } from '../../utils/datasetLoader';
import { initializeDatasetService, analyzeDatasetWithText } from '../../utils/datasetAnalysisService';
import { getQuickActionResponse } from '../../utils/quickActionsData';
import { 
  getRecentConversations, 
  addConversation, 
  getRecentActivities, 
  addActivity 
} from '../../utils/localDB';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('Analyst');
  const [isProcessing, setIsProcessing] = useState(false);
  const [datasetLoaded, setDatasetLoaded] = useState(false);
  const [datasetStats, setDatasetStats] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activities, setActivities] = useState([]);

  // Load user role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load conversations and activities from localStorage
  useEffect(() => {
    const loadStoredData = () => {
      const storedConversations = getRecentConversations(50);
      const storedActivities = getRecentActivities(50);
      setConversations(storedConversations);
      setActivities(storedActivities);
    };

    loadStoredData();
    
    // Refresh every 2 seconds to show real-time updates
    const interval = setInterval(loadStoredData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Load dataset on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await loadDataset();
        if (result && result.success) {
          initializeDatasetService(result.dataset);
          setDatasetLoaded(true);
          setDatasetStats({
            totalReviews: result.dataset.analysis.totalRows,
            countries: Object.keys(result.dataset.analysis.countryDistribution).length,
            headers: result.dataset.analysis.headers,
          });
        } else {
          console.warn('Dataset load returned unsuccessful result:', result);
          setDatasetLoaded(false);
        }
      } catch (error) {
        console.error('Error loading dataset:', error);
        setDatasetLoaded(false);
      }
    };

    loadData();
  }, []);

  const getMetrics = () => {
    const baseMetrics = [
      {
        title: 'Total Reviews Analyzed',
        value: datasetStats ? `${(datasetStats.totalReviews / 1000).toFixed(1)}K` : 'Loading...',
        subtitle: datasetStats ? `From ${datasetStats.countries} countries` : 'Loading dataset...',
        icon: 'FileText',
        trend: 'up',
        trendValue: '100%',
        color: 'primary'
      },
      {
        title: 'Dataset Status',
        value: datasetLoaded ? '✅ Ready' : '⏳ Loading',
        subtitle: datasetLoaded ? 'All data indexed' : 'Processing...',
        icon: 'Database',
        trend: 'up',
        trendValue: datasetLoaded ? 'Active' : 'Pending',
        color: 'success'
      },
      {
        title: 'Available Fields',
        value: datasetStats ? `${datasetStats.headers?.length || 0}` : 'N/A',
        subtitle: 'Data columns',
        icon: 'Columns',
        color: 'accent'
      },
      {
        title: 'Query Engine',
        value: 'Gemini AI',
        subtitle: 'Real-time analysis',
        icon: 'Zap',
        trend: 'up',
        trendValue: 'Active',
        color: 'warning'
      }
    ];

    // Add Admin-specific metrics
    if (userRole === 'Administrator') {
      baseMetrics.push(
        {
          title: 'Active Analysts',
          value: '5',
          subtitle: 'Team members',
          icon: 'Users',
          color: 'info'
        },
        {
          title: 'System Health',
          value: '98.5%',
          subtitle: 'Uptime',
          icon: 'Activity',
          trend: 'up',
          trendValue: '+2.3%',
          color: 'success'
        },
        {
          title: 'Reports Generated',
          value: '247',
          subtitle: 'This month',
          icon: 'FileText',
          trend: 'up',
          trendValue: '↑ 34%',
          color: 'primary'
        }
      );
    }

    return baseMetrics;
  };

  const metrics = getMetrics();

  const handleSubmitQuery = async (query) => {
    setIsProcessing(true);
    
    try {
      if (!datasetLoaded) {
        throw new Error('Dataset is still loading. Please wait a moment.');
      }

      // Use dataset-specific analysis if dataset is ready
      const result = await analyzeDatasetWithText(query);
      
      // Save to localStorage
      addConversation(
        query,
        result.response || result.error,
        "Dataset Analysis"
      );
      
      // Add activity
      addActivity('analysis', `Completed analysis on: ${query.substring(0, 50)}...`, {
        category: 'Dataset Analysis'
      });
      
      // Reload conversations to show new entry
      setConversations(getRecentConversations(50));
      setActivities(getRecentActivities(50));
      
    } catch (error) {
      console.error('Error processing query:', error);
      
      // Save error to localStorage
      addConversation(
        query,
        `Error: ${error?.message || 'Failed to process your query. Please try again.'}`,
        "Error"
      );
      
      // Add activity
      addActivity('error', `Query failed: ${error?.message || 'Unknown error'}`, {
        query: query
      });
      
      setConversations(getRecentConversations(50));
      setActivities(getRecentActivities(50));
      
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = (query, actionId) => {
    try {
      if (actionId) {
        // Get hardcoded response for this quick action
        const actionResponse = getQuickActionResponse(actionId, userRole);
        
        // Save to localStorage
        addConversation(
          query,
          actionResponse.response,
          actionResponse.category
        );
        
        // Add activity
        addActivity('quick_action', `Executed quick action: ${actionId}`, {
          actionId: actionId,
          category: actionResponse.category
        });
        
        // Reload conversations to show new entry
        setConversations(getRecentConversations(50));
        setActivities(getRecentActivities(50));
      } else {
        handleSubmitQuery(query);
      }
    } catch (error) {
      console.error('Quick action error:', error);
    }
  };

  const handleSelectConversation = (conversationId) => {
    navigate('/conversation-analysis', { state: { conversationId } });
  };

  const handleMetricClick = (metricTitle) => {
    if (metricTitle === 'Reports Generated') {
      navigate('/historical-reports');
    } else if (metricTitle === 'Active Conversations') {
      navigate('/conversation-analysis');
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <NavigationSidebar userRole={userRole} />
        
        <main className="main-content">
          <NavigationBreadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">AI-powered review analysis and conversational insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {metrics?.map((metric, index) => (
              <MetricCard
                key={index}
                {...metric}
                onClick={metric?.trend ? () => handleMetricClick(metric?.title) : undefined}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <QueryInterface 
                onSubmitQuery={handleSubmitQuery}
                isProcessing={isProcessing}
              />
            </div>
            
            <div>
              <QuickActionButtons 
                onActionClick={handleQuickAction}
                userRole={userRole}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConversationHistory 
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
            />
            
            <ActivityFeed activities={activities} />
          </div>

          {/* Admin-only sections */}
          {userRole === 'Administrator' && (
            <div className="mt-12 space-y-8">
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Admin Controls</h2>
                
                {/* Team Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Team Members</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'John Analyst', email: 'john@reviewchat.com', role: 'Analyst', status: 'Active' },
                        { name: 'Sarah Analytics', email: 'sarah@reviewchat.com', role: 'Analyst', status: 'Active' },
                        { name: 'Mike Reviewer', email: 'mike@reviewchat.com', role: 'Analyst', status: 'Idle' }
                      ].map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-background rounded border border-border/30">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            member.status === 'Active' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-warning/10 text-warning'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Metrics */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">API Response Time</span>
                          <span className="text-sm font-medium text-success">245ms</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Database Load</span>
                          <span className="text-sm font-medium text-info">42%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div className="bg-info h-2 rounded-full" style={{width: '42%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
                          <span className="text-sm font-medium text-success">87%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Access Control & Audit */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Data Access Control</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 text-sm">
                        <span className="text-muted-foreground">Analysts can view:</span>
                        <span className="font-medium text-foreground">All categories</span>
                      </div>
                      <div className="flex items-center justify-between p-2 text-sm">
                        <span className="text-muted-foreground">Export enabled:</span>
                        <span className="font-medium text-success">Yes</span>
                      </div>
                      <div className="flex items-center justify-between p-2 text-sm">
                        <span className="text-muted-foreground">Report templates:</span>
                        <span className="font-medium text-foreground">8 active</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Recent Audits</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-background rounded text-muted-foreground">
                        <div className="font-medium text-foreground">Data Export</div>
                        <div>analyst@reviewchat.com · 2 hrs ago</div>
                      </div>
                      <div className="p-2 bg-background rounded text-muted-foreground">
                        <div className="font-medium text-foreground">Report Generated</div>
                        <div>admin@reviewchat.com · 5 hrs ago</div>
                      </div>
                      <div className="p-2 bg-background rounded text-muted-foreground">
                        <div className="font-medium text-foreground">Settings Changed</div>
                        <div>admin@reviewchat.com · 1 day ago</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Dataset Management</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 text-sm">
                        <span className="text-muted-foreground">Dataset version:</span>
                        <span className="font-medium text-foreground">v2.3.1</span>
                      </div>
                      <div className="flex items-center justify-between p-2 text-sm">
                        <span className="text-muted-foreground">Last updated:</span>
                        <span className="font-medium text-foreground">Dec 3, 2025</span>
                      </div>
                      <div className="flex items-center justify-between p-2 text-sm">
                        <span className="text-muted-foreground">Backup status:</span>
                        <span className="font-medium text-success">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analyst-only info */}
          {userRole === 'Analyst' && (
            <div className="mt-8 p-4 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-sm text-info">
                <span className="font-semibold">👤 Analyst Mode Active</span> - You have view and analysis access to all review data. 
                For administrative functions, please contact your administrator.
              </p>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AnalyticsDashboard;