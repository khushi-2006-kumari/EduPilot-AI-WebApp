import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  bg: '#0D0B1A',
  surface: '#15121b',
  surfaceLow: '#1d1a24',
  surfaceContainer: '#221e28',
  surfaceHigh: '#26223D',
  surfaceHighest: '#37333e',
  primary: '#7C3AED',
  secondary: '#cebdff',
  onSurface: '#e8dfee',
  onSurfaceVar: '#958da1',
  outlineVar: '#4a4455',
  error: '#ffb4ab',
  cardBg: 'rgba(30,26,46,0.45)',
  cardBorder: 'rgba(124,58,237,0.15)',
  aiCardBorder: 'rgba(124,58,237,0.3)',
};

const LIGHT = {
  bg: '#ffffff',
  surface: '#f7f5fa',
  surfaceLow: '#f0ecf5',
  surfaceContainer: '#eae6ef',
  surfaceHigh: '#e2dce9',
  surfaceHighest: '#d9d2e0',
  primary: '#7C3AED',
  secondary: '#4f319c',
  onSurface: '#1a1523',
  onSurfaceVar: '#4a4455',
  outlineVar: '#c2bac9',
  error: '#690005',
  cardBg: 'rgba(255, 255, 255, 0.7)',
  cardBorder: 'rgba(122,117,129,0.2)',
  aiCardBorder: 'rgba(124,58,237,0.2)',
};

const todaySessions = [
  { time: '09:00 AM', subject: 'Data Structures', duration: '2h 00m', color: '#22d3ee', border: '#06b6d4' },
  { time: '11:00 AM', subject: 'Mathematics IV', duration: '1h 30m', color: '#4ade80', border: '#22c55e' },
  { time: '02:00 PM', subject: 'Digital Electronics', duration: '1h 30m', color: '#f472b6', border: '#ec4899' },
  { time: '04:00 PM', subject: 'Revision Block', duration: '1h 00m', color: '#A78BFA', border: '#7C3AED', isAI: true },
];

