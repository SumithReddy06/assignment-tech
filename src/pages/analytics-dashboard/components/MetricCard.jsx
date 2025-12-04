import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary', onClick }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-lg p-6 border border-border transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
      }`}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={(e) => {
        if (onClick && (e?.key === 'Enter' || e?.key === ' ')) {
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `rgba(var(--color-${color}), 0.1)` }}>
          <Icon name={icon} size={24} color={`var(--color-${color})`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;