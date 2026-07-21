import { useData } from './context/DataContext';
import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ADMIN_EMAILS } from './config/admin';

// Initial Static Imports (Core UI)
import Preloader from './components/public/Preloader';
import Cursor from './components/public/Cursor';
import ScrollProgress from './components/public/ScrollProgress';
import ParticleBackground from './components/public/ParticleBackground';
import ChatBot from './components/public/ChatBot';
import SEO from './components/public/SEO';
import HireMeModal from './components/public/HireMeModal';
import CommandPalette from './components/public/CommandPalette';
import ScrollToTop from './components/public/ScrollToTop';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ScrollToAnchor from './components/public/ScrollToAnchor';

// Lazy Loaded Pages (Code Splitting)
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogDetails = React.lazy(() => import('./pages/BlogDetails'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const HonorsPage = React.lazy(() => import('./pages/HonorsPage'));
const CertificateDetailsPage = React.lazy(() => import('./pages/CertificateDetailsPage'));

const NotFound = React.lazy(() => import('./pages/NotFound'));
const MaintenancePage = React.lazy(() => import('./pages/MaintenancePage'));

// Admin Pages
const AdminLogin = React.lazy(() => import('./components/admin/Login'));
const Dashboard = React.lazy(() => import('./components/admin/Dashboard'));
const AdminProjectEditor = React.lazy(() => import('./components/admin/AdminProjectEditor'));

function App() {
  // App initialization
  const { data, loading: dataLoading } = useData();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [minLoading, setMinLoading] = useState(() => !sessionStorage.getItem('hasVisited')); // Initialize based on storage
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check if user has visited in this session
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      // Since this is inside useEffect, we should probably initialize state lazily instead of setting it here,
      // OR use a ref to track mounted state, but for this specific "skip preloader" logic:
      // The best way is to initialize state based on sessionStorage.
    } else {
      const timer = setTimeout(() => {
        setMinLoading(false);
        sessionStorage.setItem('hasVisited', 'true');
      }, 1200); // Reduced from 2500ms
      return () => clearTimeout(timer);
    }
  }, []);

  // Show preloader if data/auth is loading, OR if it's the first visit (minLoading)
  // If not first visit, minLoading is false immediately, so we only wait for data/auth
  const shouldShowPreloader = dataLoading || authLoading || minLoading;

  // Maintenance Check Logic
  const isMaintenanceOn = data?.settings?.maintenanceMode;
  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';
  const showMaintenance = isMaintenanceOn && !isAdmin && !isAdminRoute;

  return (
    <>
      <AnimatePresence mode="wait">
        {shouldShowPreloader && <Preloader key="preloader" />}
      </AnimatePresence>

      {!shouldShowPreloader && (
        showMaintenance ? (
          <>
            <SEO />
            <Suspense fallback={null}>
              <MaintenancePage />
            </Suspense>
          </>
        ) : (
          <>
            <SEO />
            <div className="bg-noise"></div>
            <ParticleBackground />
            <Cursor />
            <ScrollProgress />
            <ChatBot />
            <HireMeModal />
            <CommandPalette />
            <ScrollToTop />
            <ScrollToAnchor />
            <AnimatePresence mode="wait">
              <Suspense fallback={null}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
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
            </AnimatePresence>
          </>
        )
      )}
    </>
  );
}

export default App;
