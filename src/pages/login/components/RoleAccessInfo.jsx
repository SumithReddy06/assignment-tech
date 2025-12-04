import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleAccessInfo = () => {
  const roles = [
    {
      icon: 'BarChart3',
      title: 'Analyst Access',
      description: 'Analyze assigned product categories and generate insights',
      color: 'text-primary'
    },
    {
      icon: 'Shield',
      title: 'Administrator Access',
      description: 'Full system access with user management capabilities',
      color: 'text-accent'
    }
  ];

  return (
    <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Users" size={16} />
        Role-Based Access
      </h3>
      <div className="space-y-4">
        {roles?.map((role, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${role?.color}`}>
              <Icon name={role?.icon} size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">{role?.title}</p>
              <p className="text-xs text-muted-foreground">{role?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleAccessInfo;