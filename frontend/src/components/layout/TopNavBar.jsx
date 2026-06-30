import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import { setTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useIsLight } from '../../hooks/useIsLight';

export function TopNavBar({
  searchQuery,  //current search input value
  setSearchQuery, // function to update search input
  triggerToast,
  onSettingsClick,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(state => state.ui.theme);  //arrow fucntion is just made it shorter
  // we can write above thing as:
  // function theme(state){
  //   return state.ui.theme;
  //}
  //useSelector (theme);
  const user = useSelector(state => state.auth.user);
  const isLight = useIsLight();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const dropdownRef = useRef(null); //useRef gives you direct access to the actual DOM element

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  const avatarInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';
  const displayName = user?.name ?? 'Student';
  const displayEmail = user?.email ?? '';
  const displaySub = user?.branch ?? user?.grade ?? 'Free Plan';

  // Theme-aware dropdown surface colors
  const dropBg = isLight ? '#ffffff' : '#1d1a24';
  const dropBorder = isLight ? 'rgba(194,186,201,0.5)' : 'rgba(74,68,85,0.6)';
  const dropText = isLight ? '#1a1523' : '#e8dfee';
  const dropMuted = isLight ? '#7a7581' : '#958da1';
  const dropHover = isLight ? 'rgba(124,58,237,0.07)' : 'rgba(44,40,51,0.8)';

  const menuItems = [
    { icon: 'person', label: 'My Profile', action: () => { navigate('/settings'); setProfileOpen(false); } },
    { icon: 'query_stats', label: 'My Analytics', action: () => { navigate('/analytics'); setProfileOpen(false); } },
    { icon: 'workspace_premium', label: 'Upgrade Plan', action: () => { triggerToast('💎 Upgrade flow coming soon!'); setProfileOpen(false); } },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      const routeMap = {
        'dashboard': '/dashboard',
        'home': '/dashboard',
        'syllabus': '/syllabus',
        'planner': '/planner',
        'study planner': '/planner',
        'notes': '/notes',
        'revision': '/revision',
        'smart revision': '/revision',
        'mocktest': '/mocktest',
        'mock test': '/mocktest',
        'test': '/mocktest',
        'chat': '/chat',
        'doubt': '/chat',
        'analytics': '/analytics',
        'focus': '/focus',
        'settings': '/settings',
        'support': '/support',
        'help': '/support',
        'session': '/session',
      };

      // Exact match
      if (routeMap[query]) {
        navigate(routeMap[query]);
        setSearchQuery('');
        return;
      }
      
      // Partial match
      for (const [key, path] of Object.entries(routeMap)) {
        if (key.includes(query) || query.includes(key)) {
          navigate(path);
          setSearchQuery('');
          return;
        }
      }

      triggerToast(`Searching for "${searchQuery}"...`);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast("🎙️ Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      triggerToast("🎙️ Listening... Speak now.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };

    recognition.onerror = () => {
      triggerToast("🎙️ Error listening. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <header className="fixed top-0 left-[288px] right-0 z-40 flex justify-between items-center h-20 px-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">

      {/* Search bar */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-surface-container-lowest/50 border border-outline-variant/20 rounded-full py-2.5 pl-12 pr-20 text-sm focus:ring-1 focus:ring-primary-container/50 text-on-surface placeholder:text-outline transition-all"
            placeholder="Search for topics, notes, or concepts..."
            type="text"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={handleVoiceSearch}
              className={`p-1.5 transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-high/60 cursor-pointer ${isListening ? 'text-primary animate-pulse' : 'text-outline hover:text-primary'}`}
              title="Voice Search"
            >
              <span className="material-symbols-outlined text-lg">mic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">

        {/* Theme Switcher */}
        <ThemeSwitcher value={theme} onChange={(val) => dispatch(setTheme(val))} />


        <div className="h-8 w-[1px] bg-outline-variant/30 mx-1" />

        {/* Profile Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="profile-menu-btn"
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 cursor-pointer group"
            title="Profile menu"
          >
            {/* Gradient initial avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm border-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                borderColor: profileOpen ? '#7C3AED' : 'rgba(124,58,237,0.3)',
              }}
            >
              {avatarInitial}
            </div>
            <span
              className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary transition-colors select-none"
              style={{ fontSize: '18px' }}
            >
              {profileOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* ── Dropdown Panel ── */}
          {profileOpen && (
            <div
              id="profile-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 14px)',
                right: 0,
                width: '264px',
                backgroundColor: dropBg,
                border: `1px solid ${dropBorder}`,
                borderRadius: '16px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.28), 0 4px 20px rgba(0,0,0,0.14)',
                overflow: 'hidden',
                zIndex: 200,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {/* User info header */}
              <div style={{ padding: '16px', borderBottom: `1px solid ${dropBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '17px', color: '#fff', flexShrink: 0,
                  }}>
                    {avatarInitial}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: dropText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayName}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: dropMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayEmail || displaySub}
                    </p>
                  </div>
                </div>

                {/* Plan badge */}
                <div style={{
                  marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 10px', borderRadius: '999px',
                  backgroundColor: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.3)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#7C3AED', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED' }}>
                    {user?.plan === 'pro' ? 'Pro Plan' : user?.plan === 'institution' ? 'Institution' : 'Free Plan'}
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <div style={{ padding: '8px 8px 4px' }}>
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '11px',
                      padding: '9px 12px', borderRadius: '10px', border: 'none',
                      backgroundColor: 'transparent', color: dropText,
                      fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      transition: 'background-color 0.15s', textAlign: 'left',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = dropHover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#7C3AED', flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Divider + Sign Out */}
              <div style={{ borderTop: `1px solid ${dropBorder}`, padding: '8px', marginTop: '4px' }}>
                <button
                  id="signout-btn"
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '11px',
                    padding: '9px 12px', borderRadius: '10px', border: 'none',
                    backgroundColor: 'transparent', color: '#f87171',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background-color 0.15s', textAlign: 'left',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#f87171', flexShrink: 0 }}>logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
