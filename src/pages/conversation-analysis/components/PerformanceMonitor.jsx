import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMonitor = ({ metrics }) => {
  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds?.good) return 'text-success';
    if (value <= thresholds?.warning) return 'text-warning';
    return 'text-error';
  };

  const getStatusIcon = (value, thresholds) => {
    if (value <= thresholds?.good) return 'CheckCircle';
    if (value <= thresholds?.warning) return 'AlertCircle';
    return 'XCircle';
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all p-4 w-80 group hover:border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <h4 className="text-sm font-bold text-foreground">Performance Monitor</h4>
        </div>
        <Icon name="Activity" size={16} color="var(--color-primary)" className="opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-3.5">
        {/* Response Time */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Response Time</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${getStatusColor(metrics?.responseTime, { good: 1000, warning: 3000 })}`}>
                {metrics?.responseTime}ms
              </span>
              <Icon
                name={getStatusIcon(metrics?.responseTime, { good: 1000, warning: 3000 })}
                size={14}
                className={getStatusColor(metrics?.responseTime, { good: 1000, warning: 3000 })}
              />
            </div>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${ 
                metrics?.responseTime <= 1000 ? 'bg-success' : metrics?.responseTime <= 3000 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${Math.min((metrics?.responseTime / 3000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Cache Hit Rate */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Cache Hit Rate</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${getStatusColor(100 - metrics?.cacheHitRate, { good: 30, warning: 60 })}`}>
                {metrics?.cacheHitRate}%
              </span>
              <Icon
                name={getStatusIcon(100 - metrics?.cacheHitRate, { good: 30, warning: 60 })}
                size={14}
                className={getStatusColor(100 - metrics?.cacheHitRate, { good: 30, warning: 60 })}
              />
            </div>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all bg-success`}
              style={{ width: `${metrics?.cacheHitRate}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 py-2">
          {/* API Calls */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-border/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Zap" size={14} className="text-info" />
              <span className="text-xs text-muted-foreground font-medium">API Calls</span>
            </div>
            <span className="text-lg font-bold text-foreground">{metrics?.apiCalls}</span>
          </div>

          {/* Data Processed */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-border/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Database" size={14} className="text-accent" />
              <span className="text-xs text-muted-foreground font-medium">Data</span>
            </div>
            <span className="text-lg font-bold text-foreground">{metrics?.dataProcessed}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} className="text-warning" />
            <span className="text-xs text-muted-foreground font-medium">Session Duration</span>
          </div>
          <span className="text-sm font-bold text-foreground">{metrics?.sessionDuration}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;