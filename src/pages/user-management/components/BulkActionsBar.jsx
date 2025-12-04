import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onClearSelection, onBulkAction }) => {
  const bulkActionOptions = [
    { value: 'activate', label: 'Activate Users' },
    { value: 'deactivate', label: 'Deactivate Users' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Users' }
  ];

  const handleActionChange = (value) => {
    if (value) {
      onBulkAction(value);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Icon name="CheckSquare" size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {selectedCount} {selectedCount === 1 ? 'user' : 'users'} selected
          </p>
          <p className="text-xs text-muted-foreground">Choose an action to apply to selected users</p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select
          placeholder="Select action..."
          options={bulkActionOptions}
          onChange={handleActionChange}
          className="min-w-[200px]"
        />
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClearSelection}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;