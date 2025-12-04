import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AnalysisHistoryTab = ({ analysisHistory, onRerun, onExport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = analysisHistory?.filter(item => {
    const matchesSearch = item?.query?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         item?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = filterType === 'all' || item?.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'nps': return 'TrendingUp';
      case 'sentiment': return 'Heart';
      case 'rating': return 'Star';
      case 'report': return 'FileText';
      default: return 'MessageSquare';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'nps': return 'text-primary';
      case 'sentiment': return 'text-success';
      case 'rating': return 'text-warning';
      case 'report': return 'text-secondary';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Analysis History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View and rerun your previous analyses
            </p>
          </div>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export History
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by query or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'nps', 'sentiment', 'rating', 'report']?.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {type?.charAt(0)?.toUpperCase() + type?.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredHistory?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No analysis history found</p>
            </div>
          ) : (
            filteredHistory?.map((item) => (
              <div
                key={item?.id}
                className="flex items-start gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item?.type === 'nps' ? 'bg-primary/10' :
                  item?.type === 'sentiment' ? 'bg-success/10' :
                  item?.type === 'rating'? 'bg-warning/10' : 'bg-secondary/10'
                }`}>
                  <Icon
                    name={getTypeIcon(item?.type)}
                    size={20}
                    className={getTypeColor(item?.type)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 truncate">
                    {item?.query}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Tag" size={14} />
                      {item?.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {item?.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {item?.time}
                    </span>
                  </div>
                  {item?.summary && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item?.summary}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onRerun(item)}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                    title="Rerun analysis"
                  >
                    <Icon name="RefreshCw" size={18} className="text-primary" />
                  </button>
                  <button
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                    title="View details"
                  >
                    <Icon name="Eye" size={18} className="text-foreground" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {analysisHistory?.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Analyses</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {analysisHistory?.filter(a => a?.type === 'nps')?.length}
              </p>
              <p className="text-sm text-muted-foreground">NPS Analyses</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {analysisHistory?.filter(a => a?.type === 'report')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Reports Generated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistoryTab;