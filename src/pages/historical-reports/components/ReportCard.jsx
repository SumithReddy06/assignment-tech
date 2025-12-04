import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReportCard = ({ report, onView, onExport, onDelete, onRerun, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getReportTypeIcon = (type) => {
    const icons = {
      'nps-analysis': 'TrendingUp',
      'sentiment-analysis': 'Heart',
      'rating-breakdown': 'Star',
      'product-comparison': 'GitCompare',
      'trend-analysis': 'LineChart'
    };
    return icons?.[type] || 'FileText';
  };

  const getReportTypeBadge = (type) => {
    const badges = {
      'nps-analysis': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'sentiment-analysis': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      'rating-breakdown': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      'product-comparison': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'trend-analysis': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    };
    return badges?.[type] || 'bg-muted text-muted-foreground';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-card border rounded-lg transition-all duration-200 ${isSelected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'}`}>
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(report?.id, e?.target?.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Select ${report?.title}`}
            />
          </div>

          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
            <Image
              src={report?.thumbnail}
              alt={report?.thumbnailAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
                  {report?.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getReportTypeBadge(report?.type)}`}>
                    <Icon name={getReportTypeIcon(report?.type)} size={12} />
                    {report?.typeLabel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {report?.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Eye"
                  onClick={() => onView(report)}
                  title="View report"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Download"
                  onClick={() => onExport(report)}
                  title="Export report"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="RefreshCw"
                  onClick={() => onRerun(report)}
                  title="Rerun analysis"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Trash2"
                  onClick={() => onDelete(report)}
                  title="Delete report"
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {report?.summary}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(report?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="User" size={14} />
                <span>{report?.createdBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="BarChart3" size={14} />
                <span>{report?.dataPoints} data points</span>
              </div>
            </div>

            {report?.tags && report?.tags?.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {report?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground"
                  >
                    <Icon name="Tag" size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-2">Analysis Parameters</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {report?.parameters?.map((param, index) => (
                <div key={index} className="bg-muted rounded-lg p-2">
                  <div className="text-xs text-muted-foreground mb-1">{param?.label}</div>
                  <div className="text-sm font-medium text-foreground">{param?.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <span>{isExpanded ? 'Hide' : 'Show'} details</span>
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={14} />
        </button>
      </div>
    </div>
  );
};

export default ReportCard;