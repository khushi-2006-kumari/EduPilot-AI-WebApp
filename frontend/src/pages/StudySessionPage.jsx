import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setFocusType } from '../store/slices/studySlice';
import { showToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

/* ─── Dual-mode colour palettes ─── */
const DARK = {
  bg:               '#0D0B1A',
  surface:          '#15121b',
  surfaceContainer: '#221e28',
  surfaceHigh:      '#2c2833',
  surfaceHighest:   '#37333e',
  primary:          '#7C3AED',
  primaryDim:       '#d2bbff',
  onSurface:        '#e8dfee',
  onSurfaceVar:     '#ccc3d8',
  outlineVar:       '#4a4455',
  cardBg:           'rgba(22,20,38,0.75)',
  glassBorder:      'rgba(149,141,161,0.12)',
  inputBg:          '#0D0B1A',
  aiCardBg:         'rgba(124,58,237,0.07)',
  aiCardBorder:     'rgba(124,58,237,0.22)',
  tipBg:            'rgba(255,255,255,0.03)',
};

const LIGHT = {
  bg:               '#ffffff',
  surface:          '#f7f5fa',
  surfaceContainer: '#eae6ef',
  surfaceHigh:      '#e2dce9',
  surfaceHighest:   '#d9d2e0',
  primary:          '#7C3AED',
  primaryDim:       '#5a00c6',
  onSurface:        '#1a1523',
  onSurfaceVar:     '#4a4455',
  outlineVar:       '#c2bac9',
  cardBg:           'rgba(255,255,255,0.9)',
  glassBorder:      'rgba(122,117,129,0.22)',
  inputBg:          '#ffffff',
  aiCardBg:         'rgba(124,58,237,0.05)',
  aiCardBorder:     'rgba(124,58,237,0.2)',
  tipBg:            'rgba(124,58,237,0.04)',
};

const SESSION_TYPES = [
  { id: 'pomodoro', label: 'Pomodoro',      icon: 'timer',               desc: '25 min work + 5 min break cycles',  color: '#7C3AED', focusKey: 'pomodoro' },
  { id: 'deepwork', label: 'Deep Work',     icon: 'center_focus_strong', desc: 'Long uninterrupted focus block',    color: '#0891b2', focusKey: 'long'     },
  { id: 'revision', label: 'Revision',      icon: 'history_edu',         desc: 'Active recall & spaced repetition', color: '#16a34a', focusKey: 'short'    },
  { id: 'mock',     label: 'Mock Practice', icon: 'quiz',                desc: 'Timed test simulation',             color: '#be185d', focusKey: 'pomodoro' },
];

const SUBJECTS = [
  'Biology', 'Advanced Calculus', 'Physics II', 'World Literature',
  'Chemistry', 'History', 'Computer Science', 'Economics',
];

// We will compute STATS dynamically inside the component

export default function StudySessionPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isLight   = useIsLight();
  const C         = isLight ? LIGHT : DARK;

  const prefill = location.state || {};
  const { streakCount, studyStats, recentSessions } = useSelector(state => state.study);

  const dynamicStats = [
    { icon: 'local_fire_department', label: 'Weekly Streak', value: streakCount, unit: 'days',  color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
    { icon: 'schedule',              label: 'Total Hours',   value: studyStats.totalHours, unit: 'hrs',   color: '#0891b2', bg: 'rgba(8,145,178,0.1)' },
    { icon: 'emoji_events',          label: 'Sessions Done', value: studyStats.sessionsDone, unit: 'total', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { icon: 'trending_up',           label: 'Avg. Focus',    value: studyStats.avgFocus, unit: '%',     color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  ];

  const [sessionName,  setSessionName]  = useState(prefill.topic ? `${prefill.topic} Session` : '');
  const [subject,      setSubject]      = useState(prefill.subject || '');
  const [topic,        setTopic]        = useState(prefill.topic || '');
  const [goal,         setGoal]         = useState('');
  const [selectedType, setSelectedType] = useState(prefill.type || 'pomodoro');
  const [rounds,       setRounds]       = useState(4);

  useEffect(() => {
    if (location.state) {
      if (prefill.subject) setSubject(prefill.subject);
      if (prefill.topic) {
        setTopic(prefill.topic);
        setSessionName(`${prefill.topic} Session`);
      }
      if (prefill.type) setSelectedType(prefill.type);
    }
  }, [location.state]);

  const totalMinutes = rounds * 30;

  const handleStart = () => {
    if (!sessionName.trim()) {
      dispatch(showToast('Please enter a session name first.'));
      return;
    }
    const sessionDef = SESSION_TYPES.find(t => t.id === selectedType);
    dispatch(setFocusType(sessionDef?.focusKey || 'pomodoro'));
    
    // Pass session details to Redux
    dispatch({
      type: 'study/setActiveSession',
      payload: {
        sessionName,
        subject: subject || 'General',
        topic: topic || sessionName,
        goal,
        selectedType,
        totalMinutes
      }
    });

    dispatch(showToast(`🚀 "${sessionName}" session started!`));
    navigate('/focus');
  };

  /* ── Shared style builders ── */
  const card = {
    background: C.cardBg,
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: `1px solid ${C.glassBorder}`,
    borderRadius: 18,
    transition: 'background 0.25s',
  };

  const inputStyle = {
    width: '100%',
    background: C.inputBg,
    border: `1px solid ${C.outlineVar}`,
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 14,
    color: C.onSurface,
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: C.onSurfaceVar,
    marginBottom: 8,
  };

  const onFocusInput = e => {
    e.target.style.borderColor = C.primary;
    e.target.style.boxShadow   = `0 0 0 3px ${C.primary}22`;
  };
  const onBlurInput  = e => {
    e.target.style.borderColor = C.outlineVar;
    e.target.style.boxShadow   = 'none';
  };

  return (
    <div style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif", transition: 'color 0.25s' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 22 }}>timer</span>
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: C.onSurface }}>
            New Study Session
          </h1>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(124,58,237,0.12)', color: isLight ? '#5a00c6' : '#d2bbff', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>auto_awesome</span>
            AI Ready
          </span>
        </div>
        <p style={{ color: C.onSurfaceVar, fontSize: 15, marginTop: 4 }}>
          Configure and launch a focused study session tailored to your goals.
        </p>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {dynamicStats.map(stat => (
          <div key={stat.label} style={{ ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 22 }}>{stat.icon}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 700, color: C.onSurface }}>{stat.value}</span>
                <span style={{ fontSize: 11, color: stat.color, fontWeight: 700 }}>{stat.unit}</span>
              </div>
              <p style={{ fontSize: 11, color: C.onSurfaceVar, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>

        {/* LEFT: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Session Details Card */}
          <div style={{ ...card, border: '1px solid rgba(124,58,237,0.35)', boxShadow: '0 0 18px rgba(124,58,237,0.08)', padding: 28 }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, margin: '0 0 24px 0', color: C.onSurface, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 20 }}>edit_note</span>
              Session Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Session Name */}
              <div>
                <label style={labelStyle}>Session Name</label>
                <input
                  value={sessionName}
                  onChange={e => setSessionName(e.target.value)}
                  placeholder="e.g. Chapter 3 Revision"
                  style={inputStyle}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </div>

              {/* Subject & Topic */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: 36 }}
                      onFocus={onFocusInput}
                      onBlur={onBlurInput}
                    >
                      <option value="">Select subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: C.onSurfaceVar, pointerEvents: 'none', fontSize: 18 }}>expand_more</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Topic</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Newton's Laws"
                    style={inputStyle}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
              </div>

              {/* Goal */}
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Goal for this session</label>
                <textarea
                  value={goal}
                  onChange={e => setGoal(e.target.value.slice(0, 150))}
                  placeholder="What do you want to achieve?"
                  rows={3}
                  style={{ ...inputStyle, resize: 'none', paddingBottom: 28, lineHeight: 1.6 }}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
                <span style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 10, color: C.onSurfaceVar, fontWeight: 700 }}>
                  {goal.length}/150
                </span>
              </div>
            </div>
          </div>

          {/* Pomodoro Rounds Card */}
          {selectedType === 'pomodoro' && (
            <div style={{ ...card, padding: 24 }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', color: C.onSurface, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 18 }}>schedule</span>
                Pomodoro Rounds
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button
                    onClick={() => setRounds(r => Math.max(1, r - 1))}
                    style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.outlineVar}`, background: C.surfaceContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onSurface, cursor: 'pointer', fontSize: 20, fontWeight: 700 }}
                    onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
                    onMouseLeave={e => e.currentTarget.style.background = C.surfaceContainer}
                  >−</button>
                  <div style={{ textAlign: 'center', minWidth: 48 }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 700, color: C.onSurface }}>{rounds}</span>
                    <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.onSurfaceVar, fontWeight: 700, margin: 0 }}>Rounds</p>
                  </div>
                  <button
                    onClick={() => setRounds(r => Math.min(12, r + 1))}
                    style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.outlineVar}`, background: C.surfaceContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onSurface, cursor: 'pointer', fontSize: 20, fontWeight: 700 }}
                    onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
                    onMouseLeave={e => e.currentTarget.style.background = C.surfaceContainer}
                  >+</button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 13, color: C.onSurfaceVar, margin: '0 0 4px 0' }}>Total: <span style={{ color: C.onSurface, fontWeight: 700 }}>{totalMinutes} min</span></p>
                  <p style={{ fontSize: 11, color: C.primary, margin: 0, fontWeight: 700 }}>25 min work + 5 min break</p>
                </div>
              </div>
              {/* Visual pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                {Array.from({ length: rounds }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 3 }}>
                    <div style={{ width: 28, height: 8, borderRadius: 999, background: C.primary, opacity: 0.8 }} />
                    <div style={{ width: 10, height: 8, borderRadius: 999, background: '#0891b2', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: C.onSurfaceVar, margin: '10px 0 0 0' }}>
                <span style={{ background: `${C.primary}20`, padding: '2px 7px', borderRadius: 4, marginRight: 6, color: C.primary }}>■ Work</span>
                <span style={{ background: 'rgba(8,145,178,0.15)', padding: '2px 7px', borderRadius: 4, color: '#0891b2' }}>■ Break</span>
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Session Type + AI Tips + CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Session Type */}
          <div style={{ ...card, padding: 28 }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, margin: '0 0 20px 0', color: C.onSurface, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 20 }}>category</span>
              Session Type
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SESSION_TYPES.map(t => {
                const active = selectedType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '14px 18px', borderRadius: 12,
                      border: active ? `1.5px solid ${t.color}70` : `1px solid ${C.outlineVar}`,
                      background: active ? `${t.color}12` : C.surfaceContainer,
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'all 0.15s ease',
                      boxShadow: active ? `0 0 14px ${t.color}22` : 'none',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.surfaceHigh; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = C.surfaceContainer; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: active ? `${t.color}20` : C.surfaceHighest, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ color: active ? t.color : C.onSurfaceVar, fontSize: 20 }}>{t.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: active ? C.onSurface : C.onSurfaceVar, margin: '0 0 2px 0' }}>{t.label}</p>
                      <p style={{ fontSize: 12, color: C.onSurfaceVar, margin: 0 }}>{t.desc}</p>
                    </div>
                    {active && (
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#fff' }}>check</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Recommendations */}
          <div style={{ background: C.aiCardBg, border: `1px solid ${C.aiCardBorder}`, borderRadius: 18, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 20 }}>auto_awesome</span>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, margin: 0, color: C.onSurface }}>AI Recommendations</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: 'lightbulb',   text: 'Best time for deep work: 9–11 AM based on your past patterns.',    color: '#ea580c' },
                { icon: 'trending_up', text: "You're 18% more productive when goals are written beforehand.",      color: '#16a34a' },
                { icon: 'timer',       text: 'Pomodoro works best for your revision-heavy subjects.',              color: C.primary },
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: C.tipBg, borderRadius: 10, padding: '10px 12px', border: `1px solid ${C.glassBorder}` }}>
                  <span className="material-symbols-outlined" style={{ color: tip.color, fontSize: 16, marginTop: 1, flexShrink: 0 }}>{tip.icon}</span>
                  <p style={{ fontSize: 12, color: C.onSurfaceVar, margin: 0, lineHeight: 1.5 }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => { setSessionName(''); setSubject(''); setTopic(''); setGoal(''); setRounds(4); }}
              style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1px solid ${C.outlineVar}`, background: C.surfaceContainer, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surfaceHigh; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.surfaceContainer; }}
            >
              Reset
            </button>
            <button
              onClick={handleStart}
              style={{ flex: 2, padding: '14px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'scale(1.01)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Start Session
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── RECENT SESSIONS ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700, margin: 0, color: C.onSurface }}>Recent Sessions</h2>
          <button onClick={() => dispatch(showToast('📊 Loading all sessions...'))} style={{ fontSize: 13, fontWeight: 700, color: C.primary, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </button>
        </div>
        {recentSessions.length === 0 ? (
          <div style={{ ...card, padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: C.outlineVar, marginBottom: 16 }}>history</span>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.onSurface }}>No recent sessions</h3>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: C.onSurfaceVar }}>Start a new session above to begin tracking your progress.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {recentSessions.map((s, i) => (
              <div key={i} style={{ ...card, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ background: s.subjectBg, color: s.subjectColor, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' }}>{s.subject}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: C.surfaceContainer, padding: '4px 8px', borderRadius: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12, color: C.onSurfaceVar }}>{s.typeIcon}</span>
                    <span style={{ fontSize: 10, color: C.onSurfaceVar, fontWeight: 700 }}>{s.type}</span>
                  </div>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 15, color: C.onSurface, margin: '0 0 6px 0', lineHeight: 1.3 }}>{s.topic}</h4>
                <p style={{ fontSize: 12, color: C.onSurfaceVar, margin: '0 0 14px 0' }}>{s.date}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <span style={{ color: C.onSurfaceVar }}>Completion</span>
                  <span style={{ color: s.progress === 100 ? '#16a34a' : C.primary }}>{s.progress}%</span>
                </div>
                <div style={{ height: 5, width: '100%', background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.progress}%`, background: s.progress === 100 ? 'linear-gradient(to right,#16a34a,#0891b2)' : `linear-gradient(to right,${C.primary},#a78bfa)`, borderRadius: 999 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontSize: 12, color: C.onSurfaceVar, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span>
                    {s.duration}
                  </span>
                  <button
                    onClick={() => { setSessionName(`${s.topic} Revision`); setSubject(s.subject); setTopic(s.topic); dispatch(showToast(`🔁 Loaded: ${s.topic}`)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: `${C.primary}15`, border: 'none', padding: '4px 12px', borderRadius: 8, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = `${C.primary}28`}
                    onMouseLeave={e => e.currentTarget.style.background = `${C.primary}15`}
                  >
                    Repeat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
