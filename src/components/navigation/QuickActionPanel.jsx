import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const QuickActionPanel = ({ userRole = 'Analyst' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualActions = () => {
    const currentPath = location?.pathname;
    
    const actions = {
      '/analytics-dashboard': [
        { label: 'New Analysis', icon: 'MessageSquare', path: '/conversation-analysis', color: 'accent' },
        { label: 'View Reports', icon: 'FileText', path: '/historical-reports', color: 'primary' },
        ...(userRole === 'Administrator' ? [
          { label: 'User Management', icon: 'Users', path: '/user-management', color: 'warning' }
        ] : [])
      ],
      '/conversation-analysis': [
        { label: 'Save Analysis', icon: 'Save', action: 'save', color: 'success' },
        { label: 'Export Data', icon: 'Download', action: 'export', color: 'primary' }
      ],
      '/historical-reports': [
        { label: 'Filter Reports', icon: 'Filter', action: 'filter', color: 'secondary' },
        ...(userRole === 'Administrator' ? [
          { label: 'Export All Reports', icon: 'Download', action: 'exportAll', color: 'warning' }
        ] : [])
      ],
      '/user-management': userRole === 'Administrator' ? [
        { label: 'Add User', icon: 'UserPlus', action: 'addUser', color: 'accent' },
        { label: 'Export Users', icon: 'Download', action: 'exportUsers', color: 'primary' },
        { label: 'System Settings', icon: 'Settings', action: 'systemSettings', color: 'secondary' }
      ] : [],
      '/user-profile': [
        { label: 'Edit Profile', icon: 'Edit', action: 'editProfile', color: 'primary' },
        { label: 'Change Password', icon: 'Lock', action: 'changePassword', color: 'secondary' }
      ]
    };

    return actions?.[currentPath] || [];
  };

  const handleAction = (action) => {
    if (action?.path) {
      navigate(action?.path);
    } else if (action?.action) {
      switch (action?.action) {
        case 'save': console.log('Saving analysis...');
          break;
        case 'export':
          console.log('Exporting data...');
          break;
        case 'filter': console.log('Opening filter panel...');
          break;
        case 'addUser': console.log('Opening add user dialog...');
          break;
        case 'exportUsers':
          console.log('Exporting user list...');
          break;
        case 'exportAll':
          console.log('Exporting all reports...');
          break;
        case 'systemSettings':
          console.log('Opening system settings...');
          break;
        case 'editProfile': console.log('Opening profile editor...');
          break;
        case 'changePassword': console.log('Opening password change dialog...');
          break;
        default:
          break;
      }
    }
    setIsExpanded(false);
  };

  const contextualActions = getContextualActions();

  if (contextualActions?.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 lg:hidden">
      {isExpanded && (
        <div className="mb-4 flex flex-col gap-2 animate-fade-in">
          {contextualActions?.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-${action?.color} text-${action?.color}-foreground transition-all duration-150 hover:scale-105 active:scale-95`}
              style={{
                backgroundColor: `var(--color-${action?.color})`,
                color: `var(--color-${action?.color}-foreground)`
              }}
            >
              <Icon name={action?.icon} size={20} />
              <span className="font-medium text-sm whitespace-nowrap">{action?.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-accent text-accent-foreground transition-all duration-150 hover:scale-110 active:scale-95"
        aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isExpanded}
      >
        <Icon name={isExpanded ? 'X' : 'Zap'} size={24} />
      </button>
    </div>
  );
};

export default QuickActionPanel;