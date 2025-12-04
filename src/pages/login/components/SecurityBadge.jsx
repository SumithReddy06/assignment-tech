import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadge = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
      <Icon name={icon} size={16} className="text-success" />
      <span className="text-xs font-medium text-muted-foreground">{text}</span>
    </div>
  );
};

export default SecurityBadge;