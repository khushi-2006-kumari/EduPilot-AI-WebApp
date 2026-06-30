import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser, setTheme, showToast, logout } from '../store';
import { useIsLight } from '../hooks/useIsLight';
import axios from 'axios';

// Accent palette: each entry has display color and the CSS variables to override
const ACCENT_PALETTES = [
  {
    id: 'purple',
    label: 'Violet',
    swatch: '#7c3aed',
    vars: {
      '--color-primary': '#d2bbff',
      '--color-on-primary': '#3f008e',
      '--color-primary-container': '#7c3aed',
      '--color-on-primary-container': '#ede0ff',
      '--color-ai-glow': '#7c3aed',
    },
  },
  {
    id: 'teal',
    label: 'Teal',
    swatch: '#00BFA5',
    vars: {
      '--color-primary': '#64ffda',
      '--color-on-primary': '#003d35',
      '--color-primary-container': '#00796b',
      '--color-on-primary-container': '#b2dfdb',
      '--color-ai-glow': '#00BFA5',
    },
  },
  {
    id: 'pink',
    label: 'Rose',
    swatch: '#FF4081',
    vars: {
      '--color-primary': '#ff80ab',
      '--color-on-primary': '#7c0030',
      '--color-primary-container': '#c2185b',
      '--color-on-primary-container': '#fce4ec',
      '--color-ai-glow': '#FF4081',
    },
  },
  {
    id: 'amber',
    label: 'Amber',
    swatch: '#FFB300',
    vars: {
      '--color-primary': '#ffe57f',
      '--color-on-primary': '#4a3800',
      '--color-primary-container': '#ff8f00',
      '--color-on-primary-container': '#fff8e1',
      '--color-ai-glow': '#FFB300',
    },
  },
  {
    id: 'indigo',
    label: 'Indigo',
    swatch: '#3F51B5',
    vars: {
      '--color-primary': '#9fa8da',
      '--color-on-primary': '#1a237e',
      '--color-primary-container': '#303f9f',
      '--color-on-primary-container': '#e8eaf6',
      '--color-ai-glow': '#3F51B5',
    },
  },
];

