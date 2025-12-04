import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActionButtons = ({ onActionClick, userRole }) => {
  const actions = [
    {
      id: 'nps-curve',
      label: 'Generate NPS Curve',
      icon: 'TrendingUp',
      query: 'Generate an NPS curve for my assigned product categories over the last 6 months',
      color: 'primary',
      description: 'Visualize Net Promoter Score trends'
    },
    {
      id: 'sentiment-analysis',
      label: 'Analyze Sentiment Trends',
      icon: 'Heart',
      query: 'Show me sentiment analysis with happy and unhappy customer distribution',
      color: 'accent',
      description: 'Track customer satisfaction patterns'
    },
    {
      id: 'product-ratings',
      label: 'Compare Product Ratings',
      icon: 'Star',
      query: 'Identify best and worst performing products based on ratings and explain why',
      color: 'warning',
      description: 'Find top and bottom performers'
    },
    {
      id: 'category-comparison',
      label: 'Category Performance',
      icon: 'BarChart3',
      query: userRole === 'Administrator' ?'Compare performance across all product categories' :'Show detailed performance metrics for my assigned categories',
      color: 'success',
      description: 'Cross-category insights',
      adminOnly: false
    },
    ...(userRole === 'Administrator' ? [
      {
        id: 'team-analytics',
        label: 'Team Analytics',
        icon: 'Users',
        query: 'Show team performance metrics including analyst activity and report generation',
        color: 'info',
        description: 'Monitor team productivity',
        adminOnly: true
      },
      {
        id: 'data-audit',
        label: 'Data & Audit Log',
        icon: 'Shield',
        query: 'Generate a system audit report showing recent data access and modifications',
        color: 'warning',
        description: 'Review system activity',
        adminOnly: true
      },
      {
        id: 'system-health',
        label: 'System Health Check',
        icon: 'Activity',
        query: 'Provide a comprehensive system health report including performance metrics',
        color: 'success',
        description: 'Monitor system status',
        adminOnly: true
      }
    ] : [])
  ];

  const filteredActions = actions?.filter(action => 
    !action?.adminOnly || userRole === 'Administrator'
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} color="var(--color-accent)" />
      </div>
      <div className="space-y-3">
        {filteredActions?.map((action) => (
          <button
            key={action?.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onActionClick(action?.query, action?.id);
            }}
            type="button"
            className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted transition-all duration-150 group"
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-150"
                style={{ backgroundColor: `rgba(var(--color-${action?.color}), 0.1)` }}
              >
                <Icon name={action?.icon} size={20} color={`var(--color-${action?.color})`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1">{action?.label}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{action?.description}</p>
              </div>
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground group-hover:translate-x-1 transition-transform duration-150 flex-shrink-0"
              />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Icon name="Lightbulb" size={14} />
          <span>Click any action to populate the query interface</span>
        </p>
      </div>
    </div>
  );
};

export default QuickActionButtons;