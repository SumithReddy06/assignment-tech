import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NotificationPreferences = ({ initialPreferences, onSave }) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (category, key) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [key]: !prev?.[category]?.[key]
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(preferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setPreferences(initialPreferences);
    setHasChanges(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage how you receive updates and alerts
          </p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Mail" size={18} className="text-primary" />
            Email Notifications
          </h3>
          <div className="space-y-3 ml-7">
            <Checkbox
              label="Analysis completion alerts"
              description="Receive email when your analysis is complete"
              checked={preferences?.email?.analysisComplete}
              onChange={() => handleToggle('email', 'analysisComplete')}
            />
            <Checkbox
              label="Weekly summary reports"
              description="Get a weekly digest of your analysis activity"
              checked={preferences?.email?.weeklySummary}
              onChange={() => handleToggle('email', 'weeklySummary')}
            />
            <Checkbox
              label="System updates"
              description="Important updates about the platform"
              checked={preferences?.email?.systemUpdates}
              onChange={() => handleToggle('email', 'systemUpdates')}
            />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Bell" size={18} className="text-primary" />
            In-App Notifications
          </h3>
          <div className="space-y-3 ml-7">
            <Checkbox
              label="Real-time analysis updates"
              description="Show notifications during analysis processing"
              checked={preferences?.inApp?.realTimeUpdates}
              onChange={() => handleToggle('inApp', 'realTimeUpdates')}
            />
            <Checkbox
              label="New report availability"
              description="Alert when new reports are generated"
              checked={preferences?.inApp?.newReports}
              onChange={() => handleToggle('inApp', 'newReports')}
            />
            <Checkbox
              label="Category access changes"
              description="Notify when your category access is modified"
              checked={preferences?.inApp?.accessChanges}
              onChange={() => handleToggle('inApp', 'accessChanges')}
            />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Shield" size={18} className="text-primary" />
            Security Alerts
          </h3>
          <div className="space-y-3 ml-7">
            <Checkbox
              label="Login from new device"
              description="Alert when your account is accessed from a new device"
              checked={preferences?.security?.newDeviceLogin}
              onChange={() => handleToggle('security', 'newDeviceLogin')}
              disabled
            />
            <Checkbox
              label="Password changes"
              description="Confirm all password modification attempts"
              checked={preferences?.security?.passwordChanges}
              onChange={() => handleToggle('security', 'passwordChanges')}
              disabled
            />
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Icon name="Lock" size={14} className="mt-0.5" />
              <span>Security alerts cannot be disabled for account protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;