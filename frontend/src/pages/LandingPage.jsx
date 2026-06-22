import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Rocket, Brain, Compass, BookOpen, Clock, Activity, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useIsLight } from '../hooks/useIsLight';
import { showToast } from '../store/slices/uiSlice';
import AuthModal from '../features/auth/AuthModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isLight = useIsLight();
  const canvasRef = useRef(null);

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hash-based smooth scrolling on page load/mount and hash change
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            window.scrollTo({ top: el.offsetTop - 85, behavior: 'smooth' });
          }, 200);
        }
      }
    };
    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  // Initialize and animate particle system on landing page
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
      const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
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

  // Set page background colors in sync with other screens
  const bgStyle = isLight ? "#f7f5fa" : "#0D0B1A";
  const textStyle = isLight ? "#1a1523" : "#e8dfee";

  // Features based on Google Stitch design, updated to match application assets
  const features = [
    {
      id: 'syllabus',
      icon: 'analytics',
      title: 'Syllabus Analyzer',
      desc: 'Upload any course syllabus. Automatically extract core topics, weighted grades, deadlines, and construct difficulty heatmaps.'
    },
    {
      id: 'notes',
      icon: 'auto_awesome',
      title: 'Smart Notes Generator',
      desc: 'Transform messy lecture recordings or slides into structured summaries, active-recall cheatsheets, and printable cheat sheets.'
    },
    {
      id: 'tutor',
      icon: 'psychology',
      title: '24/7 AI Socratic Tutor',
      desc: 'Get immediate step-by-step guidance on complex formulas, algorithms, or readings from a chatbot tailored to your exact class curriculum.'
    },
    {
      id: 'planner',
      icon: 'calendar_month',
      title: 'Interactive Spaced Planner',
      desc: 'Dynamically schedule study sessions and revision cycles mapping directly to scientific memory curves, avoiding last-minute cramming.'
    },
    {
      id: 'focus',
      icon: 'alarm',
      title: 'Focus Command Center',
      desc: 'Immerse yourself in clean Pomodoro work sessions with built-in ambient soundscapes and tracked metrics to monitor study velocity.'
    },
    {
      id: 'mock',
      icon: 'quiz',
      title: 'Smart Mock Exams',
      desc: 'Generate customized practice tests mirroring real test structures, complete with immediate grade predictions and detailed explanations.'
    }
  ];

  return (
    <div
      className={isLight ? "light-theme min-h-screen relative flex flex-col overflow-x-hidden" : "min-h-screen relative flex flex-col overflow-x-hidden"}
      style={{
        backgroundColor: bgStyle,
        color: textStyle,
        transition: "background-color 0.2s ease, color 0.2s ease"
      }}
    >
      {/* Background body style injector to prevent defaults */}
      <style>{`
        body { background-color: ${bgStyle}; transition: background-color 0.2s ease; }
        .text-gradient { background: linear-gradient(135deg, ${isLight ? '#4f319c' : '#FFFFFF'} 0%, #7C3AED 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .university-logo { filter: ${isLight ? 'grayscale(100%) opacity(0.7)' : 'grayscale(100%) invert(1) brightness(1.8) opacity(0.5)'}; }
        .university-logo:hover { filter: grayscale(0%) opacity(1) ${isLight ? '' : 'brightness(1)'}; transition: all 0.3s ease; }
      `}</style>

      {/* Decorative Interactive Background Blobs — contained so they never overflow the page width */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
        <div
          style={{ transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)` }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 rounded-full blur-[120px] transition-transform duration-300 ease-out"
        />
        <div
          style={{ transform: `translate(${-mouseOffset.x * 0.8}px, ${-mouseOffset.y * 0.8}px)` }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/10 rounded-full blur-[120px] transition-transform duration-300 ease-out"
        />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-outline-variant/10 bg-background/60 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
          {/* Logo - clicks scroll to very top */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <span className="material-symbols-outlined text-white text-base">rocket_launch</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-xl tracking-tight text-on-surface">EduPilot</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container/15 border border-primary-container/30 text-primary-container">AI</span>
            </div>
          </div>

          {/* Nav Links - use JS scroll to avoid hash URL issues */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => { const el = document.getElementById('features'); if (el) window.scrollTo({ top: el.offsetTop - 85, behavior: 'smooth' }); }}
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold cursor-pointer bg-transparent border-none"
            >Features</button>
            <button
              onClick={() => { const el = document.getElementById('preview'); if (el) window.scrollTo({ top: el.offsetTop - 85, behavior: 'smooth' }); }}
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold cursor-pointer bg-transparent border-none"
            >Preview</button>
            <button
              onClick={() => { const el = document.getElementById('pricing'); if (el) window.scrollTo({ top: el.offsetTop - 85, behavior: 'smooth' }); }}
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold cursor-pointer bg-transparent border-none"
            >Pricing</button>
            <button
              onClick={() => dispatch(showToast("EduPilot AI v1.0.0. Precision engineered for study velocity."))}
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold cursor-pointer bg-transparent border-none"
            >Methodology</button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => openAuthModal('login')}
              className="text-on-surface-variant hover:text-on-surface font-medium transition-colors text-sm cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Navbar height spacer so content doesn't hide behind fixed nav */}
      <div style={{ height: "80px", flexShrink: 0 }} />

      {/* HERO SECTION */}
      <header className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-10 flex flex-col items-center justify-center text-center py-20 lg:py-28 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 mb-8 animate-pulse">
          <span className="text-xs font-bold tracking-widest uppercase text-primary">✨ AI-Powered Academic Excellence</span>
        </div>

        <h1 className="font-headline text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.1] max-w-5xl mb-8">
          Master Your Academics <br />
          <span className="text-gradient">with AI Precision</span>
        </h1>

        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-body leading-relaxed mb-12">
          The high-performance study command center. Automate scheduling, synthesize complex courses, tackle doubt with Socratic AI, and mock test yourself to peak results.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={() => user ? navigate('/dashboard') : openAuthModal('signup')}
            className="px-10 py-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-base active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => dispatch(showToast("🎥 Opening demo video player (Demo only)."))}
            className="flex items-center gap-3 px-10 py-5 border border-outline-variant/30 text-on-surface font-bold rounded-xl hover:bg-surface-container-high/40 active:scale-95 transition-all text-base cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#7C3AED]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            Watch Demo
          </button>
        </div>

        {/* TRUST BANNER */}
        <div className="mt-28 w-full max-w-5xl">
          <p className="text-[10px] tracking-[0.3em] font-bold text-on-surface-variant/40 uppercase mb-8">TRUSTED BY 50,000+ STUDENTS AT WORLD-CLASS UNIVERSITIES</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 transition-all duration-500">
            <img
              alt="Stanford Logo"
              className="h-6 md:h-7 object-contain university-logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQqbeHQwOhalEbFZpQik2WcTOXvJVn8jurZyiRTni8FgABP8oqBjAc5ZRoBTtVIfjaP1MDhQLuJ6jBZHvbXozb7oAaR-ZtAcXK4fRdCWtkoYU-mgFApPky6KX8UaSkhY_AI_NDH7IJuK6xzxzhiN1ReikxupE7Sn3o0VZsDkgzTzcLXlPVB2eYosOlM_ihpV9SglTzXHi8W3AmnqcPisjtsPkIhTKdnD74vCXITFKAcsKqhyoEdPTuCup1UI7YWvP2mtXRmQVmP1gN"
            />
            <img
              alt="MIT Logo"
              className="h-6 md:h-7 object-contain university-logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCerR1KefUtPsGB-kNC2y6RA85I81IH3Hxi_drXPQMu2PC2N3OWbc1tsAyhrNlJrruhcO8BemEIv6HmNBT0mfgYu_wHZuuD72kcyRlft7OBBb2NzLx54pp44hgglksMkBCr9tCdonJOEEbFDjvXpqW_2716mw4SCPgjVIaFTnR8CxZQ8pFdl-r0uSH7801ldIfVJNpGJYT9zG2QhTT1_4PCaLA-TnU7TBnFVpJV91QDwFQS0aKj0D4VUbGZ0Qq7dIQpdtXOpke_ruLZ"
            />
            <img
              alt="Harvard Logo"
              className="h-6 md:h-7 object-contain university-logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWQj1MJP_E85PC0nZNw5gyllkNnq-xIbD4-2ikukTEN9sqTBApeggdCo8e-Prtu7ykRAfYP7_SxobwEnvhn0jAvOoYPuPsCUrmUVyhUQEoJuQUo3bImW2BueGtwC2nA31blqsXB0yKpGpV0MaqSRMN7OoBTEBXs8kCUeoSwZH_i9DSaLOD3v_vRxIyjG51K0Cp7ymznLF9p60hpfWFzGJR6gCgu7dHFNjvjuC5oysU2Md6hajgxFwrdLAObEIFxbcOC_8oyAjy_lbg"
            />
            <img
              alt="Oxford Logo"
              className="h-6 md:h-7 object-contain university-logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzOYW3vpkvP4SnWawUJZYxelNYKMiXIZ74_UlU4MEs0z6T9U9pXXEttbXkQBdhOQUPkDGAAXhFzJteU4YJwZkb0uNO7PlimKLbG13uP5fTpaqvHI_3A1fNqloFd69-Yu5yeP-3MkokGntYuiVToZGKK6I2obpAGGLVGpRLjPrco4X0nrDry8GbYuzzGfp2hZVIBa9aiBiJN5JWi_O5K0wBZiw-O1rDve3p5IZGm0YOx-vxKQxZAQZjwcAaNs-KnFX_7EcBoXMFDU68"
            />
            <img
              alt="Berkeley Logo"
              className="h-6 md:h-7 object-contain university-logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAar5OGlkJQRw3a7cKYVcBX4M7eNrQqRNm4JE3tP7VJtPhEY_Pm7Sxgwf0rDvf1IyRFkLoX56oG5JlAY963U-Gi95MraBd6aIQeFT4hTeqh5OMdvJOmZrpjrtoCFV2uY7J8sQOrcetNVlCH_aSGfel69LAJdcqw1gAN3uQaRBP51cqdZ06fRGRT5vTq5HQvthYNXVZanU8jdVAPpIQsRqNlxs4AXWH4CEk0ELuNd3s_R80OJN_caCBa2fDXAlpcf6yJnB7JlcMqFqr6"
            />
          </div>
        </div>
      </header>

      {/* FEATURES GRID SECTION */}
      <section id="features" className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-10 py-24 border-t border-outline-variant/10">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface">
            Precision Built for Peak Performance
          </h2>
          <p className="text-on-surface-variant text-base">
            Replace cluttered systems with an AI academic command center designed to optimize memory retention, clarify doubts, and structure plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="p-8 rounded-2xl glass-card border border-outline-variant/20 hover:border-[#7C3AED]/50 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-container/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#7C3AED] text-3xl">{feat.icon}</span>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">{feat.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{feat.desc}</p>
              <a
                className="flex items-center gap-2 text-[#7C3AED] font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                href="#"
                onClick={(e) => { e.preventDefault(); user ? navigate('/dashboard') : openAuthModal('signup'); }}
              >
                Learn More <span className="material-symbols-outlined text-xs">east</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section id="preview" className="relative z-10 w-full py-28 border-t border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Visibility over your future.</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">One unified platform to track performance, manage deadlines, and optimize study habits.</p>
          </div>

          {/* Browser frame mockup container */}
          <div className="relative bg-surface-container/30 rounded-2xl border border-outline-variant/20 overflow-hidden shadow-2xl max-w-5xl mx-auto glass-card">
            {/* Browser Header Bar */}
            <div className="bg-surface-container-high/40 px-6 py-4 flex items-center gap-3 border-b border-outline-variant/10">
              <div className="flex gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <div className="w-3 h-3 rounded-full bg-primary-container" />
              </div>
              <div className="mx-auto bg-background/50 px-8 py-1.5 rounded-lg text-[11px] text-on-surface-variant/60 font-mono border border-outline-variant/10 max-w-[280px] truncate select-none">
                app.edupilot.ai/dashboard
              </div>
            </div>

            {/* Browser Body Workspace */}
            <div className="p-6 md:p-10 grid grid-cols-12 gap-8 relative overflow-hidden">
              {/* Floating AI Insight Card */}
              <div className="absolute top-[60%] lg:top-[30%] left-[50%] lg:left-[55%] -translate-x-1/2 lg:translate-x-0 w-[90%] max-w-[340px] bg-surface-container-highest/90 border border-primary-container p-6 rounded-2xl shadow-2xl z-20 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#7C3AED] text-xl">sparkles</span>
                  <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED]">AI Insight</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed mb-4">
                  Based on your <span className="text-[#7C3AED] font-bold">Calculus II</span> syllabus, you have a major exam in 14 days. Start the <span className="underline decoration-[#7C3AED]/50">"Integrals Deep Dive"</span> study session tonight.
                </p>
                <button
                  onClick={() => user ? navigate('/dashboard') : openAuthModal('login')}
                  className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Start Session Now
                </button>
              </div>

              {/* Mock Sidebar */}
              <div className="hidden lg:block col-span-3 space-y-6 border-r border-outline-variant/15 pr-6">
                <div className="h-10 bg-primary-container/10 rounded-xl w-full border border-primary-container/20 flex items-center px-3 gap-2">
                  <span className="material-symbols-outlined text-sm text-[#7C3AED]">dashboard</span>
                  <div className="h-2.5 bg-[#7C3AED]/35 rounded w-1/2" />
                </div>
                <div className="space-y-3 pl-3">
                  <div className="h-2 bg-on-surface-variant/10 rounded w-1/2" />
                  <div className="h-2 bg-on-surface-variant/10 rounded w-2/3" />
                  <div className="h-2 bg-on-surface-variant/10 rounded w-1/3" />
                </div>
                <div className="pt-6 space-y-2">
                  <div className="h-8 bg-on-surface-variant/5 rounded-lg w-full" />
                  <div className="h-8 bg-on-surface-variant/5 rounded-lg w-full" />
                  <div className="h-8 bg-on-surface-variant/5 rounded-lg w-full" />
                </div>
              </div>

              {/* Mock Main Section */}
              <div className="col-span-12 lg:col-span-9 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/10">
                    <div className="h-2 bg-on-surface-variant/15 rounded w-1/3 mb-2" />
                    <div className="h-5 bg-on-surface/10 rounded w-2/3" />
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/10">
                    <div className="h-2 bg-on-surface-variant/15 rounded w-1/4 mb-2" />
                    <div className="h-5 bg-on-surface/10 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-72 rounded-xl bg-surface-container-high/20 border border-outline-variant/10 p-6">
                  <div className="space-y-4 opacity-20">
                    <div className="h-3 bg-on-surface/10 rounded w-1/4 mb-6" />
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-lg bg-on-surface/10" />
                      <div className="h-3 bg-on-surface/10 rounded-lg flex-1" />
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-lg bg-on-surface/10" />
                      <div className="h-3 bg-on-surface/10 rounded-lg flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkmark benefits list under the browser */}
            <div className="bg-surface-container-high/30 px-8 py-6 border-t border-outline-variant/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[#7C3AED] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium">Real-time collaboration</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[#7C3AED] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium">LMS curriculum integration</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[#7C3AED] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-medium">Predictive grade modeling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto py-28 px-6 lg:px-10 border-t border-outline-variant/10">
        <div className="text-center mb-20 space-y-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">Invest in your intellect.</h2>
          <p className="text-on-surface-variant max-w-md mx-auto">Scalable intelligence for every stage of your academic journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Basic Card */}
          <div className="p-8 md:p-10 rounded-2xl border border-outline-variant/20 bg-surface-container/20 flex flex-col justify-between glass-card">
            <div>
              <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">Basic</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-on-surface">$0</span>
                <span className="text-on-surface-variant/60 text-sm">/month</span>
              </div>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg">done</span>
                  3 Syllabus uploads / month
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg">done</span>
                  Standard AI Smart Notes
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg">done</span>
                  Basic Socratic Tutor (10/day)
                </li>
              </ul>
            </div>
            <button
              onClick={() => user ? navigate('/dashboard') : openAuthModal('signup')}
              className="w-full py-4 border border-outline-variant/30 text-on-surface rounded-xl font-bold hover:bg-surface-container-high/60 active:scale-95 transition-all cursor-pointer"
            >
              Choose Basic
            </button>
          </div>

          {/* Pro Card (Highlighted) */}
          <div className="p-8 md:p-10 rounded-2xl bg-surface-container border-2 border-[#7C3AED] relative flex flex-col justify-between transform md:scale-[1.03] glass-card">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7C3AED] px-4 py-1.5 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              MOST POPULAR
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">Pro</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-on-surface">$12</span>
                <span className="text-on-surface-variant/60 text-sm">/month</span>
              </div>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm text-on-surface font-bold">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                  Unlimited Everything
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface font-bold">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                  Priority AI Tutor Access
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface font-bold">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                  Advanced Exam Prediction
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface font-bold">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                  Pomodoro Flow Analysis
                </li>
              </ul>
            </div>
            <button
              onClick={() => user ? navigate('/dashboard') : openAuthModal('signup')}
              className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold active:scale-95 transition-all cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Institution Card */}
          <div className="p-8 md:p-10 rounded-2xl border border-outline-variant/20 bg-surface-container/20 flex flex-col justify-between glass-card">
            <div>
              <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">Institution</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-on-surface">Custom</span>
              </div>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg">done</span>
                  SSO & Cohort Analytics
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg">done</span>
                  Campus-wide Deployment
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[#7C3AED] text-lg">done</span>
                  Dedicated support & LMS sync
                </li>
              </ul>
            </div>
            <button
              onClick={() => dispatch(showToast("📧 Institution sales form opened (Demo)."))}
              className="w-full py-4 border border-outline-variant/30 text-on-surface rounded-xl font-bold hover:bg-surface-container-high/60 active:scale-95 transition-all cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 px-6 relative z-10 border-t border-outline-variant/10">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[2.5rem] bg-gradient-to-br from-primary-container/20 via-surface-container/40 to-background border border-primary-container/20 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-container/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="font-headline text-4xl md:text-6xl font-extrabold mb-8 text-on-surface">Ready to fly?</h2>
          <p className="text-on-surface-variant text-lg mb-12 max-w-xl mx-auto">Join the world's most ambitious students using EduPilot AI to redefine their academic potential.</p>
          <button
            onClick={() => user ? navigate('/dashboard') : openAuthModal('signup')}
            className="px-12 py-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-lg active:scale-95 transition-all cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-outline-variant/10 pt-20 pb-12 bg-surface-container-lowest/80 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div style={{
                  width: "28px", height: "28px", borderRadius: "6px",
                  background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined text-white text-[15px]">rocket_launch</span>
                </div>
                <span className="font-headline text-xl font-bold text-on-surface">EduPilot</span>
              </div>
              <p className="text-on-surface-variant/70 text-sm leading-relaxed max-w-sm">
                Precision-engineered for academic excellence. We empower the next generation of thinkers with cutting-edge AI study tools.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); dispatch(showToast("🌐 Connecting to community web portal.")); }}
                  className="w-9 h-9 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-lg">public</span>
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); dispatch(showToast("📢 Sharing content portal.")); }}
                  className="w-9 h-9 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#7C3AED]">Product</h4>
                <ul className="space-y-3">
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#features">Features</a></li>
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#preview">Methodology</a></li>
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#pricing">Pricing</a></li>
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); openAuthModal('signup'); }}>Get Started</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#7C3AED]">Company</h4>
                <ul className="space-y-3">
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#" onClick={(e) => { e.preventDefault(); dispatch(showToast("EduPilot AI corporate information.")); }}>About Us</a></li>
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#" onClick={(e) => { e.preventDefault(); dispatch(showToast("EduPilot AI Ethics & Privacy Commitment.")); }}>AI Ethics</a></li>
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#" onClick={(e) => { e.preventDefault(); dispatch(showToast("EduPilot AI is growing! Apply within.")); }}>Careers</a></li>
                </ul>
              </div>
              <div className="space-y-4 col-span-2 lg:col-span-1">
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#7C3AED]">Support</h4>
                <ul className="space-y-3">
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>Help Center</a></li>
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#" onClick={(e) => { e.preventDefault(); dispatch(showToast("Loading Discord Community invitation.")); }}>Community</a></li>
                  <li><a className="text-on-surface-variant/70 text-sm hover:text-on-surface transition-colors" href="#" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/5 gap-6">
            <p className="text-on-surface-variant/40 text-[10px] uppercase tracking-widest font-bold">© 2026 EduPilot AI. All rights reserved.</p>
            <div className="flex gap-8">
              <a className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 hover:text-on-surface" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <a className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 hover:text-on-surface" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              <a className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 hover:text-on-surface" href="#" onClick={(e) => e.preventDefault()}>Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialTab={authModalTab} 
      />
    </div>
  );
}