const TABS = [
  { id: 'profile', label: 'My Profile', icon: 'person' },
  { id: 'study', label: 'Study Preferences', icon: 'school' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'security', label: 'Security', icon: 'shield' },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors from Redux
  const user = useSelector(state => state.auth.user);
  const theme = useSelector(state => state.ui.theme);
  const streakCount = useSelector(state => state.study.streakCount) || 0;
  const completedTaskCount = useSelector(state => state.study.tasks.filter(t => t.completed).length) || 0;
  const mockTestsCount = useSelector(state => state.study.mockTests.pastResults?.length || 0);

  // Tab State
  const [activeTab, setActiveTab] = useState('profile');

  // Local States for form inputs
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [year, setYear] = useState(user?.year || 'Freshman');
  const [studyHours, setStudyHours] = useState(user?.studyHours || 6);
  const [focusSession, setFocusSession] = useState(user?.focusSession || 'Morning');
  const [pomodoroEnabled, setPomodoroEnabled] = useState(true);

  // Notifications
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyMockTest, setNotifyMockTest] = useState(true);
  const [notifyAi, setNotifyAi] = useState(true);
  const [notifyStreak, setNotifyStreak] = useState(false);

  // Other visual settings
  const [accentColor, setAccentColor] = useState('purple');

  // Avatar
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || null);
  const photoInputRef = useRef(null);

  // Password reset modal state

  // Password reset modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLight = useIsLight();

  // Save changes handler
  const handleSave = (e) => {
    if (e) e.preventDefault();
    dispatch(updateUser({
      name,
      email,
      university,
      branch,
      year,
      studyHours,
      focusSession
    }));
    dispatch(showToast("💾 Profile preferences saved successfully."));
  };

  const handlePasswordReset = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSave = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      dispatch(showToast("⚠️ Passwords do not match or are empty."));
      return;
    }
    
    try {
      if (!user || !user.token) {
        dispatch(showToast("⚠️ Not authenticated."));
        return;
      }
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:5000/api/auth/password', { newPassword }, config);
      dispatch(showToast("✅ Password updated successfully!"));
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const msg = error.response?.data?.error || "⚠️ Failed to update password.";
      dispatch(showToast(msg));
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete('http://localhost:5000/api/auth/me', config);
        dispatch(logout());
        dispatch(showToast("Account deleted successfully."));
        navigate('/login');
      } catch (error) {
        dispatch(showToast(error.response?.data?.error || "Failed to delete account."));
      }
    }
  };

  // Apply accent palette: set CSS custom properties on <html>
  const applyAccent = useCallback((palette) => {
    Object.entries(palette.vars).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }, []);

  const handleAccentChange = (palette) => {
    setAccentColor(palette.id);
    applyAccent(palette);
    dispatch(showToast(`🎨 Accent color changed to ${palette.label}`));
  };

  const handlePhotoUpload = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      dispatch(showToast('⚠️ Please select a valid image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatarSrc(dataUrl);
      dispatch(updateUser({ avatar: dataUrl }));
      dispatch(showToast('✅ Profile photo updated successfully!'));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Reusable toggle switch component for cleaner code
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus:outline-none ${
        checked
          ? 'bg-primary-container border-primary/40'
          : 'bg-surface-container-highest border-outline-variant'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full shadow-md transition-transform duration-200 ${
          checked
            ? 'translate-x-5 bg-on-primary-container'
            : 'translate-x-0.5 bg-on-surface-variant'
        }`}
      />
    </button>
  );

  return (<>
    <div className="space-y-8 animate-fade-in-up">
      <style>{`
        .glass-card-settings {
          background: ${isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(34, 30, 40, 0.8)'};
          border: 1px solid ${isLight ? 'rgba(122, 117, 129, 0.2)' : 'rgba(74, 68, 85, 0.6)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .violet-glow-settings {
          box-shadow: ${isLight ? '0 10px 30px rgba(0, 0, 0, 0.05)' : '0 0 20px rgba(124, 58, 237, 0.15)'};
        }
        .violet-border-glow-settings {
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #d2bbff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(210, 187, 255, 0.5);
        }
        .tab-content-enter {
          animation: tabFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">settings</span> Profile &amp; Settings
          </h1>
          <p className="text-on-surface-variant mt-2 font-medium">
            Manage your student profile, academic metrics, and app preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1440px] mx-auto">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="glass-card-settings rounded-2xl p-4 flex flex-col gap-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full p-3.5 rounded-xl transition-all cursor-pointer font-semibold text-left ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-card-settings rounded-xl p-4 flex items-center gap-4 border-l-4 border-l-primary">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-primary mb-0.5">AI STATUS</p>
              <p className="text-sm text-on-surface">Predicting Performance...</p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">85%</span>
          </div>
        </div>

        {/* Right Column: Tab Content Panels */}
        <div className="col-span-12 lg:col-span-9 relative min-h-[500px]">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="tab-content-enter space-y-6">
              {/* Top Row: Avatar & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 glass-card-settings violet-glow-settings rounded-2xl p-8 flex flex-col items-center text-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 violet-border-glow-settings overflow-hidden mb-6">
                      {avatarSrc ? (
                        <img alt="Avatar" className="w-full h-full object-cover" src={avatarSrc} />
                      ) : (
                        <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOosZ7-vOiCSdZcOwKrrNVaItlJhuXAhIQsmTCMN-m3tbLooReV_2oYpTGj5ciMLD6s7l6AvJQ8mzyLyQ5ElZTz9kRkzaMg867M3tGjyqEmcOzYSZOUMk610oubchCtyYbb-ZNML9mixbZlTmadjJVVHW-36ZIEaTmvSWNLJYj23fzO74y7b55QInAIkydAOp8NYGpFXNsffBjYRjJKR7Leu_lWhVLKQL-wN_ud6HIjMcEfHSdyZLwVZWrDGo1jHaJD6--fuqw8hwc" />
                      )}
                    </div>
                    <button 
                      onClick={handlePhotoUpload}
                      className="absolute bottom-6 right-2 bg-primary text-on-primary p-2 rounded-full hover:scale-110 transition-transform shadow-lg border-2 border-[#12102A] cursor-pointer flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </button>
                  </div>
                  <h2 className="font-headline text-2xl font-bold mb-1 text-on-surface">{name || 'User'}</h2>
                  <p className="text-on-surface-variant text-sm mb-4">{email || 'email@example.com'}</p>
                  <span className="px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container border border-secondary/20 text-xs font-bold tracking-wide mb-6">
                    {branch ? branch.toUpperCase() : 'STUDENT'}
                  </span>
                </div>

                <div className="md:col-span-7 glass-card-settings rounded-2xl p-8 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">monitoring</span> Academic Stats
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30 text-center">
                      <span className="block text-primary font-bold text-3xl mb-1">{streakCount}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Streak 🔥</span>
                    </div>
                    <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30 text-center">
                      <span className="block text-primary font-bold text-3xl mb-1">{completedTaskCount}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Topics</span>
                    </div>
                    <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/30 text-center">
                      <span className="block text-primary font-bold text-3xl mb-1">{mockTestsCount}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Mock Tests</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Edit Details */}
              <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <h3 className="font-headline text-xl font-semibold text-on-surface">Edit Profile Details</h3>
                </div>
                
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Full Name</label>
                    <input className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Email Address</label>
                    <input className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Institution</label>
                    <input className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none" type="text" value={university} onChange={(e) => setUniversity(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Branch</label>
                    <select className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none cursor-pointer" value={branch} onChange={(e) => setBranch(e.target.value)}>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Biological Sciences">Biological Sciences</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business & Economics">Business & Economics</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Year</label>
                    <select className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none cursor-pointer" value={year} onChange={(e) => setYear(e.target.value)}>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Postgrad">Postgrad</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2 pt-4 flex justify-end">
                    <button type="submit" className="bg-primary-container text-on-primary-container py-3 px-8 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">save</span> Save Changes
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {/* STUDY TAB */}
          {activeTab === 'study' && (
            <div className="tab-content-enter space-y-6">
              <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">school</span>
                  <h3 className="font-headline text-xl font-semibold text-on-surface">Study Routine</h3>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-xs font-bold text-on-surface-variant uppercase">Study Hours per Day</label>
                      <span className="text-primary font-bold text-lg bg-primary/10 px-3 py-1 rounded-lg">{studyHours} Hours</span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-container-highest rounded-full appearance-none custom-slider cursor-pointer accent-primary mt-2" 
                      max="12" min="1" type="range" value={studyHours} onChange={(e) => setStudyHours(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-outline-variant/30">
                    <label className="text-xs font-bold text-on-surface-variant uppercase block mb-4">Preferred Focus Session</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {['Morning', 'Afternoon', 'Night'].map((session) => (
                        <button 
                          key={session} onClick={() => setFocusSession(session)}
                          className={`p-4 rounded-xl text-center font-bold border transition-all cursor-pointer flex flex-col items-center gap-2 ${
                            focusSession === session 
                              ? 'bg-secondary-container text-on-secondary-container border-primary/40 shadow-lg' 
                              : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-variant hover:border-primary/20'
                          }`}
                        >
                          <span className="material-symbols-outlined text-2xl">
                            {session === 'Morning' ? 'light_mode' : session === 'Afternoon' ? 'partly_cloudy_day' : 'dark_mode'}
                          </span>
                          {session}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-on-surface block">Pomodoro Timer</span>
                      <span className="text-sm text-on-surface-variant mt-1 block">Enable 25-minute focus intervals during study sessions.</span>
                    </div>
                    <ToggleSwitch checked={pomodoroEnabled} onChange={() => setPomodoroEnabled(!pomodoroEnabled)} />
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button onClick={handleSave} className="bg-primary-container text-on-primary-container py-3 px-8 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">save</span> Save Preferences
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="tab-content-enter grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">palette</span>
                  <h3 className="font-headline text-xl font-semibold text-on-surface">Appearance</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase block mb-3">Theme Mode</label>
                    <div className="bg-surface-container-lowest p-1.5 rounded-xl flex border border-outline-variant">
                      {['light', 'dark', 'auto'].map(t => (
                        <button 
                          key={t}
                          onClick={() => { dispatch(setTheme(t)); dispatch(showToast(`Theme switched to ${t.toUpperCase()}`)); }}
                          className={`flex-1 py-3 text-sm font-bold capitalize transition-all cursor-pointer rounded-lg flex items-center justify-center gap-2 ${
                            theme === t ? 'bg-surface-variant text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {t === 'light' ? 'light_mode' : t === 'dark' ? 'dark_mode' : 'brightness_auto'}
                          </span>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase block mb-3">Accent Color</label>
                    <div className="flex items-center gap-4 flex-wrap bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                      {ACCENT_PALETTES.map((palette) => (
                        <button
                          key={palette.id}
                          title={palette.label}
                          onClick={() => handleAccentChange(palette)}
                          style={{ backgroundColor: palette.swatch }}
                          className={`w-10 h-10 rounded-full cursor-pointer transition-all border-2 border-transparent hover:scale-110 ${
                            accentColor === palette.id
                              ? `ring-4 ring-offset-4 scale-110 ${isLight ? 'ring-gray-700 ring-offset-[#eae6ef]' : 'ring-white ring-offset-[#1d1a24]'}`
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">notifications_active</span>
                  <h3 className="font-headline text-xl font-semibold text-on-surface">Notifications</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-on-surface">Daily reminders</span>
                    <ToggleSwitch checked={notifyDaily} onChange={() => setNotifyDaily(!notifyDaily)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-on-surface">Mock test alerts</span>
                    <ToggleSwitch checked={notifyMockTest} onChange={() => setNotifyMockTest(!notifyMockTest)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-on-surface">AI suggestions</span>
                    <ToggleSwitch checked={notifyAi} onChange={() => setNotifyAi(!notifyAi)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-on-surface">Streak alerts</span>
                    <ToggleSwitch checked={notifyStreak} onChange={() => setNotifyStreak(!notifyStreak)} />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="tab-content-enter space-y-6">
              <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">shield</span>
                  <h3 className="font-headline text-xl font-semibold text-on-surface">Privacy &amp; Security</h3>
                </div>
                
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-on-surface text-base">Password</h4>
                      <p className="text-sm text-on-surface-variant mt-1">Change your current account password.</p>
                    </div>
                    <button 
                      onClick={handlePasswordReset}
                      className="py-2 px-5 rounded-lg bg-primary-container text-on-primary-container font-bold hover:brightness-110 transition-all cursor-pointer text-sm flex items-center gap-2"
                    >
                      Update <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-outline-variant/30 mt-8">
                    <h4 className="font-bold text-error text-base mb-2">Danger Zone</h4>
                    <p className="text-sm text-on-surface-variant mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button 
                      onClick={handleDeleteAccount}
                      className="py-2.5 px-6 rounded-lg border-2 border-error/50 text-error font-bold hover:bg-error hover:text-white transition-all cursor-pointer text-sm"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>

    {/* ── Hidden file input for photo upload ── */}
    <input
      ref={photoInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handlePhotoSelected}
    />

    {/* ── Password Reset Modal ── */}
    {showPasswordModal && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        onClick={() => setShowPasswordModal(false)}
      >
        <div className="glass-card-settings rounded-2xl p-8 max-w-sm w-full mx-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl">lock_reset</span>
              <h3 className="font-headline text-xl font-bold text-on-surface">Change Password</h3>
            </div>
            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase px-1">New Password</label>
                <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Confirm Password</label>
                <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none text-sm" />
              </div>
            </div>
            <div className="flex gap-3 w-full mt-4">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-bold hover:bg-surface-variant transition-all cursor-pointer">Cancel</button>
              <button onClick={handlePasswordSave} className="flex-1 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-sm font-bold hover:brightness-110 transition-all cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>);
}
