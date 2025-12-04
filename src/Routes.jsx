import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import ConversationAnalysis from './pages/conversation-analysis';
import Login from './pages/login';
import UserManagement from './pages/user-management';
import HistoricalReports from './pages/historical-reports';
import UserProfile from './pages/user-profile';
import AdminProfile from './pages/admin-profile';
import AnalystProfile from './pages/analyst-profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Login />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/conversation-analysis" element={<ConversationAnalysis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/historical-reports" element={<HistoricalReports />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/analyst-profile" element={<AnalystProfile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
