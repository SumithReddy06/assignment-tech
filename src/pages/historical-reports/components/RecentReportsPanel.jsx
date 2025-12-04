import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentReportsPanel = ({ recentReports, onReportClick }) => {
  const formatDate = (date) => {
    const now = new Date();
    const reportDate = new Date(date);
    const diffInHours = Math.floor((now - reportDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return reportDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Clock" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Recently Accessed</h3>
      </div>
      <div className="space-y-3">
        {recentReports?.map((report) => (
          <button
            key={report?.id}
            onClick={() => onReportClick(report)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-150 text-left"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-muted">
              <Image
                src={report?.thumbnail}
                alt={report?.thumbnailAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                {report?.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(report?.accessedAt)}</span>
                <span>•</span>
                <span>{report?.category}</span>
              </div>
            </div>

            <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentReportsPanel;