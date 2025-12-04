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
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Clock" size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `rgba(var(--color-${getActivityColor(activity?.type)}), 0.1)` }}
              >
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={16} 
                  color={`var(--color-${getActivityColor(activity?.type)})`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity?.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimestamp(activity?.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;