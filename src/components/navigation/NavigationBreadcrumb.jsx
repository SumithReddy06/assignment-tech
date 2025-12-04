import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumb = () => {
  const location = useLocation();
  
  const routeLabels = {
    '/analytics-dashboard': 'Dashboard',
    '/conversation-analysis': 'Analysis',
    '/historical-reports': 'Reports',
    '/user-management': 'Users',
    '/user-profile': 'Profile'
  };

  const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
  
  const breadcrumbs = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments?.slice(0, index + 1)?.join('/')}`;
    const label = routeLabels?.[path] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1)?.replace(/-/g, ' ');
    
    return {
      path,
      label,
      isLast: index === pathSegments?.length - 1
    };
  });

  if (breadcrumbs?.length === 0) {
    return null;
  }

  return (
    <nav 
      className="flex items-center gap-2 mb-6 text-sm"
      aria-label="Breadcrumb navigation"
    >
      <Link 
        to="/analytics-dashboard" 
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
        aria-label="Home"
      >
        <Icon name="Home" size={16} />
      </Link>
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path}>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          
          {crumb?.isLast ? (
            <span 
              className="font-medium text-foreground"
              aria-current="page"
            >
              {crumb?.label}
            </span>
          ) : (
            <Link
              to={crumb?.path}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {crumb?.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default NavigationBreadcrumb;