import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserTableRow = ({ user, onEdit, onToggleStatus, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-success' : 'text-muted-foreground';
  };

  const getStatusBgColor = (status) => {
    return status === 'Active' ? 'bg-success/10' : 'bg-muted';
  };

  return (
    <>
      {/* Desktop Row */}
      <tr className="hidden lg:table-row border-b border-border hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image 
                src={user?.avatar} 
                alt={user?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-foreground">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Icon name="Shield" size={12} />
            {user?.role}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1.5">
            {user?.categories?.slice(0, 2)?.map((category, idx) => (
              <span key={idx} className="px-2 py-1 rounded text-xs bg-accent/10 text-accent-foreground">
                {category}
              </span>
            ))}
            {user?.categories?.length > 2 && (
              <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                +{user?.categories?.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-muted-foreground">
          {user?.lastLogin}
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBgColor(user?.status)} ${getStatusColor(user?.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'Active' ? 'bg-success' : 'bg-muted-foreground'}`}></span>
            {user?.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              iconName="Eye"
              iconSize={16}
              onClick={() => onViewDetails(user)}
              className="hover:bg-primary/10 hover:text-primary"
            />
            <Button
              variant="ghost"
              size="icon"
              iconName="Edit"
              iconSize={16}
              onClick={() => onEdit(user)}
              className="hover:bg-accent/10 hover:text-accent"
            />
            <Button
              variant="ghost"
              size="icon"
              iconName={user?.status === 'Active' ? 'UserX' : 'UserCheck'}
              iconSize={16}
              onClick={() => onToggleStatus(user)}
              className={user?.status === 'Active' ? 'hover:bg-destructive/10 hover:text-destructive' : 'hover:bg-success/10 hover:text-success'}
            />
          </div>
        </td>
      </tr>
      {/* Mobile Card */}
      <div className="lg:hidden border border-border rounded-lg p-4 mb-3 bg-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image 
                src={user?.avatar} 
                alt={user?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-foreground">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconSize={20}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Icon name="Shield" size={12} />
            {user?.role}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBgColor(user?.status)} ${getStatusColor(user?.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'Active' ? 'bg-success' : 'bg-muted-foreground'}`}></span>
            {user?.status}
          </span>
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Assigned Categories</div>
              <div className="flex flex-wrap gap-1.5">
                {user?.categories?.map((category, idx) => (
                  <span key={idx} className="px-2 py-1 rounded text-xs bg-accent/10 text-accent-foreground">
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Last Login</div>
              <div className="text-sm text-foreground">{user?.lastLogin}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onViewDetails(user)}
                fullWidth
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                onClick={() => onEdit(user)}
                fullWidth
              >
                Edit
              </Button>
              <Button
                variant={user?.status === 'Active' ? 'destructive' : 'success'}
                size="sm"
                iconName={user?.status === 'Active' ? 'UserX' : 'UserCheck'}
                iconPosition="left"
                onClick={() => onToggleStatus(user)}
                fullWidth
              >
                {user?.status === 'Active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserTableRow;