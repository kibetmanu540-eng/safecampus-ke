import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import ResourcesPage from './pages/ResourcesPage';
import MyStoryPage from './pages/MyStoryPage';
import Navigation from './components/Navigation';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showRouteTransition, setShowRouteTransition] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash) return;

    setShowRouteTransition(true);
    setTransitionKey((prev) => prev + 1);
    const timer = setTimeout(() => {
      setShowRouteTransition(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, showSplash]);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-500">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30">
            <img src="/logo.jpg" alt="SafeCampus KE logo" className="w-17 h-17 object-contain rounded-full" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-wide">SafeCampus KE</h1>
            <p className="text-sm text-purple-100">Loading your safe reporting space...</p>
          </div>
          <div className="h-1 w-32 bg-purple-400/30 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-white/80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
        {showRouteTransition && (
          <div key={transitionKey} className="sc-route-transition">
            <div className="sc-route-transition__swipe" />
            <div className="sc-route-transition__swipe sc-route-transition__swipe--secondary" />
            <div className="sc-route-transition__content">
              <div className="sc-route-transition__logo">SC</div>
              <div>
                <p className="sc-route-transition__title">SafeCampus</p>
                <p className="sc-route-transition__subtitle">Protecting students online & offline</p>
              </div>
            </div>
          </div>
        )}
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/my-story" element={<MyStoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
