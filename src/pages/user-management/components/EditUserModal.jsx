import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Analyst',
    status: user?.status || 'Active',
    categories: user?.categories || []
  });

  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'Analyst', label: 'Analyst' },
    { value: 'Administrator', label: 'Administrator' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const availableCategories = [
    'Electronics',
    'Home & Kitchen',
    'Books',
    'Clothing',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Toys & Games',
    'Automotive',
    'Health & Household',
    'Pet Supplies'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev?.categories?.includes(category)
        ? prev?.categories?.filter(c => c !== category)
        : [...prev?.categories, category]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) newErrors.email = 'Invalid email format';
    if (formData?.categories?.length === 0) newErrors.categories = 'At least one category must be assigned';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...user, ...formData });
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e?.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Edit User</h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter full name"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Role"
              options={roleOptions}
              value={formData?.role}
              onChange={(value) => handleInputChange('role', value)}
              required
            />
            <Select
              label="Account Status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Assigned Product Categories *
              </label>
              {errors?.categories && (
                <span className="text-xs text-destructive">{errors?.categories}</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border">
              {availableCategories?.map((category) => (
                <Checkbox
                  key={category}
                  label={category}
                  checked={formData?.categories?.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {formData?.categories?.length} {formData?.categories?.length === 1 ? 'category' : 'categories'}
            </p>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
            <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-accent-foreground">
              <p className="font-medium mb-1">Category Assignment Guidelines</p>
              <p>Analysts can only access and analyze reviews for their assigned product categories. Administrators have access to all categories by default.</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" iconName="Save" iconPosition="left" onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;