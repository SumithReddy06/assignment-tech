import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '../../components/navigation/NavigationSidebar';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import NavigationBreadcrumb from '../../components/navigation/NavigationBreadcrumb';
import QuickActionPanel from '../../components/navigation/QuickActionPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'Administrator') {
      navigate('/analyst-profile');
    }
  }, [navigate]);

  const [adminData] = useState({
    name: "Admin User",
    email: localStorage.getItem('userEmail') || "admin@reviewchat.com",
    role: "Administrator",
    department: "System Administration",
    status: "Active",
    joinDate: "January 2024",
    profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1479bf0bf-1763297239550.png",
    permissions: [
      "Full Dataset Access",
      "User Management",
      "System Configuration",
      "Audit Log Access",
      "Team Analytics",
      "Report Generation",
      "Data Export",
      "API Access"
    ]
  });

  const [teamMembers] = useState([
    {
      id: 1,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@reviewchat.com",
      role: "Analyst",
      department: "Data Analytics",
      status: "Active",
      joinDate: "Jan 15, 2024",
      categories: ["Electronics", "Home & Kitchen", "Sports & Outdoors"]
    },
    {
      id: 2,
      name: "John Chen",
      email: "john.chen@reviewchat.com",
      role: "Analyst",
      department: "Product Insights",
      status: "Active",
      joinDate: "Feb 10, 2024",
      categories: ["Books", "Clothing", "Beauty"]
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@reviewchat.com",
      role: "Analyst",
      department: "Customer Success",
      status: "Inactive",
      joinDate: "Mar 5, 2024",
      categories: ["Toys", "Home"]
    }
  ]);

  const [systemStatus] = useState({
    database: { status: "Healthy", uptime: "99.98%", lastCheck: "2 mins ago" },
    api: { status: "Healthy", uptime: "99.97%", lastCheck: "1 min ago" },
    dataSync: { status: "Running", lastSync: "5 mins ago", nextSync: "10:00 AM" },
    storage: { used: "245 GB", total: "500 GB", percentage: 49 }
  });

  const [auditLogs] = useState([
    {
      id: 1,
      action: "User Created",
      user: "Sarah Mitchell",
      timestamp: "Dec 3, 2025 2:30 PM",
      details: "New analyst user onboarded with Electronics category access"
    },
    {
      id: 2,
      action: "Dataset Updated",
      user: "System",
      timestamp: "Dec 3, 2025 10:15 AM",
      details: "Amazon Reviews dataset synchronized with 15,234 new records"
    },
    {
      id: 3,
      action: "Report Generated",
      user: "John Chen",
      timestamp: "Dec 2, 2025 4:45 PM",
      details: "Quarterly business review generated for Q4 2025"
    },
    {
      id: 4,
      action: "Access Revoked",
      user: "Emma Rodriguez",
      timestamp: "Dec 2, 2025 11:30 AM",
      details: "Category access removed: Home & Kitchen"
    },
    {
      id: 5,
      action: "System Backup",
      user: "System",
      timestamp: "Dec 1, 2025 9:00 PM",
      details: "Full system backup completed successfully - 485 GB"
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Admin Overview', icon: 'BarChart3' },
    { id: 'team', label: 'Team Management', icon: 'Users' },
    { id: 'system', label: 'System Status', icon: 'Settings' },
    { id: 'audit', label: 'Audit Logs', icon: 'FileText' },
    { id: 'permissions', label: 'Permissions', icon: 'Lock' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginTimestamp');
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <NavigationSidebar userRole="Administrator" />
        
        <div className="main-content">
          <NavigationBreadcrumb />
          
          {/* Admin Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="Shield" size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{adminData?.name}</h1>
                    <p className="text-blue-100 text-lg">{adminData?.role}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
            <div className="border-b border-border overflow-x-auto">
              <div className="flex min-w-max">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                      activeTab === tab?.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                    {activeTab === tab?.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Administrator Privileges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adminData?.permissions?.map((permission, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Icon name="CheckCircle" size={20} className="text-blue-600" />
                          <span className="text-sm font-medium text-foreground">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                        <p className="text-sm text-blue-100 mb-2">Active Users</p>
                        <p className="text-3xl font-bold">2</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                        <p className="text-sm text-green-100 mb-2">Total Reviews</p>
                        <p className="text-3xl font-bold">28.4K</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                        <p className="text-sm text-purple-100 mb-2">Reports Generated</p>
                        <p className="text-3xl font-bold">156</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                        <p className="text-sm text-orange-100 mb-2">System Uptime</p>
                        <p className="text-3xl font-bold">99.9%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Management Tab */}
              {activeTab === 'team' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Team Members</h2>
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => alert('Add user feature coming soon')}
                    >
                      Add User
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Categories</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers?.map((member) => (
                          <tr key={member?.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-4 px-4 text-sm">{member?.name}</td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">{member?.email}</td>
                            <td className="py-4 px-4 text-sm">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {member?.role}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                member?.status === 'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {member?.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">
                              {member?.categories?.length} assigned
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <button className="text-primary hover:text-primary/80 font-medium">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* System Status Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">System Health</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Database Status */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Database</h3>
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium text-green-700">{systemStatus?.database?.status}</span>
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span className="font-medium">{systemStatus?.database?.uptime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Check:</span>
                          <span className="font-medium">{systemStatus?.database?.lastCheck}</span>
                        </div>
                      </div>
                    </div>

                    {/* API Status */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">API Service</h3>
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium text-green-700">{systemStatus?.api?.status}</span>
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span className="font-medium">{systemStatus?.api?.uptime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Check:</span>
                          <span className="font-medium">{systemStatus?.api?.lastCheck}</span>
                        </div>
                      </div>
                    </div>

                    {/* Data Sync */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Data Synchronization</h3>
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                          <span className="text-sm font-medium text-blue-700">{systemStatus?.dataSync?.status}</span>
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Sync:</span>
                          <span className="font-medium">{systemStatus?.dataSync?.lastSync}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Next Sync:</span>
                          <span className="font-medium">{systemStatus?.dataSync?.nextSync}</span>
                        </div>
                      </div>
                    </div>

                    {/* Storage */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Storage</h3>
                        <span className="text-sm font-medium">{systemStatus?.storage?.percentage}%</span>
                      </div>
                      <div className="space-y-3">
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${systemStatus?.storage?.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{systemStatus?.storage?.used} / {systemStatus?.storage?.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Audit Logs Tab */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">System Audit Log</h2>
                  <div className="space-y-3">
                    {auditLogs?.map((log) => (
                      <div key={log?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">{log?.action}</p>
                            <p className="text-xs text-muted-foreground">by {log?.user}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{log?.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log?.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permissions Tab */}
              {activeTab === 'permissions' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Administrator Permissions</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-blue-900 mb-1">Full System Access</p>
                        <p className="text-sm text-blue-700">Administrators have unrestricted access to all features, data, and system controls.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Granted Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'User Management', description: 'Create, edit, and delete user accounts' },
                        { name: 'Data Access', description: 'Full access to all datasets and records' },
                        { name: 'System Configuration', description: 'Modify system settings and configurations' },
                        { name: 'Audit Logs', description: 'View complete system activity logs' },
                        { name: 'Team Analytics', description: 'View team performance and usage metrics' },
                        { name: 'Report Generation', description: 'Generate and manage system reports' },
                        { name: 'Data Export', description: 'Export data in various formats' },
                        { name: 'API Access', description: 'Full API access with unlimited rate limits' }
                      ]?.map((perm, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-4">
                          <p className="font-semibold text-sm mb-1">{perm?.name}</p>
                          <p className="text-xs text-muted-foreground">{perm?.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <QuickActionPanel userRole="Administrator" />
      </div>
    </SidebarProvider>
  );
};

export default AdminProfile;
