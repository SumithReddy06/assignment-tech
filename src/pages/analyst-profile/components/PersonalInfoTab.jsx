import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalInfoTab = ({ userData, onSave }) => {
  const [formData, setFormData] = useState({
    name: userData?.name,
    email: userData?.email,
    phone: userData?.phone,
    department: userData?.department,
    location: userData?.location
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData?.phone && !/^\+?[\d\s-()]+$/?.test(formData?.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordData?.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  const handlePasswordUpdate = () => {
    if (validatePassword()) {
      console.log('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            disabled={!isEditing}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            disabled={!isEditing}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            disabled={!isEditing}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="Department"
            type="text"
            value={formData?.department}
            onChange={(e) => handleInputChange('department', e?.target?.value)}
            disabled={!isEditing}
          />

          <Input
            label="Location"
            type="text"
            value={formData?.location}
            onChange={(e) => handleInputChange('location', e?.target?.value)}
            disabled={!isEditing}
            className="md:col-span-2"
          />
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <Button variant="default" onClick={handleSave}>
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: userData?.name,
                  email: userData?.email,
                  phone: userData?.phone,
                  department: userData?.department,
                  location: userData?.location
                });
                setErrors({});
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Password & Security</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your password and security settings
            </p>
          </div>
          {!showPasswordSection && (
            <Button
              variant="outline"
              size="sm"
              iconName="Lock"
              iconPosition="left"
              onClick={() => setShowPasswordSection(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        {showPasswordSection && (
          <div className="space-y-4 mt-6">
            <Input
              label="Current Password"
              type="password"
              value={passwordData?.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
              error={errors?.currentPassword}
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData?.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
              error={errors?.newPassword}
              description="Must be at least 8 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData?.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              required
            />

            <div className="flex gap-3 mt-6">
              <Button variant="default" onClick={handlePasswordUpdate}>
                Update Password
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordSection(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setErrors({});
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!showPasswordSection && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={20} className="text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Password last changed</p>
                <p className="text-sm text-muted-foreground">November 15, 2025</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoTab;