export default function StudyPlannerPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLight = useIsLight();
  const colors = isLight ? LIGHT : DARK;
  
  const generatedPlan = useSelector(state => state.study.generatedPlan);

  const [studyHours, setStudyHours] = React.useState(6.5);
  const [preferences, setPreferences] = React.useState({
    morningFocus: true,
    difficultySpike: true,
    breakReminders: false
  });

  const S = {
    page: { color: colors.onSurface, fontFamily: "'Inter', sans-serif" },
    card: { background: colors.cardBg, backdropFilter: 'blur(12px)', border: `1px solid ${colors.cardBorder}`, borderRadius: 16, padding: 24 },
    aiCard: { background: colors.cardBg, backdropFilter: 'blur(12px)', border: `1px solid ${colors.aiCardBorder}`, boxShadow: '0 0 20px rgba(124,58,237,0.08)', borderRadius: 16, padding: 24 },
    cardTitle: { fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: colors.onSurface, margin: 0 },
  };

  const weekDays = [
    { day: 'Mon', date: 23, dot: '#22d3ee', done: true },
    { day: 'Tue', date: 24, dot: '#fff', active: true },
    { day: 'Wed', date: 25, dot: '#4ade80', done: false },
    { day: 'Thu', date: 26, dot: '#f472b6', done: false },
    { day: 'Fri', date: 27, dot: '#22d3ee', done: false },
    { day: 'Sat', date: 28, dot: '#A78BFA', done: false },
    { day: 'Sun', date: 29, dot: null, done: false },
  ];

  const dynamicExamCards = generatedPlan?.units?.map((u, i) => ({
    subject: u.label.split(': ')[1] || u.label,
    days: `${10 + i * 5} Days Left`,
    color: i === 0 ? '#7C3AED' : i === 1 ? '#cebdff' : colors.onSurfaceVar,
    pct: i === 0 ? 85 : i === 1 ? 45 : 10
  })) || [
    { subject: 'Discrete Math', days: '12 Days Left', color: '#7C3AED', pct: 85 },
    { subject: 'Data Structures', days: '19 Days Left', color: '#cebdff', pct: 45 },
    { subject: 'Digital Sys', days: '24 Days Left', color: colors.onSurfaceVar, pct: 10 },
  ];

  const dynamicUpcomingExams = generatedPlan?.units?.map((u, i) => ({
    date: `Jun ${15 + i * 3}`, 
    name: u.label.split(': ')[1] || u.label,
    days: `${8 + i * 3} Days`,
    color: i === 0 ? '#7C3AED' : i === 1 ? '#cebdff' : colors.onSurfaceVar,
    covered: `${i === 0 ? 12 : i === 1 ? 4 : 1}/${u.count.split(' ')[0] || 10}`,
    pct: i === 0 ? 85 : i === 1 ? 40 : 5,
    dim: i > 1
  })) || [
    { date: 'Jun 15', name: 'Discrete Mathematics', days: '8 Days', color: '#7C3AED', covered: '12/14', pct: 85 },
    { date: 'Jun 18', name: 'Data Structures Midterm', days: '11 Days', color: '#cebdff', covered: '4/10', pct: 40 },
    { date: 'Jun 22', name: 'Digital Systems Final', days: '15 Days', color: colors.onSurfaceVar, covered: '1/14', pct: 5, dim: true },
  ];

  const dynamicTodaySessions = generatedPlan?.units?.[0]?.topics?.length ? 
    generatedPlan.units[0].topics.slice(0, 4).map((t, i) => ({
      time: `${9 + i * 2}:00 AM`, 
      subject: t.name, 
      duration: t.time || '1h 30m', 
      color: t.color || '#A78BFA', 
      border: t.color || '#7C3AED', 
      isAI: true
    })) : todaySessions;

  const weeklyGoals = generatedPlan?.roadmap?.slice(0, 3).map(r => r.title) || [
    'Master Graph Algorithms', 'Complete Math Problem Set', 'Review Logic Gate Optimizations'
  ];
  return (
    <div style={S.page}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 800, color: colors.onSurface, margin: 0, letterSpacing: '-0.02em' }}>Study Planner</h2>
            <p style={{ color: colors.onSurfaceVar, fontSize: 16, marginTop: 8 }}>Your AI-generated personalized study schedule</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ background: 'rgba(124,58,237,0.2)', color: '#7C3AED', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(124,58,237,0.3)' }}>AI GENERATED</span>
            <span style={{ color: colors.onSurfaceVar, fontSize: 14, fontWeight: 500 }}>Week 3 of 12</span>
            <button style={{ background: colors.surfaceContainer, border: `1px solid ${colors.outlineVar}`, color: colors.onSurface, padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = colors.surfaceHigh}
              onMouseLeave={e => e.currentTarget.style.background = colors.surfaceContainer}
              onClick={() => dispatch(showToast('Regenerating study plan... Personalized roadmap updated!'))}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
              Regenerate Plan
            </button>
          </div>
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8" style={{ width: '100%' }}>
        {/* Left: Weekly Calendar + Today's Schedule */}
        <div className="xl:col-span-3 flex flex-col gap-6" style={{ minWidth: 0 }}>
          {/* This Week */}
          <div style={S.aiCard}>
            <h3 style={{ ...S.cardTitle, marginBottom: 16 }}>This Week</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
              {weekDays.map(d => (
                <div key={d.day} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '8px 4px', borderRadius: 8,
                  background: d.active ? '#7C3AED' : colors.surfaceContainer,
                  color: d.active ? '#fff' : undefined, position: 'relative',
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: d.active ? '#fff' : colors.onSurfaceVar }}>{d.day}</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{d.date}</span>
                  {d.done ? (
                    <span className="material-symbols-outlined" style={{ fontSize: 12, color: d.active ? '#fff' : '#7C3AED' }}>check</span>
                  ) : d.dot ? (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.dot }} />
                  ) : <div style={{ height: 6 }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div style={{ ...S.card, flex: 1 }}>
            <h3 style={{ ...S.cardTitle, marginBottom: 24 }}>Today's Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {dynamicTodaySessions.map((s, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: 20, borderLeft: `4px solid ${s.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', background: `${s.border}1a`, color: s.color, borderRadius: 4, textTransform: 'uppercase' }}>{s.duration}</span>
                    <input type="checkbox" style={{ accentColor: '#7C3AED' }} />
                  </div>
                  <p style={{ fontSize: 10, color: colors.onSurfaceVar, fontWeight: 700, marginBottom: 4 }}>{s.time}</p>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: s.isAI ? s.color : colors.onSurface, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s.isAI && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span>}
                    {s.subject}
                  </h4>
                  <button onClick={() => { dispatch(showToast(`⏰ Starting: ${s.subject}`)); navigate('/session'); }} style={{ width: '100%', padding: '6px', borderRadius: 8, background: s.isAI ? '#7C3AED' : `${s.border}1a`, color: s.isAI ? '#fff' : s.color, fontSize: 10, fontWeight: 700, border: s.isAI ? 'none' : `1px solid ${s.border}4d`, cursor: 'pointer' }}>
                    Start Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: AI Plan Overview */}
        <div className="xl:col-span-5" style={{ ...S.aiCard, minWidth: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ ...S.cardTitle, fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              AI Plan Overview
              <span style={{ background: 'rgba(124,58,237,0.2)', color: '#7C3AED', fontSize: 10, padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(124,58,237,0.3)', textTransform: 'uppercase' }}>Adaptive</span>
            </h3>
            <p style={{ fontSize: 12, color: colors.onSurfaceVar, marginTop: 4 }}>Real-time learning path adaptation</p>
          </div>

          {/* Exam Countdowns */}
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }}>
            {dynamicExamCards.map(ec => (
              <div key={ec.subject} style={{ minWidth: 180, background: colors.surfaceContainer, padding: 16, borderRadius: 12, border: `1px solid ${colors.outlineVar}`, flexShrink: 0 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: colors.onSurfaceVar, textTransform: 'uppercase', marginBottom: 4 }}>{ec.subject}</p>
                <h4 style={{ fontFamily: "'Inter'", fontSize: 18, fontWeight: 700, color: ec.color, margin: '0 0 12px 0' }}>{ec.days}</h4>
                <div style={{ width: '100%', height: 4, background: colors.outlineVar, borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${ec.pct}%`, background: ec.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Goals */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, background: 'rgba(124,58,237,0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(124,58,237,0.1)', marginBottom: 24 }}>
            <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
              <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                <circle className="text-surface-container-high" cx="18" cy="18" r="16" fill="none" stroke={colors.outlineVar} strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#7C3AED" strokeDasharray="66, 100" strokeLinecap="round" strokeWidth="4" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>4/6</div>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7C3AED', marginBottom: 12 }}>Weekly Goals</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {weeklyGoals.map((g, index) => (
                  <label key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <input type="checkbox" defaultChecked={index < 2} style={{ accentColor: '#7C3AED' }} />
                    <span style={{ textDecoration: index < 2 ? 'line-through' : 'none', color: index < 2 ? colors.onSurfaceVar : colors.onSurface }}>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div style={{ background: 'rgba(124,58,237,0.2)', borderRadius: 16, padding: 16, border: '1px solid rgba(124,58,237,0.3)', display: 'flex', gap: 16, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>psychology</span>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', marginBottom: 4 }}>AI Recommendation</h4>
              <p style={{ fontSize: 12, color: colors.onSurface, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                "I've identified a pattern in your Digital Electronics quiz results. I'm prioritizing logic circuit simplification for tomorrow's revision block."
              </p>
            </div>
          </div>

          {/* Adaptation Panel */}
          <div style={{ borderTop: `1px solid ${colors.outlineVar}`, paddingTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: colors.onSurfaceVar, margin: 0 }}>How Your Plan Adapts</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%' }} />
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Live</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <svg width="40" height="40" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke={colors.outlineVar} strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#7C3AED" strokeDasharray="75,100" strokeLinecap="round" strokeWidth="2.5" />
                </svg>
                <p style={{ fontSize: 8, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', color: colors.onSurfaceVar, margin: 0 }}>Remaining<br />Syllabus</p>
              </div>
              <div style={{ background: colors.surfaceContainer, borderRadius: 12, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colors.outlineVar}` }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#7C3AED', margin: 0 }}>4hrs</p>
                <p style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: colors.onSurfaceVar, margin: 0 }}>Available Time</p>
              </div>
              <div style={{ background: 'rgba(255,180,171,0.1)', border: '1px solid rgba(255,180,171,0.3)', borderRadius: 12, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, color: colors.error, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>High Need</span>
                <p style={{ fontSize: 10, fontWeight: 700, color: colors.onSurface, margin: 0 }}>Calculus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress + Deadlines */}
        <div className="xl:col-span-4 flex flex-col gap-6" style={{ minWidth: 0 }}>
          {/* This Week's Progress */}
          <div style={S.card}>
            <h3 style={{ ...S.cardTitle, marginBottom: 24 }}>This Week's Progress</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, height: 128, marginBottom: 32 }}>
              {[64, 96, 48, 112, 32, 16, 0].map((h, i) => (
                <div key={i} style={{ flex: 1, background: colors.surfaceContainer, borderRadius: '4px 4px 0 0', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${h}px`, background: `rgba(124,58,237,${h > 0 ? (h / 128).toFixed(1) : 0.1})`, borderRadius: '4px 4px 0 0' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: colors.surfaceContainer, borderRadius: 16, padding: 16, border: `1px solid ${colors.outlineVar}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 8 }}>
                  <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke={colors.outlineVar} strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#7C3AED" strokeDasharray="78,100" strokeLinecap="round" strokeWidth="4" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>78%</div>
                </div>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.onSurfaceVar, margin: 0 }}>Productivity Score</p>
              </div>
              <div style={{ background: colors.surfaceContainer, borderRadius: 16, padding: 16, border: `1px solid ${colors.outlineVar}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 20 }}>local_fire_department</span>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>14 Day</span>
                </div>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.onSurfaceVar, marginBottom: 8 }}>Streak</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                  {[1,1,1,1,1,0,0].map((a, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: a ? '#7C3AED' : colors.outlineVar }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Deadlines */}
          <div style={{ ...S.card, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ ...S.cardTitle, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: '#7C3AED', fontSize: 24 }}>notifications_active</span>
                Deadlines
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { dot: '#ffb4ab', name: 'Data Structures Project', due: 'Due in 2 days', path: '/notes', msg: '📂 Opening notes library for Data Structures Project...' },
                { dot: '#facc15', name: 'Math Assignment 04', due: 'Due in 5 days', path: '/notes', msg: '📂 Opening notes library for Math Assignment 04...' },
                { dot: '#22c55e', name: 'Lab Report: Circuits', due: 'Due in 1 week', dim: true, path: '/syllabus', msg: '⚡ Opening syllabus for Electronics Circuits...' },
              ].map((d, i) => (
                <div 
                  key={i} 
                  onClick={() => { dispatch(showToast(d.msg)); navigate(d.path); }}
                  style={{ padding: 12, background: colors.surfaceContainer, border: `1px solid ${colors.outlineVar}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: d.dim ? 0.7 : 1, cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.dot, display: 'inline-block' }} />
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>{d.name}</p>
                      <p style={{ fontSize: 9, color: colors.onSurfaceVar, margin: 0 }}>{d.due}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: colors.onSurfaceVar, fontSize: 18 }}>chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ width: '100%' }}>
        {/* Upcoming Exams */}
        <div style={S.card}>
          <h3 style={{ ...S.cardTitle, marginBottom: 32 }}>Upcoming Exams & Deadlines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 1, background: colors.outlineVar }} />
            {dynamicUpcomingExams.map((e, i) => (
              <div key={i} style={{ position: 'relative', paddingLeft: 32, opacity: e.dim ? 0.6 : 1 }}>
                <div style={{ position: 'absolute', left: -2, top: 6, width: 10, height: 10, borderRadius: '50%', background: e.color, outline: `4px solid ${colors.bg}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: colors.onSurfaceVar, textTransform: 'uppercase' }}>{e.date}</span>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: colors.onSurface, margin: 0 }}>{e.name}</h4>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: `${e.color}33`, color: e.color, border: `1px solid ${e.color}4d`, borderRadius: 999, textTransform: 'uppercase' }}>{e.days}</span>
                </div>
                <div style={{ width: '100%', height: 6, background: colors.surfaceContainer, borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${e.pct}%`, background: e.color, borderRadius: 999 }} />
                </div>
                <p style={{ fontSize: 10, color: colors.onSurfaceVar, marginTop: 8 }}>Coverage: {e.covered} Topics Mastered</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revision Timetable */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <h3 style={S.cardTitle}>Revision Timetable</h3>
              <p style={{ fontSize: 10, color: colors.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>AI Scheduled Revision Cycles</p>
            </div>
            <span style={{ background: 'rgba(124,58,237,0.2)', color: '#7C3AED', fontSize: 9, padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(124,58,237,0.3)', fontWeight: 800, textTransform: 'uppercase' }}>Active Cycle</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(7, 1fr)', gap: 6, marginBottom: 32 }}>
            {['Sub','M','T','W','T','F','S','S'].map((h, i) => (
              <div key={i} style={{ fontSize: 9, fontWeight: 700, color: colors.onSurfaceVar, textTransform: 'uppercase', padding: 8, textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>
            ))}
            {/* MATH Row */}
            <div style={{ padding: 6, fontSize: 10, fontWeight: 700, border: `1px solid ${colors.outlineVar}`, background: colors.surfaceContainer, borderRadius: 8 }}>MATH</div>
            {[true,false,true,null,null,false,false].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {a === true ? <div style={{ width: 16, height: 16, borderRadius: 4, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 10, color: '#fff' }}>check</span></div>
                  : a === false ? <div style={{ width: 16, height: 16, borderRadius: 4, background: colors.outlineVar, border: `1px solid ${colors.outlineVar}` }} />
                  : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(124,58,237,0.6)' }} />}
              </div>
            ))}
            {/* DATA Row */}
            <div style={{ padding: 6, fontSize: 10, fontWeight: 700, border: `1px solid ${colors.outlineVar}`, background: colors.surfaceContainer, borderRadius: 8 }}>DATA</div>
            {[false,true,null,false,true,null,null].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {a === true ? <div style={{ width: 16, height: 16, borderRadius: 4, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 10, color: '#fff' }}>check</span></div>
                  : a === false ? <div style={{ width: 16, height: 16, borderRadius: 4, background: colors.outlineVar, border: `1px solid ${colors.outlineVar}` }} />
                  : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(124,58,237,0.6)' }} />}
              </div>
            ))}
          </div>
          <div style={{ padding: 16, background: colors.surfaceContainer, borderRadius: 16, border: `1px solid ${colors.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: colors.onSurfaceVar, marginBottom: 4 }}>Spaced Repetition Status</p>
              <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>14 Topics Due Today</p>
            </div>
            <button style={{ padding: '6px 12px', background: '#7C3AED', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
              onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
              onClick={() => { dispatch(showToast('📚 Starting spaced repetition review!')); navigate('/revision'); }}
            >Review Now</button>
          </div>
        </div>

        {/* Customize Plan */}
        <div style={S.card}>
          <h3 style={{ ...S.cardTitle, marginBottom: 32 }}>Customize Your Plan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: colors.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Study Hours/Day</label>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>{studyHours} hrs</span>
              </div>
              <input type="range" min="1" max="12" step="0.5" value={studyHours} onChange={e => setStudyHours(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7C3AED' }} />
            </div>
            {[
              { icon: 'wb_sunny', label: 'Morning Focus', key: 'morningFocus' },
              { icon: 'bolt', label: 'Difficulty Spike Focus', key: 'difficultySpike' },
              { icon: 'timer', label: 'Break Reminders', key: 'breakReminders' },
            ].map(item => {
              const isOn = preferences[item.key];
              return (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ color: isOn ? '#7C3AED' : colors.onSurfaceVar, fontSize: 22 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: isOn ? colors.onSurface : colors.onSurfaceVar }}>{item.label}</span>
                  </div>
                  <div 
                    onClick={() => setPreferences(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    style={{ width: 32, height: 18, borderRadius: 999, background: isOn ? '#7C3AED' : colors.outlineVar, position: 'relative', cursor: 'pointer', border: `1px solid ${isOn ? '#7C3AED' : colors.outlineVar}` }}
                  >
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, right: isOn ? 2 : undefined, left: isOn ? undefined : 2, transition: 'all 0.15s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => dispatch(showToast(`✅ Study plan updated: ${studyHours} hrs/day, Morning Focus: ${preferences.morningFocus ? 'ON' : 'OFF'}, Difficulty Spike: ${preferences.difficultySpike ? 'ON' : 'OFF'}, Break Reminders: ${preferences.breakReminders ? 'ON' : 'OFF'}`))}
            style={{ marginTop: 32, width: '100%', background: '#7C3AED', color: '#fff', padding: '14px', borderRadius: 16, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
            onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
          >
            Update Plan
          </button>
        </div>
      </div>
    </div>
  );
}
