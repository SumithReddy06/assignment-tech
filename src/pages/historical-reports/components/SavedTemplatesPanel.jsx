import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedTemplatesPanel = ({ templates, onTemplateUse, onTemplateDelete }) => {
  const getTemplateIcon = (type) => {
    const icons = {
      'nps-analysis': 'TrendingUp',
      'sentiment-analysis': 'Heart',
      'rating-breakdown': 'Star',
      'product-comparison': 'GitCompare',
      'trend-analysis': 'LineChart'
    };
    return icons?.[type] || 'FileText';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Bookmark" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Saved Templates</h3>
        </div>
        <Button variant="ghost" size="sm" iconName="Plus" iconPosition="left">
          New
        </Button>
      </div>
      <div className="space-y-3">
        {templates?.map((template) => (
          <div
            key={template?.id}
            className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors duration-150"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name={getTemplateIcon(template?.type)} size={20} color="var(--color-primary)" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {template?.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {template?.parameters?.slice(0, 3)?.map((param, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                >
                  <Icon name="Settings" size={10} />
                  {param}
                </span>
              ))}
              {template?.parameters?.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{template?.parameters?.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                iconPosition="left"
                onClick={() => onTemplateUse(template)}
                fullWidth
              >
                Use Template
              </Button>
              <Button
                variant="ghost"
                size="icon"
                iconName="Trash2"
                onClick={() => onTemplateDelete(template)}
              />
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Icon name="Clock" size={12} />
              <span>Used {template?.usageCount} times</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTemplatesPanel;