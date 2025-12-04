import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStatsCard = ({ title, value, change, icon, trend }) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name={icon} size={24} color="var(--color-primary)" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-semibold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </div>
  );
};

export default UserStatsCard;