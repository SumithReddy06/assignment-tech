import React, { useState } from 'react';
import { SidebarProvider } from '../../components/navigation/NavigationSidebar';
import NavigationSidebar from '../../components/navigation/NavigationSidebar';
import NavigationBreadcrumb from '../../components/navigation/NavigationBreadcrumb';
import QuickActionPanel from '../../components/navigation/QuickActionPanel';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoTab from './components/PersonalInfoTab';
import CategoryAccessTab from './components/CategoryAccessTab';
import AnalysisHistoryTab from './components/AnalysisHistoryTab';
import NotificationPreferences from './components/NotificationPreferences';
import SessionManagement from './components/SessionManagement';
import Icon from '../../components/AppIcon';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const [userData] = useState({
    name: "Sarah Mitchell",
    email: "sarah.mitchell@reviewchat.com",
    phone: "+1 (555) 234-5678",
    department: "Data Analytics",
    location: "San Francisco, CA",
    role: "Analyst",
    memberSince: "January 2024",
    profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1479bf0bf-1763297239550.png",
    profileImageAlt: "Professional headshot of woman with shoulder-length brown hair wearing navy blue blazer and white blouse"
  });

  const [assignedCategories] = useState([
  {
    id: 1,
    name: "Electronics",
    icon: "Laptop",
    reviewCount: "45,230",
    accessLevel: "Full Access",
    assignedDate: "Jan 15, 2024"
  },
  {
    id: 2,
    name: "Home & Kitchen",
    icon: "Home",
    reviewCount: "32,890",
    accessLevel: "Full Access",
    assignedDate: "Jan 15, 2024"
  },
  {
    id: 3,
    name: "Books",
    icon: "BookOpen",
    reviewCount: "28,450",
    accessLevel: "Read Only",
    assignedDate: "Feb 10, 2024"
  },
  {
    id: 4,
    name: "Sports & Outdoors",
    icon: "Dumbbell",
    reviewCount: "19,670",
    accessLevel: "Full Access",
    assignedDate: "Mar 5, 2024"
  }]
  );

  const [analysisHistory] = useState([
  {
    id: 1,
    query: "What is the NPS score for wireless headphones in Electronics?",
    category: "Electronics",
    type: "nps",
    date: "Dec 2, 2025",
    time: "10:30 AM",
    summary: "NPS score of 42 indicates strong customer satisfaction with wireless headphones. Promoters cite sound quality and battery life as key strengths."
  },
  {
    id: 2,
    query: "Show sentiment analysis for kitchen appliances",
    category: "Home & Kitchen",
    type: "sentiment",
    date: "Dec 1, 2025",
    time: "2:15 PM",
    summary: "Overall positive sentiment (68%) with customers praising durability and ease of use. Negative feedback focuses on pricing concerns."
  },
  {
    id: 3,
    query: "Which products have the highest ratings in Sports category?",
    category: "Sports & Outdoors",
    type: "rating",
    date: "Nov 30, 2025",
    time: "4:45 PM",
    summary: "Yoga mats and resistance bands lead with 4.7+ average ratings. Customers value quality materials and value for money."
  },
  {
    id: 4,
    query: "Generate comprehensive report for Books category",
    category: "Books",
    type: "report",
    date: "Nov 29, 2025",
    time: "11:20 AM",
    summary: "Detailed analysis covering 28,450 reviews across fiction, non-fiction, and educational categories with trend insights."
  },
  {
    id: 5,
    query: "What are customers saying about smart home devices?",
    category: "Electronics",
    type: "sentiment",
    date: "Nov 28, 2025",
    time: "9:00 AM",
    summary: "Mixed sentiment with 55% positive. Customers appreciate functionality but express concerns about privacy and setup complexity."
  }]
  );

  const [notificationPreferences] = useState({
    email: {
      analysisComplete: true,
      weeklySummary: true,
      systemUpdates: false
    },
    inApp: {
      realTimeUpdates: true,
      newReports: true,
      accessChanges: true
    },
    security: {
      newDeviceLogin: true,
      passwordChanges: true
    }
  });

  const [sessions] = useState([
  {
    id: 1,
    deviceName: "MacBook Pro",
    deviceType: "desktop",
    browser: "Chrome 120",
    os: "macOS Sonoma",
    location: "San Francisco, CA",
    ipAddress: "192.168.1.100",
    lastActive: new Date(),
    isCurrent: true
  },
  {
    id: 2,
    deviceName: "iPhone 15 Pro",
    deviceType: "mobile",
    browser: "Safari 17",
    os: "iOS 17.2",
    location: "San Francisco, CA",
    ipAddress: "192.168.1.101",
    lastActive: new Date(Date.now() - 3600000),
    isCurrent: false
  },
  {
    id: 3,
    deviceName: "iPad Air",
    deviceType: "tablet",
    browser: "Safari 17",
    os: "iPadOS 17.2",
    location: "Oakland, CA",
    ipAddress: "192.168.1.102",
    lastActive: new Date(Date.now() - 86400000),
    isCurrent: false
  }]
  );

  const tabs = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'categories', label: 'Category Access', icon: 'Tag' },
  { id: 'history', label: 'Analysis History', icon: 'Clock' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  { id: 'sessions', label: 'Sessions', icon: 'Shield' }];


  const handleImageUpload = (file) => {
    console.log('Uploading profile image:', file?.name);
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleSavePersonalInfo = (formData) => {
    console.log('Saving personal info:', formData);
  };

  const handleRerunAnalysis = (analysis) => {
    console.log('Rerunning analysis:', analysis?.query);
  };

  const handleExportHistory = () => {
    console.log('Exporting analysis history');
  };

  const handleSaveNotifications = (preferences) => {
    console.log('Saving notification preferences:', preferences);
  };

  const handleRevokeSession = (sessionId) => {
    console.log('Revoking session:', sessionId);
  };

  const handleRevokeAllSessions = () => {
    console.log('Revoking all sessions');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <NavigationSidebar userRole={userData?.role} />
        
        <div className="main-content">
          <NavigationBreadcrumb />
          
          <ProfileHeader
            userData={userData}
            onImageUpload={handleImageUpload}
            onEditProfile={handleEditProfile} />


          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="border-b border-border overflow-x-auto">
              <div className="flex min-w-max">
                {tabs?.map((tab) =>
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab?.id ?
                  'text-primary' : 'text-muted-foreground hover:text-foreground'}`
                  }>

                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                    {activeTab === tab?.id &&
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  }
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'personal' &&
              <PersonalInfoTab
                userData={userData}
                onSave={handleSavePersonalInfo} />

              }

              {activeTab === 'categories' &&
              <CategoryAccessTab
                userRole={userData?.role}
                assignedCategories={assignedCategories} />

              }

              {activeTab === 'history' &&
              <AnalysisHistoryTab
                analysisHistory={analysisHistory}
                onRerun={handleRerunAnalysis}
                onExport={handleExportHistory} />

              }

              {activeTab === 'notifications' &&
              <NotificationPreferences
                initialPreferences={notificationPreferences}
                onSave={handleSaveNotifications} />

              }

              {activeTab === 'sessions' &&
              <SessionManagement
                sessions={sessions}
                onRevokeSession={handleRevokeSession}
                onRevokeAll={handleRevokeAllSessions} />

              }
            </div>
          </div>
        </div>

        <QuickActionPanel userRole={userData?.role} />
      </div>
    </SidebarProvider>);

};

export default UserProfile;