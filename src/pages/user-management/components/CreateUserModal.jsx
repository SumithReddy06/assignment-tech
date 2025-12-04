import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateUserModal = ({ onClose, onCreate, existingAdminExists = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Analyst',
    password: '',
    confirmPassword: '',
    categories: []
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: 'Analyst', label: 'Analyst', description: 'Can analyze assigned product categories' },
    { value: 'Administrator', label: 'Administrator', description: 'Full system access and user management' }
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
    if (!formData?.password) newErrors.password = 'Password is required';
    if (formData?.password?.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData?.password !== formData?.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData?.role === 'Analyst' && formData?.categories?.length === 0) {
      newErrors.categories = 'At least one category must be assigned for Analysts';
    }
    // Prevent creating a second Administrator
    if (formData?.role === 'Administrator' && existingAdminExists) {
      newErrors.role = 'An Administrator account already exists. Only one Administrator is allowed.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newUser = {
        id: `USR${Date.now()}`,
        name: formData?.name,
        email: formData?.email,
        role: formData?.role,
        categories: formData?.role === 'Administrator' ? availableCategories : formData?.categories,
        status: 'Active',
        lastLogin: 'Never',
        createdAt: new Date()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData?.name}`,
        avatarAlt: `Professional avatar for ${formData?.name} showing friendly expression with modern styling`,
        totalAnalyses: 0,
        stats: {
          queries: 0,
          reports: 0,
          avgResponseTime: '0s',
          satisfaction: '0%'
        },
        permissions: formData?.role === 'Administrator' 
          ? ['Full System Access', 'User Management', 'All Categories', 'System Configuration']
          : ['View Assigned Categories', 'Create Analysis', 'Generate Reports', 'Export Data']
      };
      
      onCreate(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e?.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Create New User</h2>
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

          <Select
            label="User Role"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value)}
            description="Select the appropriate role based on user responsibilities"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
                description="Minimum 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={formData?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              required
            />
          </div>

          {formData?.role === 'Analyst' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Assign Product Categories *
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
          )}

          {formData?.role === 'Administrator' && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
              <Icon name="Shield" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary-foreground">
                <p className="font-medium mb-1">Administrator Access</p>
                <p>This user will have full system access including all product categories and user management capabilities.</p>
                {existingAdminExists && (
                  <p className="text-xs text-destructive mt-2">Warning: An Administrator already exists — creating another is not allowed.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" iconName="UserPlus" iconPosition="left" onClick={handleSubmit}>
            Create User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;