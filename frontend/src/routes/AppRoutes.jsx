import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../pages/LandingPage.jsx';
import ProjectFeedPage from '../pages/ProjectFeedPage.jsx';
import ProjectDetailPage from '../pages/ProjectDetailPage.jsx';
import PostProjectPage from '../pages/PostProjectPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/projects" element={<ProjectFeedPage />} />
    <Route path="/projects/:id" element={<ProjectDetailPage />} />

    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects/new" element={<PostProjectPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

