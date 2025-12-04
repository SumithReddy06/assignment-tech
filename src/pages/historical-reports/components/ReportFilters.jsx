import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ReportFilters = ({ onFilterChange, resultsCount }) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: 'all',
    category: 'all',
    reportType: 'all',
    tags: []
  });

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'home-kitchen', label: 'Home & Kitchen' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'beauty', label: 'Beauty & Personal Care' }
  ];

  const reportTypeOptions = [
    { value: 'all', label: 'All Report Types' },
    { value: 'nps-analysis', label: 'NPS Analysis' },
    { value: 'sentiment-analysis', label: 'Sentiment Analysis' },
    { value: 'rating-breakdown', label: 'Rating Breakdown' },
    { value: 'product-comparison', label: 'Product Comparison' },
    { value: 'trend-analysis', label: 'Trend Analysis' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      dateRange: 'all',
      category: 'all',
      reportType: 'all',
      tags: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters?.searchQuery || filters?.dateRange !== 'all' || 
                          filters?.category !== 'all' || filters?.reportType !== 'all' || 
                          filters?.tags?.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Filter Reports</h3>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            iconName="X" 
            iconPosition="left"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search reports..."
          value={filters?.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
          className="col-span-1 md:col-span-2"
        />

        <Select
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Select date range"
        />

        <Select
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Select category"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          options={reportTypeOptions}
          value={filters?.reportType}
          onChange={(value) => handleFilterChange('reportType', value)}
          placeholder="Select report type"
        />

        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <Icon name="FileText" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{resultsCount}</span> reports
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;