import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store';
import { useIsLight } from '../hooks/useIsLight';
import { ArrowRight, ArrowLeft, BookOpen, Check, Sparkles } from 'lucide-react';

const branchSubjects = {
  "Computer Science": ["Data Structures", "Discrete Mathematics", "Operating Systems", "Calculus II", "Digital Electronics", "Database Systems"],
  "Mechanical Engineering": ["Thermodynamics", "Materials Science", "Fluid Mechanics", "Engineering Maths", "Circuit Analysis", "Dynamics"],
  "Economics": ["Microeconomics", "Financial Accounting", "Macroeconomics", "Corporate Finance", "Business Statistics", "Marketing Principles"],
  "Biological Sciences": ["Cell Biology", "Genetics", "Organic Chemistry", "Biostatistics", "Microbiology", "Human Anatomy"],
  "Psychology": ["Introduction to Psychology", "Cognitive Psychology", "Social Psychology", "Developmental Psychology", "Research Methods", "Biopsychology"],
  "Fine Arts": ["Art History", "Drawing & Composition", "Painting I", "Sculpture", "Digital Arts", "Visual Design"]
};

const avatars = [
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6qcJskBiW5wj9vu0zm3se0UbWBny9LpmQvjIE07lxrXP9jeCBrGbsgUidnkh7Zm6HjfM8TUWDyD_hJZXBdZhJxdTlpW4v8Qu8fj-Fqd3rEeRLFz1pG-7t13j7oDoPqDtaV_HA41VDZnO5h-KIhFg8DA7RFhcJphrYHuLEsgmMtAmfm_b2goPUV-FRas4HmvvRIUtuNBIDB66eF26dCK7byIdz8xt0kyP4p5C-W28n-AgvDyeUvTYUOdAP_jCdQ8gv62fOX7PrVLpw', label: 'Tech Enthusiast' },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGokEqar_zcjnljMyMiXKahctzW54vjj4Pdxap6Cl5WRbNjnBkIa3moU88RTPJZkKcMLG_DCxwXqS0mRONRYKeO07ZLUvlzeJsrycjRIv5NpxIwH32EiVDWLPLRG37bJlQ6vSX-wKRE_WpHUeNbSEOvC_2gMEo-sFmn2Hfdc-mE8bi_4r_tPlG8IxLMLaHEjTWtTGXi7ze288DKAw_lWKzBanPoW-3lvah0bW58qovCxGDB9Yf-Eq3ghlyvRr9vHO_8vnhevks10XZ', label: 'Studious Thinker' },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM09jFUphbo7VFunnZtPaUhcoh6bpPcr42fyq4xRmkBkpzzmQKv73VIAcZAwquHTsjUMeFVxa3pewsOhr1qZ8g_RC8uurnmq_mIGi7mlIjqB5YI9LZw_aYEvE5JWxYAxiog1PLRil1kYBCpnP5PolCdvHB4AFIqnb602U0sbaEQQBYU56G7BPF1uKeUh17rSMGM7WwHzNEU_wLReMmBttnzqX-0M1TJouMpNNx-EMCtpur6jt1e4uPULdM4zgp_B_EJLpwaghNwHpC', label: 'SaaS Innovator' },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCGLrRjz4zVY0StSb833lWPCGKzdn9xKWnffa7MbOVP-oo_8ygQR9iz4WD52wL2HoSGctlpD9UOrmEufgY5QQBpZGu8X_ZOULFYLXNLu-OCo0Hxvw6qLS9LGlS_nc4pmHxE4Zhi27empQQmqDaIZYLfWjLMwFnhxNq0Z_Yiz001tIqtoVPp_n1SoXCFsAXuQhv4nFUh8SkchIPYoGJVd4y2o4Nchh2ZoxLYZTDGoGLKiBMDecU1Fb5_6UaXrBNZTt3mxvAHghN1hN5', label: 'Creative Academic' },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOCAJPy-rhYGfAbbbgg_7rDZI9v8ANrwfFyeIJ_elaPtn5iZzEm-gehYbPc7RI5LIFWCF_KArhjqwcVnzzusyo1EJz-otcC3t3r74fuhBM--KeEmU-Auj1i-dyrBvs89fKCqg9vfZKoptb2lAc_GFkH38xZDkv8gGGjX82AY2VFz_TSOT8YY-8liY0HR1xYRUmeX_n6Bw7nybmZA-fgZ5xTBv_nqd9JsoRVNUgR8FJlT30PcikeFtwH8T7KkaU5mxJtcUy-x_ZhOp-', label: 'AI Pilot' },
  { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGCS_U1RWCPi0Azp7ySffDmEmqrMwA0bBVXDrjJ_A_SQI-ORp5DWjDgdOJa6uBWlLA16tqN_P4yVEB7E97isqYhGyLG8xoFzXqWnfAdl2Slo7v3PH4gusjXKvu4XregfrKlMLzcnjrqfIj4a7SraQ50TC4MBSaPN6RgtTHUmaslSKF8bEv_jgm7Q4gqrk2BXonuoJreZjbXm77V72aAJjKmCpfZ6wBgVr5MexNehATEWixHqUndvQlhNfsbfRPg0-JZi8_65VreiYM', label: 'Deep Researcher' }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLight = useIsLight();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // States
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science');
  const [year, setYear] = useState(user?.year || '1st Year');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || avatars[0].url);
  const [selectedSubjects, setSelectedSubjects] = useState(user?.selectedSubjects || []);
  const [studyHours, setStudyHours] = useState(user?.studyHours || 15);
  const [gradeGoal, setGradeGoal] = useState(user?.gradeGoal || 'A');
  const [focusSession, setFocusSession] = useState(user?.focusSession || 'Morning');

  // Interactive mouse-glow effect for atmospheric violet orbs
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 50,
        y: (e.clientY / window.innerHeight - 0.5) * 50,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(prev => prev.filter(s => s !== subject));
    } else {
      setSelectedSubjects(prev => [...prev, subject]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Save onboarding preferences to user profile in Redux
      dispatch(updateUser({
        name,
        university,
        branch,
        year,
        avatar: selectedAvatar,
        selectedSubjects,
        studyHours,
        gradeGoal,
        focusSession,
        onboardingCompleted: true
      }));
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const availableSubjects = branchSubjects[branch] || [];

  // Hours commitment level labels
  const getCommitmentLabel = (hours) => {
    if (hours <= 10) return 'Casual Student';
    if (hours <= 20) return 'Consistent Revisionist';
    if (hours <= 30) return 'Dedicated Academic';
    return 'Deep Work Scholar';
  };

  return (
    <div
      className={isLight ? "light-theme" : ""}
      style={{
        backgroundColor: isLight ? "#f7f5fa" : "#0D0B1A",
        minHeight: "100vh",
        color: isLight ? "#1a1523" : "#e8dfee",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        transition: "background-color 0.3s ease, color 0.3s ease"
      }}
    >
      {/* Dynamic Style variables block */}
      <style>{`
        .dot-grid {
          background-image: radial-gradient(${isLight ? 'rgba(124, 58, 237, 0.05)' : 'rgba(124, 58, 237, 0.15)'} 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .violet-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, ${isLight ? 'rgba(124, 58, 237, 0.06)' : 'rgba(124, 58, 237, 0.12)'} 0%, rgba(124, 58, 237, 0) 70%);
          border-radius: 50%;
          filter: blur(60px);
          z-index: 1;
          pointer-events: none;
        }
        .ai-glow-border {
          position: relative;
          z-index: 5;
        }
        .ai-glow-border::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, #7c3aed, #67e8f9);
          border-radius: inherit;
          z-index: -1;
          opacity: 0.25;
          transition: opacity 0.3s ease;
        }
        .ai-glow-border:focus-within::after {
          opacity: 0.9;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
        }
        .glass-card {
          background: ${isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(34, 30, 40, 0.8)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${isLight ? 'rgba(122, 117, 129, 0.2)' : 'rgba(74, 68, 85, 0.6)'};
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .custom-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237a7581'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25em;
        }
      `}</style>

      {/* Atmospheric Orbs */}
      <div className="violet-orb top-[-10%] left-[-10%] dot-grid" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}></div>
      <div className="violet-orb bottom-[-10%] right-[-10%]" style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}></div>

      {/* Top Header / Shell */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30 h-16">
        <div className="flex justify-between items-center px-6 h-full max-w-[1440px] mx-auto w-full">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <span className="font-headline text-lg font-bold text-on-surface">EduPilot AI</span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-6">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${s === step
                    ? 'bg-primary ring-4 ring-primary/20 scale-110'
                    : s < step
                      ? 'bg-primary'
                      : 'bg-surface-container-highest'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Step {step} of 4</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-24 pb-12 w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">

        {/* Floating avatar preview only on profile setup steps */}
        {step === 1 && (
          <div className="relative mb-6 group flex justify-center z-10">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl shadow-primary-container/20 animate-float">
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
                <img alt="Active Avatar" className="w-full h-full object-cover" src={selectedAvatar} />
              </div>
            </div>
            <span className="material-symbols-outlined absolute -top-1 right-2 text-primary text-3xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            {step === 1 && "Let's set up your profile"}
            {step === 2 && "Select Active Subjects"}
            {step === 3 && "Set Weekly Goals"}
            {step === 4 && "Your Academic Suite is Ready!"}
          </h1>
          <p className="font-body text-sm md:text-base text-on-surface-variant max-w-lg mx-auto">
            {step === 1 && "Tell us about yourself so we can personalize your AI academic experience."}
            {step === 2 && "Choose the modules you're focusing on this semester to track schedules."}
            {step === 3 && "Fine-tune your revision hours and target grades for performance insights."}
            {step === 4 && "Review your customized profile summary below before entering the hub."}
          </p>
        </div>

        {/* Wizard Form Card */}
        <section className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 md:p-10 shadow-2xl glass-card relative overflow-hidden">

          {/* STEP 1: Academic Profile */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                  <div className="ai-glow-border rounded-xl">
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface placeholder:text-outline/40 focus:ring-0 text-sm font-medium outline-none"
                      placeholder="e.g. Alex Rivera"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* University */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">University / Institution</label>
                  <div className="ai-glow-border rounded-xl">
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface placeholder:text-outline/40 focus:ring-0 text-sm font-medium outline-none"
                      placeholder="e.g. Stanford University"
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Branch */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Branch / Major</label>
                  <div className="ai-glow-border rounded-xl">
                    <select
                      className="w-full custom-select bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-0 text-sm font-medium cursor-pointer outline-none"
                      value={branch}
                      onChange={(e) => {
                        setBranch(e.target.value);
                        setSelectedSubjects([]); // Reset subjects on branch switch
                      }}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Economics">Economics</option>
                      <option value="Biological Sciences">Biological Sciences</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Fine Arts">Fine Arts</option>
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Year</label>
                  <div className="ai-glow-border rounded-xl">
                    <select
                      className="w-full custom-select bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-0 text-sm font-medium cursor-pointer outline-none"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year (Master's)">5th Year (Master's)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Avatar Grid selection */}
              <div className="pt-4 border-t border-outline-variant/15">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-3">Choose your AI Persona</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {avatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(av.url)}
                      title={av.label}
                      className={`w-full aspect-square rounded-full border-2 overflow-hidden hover:scale-105 active:scale-95 transition-all cursor-pointer ${selectedAvatar === av.url
                        ? 'border-primary ring-4 ring-primary/20 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img alt={av.label} className="w-full h-full object-cover" src={av.url} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Subject Selector */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-on-surface-variant">Recommended subjects for <span className="text-primary font-bold">{branch}</span>:</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {availableSubjects.map((subject) => {
                  const isSelected = selectedSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      onClick={() => handleToggleSubject(subject)}
                      type="button"
                      className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${isSelected
                        ? 'bg-primary-container/20 border-primary text-primary shadow-lg shadow-primary-container/10'
                        : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                    >
                      {isSelected ? <Check className="w-4 h-4 text-primary" /> : <BookOpen className="w-4 h-4 opacity-50" />}
                      {subject}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-outline-variant/15">
                <p className="text-xs text-outline italic flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Don't see all your subjects? You can add customized ones inside your planner anytime.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Goals Setup */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">

              {/* Weekly study hours */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span className="uppercase tracking-wider">Weekly Study Commitment</span>
                  <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">{studyHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={studyHours}
                  onChange={(e) => setStudyHours(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-wider">
                  <span>5 Hours (Casual)</span>
                  <span className="text-primary-container">{getCommitmentLabel(studyHours)}</span>
                  <span>40 Hours (Deep Work)</span>
                </div>
              </div>

              {/* Study focus session */}
              <div className="space-y-3 pt-4 border-t border-outline-variant/15">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Preferred Focus Session</label>
                <div className="flex gap-2">
                  {['Morning', 'Afternoon', 'Night'].map((session) => (
                    <button
                      key={session}
                      type="button"
                      onClick={() => setFocusSession(session)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${focusSession === session
                        ? 'bg-primary-container text-on-white-container border-primary/30 shadow-md'
                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
                        }`}
                    >
                      {session}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Target */}
              <div className="space-y-3 pt-4 border-t border-outline-variant/15">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Target Grade Average</label>
                <div className="grid grid-cols-4 gap-3">
                  {['A+', 'A', 'B', 'C'].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setGradeGoal(grade)}
                      className={`py-3.5 rounded-xl border font-bold text-sm transition-all cursor-pointer ${gradeGoal === grade
                        ? 'bg-primary-container text-on-white-container border-primary/30 shadow-md'
                        : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Ready (Confirmation Screen) */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">

                {/* Accent design glows */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary to-cyan-400 opacity-20 blur-xl rounded-full"></div>

                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 shadow-xl shrink-0">
                  <img alt="Profile avatar" className="w-full h-full object-cover" src={selectedAvatar} />
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">{name || 'Khushi'}</h3>
                  <p className="text-on-surface-variant text-sm font-medium">{university || 'Academic Student'}</p>
                  <span className="inline-block px-3 py-1 bg-secondary-container/40 text-on-secondary-container border border-secondary/20 rounded-full text-xs font-bold tracking-wide">
                    {branch.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Preferences Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
                  <span className="block text-outline text-[10px] font-bold uppercase tracking-wider mb-1">Academic Year</span>
                  <span className="text-on-surface font-bold text-sm">{year}</span>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
                  <span className="block text-outline text-[10px] font-bold uppercase tracking-wider mb-1">Weekly Target</span>
                  <span className="text-on-surface font-bold text-sm">{studyHours} Hours</span>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
                  <span className="block text-outline text-[10px] font-bold uppercase tracking-wider mb-1">Grade Goal</span>
                  <span className="text-primary font-bold text-sm">{gradeGoal}</span>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
                  <span className="block text-outline text-[10px] font-bold uppercase tracking-wider mb-1">Subjects Tracked</span>
                  <span className="text-on-surface font-bold text-sm">{selectedSubjects.length} Courses</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="flex justify-center gap-8 pt-4 border-t border-outline-variant/15 opacity-60">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
                  <span className="material-symbols-outlined text-sm text-primary">school</span>
                  <span>Syllabus Tracking</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
                  <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                  <span>AI Assistance</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
                  <span className="material-symbols-outlined text-sm text-primary">terminal</span>
                  <span>Command Center</span>
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-between pt-6 mt-8 border-t border-outline-variant/15">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-5 py-3 bg-transparent text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 text-sm font-bold disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={step === 1 && (!name.trim() || !university.trim())}
              className="px-6 py-3 bg-primary-container text-on-primary-container font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary-container/20 hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              {step === 4 ? 'Launch Command Center' : 'Continue'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
