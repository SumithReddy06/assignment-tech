import React from 'react';
import Icon from '../../../components/AppIcon';

const BrandHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
          <Icon name="MessageSquareText" size={32} className="text-primary" />
        </div>
      </div>
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        ReviewChat Analytics
      </h1>
      <p className="text-sm text-muted-foreground">
        AI-Powered Product Review Analysis Platform
      </p>
    </div>
  );
};

export default BrandHeader;