import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, User, BookOpen, GraduationCap, Rocket, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useIsLight } from '../../hooks/useIsLight';
import { showToast } from '../../store/slices/uiSlice';

export default function Login({ onLoginSuccess, initialTab = 'login' }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLight = useIsLight();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [showPassword, setShowPassword] = useState(false);
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

  const canvasRef = useRef(null);
  const rightPanelRef = useRef(null);
  const loginFormRef = useRef(null);
  const signupFormRef = useRef(null);

  // Initialize and animate particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * -0.5 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.y += this.speedY;
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.fillStyle = isLight
          ? `rgba(124, 58, 237, ${this.opacity * 0.6})`
          : `rgba(210, 187, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 8000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  // Mouse move glow & orb shifting effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Glow on right panel
      const rightPanel = rightPanelRef.current;
      if (rightPanel) {
        const rect = rightPanel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        rightPanel.style.setProperty('--mouse-x', `${x}px`);
        rightPanel.style.setProperty('--mouse-y', `${y}px`);
      }

      // Floating Orbs shifting
      const xRatio = e.clientX / window.innerWidth;
      const yRatio = e.clientY / window.innerHeight;
      const orbs = document.querySelectorAll('.floating-orb');
      orbs.forEach((orb, index) => {
        const shift = (index + 1) * 20;
        orb.style.transform = `translate(${xRatio * shift}px, ${yRatio * shift}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Backend URL
  const API_URL = 'http://localhost:5000/api/auth';

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
          onLoginSuccess(data.user);
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
          onLoginSuccess(data.user);
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

  const handleMockGoogleLogin = () => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const googleUser = {
        name: 'Google User',
        email: 'google.student@university.edu',
        university: 'Global Cloud Academy',
        branch: 'Computer Science',
        year: 'Junior'
      };
      setSuccess('Logged in via Google Account!');
      setTimeout(() => {
        onLoginSuccess(googleUser);
      }, 800);
    }, 1500);
  };

  const bgStyle = isLight ? "#f7f5fa" : "#0D0B1A";
  const textStyle = isLight ? "#1a1523" : "#e8dfee";

  return (
    <div
      className={isLight ? "light-theme w-full h-screen font-body flex flex-col md:flex-row overflow-hidden relative" : "w-full h-screen font-body flex flex-col md:flex-row overflow-hidden relative"}
      style={{
        backgroundColor: bgStyle,
        color: textStyle,
        transition: "background-color 0.2s ease, color 0.2s ease"
      }}
    >
      {/* Background body style injector to prevent defaults */}
      <style>{`
        body { background-color: ${bgStyle}; transition: background-color 0.2s ease; }
        .glass-panel {
          background: ${isLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(22, 20, 38, 0.45)'};
          backdrop-filter: blur(12px);
          border: 1px solid ${isLight ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.2)'};
        }
        .mouse-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0) 70%);
          top: var(--mouse-y, 50%);
          left: var(--mouse-x, 50%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          z-index: 0;
          opacity: 0.3;
          transition: transform 0.2s ease-out;
        }
      `}</style>

      {/* Brand Header overlay */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex justify-between items-center px-6 md:px-10 max-w-[1440px] mx-auto pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto select-none cursor-pointer" onClick={() => navigate('/')}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }} className="">
            <span className="material-symbols-outlined text-white text-base">rocket_launch</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-xl text-primary tracking-tight">EduPilot</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">AI</span>
          </div>
        </div>
      </nav>

      {/* LEFT PANEL (Branding) — fixed, never scrolls */}
      <section className="hidden md:flex relative w-1/2 h-screen flex-shrink-0 bg-gradient-to-br from-primary-container/20 to-background flex-col justify-center px-16 overflow-hidden border-r border-outline-variant/10">
        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

        {/* Animated Atmosphere Orbs */}
        <div className="floating-orb w-64 h-64 bg-primary/20 top-20 left-10" />
        <div className="floating-orb w-80 h-80 bg-secondary/15 bottom-10 right-10" />

        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="flex items-center gap-3">
            {/* we do some changes*/}
            <span className="text-primary mt-5  font-bold text-sm tracking-wider uppercase">Academic Command Center</span>
          </div>

          <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Elevate Your <br />
            <span className="ai-gradient-text font-extrabold">Academic Journey</span>
          </h1>

          <p className="text-on-surface-variant text-lg leading-relaxed">
            AI-powered study planning, smart revision, and personalized exam preparation — all in one dashboard.
          </p>

          <ul className="space-y-5 pt-4">
            <li className="flex items-center gap-4 group">
              <span className="p-1.5 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5" />
              </span>
              <span className="text-white text-base font-medium">AI Syllabus Analyzer</span>
            </li>
            <li className="flex items-center gap-4 group">
              <span className="p-1.5 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-white text-base font-medium">Personalized Study Planner</span>
            </li>
            <li className="flex items-center gap-4 group">
              <span className="p-1.5 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-white text-base font-medium">Smart Mock Tests</span>
            </li>
          </ul>

          {/* Floating Stats Card */}
          <div className="glass-panel p-5 rounded-xl flex items-center gap-5 mt-8 border border-outline-variant/30 max-w-sm animate-float">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary-container flex items-center justify-center text-xs font-bold text-white">AJ</div>
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-secondary-container flex items-center justify-center text-xs font-bold text-white">EL</div>
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-surface-bright flex items-center justify-center text-xs font-bold text-white">MS</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">10,000+ students</div>
              <div className="text-primary text-xs font-medium">95% exam success rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL (Authentication Forms) — scrollable */}
      <section
        ref={rightPanelRef}
        id="rightPanel"
        className="relative w-full md:w-1/2 h-screen flex-shrink-0 flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto"
      >
        <div className="mouse-glow" />

        <div className="w-full max-w-md space-y-8 relative z-10 pt-24 pb-12">
          {/* Header for small screens */}
          <div className="md:hidden text-center space-y-2 mb-4">
            <div className="font-headline text-3xl font-extrabold text-primary tracking-tight">EduPilot AI</div>
            <p className="text-on-surface-variant text-sm">Precision-engineered for academic excellence.</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-outline-variant/20">
            <button
              className={`flex-1 py-4 text-center font-headline font-bold text-lg transition-all border-b-2 cursor-pointer ${activeTab === 'login'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
                }`}
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccess('');
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-headline font-bold text-lg transition-all border-b-2 cursor-pointer ${activeTab === 'signup'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
                }`}
              onClick={() => {
                setActiveTab('signup');
                setError('');
                setSuccess('');
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="p-4 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-start gap-3 animate-fade-in-up">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}
          {success && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 flex items-start gap-3 animate-fade-in-up">
              <span className="material-symbols-outlined text-green-400 mt-0.5">check_circle</span>
              <div className="text-sm font-medium">{success}</div>
            </div>
          )}

          {/* Demo account tooltip */}
          {activeTab === 'login' && !error && !success && (
            <div className="p-3 rounded-lg bg-primary-container/10 border border-primary/20 text-on-primary-container text-xs flex items-center justify-between">
              <span><strong>Demo User:</strong> student@university.edu</span>
              <span><strong>Pass:</strong> password123</span>
            </div>
          )}

          {/* Form Content */}
          <div className="relative overflow-hidden min-h-[420px]">
            {/* LOGIN STATE */}
            {activeTab === 'login' && (
              <div ref={loginFormRef} className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">Welcome Back</h2>
                  <p className="text-on-surface-variant">Access your personalized study dashboard.</p>
                </div>

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

                  {/* Remember me & submit */}
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
                    className="w-full bg-primary-container text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-primary-container/20 transition-all flex justify-center items-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        Enter Dashboard <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-outline-variant/20"></div>
                  <span className="flex-shrink mx-4 text-xs font-bold text-outline uppercase tracking-widest">OR CONTINUE WITH</span>
                  <div className="flex-grow border-t border-outline-variant/20"></div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleMockGoogleLogin}
                  className="w-full border border-outline-variant/40 text-on-surface font-medium py-3 rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="currentColor"></path>
                  </svg>
                  Google Account
                </button>

                <p className="text-center text-on-surface-variant text-sm">
                  New here?{' '}
                  <a
                    className="text-primary font-bold hover:underline cursor-pointer"
                    onClick={() => {
                      setActiveTab('signup');
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Request Access
                  </a>
                </p>
              </div>
            )}

            {/* SIGN UP STATE */}
            {activeTab === 'signup' && (
              <div ref={signupFormRef} className="space-y-5 animate-fade-in-up">
                <div className="space-y-1">
                  <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">Create Account</h2>
                  <p className="text-on-surface-variant text-sm">Join the next generation of academic achievers.</p>
                </div>

                <form className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4" onSubmit={handleSignup}>
                  <div className="space-y-1 col-span-2">
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
                      />
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2">
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
                      />
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2">
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
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full col-span-2 bg-primary-container text-white font-bold py-3.5 rounded-lg hover:shadow-lg hover:shadow-primary-container/20 transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Registering...
                      </span>
                    ) : (
                      <>
                        Start Learning <Rocket className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-on-surface-variant text-sm mt-3">
                  Already have an account?{' '}
                  <a
                    className="text-primary font-bold hover:underline cursor-pointer"
                    onClick={() => {
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
      </section>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 w-full py-4 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-on-surface-variant/40 text-xs gap-2 z-50 pointer-events-none">
        <div className="pointer-events-auto select-none">
          © 2026 EduPilot AI. Precision-engineered for academic excellence.
        </div>
        <div className="flex gap-6 pointer-events-auto">
          <a href="#" className="hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>AI Ethics</a>
          <a href="#" className="hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>Support</a>
          <a href="#" className="hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
