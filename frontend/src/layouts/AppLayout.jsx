import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { SidebarNav } from '../components/layout/SidebarNav';
import { TopNavBar } from '../components/layout/TopNavBar';
import { showToast, hideToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.user);
  const toast = useSelector(state => state.ui.toast);
  const isLight = useIsLight();

  // Search state — lives here so it persists across nav without Redux overhead
  const [searchQuery, setSearchQuery] = useState('');

  // Hide toast after timeout
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, dispatch]);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to onboarding if not yet completed
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div 
      className={isLight ? "light-theme" : ""}
      style={{ 
        display: "flex", 
        backgroundColor: isLight ? "#f7f5fa" : "#0D0B1A", 
        minHeight: "100vh",
        transition: "background-color 0.2s ease, color 0.2s ease"
      }}
    >
      {/* Dynamic Style variables block */}
      <style>{`
        body { background-color: ${isLight ? '#f7f5fa' : '#0D0B1A'}; }
        .ai-glow { box-shadow: 0 0 15px rgba(124, 58, 237, 0.2); border: 1px solid rgba(124, 58, 237, 0.3); }
        .glass-card { background: ${isLight ? 'rgba(255,255,255,0.7)' : 'rgba(34, 30, 40, 0.4)'}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(149, 141, 161, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4a4455; border-radius: 10px; }
        .progress-ring__circle { transition: stroke-dashoffset 0.35s; transform: rotate(-90deg); transform-origin: 50% 50%; }
      `}</style>

      {/* Sidebar navigation wrapper */}
      <SidebarNav user={user} />

      {/* Main viewport */}
      <main style={{ marginLeft: "288px", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Navbar */}
        <TopNavBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          triggerToast={(msg) => dispatch(showToast(msg))}
          onSettingsClick={() => navigate('/settings')}
        />

        {/* Content Container — paddingTop offsets the fixed 80px navbar */}
        <div className="px-10 py-8 max-w-[1440px] w-full mx-auto flex-1" style={{ paddingTop: '96px' }}>
          <Outlet />
        </div>
      </main>

      {/* Floating global notifications */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 glass-card bg-surface-container-high/90 border border-primary-container/30 px-5 py-3 rounded-xl shadow-2xl animate-fade-in-up text-xs font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">sparkles</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
