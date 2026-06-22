import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store';
import { Mail, Lock, User, GraduationCap, ArrowRight, Eye, EyeOff, AlertCircle, X, Rocket } from 'lucide-react';
import { useIsLight } from '../../hooks/useIsLight';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLight = useIsLight();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Sign up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUniversity, setSignupUniversity] = useState('');
  const [signupBranch, setSignupBranch] = useState('Computer Science');
  const [signupYear, setSignupYear] = useState('Freshman');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Error/Success state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Backend URL
  const API_URL = 'http://localhost:5000/api/auth';

  const handleLoginSuccess = (userData) => {
    dispatch(loginSuccess(userData));
    onClose();
    navigate('/dashboard');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Authentication successful!');
        if (rememberMe) {
          localStorage.setItem('edupilot_remember_email', loginEmail);
        } else {
          localStorage.removeItem('edupilot_remember_email');
        }

        setTimeout(() => {
          handleLoginSuccess(data.user);
        }, 800);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signupName || !signupEmail || !signupUniversity || !signupPassword || !signupConfirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          university: signupUniversity,
          branch: signupBranch,
          year: signupYear
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully!');
        setTimeout(() => {
          handleLoginSuccess(data.user);
        }, 1000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className={`relative w-full max-w-[500px] ${isLight ? 'bg-[#f7f5fa]' : 'bg-[#0D0B1A]'} rounded-2xl shadow-2xl border border-outline-variant/20 flex flex-col my-8`}
        style={{ color: isLight ? "#1a1523" : "#e8dfee" }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <X className="w-5 h-5 text-outline" />
        </button>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="text-center space-y-2 mb-6 mt-4">
            <div className="font-headline text-3xl font-extrabold text-primary tracking-tight">EduPilot AI</div>
            <p className="text-on-surface-variant text-sm">Precision-engineered for academic excellence.</p>
          </div>



          {/* Alert messages */}
          {error && (
            <div className="p-4 mb-4 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}
          {success && (
            <div className="p-4 mb-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 flex items-start gap-3">
              <span className="material-symbols-outlined text-green-400 mt-0.5">check_circle</span>
              <div className="text-sm font-medium">{success}</div>
            </div>
          )}

          {/* LOGIN STATE */}
          {activeTab === 'login' && (
            <div className="space-y-6 animate-fade-in-up">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Academic Email</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="student@university.edu"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Password</label>
                    <a href="#" className="text-xs font-bold text-primary hover:underline" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="rounded bg-surface-container-low border-outline-variant/40 text-primary focus:ring-primary"
                    />
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-primary-container/20 transition-all flex justify-center items-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      Submit <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-on-surface-variant text-sm mt-6">
                Don't have an account?{' '}
                <a
                  className="text-primary font-bold hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('signup');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Sign Up
                </a>
              </p>
            </div>
          )}

          {/* SIGN UP STATE */}
          {activeTab === 'signup' && (
            <div className="space-y-5 animate-fade-in-up">
              <form className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4" onSubmit={handleSignup}>
                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="Alex Johnson"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={isLoading}
                      required
                      style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                    />
                  </div>
                </div>

                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Academic Email</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="alex@harvard.edu"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                    />
                  </div>
                </div>

                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">University / Institution</label>
                  <div className="relative">
                    <GraduationCap className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                      placeholder="Harvard University"
                      type="text"
                      value={signupUniversity}
                      onChange={(e) => setSignupUniversity(e.target.value)}
                      disabled={isLoading}
                      required
                      style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Branch</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary transition-all text-sm cursor-pointer"
                    value={signupBranch}
                    onChange={(e) => setSignupBranch(e.target.value)}
                    disabled={isLoading}
                    style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                  >
                    <option>Computer Science</option>
                    <option>Biological Sciences</option>
                    <option>Engineering</option>
                    <option>Business & Economics</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Year</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary transition-all text-sm cursor-pointer"
                    value={signupYear}
                    onChange={(e) => setSignupYear(e.target.value)}
                    disabled={isLoading}
                    style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                  >
                    <option>Freshman</option>
                    <option>Sophomore</option>
                    <option>Junior</option>
                    <option>Senior</option>
                    <option>Postgrad</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Password</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                    placeholder="••••••••"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">Confirm Password</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                    placeholder="••••••••"
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    style={{ color: isLight ? "#1a1523" : "white", backgroundColor: isLight ? "white" : undefined }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full col-span-1 sm:col-span-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 rounded-lg hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      Registering...
                    </span>
                  ) : (
                    <>
                      Submit <Rocket className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
              
              <p className="text-center text-on-surface-variant text-sm mt-6">
                Already have an account?{' '}
                <a
                  className="text-primary font-bold hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('login');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
