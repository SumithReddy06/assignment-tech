import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar, { SidebarProvider, useSidebar } from '../../components/navigation/NavigationSidebar';
import NavigationBreadcrumb from '../../components/navigation/NavigationBreadcrumb';
import QuickActionPanel from '../../components/navigation/QuickActionPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import UserTableRow from './components/UserTableRow';
import UserStatsCard from './components/UserStatsCard';
import ActivityFeed from './components/ActivityFeed';
import UserDetailsModal from './components/UserDetailsModal';
import EditUserModal from './components/EditUserModal';
import CreateUserModal from './components/CreateUserModal';
import BulkActionsBar from './components/BulkActionsBar';

const UserManagementContent = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Check user role on mount - restrict to admin only
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    if (role !== 'Administrator') {
      // Redirect non-admin users away
      navigate('/analyst-profile');
    }
  }, [navigate]);

  const [users, setUsers] = useState([
  {
    id: 'USR001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@reviewchat.com',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1feefabc9-1763293590878.png",
    avatarAlt: 'Professional headshot of woman with brown hair in business attire smiling warmly at camera',
    role: 'Analyst',
    categories: ['Electronics', 'Home & Kitchen', 'Books'],
    lastLogin: 'Dec 3, 2025 10:30 AM',
    status: 'Active',
    createdAt: 'Jan 15, 2025',
    totalAnalyses: 247,
    stats: {
      queries: 1243,
      reports: 89,
      avgResponseTime: '2.3s',
      satisfaction: '94%'
    },
    permissions: ['View Assigned Categories', 'Create Analysis', 'Generate Reports', 'Export Data']
  },
  {
    id: 'USR002',
    name: 'Michael Chen',
    email: 'michael.chen@reviewchat.com',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb933d20-1763293416126.png",
    avatarAlt: 'Professional headshot of Asian man with short black hair wearing navy suit and glasses',
    role: 'Administrator',
    categories: ['Electronics', 'Home & Kitchen', 'Books', 'Clothing', 'Sports & Outdoors', 'Beauty & Personal Care', 'Toys & Games', 'Automotive', 'Health & Household', 'Pet Supplies'],
    lastLogin: 'Dec 3, 2025 11:15 AM',
    status: 'Active',
    createdAt: 'Jan 10, 2025',
    totalAnalyses: 412,
    stats: {
      queries: 2156,
      reports: 134,
      avgResponseTime: '1.8s',
      satisfaction: '97%'
    },
    permissions: ['Full System Access', 'User Management', 'All Categories', 'System Configuration']
  },
  {
    id: 'USR003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@reviewchat.com',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c5beebde-1763299010301.png",
    avatarAlt: 'Professional headshot of Hispanic woman with long dark hair in professional blazer with confident smile',
    role: 'Analyst',
    categories: ['Clothing', 'Beauty & Personal Care', 'Toys & Games'],
    lastLogin: 'Dec 2, 2025 4:45 PM',
    status: 'Active',
    createdAt: 'Feb 1, 2025',
    totalAnalyses: 189,
    stats: {
      queries: 876,
      reports: 67,
      avgResponseTime: '2.7s',
      satisfaction: '91%'
    },
    permissions: ['View Assigned Categories', 'Create Analysis', 'Generate Reports', 'Export Data']
  },
  {
    id: 'USR004',
    name: 'David Thompson',
    email: 'david.thompson@reviewchat.com',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_187ac2848-1764684680250.png",
    avatarAlt: 'Professional headshot of Caucasian man with short blonde hair in gray suit with friendly expression',
    role: 'Analyst',
    categories: ['Sports & Outdoors', 'Automotive', 'Health & Household'],
    lastLogin: 'Nov 28, 2025 2:20 PM',
    status: 'Inactive',
    createdAt: 'Jan 20, 2025',
    totalAnalyses: 156,
    stats: {
      queries: 734,
      reports: 52,
      avgResponseTime: '3.1s',
      satisfaction: '88%'
    },
    permissions: ['View Assigned Categories', 'Create Analysis', 'Generate Reports', 'Export Data']
  },
  {
    id: 'USR005',
    name: 'Priya Patel',
    email: 'priya.patel@reviewchat.com',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_129e71e71-1763293897486.png",
    avatarAlt: 'Professional headshot of Indian woman with long black hair in elegant business attire with warm smile',
    role: 'Analyst',
    categories: ['Electronics', 'Pet Supplies'],
    lastLogin: 'Dec 3, 2025 9:00 AM',
    status: 'Active',
    createdAt: 'Feb 10, 2025',
    totalAnalyses: 203,
    stats: {
      queries: 1089,
      reports: 78,
      avgResponseTime: '2.5s',
      satisfaction: '93%'
    },
    permissions: ['View Assigned Categories', 'Create Analysis', 'Generate Reports', 'Export Data']
  }]
  );

  const statsData = [
  { title: 'Total Users', value: '5', change: '+2 this month', icon: 'Users', trend: 'up' },
  { title: 'Active Sessions', value: '4', change: '80% active', icon: 'Activity', trend: 'up' },
  { title: 'Total Analyses', value: '1,207', change: '+156 this week', icon: 'MessageSquare', trend: 'up' },
  { title: 'Avg Response Time', value: '2.5s', change: '-0.3s improved', icon: 'Zap', trend: 'up' }];


  const recentActivities = [
  {
    id: 1,
    userName: 'Sarah Johnson',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1feefabc9-1763293590878.png",
    userAvatarAlt: 'Professional headshot of woman with brown hair in business attire smiling warmly at camera',
    action: 'completed analysis for Electronics category',
    type: 'analysis',
    timestamp: '5 minutes ago',
    details: 'Generated NPS curve for Samsung Galaxy products'
  },
  {
    id: 2,
    userName: 'Michael Chen',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb933d20-1763293416126.png",
    userAvatarAlt: 'Professional headshot of Asian man with short black hair wearing navy suit and glasses',
    action: 'created new user account',
    type: 'create',
    timestamp: '15 minutes ago',
    details: 'Added Priya Patel as Analyst'
  },
  {
    id: 3,
    userName: 'Emily Rodriguez',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c5beebde-1763299010301.png",
    userAvatarAlt: 'Professional headshot of Hispanic woman with long dark hair in professional blazer with confident smile',
    action: 'generated report for Beauty category',
    type: 'report',
    timestamp: '1 hour ago',
    details: 'Exported satisfaction metrics for skincare products'
  },
  {
    id: 4,
    userName: 'Michael Chen',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb933d20-1763293416126.png",
    userAvatarAlt: 'Professional headshot of Asian man with short black hair wearing navy suit and glasses',
    action: 'updated category assignments',
    type: 'edit',
    timestamp: '2 hours ago',
    details: 'Modified Sarah Johnson\'s access permissions'
  },
  {
    id: 5,
    userName: 'Priya Patel',
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_129e71e71-1763293897486.png",
    userAvatarAlt: 'Professional headshot of Indian woman with long black hair in elegant business attire with warm smile',
    action: 'logged in to system',
    type: 'login',
    timestamp: '3 hours ago'
  }];


  const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'Analyst', label: 'Analyst' },
  { value: 'Administrator', label: 'Administrator' }];


  const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }];


  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
    prev?.includes(userId) ?
    prev?.filter((id) => id !== userId) :
    [...prev, userId]
    );
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
    user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesRole = roleFilter === 'all' || user?.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user?.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  })?.sort((a, b) => {
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];
    if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map((user) => user?.id));
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleToggleStatus = (user) => {
    setUsers((prev) =>
    prev?.map((u) =>
    u?.id === user?.id ?
    { ...u, status: u?.status === 'Active' ? 'Inactive' : 'Active' } :
    u
    )
    );
  };

  const handleSaveUser = (updatedUser) => {
    // Ensure there is only one administrator
    const existingAdmin = users?.find(u => u?.role === 'Administrator' && u?.id !== updatedUser?.id);
    if (updatedUser?.role === 'Administrator' && existingAdmin) {
      alert('Only one Administrator account is permitted. Please change the existing Administrator role before promoting another user.');
      return;
    }

    setUsers((prev) =>
      prev?.map((u) => u?.id === updatedUser?.id ? updatedUser : u)
    );
  };

  const handleCreateUser = (newUser) => {
    // If creating an Administrator, ensure there is no existing admin user
    if (newUser?.role === 'Administrator' && users?.some(u => u?.role === 'Administrator')) {
      alert('Only one Administrator account is permitted. Please update the existing Administrator instead.');
      return;
    }

    setUsers((prev) => [...prev, newUser]);
  };

  const handleBulkAction = (action) => {
    console.log(`Performing bulk action: ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
  };

  return (
    <>
      <Helmet>
        <title>User Management - ReviewChat Analytics</title>
        <meta name="description" content="Manage user access, permissions, and product category assignments for ReviewChat Analytics platform" />
      </Helmet>
      <div className={`main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <NavigationBreadcrumb />

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">Manage user access, permissions, and monitor system activity</p>
            </div>
            <Button
              variant="default"
              iconName="UserPlus"
              iconPosition="left"
              onClick={() => setShowCreateModal(true)}>

              Create New User
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData?.map((stat, index) =>
            <UserStatsCard key={index} {...stat} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)} />

                </div>
                <div className="flex gap-2">
                  <Select
                    options={roleOptions}
                    value={roleFilter}
                    onChange={setRoleFilter}
                    placeholder="Filter by role"
                    className="min-w-[150px]" />

                  <Select
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Filter by status"
                    className="min-w-[150px]" />

                </div>
              </div>

              <BulkActionsBar
                selectedCount={selectedUsers?.length}
                onClearSelection={() => setSelectedUsers([])}
                onBulkAction={handleBulkAction} />


              <div className="overflow-x-auto">
                <table className="w-full hidden lg:table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-border" />

                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2">
                          User
                          <Icon name={sortConfig?.key === 'name' ? sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' : 'ChevronsUpDown'} size={16} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('role')}>
                        <div className="flex items-center gap-2">
                          Role
                          <Icon name={sortConfig?.key === 'role' ? sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' : 'ChevronsUpDown'} size={16} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Categories</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('lastLogin')}>
                        <div className="flex items-center gap-2">
                          Last Login
                          <Icon name={sortConfig?.key === 'lastLogin' ? sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' : 'ChevronsUpDown'} size={16} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('status')}>
                        <div className="flex items-center gap-2">
                          Status
                          <Icon name={sortConfig?.key === 'status' ? sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' : 'ChevronsUpDown'} size={16} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.map((user) =>
                    <React.Fragment key={user?.id}>
                        <tr>
                          <td className="px-6 py-4">
                            <input
                            type="checkbox"
                            checked={selectedUsers?.includes(user?.id)}
                            onChange={() => handleSelectUser(user?.id)}
                            className="w-4 h-4 rounded border-border" />

                          </td>
                          <td colSpan={6} className="p-0">
                            <UserTableRow
                            user={user}
                            onEdit={handleEditUser}
                            onToggleStatus={handleToggleStatus}
                            onViewDetails={handleViewDetails} />

                          </td>
                        </tr>
                      </React.Fragment>
                    )}
                  </tbody>
                </table>

                <div className="lg:hidden space-y-3">
                  {filteredUsers?.map((user) =>
                  <UserTableRow
                    key={user?.id}
                    user={user}
                    onEdit={handleEditUser}
                    onToggleStatus={handleToggleStatus}
                    onViewDetails={handleViewDetails} />

                  )}
                </div>
              </div>

              {filteredUsers?.length === 0 &&
              <div className="text-center py-12">
                  <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found matching your criteria</p>
                </div>
              }
            </div>
          </div>

          <div className="lg:col-span-1">
            <ActivityFeed activities={recentActivities} />
          </div>
        </div>
      </div>
      {showDetailsModal &&
      <UserDetailsModal
        user={selectedUser}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedUser(null);
        }} />

      }
      {showEditModal &&
      <EditUserModal
        user={selectedUser}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser} />

      }
      {showCreateModal &&
      <CreateUserModal
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateUser}
        existingAdminExists={users?.some(u => u?.role === 'Administrator')} />

      }
      <QuickActionPanel userRole="Administrator" />
    </>);

};

const UserManagement = () => {
  return (
    <SidebarProvider>
      <NavigationSidebar userRole="Administrator" />
      <UserManagementContent />
    </SidebarProvider>);

};

export default UserManagement;