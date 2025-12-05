import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

const RoleBasedNavigationFilter = ({ items, userRole }) => {
  return items?.filter(item => !item?.roleRequired || item?.roleRequired === userRole);
};

const ConversationStateIndicator = ({ isActive, conversationCount }) => {
  if (!isActive || conversationCount === 0) return null;

  return (
    <span className={`conversation-indicator`} title={`${conversationCount} messages`}>
      <Icon name="MessageSquare" size={12} />
      <span className="text-xs font-semibold">{conversationCount}</span>
    </span>
  );
};

const NavigationSidebar = ({ userRole = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
  const [activeConversation, setActiveConversation] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage to get real-time count
  useEffect(() => {
    const loadMessageCount = () => {
      try {
        const messagesData = localStorage.getItem('conversationMessages');
        if (messagesData) {
          const parsedMessages = JSON.parse(messagesData);
          setMessages(parsedMessages);
          if (location?.pathname === '/conversation-analysis') {
            setConversationCount(parsedMessages.length || 0);
          }
        }
      } catch (error) {
        console.error('Error loading message count:', error);
      }
    };

    loadMessageCount();
    
    // Listen for custom event from conversation analysis page
    window.addEventListener('messagesUpdated', loadMessageCount);
    // Also listen for storage changes
    window.addEventListener('storage', loadMessageCount);
    
    return () => {
      window.removeEventListener('messagesUpdated', loadMessageCount);
      window.removeEventListener('storage', loadMessageCount);
    };
  }, [location?.pathname]);

  // Handle logout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    
    // Redirect to login
    navigate('/login');
  };

  // Determine effective role: prefer prop, fall back to localStorage, otherwise use 'Analyst'
  const effectiveRole = userRole || localStorage.getItem('userRole') || 'Analyst';

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/analytics-dashboard',
      icon: 'LayoutDashboard',
      roleRequired: null,
      tooltip: 'Central hub for analytics and insights'
    },
    {
      label: 'Analysis',
      path: '/conversation-analysis',
      icon: 'MessageSquare',
      roleRequired: null,
      tooltip: 'AI-powered conversational analysis',
      showConversationState: true
    },
    {
      label: 'Reports',
      path: '/historical-reports',
      icon: 'FileText',
      roleRequired: null,
      tooltip: 'Historical analysis and reports'
    },
    {
      label: 'Users',
      path: '/user-management',
      icon: 'Users',
      roleRequired: 'Administrator',
      tooltip: 'Manage user access and permissions'
    },
    {
      label: 'Profile',
      path: effectiveRole === 'Administrator' ? '/admin-profile' : '/analyst-profile',
      icon: 'User',
      roleRequired: null,
      tooltip: 'Personal account settings'
    }
  ];

  const filteredItems = RoleBasedNavigationFilter({ items: navigationItems, userRole: effectiveRole });

  const handleQuickAction = () => {
    closeMobileSidebar();
    navigate('/conversation-analysis', { state: { resetConversation: true } });
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="mobile-menu-button"
        aria-label="Toggle navigation menu"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={20} />
      </button>
      {isMobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}
      <aside 
        className={`sidebar ${isCollapsed && window.innerWidth >= 1024 ? 'collapsed' : ''} ${isMobileOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Icon name="BarChart3" size={24} color="var(--color-primary)" />
          </div>
          <div className="mt-4 px-3 py-3 bg-background rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Current Role</p>
                <p className={`text-sm font-semibold ${effectiveRole === 'Administrator' ? 'text-warning' : 'text-info'}`}>
              {effectiveRole === 'Administrator' ? '👑 Administrator' : '📊 Analyst'}
            </p>
          </div>
        </div>

        <nav className="sidebar-nav" role="navigation">
          {filteredItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMobileSidebar}
                title={item?.tooltip}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item?.icon} size={20} />
                <span className="flex-1">{item?.label}</span>
                {item?.showConversationState && (
                  <ConversationStateIndicator 
                    isActive={activeConversation} 
                    conversationCount={conversationCount}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="quick-action-panel">
          <button 
            className="quick-action-button"
            onClick={handleQuickAction}
            aria-label="Start new analysis"
          >
            <Icon name="Plus" size={18} />
            <span>New Analysis</span>
          </button>
          
          <button 
            className="quick-action-button mt-2 !bg-destructive hover:!bg-destructive/90"
            onClick={handleLogout}
            aria-label="Logout"
            title="Sign out from ReviewChat Analytics"
          >
            <Icon name="LogOut" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;