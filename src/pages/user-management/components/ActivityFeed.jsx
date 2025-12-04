import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      login: 'LogIn',
      analysis: 'MessageSquare',
      report: 'FileText',
      edit: 'Edit',
      create: 'UserPlus',
      deactivate: 'UserX'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      login: 'text-primary',
      analysis: 'text-accent',
      report: 'text-success',
      edit: 'text-warning',
      create: 'text-success',
      deactivate: 'text-destructive'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image 
                src={activity?.userAvatar} 
                alt={activity?.userAvatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity?.userName}</span>
                  {' '}
                  <span className="text-muted-foreground">{activity?.action}</span>
                </p>
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={16} 
                  className={getActivityColor(activity?.type)}
                />
              </div>
              <div className="text-xs text-muted-foreground">{activity?.timestamp}</div>
              {activity?.details && (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
                  {activity?.details}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;