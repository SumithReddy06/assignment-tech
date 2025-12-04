import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e?.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">User Details</h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image 
                src={user?.avatar} 
                alt={user?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{user?.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Icon name="Shield" size={12} />
                  {user?.role}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user?.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'Active' ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                  {user?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="User" size={16} />
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">User ID</div>
                <div className="text-sm text-foreground font-medium">{user?.id}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Last Login</div>
                <div className="text-sm text-foreground">{user?.lastLogin}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Account Created</div>
                <div className="text-sm text-foreground">{user?.createdAt}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Total Analyses</div>
                <div className="text-sm text-foreground">{user?.totalAnalyses}</div>
              </div>
            </div>
          </div>

          {/* Assigned Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="FolderOpen" size={16} />
              Assigned Product Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {user?.categories?.map((category, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg text-sm bg-accent/10 text-accent-foreground border border-accent/20">
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Activity Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-semibold text-foreground mb-1">{user?.stats?.queries}</div>
                <div className="text-xs text-muted-foreground">Queries</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-semibold text-foreground mb-1">{user?.stats?.reports}</div>
                <div className="text-xs text-muted-foreground">Reports</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-semibold text-foreground mb-1">{user?.stats?.avgResponseTime}</div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-semibold text-foreground mb-1">{user?.stats?.satisfaction}</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="Lock" size={16} />
              Permissions
            </h4>
            <div className="space-y-2">
              {user?.permissions?.map((permission, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-foreground">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="Edit" iconPosition="left">
            Edit User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;