import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DiscoveryFeed from './pages/discovery-feed';
import StudentOrganizations from './pages/student-organizations';
import ProfileManagement from './pages/profile-management';
import LoginRegister from './pages/login-register';
import MessagingHub from './pages/messaging-hub';
import CampusEvents from './pages/campus-events';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CampusEvents />} />
        <Route path="/discovery-feed" element={<DiscoveryFeed />} />
        <Route path="/student-organizations" element={<StudentOrganizations />} />
        <Route path="/profile-management" element={<ProfileManagement />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/messaging-hub" element={<MessagingHub />} />
        <Route path="/campus-events" element={<CampusEvents />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
