import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser, setTheme, showToast } from '../store';
import { useIsLight } from '../hooks/useIsLight';

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

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors from Redux
  const user = useSelector(state => state.auth.user);
  const theme = useSelector(state => state.ui.theme);
  const streakCount = useSelector(state => state.study.streakCount) || 14;
  const completedTaskCount = useSelector(state => state.study.tasks.filter(t => t.completed).length) || 0;
  const mockTestsCount = useSelector(state => state.study.mockTests.pastResults.length) || 3;

  // Local States for form inputs
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex.rivera@university.edu');
  const [university, setUniversity] = useState(user?.university || 'Stanford University');
  const [yearSemester, setYearSemester] = useState(user?.yearSemester || 'Year 3 / Sem 5');
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
  const [twoFactor, setTwoFactor] = useState(false);

  // Avatar
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || null);
  const photoInputRef = useRef(null);

  // 2FA confirm modal state
  const [show2faModal, setShow2faModal] = useState(false);

  const isLight = useIsLight();

  // Save changes handler
  const handleSave = (e) => {
    if (e) e.preventDefault();
    dispatch(updateUser({
      name,
      email,
      university,
      yearSemester,
      studyHours,
      focusSession
    }));
    dispatch(showToast("💾 Profile preferences saved successfully."));
  };

  const handlePasswordReset = () => {
    dispatch(showToast("🔒 Password reset link sent to your registered email."));
  };

  const handleDeleteAccount = () => {
    dispatch(showToast("⚠️ Account deletion request logged. Contact admin to finalize."));
  };

  const handleFeedback = () => {
    dispatch(showToast("❤️ Thank you for your feedback!"));
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
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const handle2faToggle = () => {
    if (!twoFactor) {
      // enabling → show confirmation modal
      setShow2faModal(true);
    } else {
      setTwoFactor(false);
      dispatch(showToast('🔓 Two-Factor Authentication disabled.'));
    }
  };

  const confirm2faEnable = () => {
    setTwoFactor(true);
    setShow2faModal(false);
    dispatch(showToast('🔐 Two-Factor Authentication enabled!'));
  };

  return (<>
    <div className="space-y-8 animate-fade-in-up">
      {/* Scope component specific styles */}
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
        
        {/* Left Column: Profile Card */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-card-settings violet-glow-settings rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 violet-border-glow-settings overflow-hidden mb-6">
                {avatarSrc ? (
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    src={avatarSrc}
                  />
                ) : (
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOosZ7-vOiCSdZcOwKrrNVaItlJhuXAhIQsmTCMN-m3tbLooReV_2oYpTGj5ciMLD6s7l6AvJQ8mzyLyQ5ElZTz9kRkzaMg867M3tGjyqEmcOzYSZOUMk610oubchCtyYbb-ZNML9mixbZlTmadjJVVHW-36ZIEaTmvSWNLJYj23fzO74y7b55QInAIkydAOp8NYGpFXNsffBjYRjJKR7Leu_lWhVLKQL-wN_ud6HIjMcEfHSdyZLwVZWrDGo1jHaJD6--fuqw8hwc"
                  />
                )}
              </div>
              <button 
                onClick={handlePhotoUpload}
                className="absolute bottom-6 right-2 bg-primary text-on-primary p-2 rounded-full hover:scale-110 transition-transform shadow-lg border-2 border-[#12102A] cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            
            <h2 className="font-headline text-2xl font-bold mb-1 text-on-surface">{name}</h2>
            <p className="text-on-surface-variant text-sm mb-4">{email}</p>
            <span className="px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container border border-secondary/20 text-xs font-bold tracking-wide mb-8">
              B.TECH STUDENT
            </span>
            
            <div className="grid grid-cols-3 gap-3 w-full mb-8">
              <div className="bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/30">
                <span className="block text-primary font-bold text-lg leading-tight">{streakCount}</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Streak 🔥</span>
              </div>
              <div className="bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/30">
                <span className="block text-primary font-bold text-lg leading-tight">{completedTaskCount + 39}</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Topics</span>
              </div>
              <div className="bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/30">
                <span className="block text-primary font-bold text-lg leading-tight">{mockTestsCount + 9}</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Mock Tests</span>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              className="w-full py-3 bg-primary-container text-on-primary-container rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Save Preferences
            </button>
          </div>

          {/* Quick Access Badge */}
          <div className="glass-card-settings rounded-xl p-4 flex items-center gap-4 border-l-4 border-l-primary">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-primary mb-0.5">AI STATUS</p>
              <p className="text-sm text-on-surface">Predicting Exam Performance...</p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">85%</span>
          </div>
        </div>

        {/* Right Column: Settings Panels */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Section 1: Account Settings */}
          <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="font-headline text-xl font-semibold text-on-surface">Account Settings</h3>
            </div>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Full Name</label>
                <input 
                  className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none" 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Email Address</label>
                <input 
                  className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Institution</label>
                <input 
                  className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none" 
                  type="text" 
                  value={university} 
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase px-1">Year / Semester</label>
                <select 
                  className="w-full bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all border outline-none"
                  value={yearSemester}
                  onChange={(e) => setYearSemester(e.target.value)}
                >
                  <option value="Year 3 / Sem 5">Year 3 / Sem 5</option>
                  <option value="Year 3 / Sem 6">Year 3 / Sem 6</option>
                  <option value="Year 4 / Sem 7">Year 4 / Sem 7</option>
                </select>
              </div>
              
              <div className="col-span-1 md:col-span-2 pt-2 flex justify-end">
                <button 
                  type="submit" 
                  className="bg-primary-container text-on-primary-container py-2.5 px-6 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Account Changes
                </button>
              </div>
            </form>
          </section>

          {/* Section 2: Study Preferences */}
          <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">school</span>
              <h3 className="font-headline text-xl font-semibold text-on-surface">Study Preferences</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Study Hours per Day</label>
                  <span className="text-primary font-bold">{studyHours} Hours</span>
                </div>
                <input 
                  className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none custom-slider cursor-pointer accent-primary" 
                  max="12" 
                  min="1" 
                  type="range" 
                  value={studyHours}
                  onChange={(e) => setStudyHours(Number(e.target.value))}
                />
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-on-surface-variant uppercase block">Focus Sessions</label>
                  <div className="flex gap-2">
                    {['Morning', 'Afternoon', 'Night'].map((session) => (
                      <button 
                        key={session}
                        onClick={() => setFocusSession(session)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                          focusSession === session 
                            ? 'bg-secondary-container text-on-secondary-container border-primary/30' 
                            : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-variant'
                        }`}
                      >
                        {session}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className="text-sm font-bold text-on-surface">Pomodoro Timer</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={pomodoroEnabled}
                      onChange={() => setPomodoroEnabled(!pomodoroEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Notifications & Appearance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Notifications panel */}
            <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Notifications</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">Daily reminders</span>
                  <input 
                    type="checkbox" 
                    checked={notifyDaily}
                    onChange={() => setNotifyDaily(!notifyDaily)}
                    className="w-4.5 h-4.5 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary cursor-pointer" 
                  />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">Mock test alerts</span>
                  <input 
                    type="checkbox" 
                    checked={notifyMockTest}
                    onChange={() => setNotifyMockTest(!notifyMockTest)}
                    className="w-4.5 h-4.5 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary cursor-pointer" 
                  />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">AI suggestions</span>
                  <input 
                    type="checkbox" 
                    checked={notifyAi}
                    onChange={() => setNotifyAi(!notifyAi)}
                    className="w-4.5 h-4.5 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary cursor-pointer" 
                  />
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">Streak alerts</span>
                  <input 
                    type="checkbox" 
                    checked={notifyStreak}
                    onChange={() => setNotifyStreak(!notifyStreak)}
                    className="w-4.5 h-4.5 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary cursor-pointer" 
                  />
                </li>
              </ul>
            </section>

            {/* Appearance panel */}
            <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">palette</span>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Appearance</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-lowest p-1 rounded-lg flex border border-outline-variant">
                  <button 
                    onClick={() => {
                      dispatch(setTheme('light'));
                      dispatch(showToast("Theme switched to LIGHT"));
                    }}
                    className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer rounded-md ${
                      theme === 'light' 
                        ? 'bg-surface-variant text-on-surface shadow-sm' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => {
                      dispatch(setTheme('dark'));
                      dispatch(showToast("Theme switched to DARK"));
                    }}
                    className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer rounded-md ${
                      theme === 'dark' 
                        ? 'bg-surface-variant text-on-surface shadow-sm' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Dark
                  </button>
                  <button 
                    onClick={() => {
                      dispatch(setTheme('auto'));
                      dispatch(showToast("Theme switched to AUTO (System)"));
                    }}
                    className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer rounded-md ${
                      theme === 'auto' 
                        ? 'bg-surface-variant text-on-surface shadow-sm' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Auto
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {ACCENT_PALETTES.map((palette) => (
                      <button
                        key={palette.id}
                        title={palette.label}
                        onClick={() => handleAccentChange(palette)}
                        style={{ backgroundColor: palette.swatch }}
                        className={`w-7 h-7 rounded-full cursor-pointer transition-all border-2 border-transparent hover:scale-110 ${
                          accentColor === palette.id
                            ? `ring-2 ring-offset-2 scale-110 ${isLight ? 'ring-gray-700 ring-offset-[#eae6ef]' : 'ring-white ring-offset-[#1d1a24]'}`
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Selected: <span className="font-bold text-primary">{ACCENT_PALETTES.find(p => p.id === accentColor)?.label}</span>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Section 4: Privacy & Security + About & Help */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            
            {/* Privacy & Security */}
            <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">shield</span>
                <h3 className="font-headline text-lg font-semibold text-on-surface">Privacy &amp; Security</h3>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handlePasswordReset}
                  className="w-full py-2.5 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-variant transition-all flex items-center justify-between cursor-pointer"
                >
                  Change Password
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
                
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-sm font-medium text-on-surface">Two-factor auth</span>
                    {twoFactor && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 font-bold uppercase tracking-wide">Active</span>
                    )}
                  </div>
                  {/* Styled slide toggle */}
                  <button
                    onClick={handle2faToggle}
                    aria-pressed={twoFactor}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus:outline-none ${
                      twoFactor
                        ? 'bg-primary-container border-primary/40'
                        : 'bg-surface-container-highest border-outline-variant'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full shadow-md transition-transform duration-200 ${
                        twoFactor
                          ? 'translate-x-5 bg-on-primary-container'
                          : 'translate-x-0.5 bg-on-surface-variant'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="pt-4 border-t border-outline-variant/30 text-center">
                  <button 
                    onClick={handleDeleteAccount}
                    className="text-error text-xs font-bold uppercase hover:underline tracking-widest cursor-pointer bg-transparent border-none"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

            {/* About & Help */}
            <section className="glass-card-settings rounded-2xl border-l-4 border-l-primary p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">info</span>
                <h3 className="font-headline text-lg font-semibold text-on-surface">About &amp; Help</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">App Version</span>
                  <span className="font-mono text-primary">v1.0.4</span>
                </div>
                
                <button 
                  onClick={() => navigate('/support')}
                  className="block w-full py-2.5 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-variant transition-all text-center cursor-pointer"
                >
                  Contact Support
                </button>
                
                <button 
                  onClick={handleFeedback}
                  className="w-full py-2.5 px-4 rounded-lg bg-primary/10 border border-primary/20 text-sm font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
                >
                  Send Feedback
                </button>
              </div>
            </section>

          </div>

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

      {/* ── 2FA Confirmation Modal ── */}
      {show2faModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShow2faModal(false)}
        >
          <div
            className="glass-card-settings rounded-2xl p-8 max-w-sm w-full mx-4 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">security</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Enable 2-Factor Auth?</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Two-factor authentication adds an extra layer of security. A verification code will be required at each login.
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShow2faModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-bold hover:bg-surface-variant transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirm2faEnable}
                  className="flex-1 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-sm font-bold hover:brightness-110 transition-all cursor-pointer"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
