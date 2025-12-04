import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryAccessTab = ({ userRole, assignedCategories }) => {
  if (userRole === 'Administrator') {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={24} className="text-success" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Full System Access</h2>
            <p className="text-sm text-muted-foreground">
              Administrator privileges granted
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Check" size={16} className="text-success" />
            <span className="text-foreground">Access to all product categories</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Check" size={16} className="text-success" />
            <span className="text-foreground">User management capabilities</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Check" size={16} className="text-success" />
            <span className="text-foreground">System configuration access</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Check" size={16} className="text-success" />
            <span className="text-foreground">Full report generation and export</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Assigned Product Categories
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          You have access to analyze reviews for the following product categories
        </p>

        <div className="space-y-3">
          {assignedCategories?.map((category) => (
            <div
              key={category?.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={category?.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{category?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category?.reviewCount} reviews available
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full font-medium">
                  {category?.accessLevel}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Since {category?.assignedDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-1">Access Information</h3>
            <p className="text-sm text-muted-foreground">
              Your category assignments are managed by system administrators. To request access to additional categories, please contact your administrator or submit a request through the user management portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAccessTab;
