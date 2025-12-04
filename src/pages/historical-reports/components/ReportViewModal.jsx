import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReportViewModal = ({ report, onClose, onExport, onRerun }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!report) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'visualizations', label: 'Visualizations', icon: 'BarChart3' },
    { id: 'insights', label: 'Insights', icon: 'Lightbulb' },
    { id: 'parameters', label: 'Parameters', icon: 'Settings' }
  ];

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-2xl font-semibold text-foreground mb-2 line-clamp-1">
              {report?.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(report?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="User" size={14} />
                <span>{report?.createdBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Tag" size={14} />
                <span>{report?.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onExport(report)}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={() => onRerun(report)}
            >
              Rerun
            </Button>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="border-b border-border px-6">
          <div className="flex gap-1">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150 border-b-2 ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">{report?.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="BarChart3" size={20} color="var(--color-primary)" />
                    <span className="text-sm text-muted-foreground">Data Points</span>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">{report?.dataPoints}</div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="TrendingUp" size={20} color="var(--color-success)" />
                    <span className="text-sm text-muted-foreground">Avg Rating</span>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">4.2/5.0</div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Users" size={20} color="var(--color-accent)" />
                    <span className="text-sm text-muted-foreground">Reviews</span>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">12,847</div>
                </div>
              </div>

              {report?.tags && report?.tags?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {report?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                      >
                        <Icon name="Tag" size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'visualizations' && (
            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-6 h-64 flex items-center justify-center">
                <Image
                  src={report?.thumbnail}
                  alt={report?.thumbnailAlt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4]?.map((item) => (
                  <div key={item} className="bg-muted rounded-lg p-4 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Visualization {item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              {report?.insights?.map((insight, index) => (
                <div key={index} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-1">{insight?.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report?.parameters?.map((param, index) => (
                <div key={index} className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">{param?.label}</div>
                  <div className="text-base font-medium text-foreground">{param?.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportViewModal;