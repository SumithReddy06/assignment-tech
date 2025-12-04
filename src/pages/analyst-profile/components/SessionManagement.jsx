import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionManagement = ({ sessions, onRevokeSession, onRevokeAll }) => {
  const getCurrentSession = () => {
    return sessions?.find(s => s?.isCurrent);
  };

  const getOtherSessions = () => {
    return sessions?.filter(s => !s?.isCurrent);
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop': return 'Monitor';
      case 'mobile': return 'Smartphone';
      case 'tablet': return 'Tablet';
      default: return 'Laptop';
    }
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const currentSession = getCurrentSession();
  const otherSessions = getOtherSessions();

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Active Sessions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your active login sessions across devices
            </p>
          </div>
          {otherSessions?.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              iconName="LogOut"
              iconPosition="left"
              onClick={onRevokeAll}
            >
              Revoke All
            </Button>
          )}
        </div>

        {currentSession && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Current Session</h3>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon
                      name={getDeviceIcon(currentSession?.deviceType)}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{currentSession?.deviceName}</p>
                      <span className="px-2 py-0.5 bg-success text-success-foreground text-xs rounded-full">
                        Active Now
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentSession?.browser} • {currentSession?.os}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        {currentSession?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Wifi" size={14} />
                        {currentSession?.ipAddress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {otherSessions?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Other Sessions</h3>
            <div className="space-y-3">
              {otherSessions?.map((session) => (
                <div
                  key={session?.id}
                  className="flex items-start justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Icon
                        name={getDeviceIcon(session?.deviceType)}
                        size={20}
                        className="text-secondary"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{session?.deviceName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {session?.browser} • {session?.os}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          {session?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {formatLastActive(session?.lastActive)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => onRevokeSession(session?.id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherSessions?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Shield" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No other active sessions</p>
          </div>
        )}
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-1">Session Security</h3>
            <p className="text-sm text-muted-foreground">
              If you notice any suspicious activity or unrecognized devices, revoke those sessions immediately and change your password. Sessions automatically expire after 30 days of inactivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
