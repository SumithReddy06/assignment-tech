import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      analysis: 'MessageSquare',
      report: 'FileText',
      export: 'Download',
      user: 'User',
      system: 'Settings',
      quick_action: 'Zap',
      error: 'AlertCircle'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      analysis: 'primary',
      report: 'success',
      export: 'accent',
      user: 'secondary',
      system: 'warning',
      quick_action: 'info',
      error: 'destructive'
    };
    return colors?.[type] || 'primary';
  };

  const formatTimestamp = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return 'just now';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={16} className="text-primary" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-6 text-muted-foreground px-4">
            <Icon name="Clock" size={32} className="mb-2 opacity-40" />
            <p className="text-xs text-center">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {activities?.map((activity) => (
              <div key={activity?.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `rgba(var(--color-${getActivityColor(activity?.type)}), 0.1)` }}
                >
                  <Icon 
                    name={getActivityIcon(activity?.type)} 
                    size={14} 
                    className={`text-${getActivityColor(activity?.type)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground line-clamp-2">{activity?.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(activity?.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;