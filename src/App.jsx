import { useData } from './context/DataContext';
import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ADMIN_EMAILS } from './config/admin';

// Static Utility Imports
import SEO from './components/public/SEO';
import ScrollToTop from './components/public/ScrollToTop';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ScrollToAnchor from './components/public/ScrollToAnchor';
import Preloader from './components/public/Preloader';
import { ResumeProvider } from './context/ResumeContext';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { initConsoleLinks } from './utils/consoleLinks';

// Lazy Loaded Pages
const Home = lazyWithRetry(() => import('./pages/Home'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Signup = lazyWithRetry(() => import('./pages/Signup'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));
const BlogDetails = lazyWithRetry(() => import('./pages/BlogDetails'));
const ProjectDetails = lazyWithRetry(() => import('./pages/ProjectDetails'));
const HonorsPage = lazyWithRetry(() => import('./pages/HonorsPage'));
const CertificateDetailsPage = lazyWithRetry(() => import('./pages/CertificateDetailsPage'));
const ResumePage = lazyWithRetry(() => import('./pages/ResumePage'));

const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
const MaintenancePage = lazyWithRetry(() => import('./pages/MaintenancePage'));

// Admin Pages
const AdminLogin = lazyWithRetry(() => import('./components/admin/Login'));
const Dashboard = lazyWithRetry(() => import('./components/admin/Dashboard'));
const AdminProjectEditor = lazyWithRetry(() => import('./components/admin/AdminProjectEditor'));

function App() {
  const { data } = useData() || {};
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Display portfolio links in console
  useEffect(() => {
    if (data) {
      initConsoleLinks(data);
    }
  }, [data]);

  // Maintenance Check Logic
  const isMaintenanceOn = data?.settings?.maintenanceMode;
  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';
  const showMaintenance = isMaintenanceOn && !isAdmin && !isAdminRoute;

  return (
    <ResumeProvider>
      <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] font-sans antialiased selection:bg-[#CDEBE6] selection:text-[#102A28]">
        {!isAdminRoute && <Preloader />}
        <ScrollToTop />
        <ScrollToAnchor />
        {showMaintenance ? (
          <>
            <SEO />
            <Suspense fallback={null}>
              <MaintenancePage />
            </Suspense>
          </>
        ) : (
          <Suspense fallback={null}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/honors" element={<HonorsPage />} />
              <Route path="/honors/:id" element={<CertificateDetailsPage />} />
              <Route path="/certificate/:id" element={<CertificateDetailsPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/project/new" element={<ProtectedRoute><AdminProjectEditor /></ProtectedRoute>} />
              <Route path="/admin/project/edit/:id" element={<ProtectedRoute><AdminProjectEditor /></ProtectedRoute>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        )}
      </div>
    </ResumeProvider>
  );
}

export default App;
