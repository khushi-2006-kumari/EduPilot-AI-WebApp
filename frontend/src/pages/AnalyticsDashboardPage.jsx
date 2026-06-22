import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  onSurface: '#e8dfee', onSurfaceVar: '#ccc3d8', outline: '#958da1',
  primary: '#7C3AED', primaryDim: '#d2bbff', secondary: '#cebdff', tertiary: '#c9c4d9',
  surfaceContainer: '#221e28', surfaceHigh: '#2c2833', surfaceHighest: '#37333e',
  surfaceLow: '#1d1a24', outlineVar: '#4a4455', error: '#ffb4ab',
  heatEmpty: '#1d1a24',
};
const LIGHT = {
  onSurface: '#1a1523', onSurfaceVar: '#4a4455', outline: '#7a7581',
  primary: '#7C3AED', primaryDim: '#5a00c6', secondary: '#4f319c', tertiary: '#5a5471',
  surfaceContainer: '#f3f0f8', surfaceHigh: '#ede9f5', surfaceHighest: '#e4dff0',
  surfaceLow: '#faf7ff', outlineVar: '#c2bac9', error: '#ba1a1a',
  heatEmpty: '#ece8f2',
};

const heatmapData = [1,1,2,1,0,3,3,3,3,1,3,3,0,2,2,3,3,3,1,2,2,2,1,3,2,2,3,2,0,0,1,2,1,3,3,0,0,2,1,0,3,0,1,2,0];

const subjects = (C) => [
  { label: 'Algorithms', pct: 90, color: C.primaryDim, dot: C.primaryDim },
  { label: 'Data Structures', pct: 85, color: C.secondary, dot: C.secondary },
  { label: 'Discrete Maths', pct: 72, color: C.tertiary, dot: C.tertiary },
  { label: 'Electronics', pct: 68, color: C.error, dot: C.error },
];

const syllabusRows = [
  { name: 'Computer Science II', total: 92, completed: 70, inProgress: 22 },
  { name: 'Advanced Calculus', total: 45, completed: 20, inProgress: 25 },
  { name: 'Physical Electronics', total: 31, completed: 10, inProgress: 21 },
];

const achievements = (C) => [
  { icon: 'workspace_premium', color: C.primaryDim, active: true },
  { icon: 'local_fire_department', color: C.secondary, active: true },
  { icon: 'military_tech', color: C.onSurfaceVar, active: false },
  { icon: 'school', color: C.onSurfaceVar, active: false },
];

const efficiencyRings = [
  { label: 'Consistency', pct: 85, offset: 26 },
  { label: 'Coverage', pct: 72, offset: 49 },
  { label: 'Revision', pct: 65, offset: 61 },
];

export default function AnalyticsDashboardPage() {
  const [period, setPeriod] = useState('month');
  const navigate = useNavigate();
  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  const generatedPlan = useSelector(state => state.study.generatedPlan);

  const dynamicSubjects = generatedPlan?.units?.map((u, i) => ({
    label: u.label.split(': ')[1] || u.label,
    pct: [90, 85, 72, 68, 55][i % 5],
    color: [C.primaryDim, C.secondary, C.tertiary, C.error, C.primary][i % 5],
    dot: [C.primaryDim, C.secondary, C.tertiary, C.error, C.primary][i % 5]
  })) || subjects(C);

  const dynamicSyllabusRows = generatedPlan?.units?.slice(0, 3).map((u, i) => ({
    name: u.label.split(': ')[1] || u.label,
    total: [92, 45, 31][i % 3],
    completed: [70, 20, 10][i % 3],
    inProgress: [22, 25, 21][i % 3]
  })) || syllabusRows;

  const aiComment = generatedPlan?.units?.[0]?.label 
    ? `"Your momentum in ${generatedPlan.units[0].label.split(': ')[1] || generatedPlan.units[0].label} is exceptional. I suggest allocating more time to your weaker topics over the next 48 hours to balance your averages."`
    : `"Your momentum in Algorithms is exceptional. I suggest allocating 25% more time to Electronics over the next 48 hours to balance your midterm averages."`;

  const heatColors = [C.heatEmpty, `rgba(79,49,156,0.4)`, `rgba(79,49,156,0.7)`, '#7c3aed'];

  return (
    <div style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Inter'", fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Analytics</h2>
          <p style={{ color: C.onSurfaceVar, fontSize: 16, marginTop: 8 }}>Track your academic performance and productivity insights</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: C.surfaceContainer, padding: 6, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          {[['week', 'This Week'], ['month', 'This Month'], ['semester', 'This Semester']].map(([key, label]) => (
            <button key={key} onClick={() => setPeriod(key)} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: period === key ? 600 : 400, background: period === key ? '#7C3AED' : 'transparent', color: period === key ? '#fff' : C.onSurfaceVar, transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginBottom: 32 }}>
        <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: C.onSurfaceVar }}>Overall Score</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.primaryDim, background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 999 }}>+2.4%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 40, fontWeight: 700, margin: 0 }}>82%</h3>
            <div style={{ flex: 1, height: 48, display: 'flex', alignItems: 'flex-end', gap: 3, paddingBottom: 4 }}>
              {[0.3,0.5,0.65,1,0.75].map((h, i) => (
                <div key={i} style={{ flex: 1, background: `rgba(124,58,237,${h})`, borderRadius: '3px 3px 0 0', height: `${h * 48}px` }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: C.onSurfaceVar }}>Study Hours</span>
            <span className="material-symbols-outlined" style={{ color: C.primaryDim, fontSize: 20 }}>schedule</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 40, fontWeight: 700, margin: 0 }}>48.5h</h3>
            <div style={{ flex: 1, height: 40, marginBottom: 4 }}>
              <svg width="100%" height="40" preserveAspectRatio="none">
                <path d="M0 30 Q20 10, 40 24 T80 16 T120 28 T160 12 T200 20" fill="none" stroke={C.primaryDim} strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: C.onSurfaceVar }}>Topics Completed</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.onSurfaceVar }}>34/85</span>
          </div>
          <h3 style={{ fontFamily: "'Inter'", fontSize: 40, fontWeight: 700, margin: '0 0 16px 0' }}>40%</h3>
          <div style={{ height: 8, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '40%', background: '#7C3AED', borderRadius: 999 }} />
          </div>
        </div>
        <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}`, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="28" fill="transparent" stroke={C.surfaceHighest} strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#7c3aed" strokeDasharray="176" strokeDashoffset="38" strokeLinecap="round" strokeWidth="6" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.onSurface }}>78</span>
          </div>
          <div>
            <span style={{ fontSize: 14, color: C.onSurfaceVar, display: 'block', marginBottom: 4 }}>Productivity</span>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 22, fontWeight: 700, margin: 0 }}>Exceptional</h3>
          </div>
        </div>
      </div>

      {/* Row 2: Study Activity + Subject Mastery */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginBottom: 32 }}>
        <div style={{ background: C.surfaceContainer, padding: 32, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h4 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, margin: '0 0 4px 0' }}>Study Activity</h4>
              <p style={{ fontSize: 14, color: C.onSurfaceVar, margin: 0 }}>Intensity of focus hours per day</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ dot: C.primary, label: 'Current' }, { dot: 'transparent', label: 'Average', border: C.outline }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: l.dot, border: l.border ? `1px solid ${l.border}` : 'none' }} />
                  <span style={{ fontSize: 12, color: C.onSurfaceVar }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 200, position: 'relative', marginBottom: 32 }}>
            <svg width="100%" height="200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 180 L60 160 L120 195 L180 125 L240 140 L300 85 L360 105 L420 35 L480 70 L540 90 L600 50 L660 80 L720 18 L780 45 L840 70 L900 110 L960 135 L1000 150 L1000 200 L0 200 Z" fill="url(#cg)" />
              <path d="M0 180 L60 160 L120 195 L180 125 L240 140 L300 85 L360 105 L420 35 L480 70 L540 90 L600 50 L660 80 L720 18 L780 45 L840 70 L900 110 L960 135 L1000 150" fill="none" stroke="#7c3aed" strokeLinecap="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div style={{ borderTop: `1px solid ${C.outlineVar}`, paddingTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>Study Consistency</span>
              <span style={{ fontSize: 12, color: C.onSurfaceVar }}>Last 90 days</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {heatmapData.map((val, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: heatColors[val] }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: C.surfaceContainer, padding: 32, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <h4 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, marginBottom: 24, color: C.onSurface }}>Subject Mastery</h4>
          <div style={{ width: 160, height: 160, margin: '0 auto 32px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" viewBox="0 0 100 100">
              {[45,30,15].map(r => <circle key={r} cx="50" cy="50" fill="none" r={r} stroke={C.outlineVar} strokeDasharray="2 2" strokeWidth="0.5" />)}
              <path d="M50 5 L85 25 L95 65 L50 95 L5 65 L15 25 Z" fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="2" />
              <text x="50" y="2" textAnchor="middle" style={{ fontSize: '6px', fill: C.onSurfaceVar }}>LOGIC</text>
              <text x="98" y="52" textAnchor="start" style={{ fontSize: '6px', fill: C.onSurfaceVar }}>DATA</text>
              <text x="50" y="100" textAnchor="middle" style={{ fontSize: '6px', fill: C.onSurfaceVar }}>ALGO</text>
              <text x="0" y="52" textAnchor="end" style={{ fontSize: '6px', fill: C.onSurfaceVar }}>MATH</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dynamicSubjects.map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
                  <span style={{ fontSize: 14, color: C.onSurface }}>{s.label}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.onSurface }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Test Performance + Efficiency + AI Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginBottom: 32 }}>
        <div style={{ background: C.surfaceContainer, padding: 32, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <h4 style={{ fontFamily: "'Inter'", fontSize: 18, fontWeight: 700, marginBottom: 8, color: C.onSurface }}>Test Performance</h4>
          <p style={{ fontSize: 13, color: C.onSurfaceVar, marginBottom: 24 }}>Score trajectory over recent assessments</p>
          <div style={{ height: 160, position: 'relative', marginBottom: 24 }}>
            <svg width="100%" height="160" preserveAspectRatio="none">
              <path d="M0 130 L100 110 L200 125 L300 70 L400 45 L500 25" fill="none" stroke={C.primaryDim} strokeLinecap="round" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              {[{cx:'0%',cy:130},{cx:'20%',cy:110},{cx:'40%',cy:125},{cx:'60%',cy:70},{cx:'80%',cy:45},{cx:'100%',cy:25}].map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r="5" fill={C.primaryDim} />
              ))}
            </svg>
          </div>
          <div style={{ padding: 16, background: C.surfaceHigh, border: `1px solid ${C.outlineVar}`, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, color: C.onSurfaceVar, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em' }}>Predicted Final</span>
              <p style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, color: C.primaryDim, margin: 0 }}>88.5%</p>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#7C3AED', fontSize: 28 }}>auto_awesome</span>
          </div>
        </div>

        <div style={{ background: C.surfaceContainer, padding: 32, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <h4 style={{ fontFamily: "'Inter'", fontSize: 18, fontWeight: 700, marginBottom: 32, color: C.onSurface }}>Efficiency Metrics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
            {efficiencyRings.map(ring => (
              <div key={ring.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', width: 64, height: 64 }}>
                  <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke={C.surfaceHighest} strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="#7c3aed" strokeDasharray="176" strokeDashoffset={ring.offset} strokeWidth="4" />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.onSurface }}>{ring.pct}%</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.onSurfaceVar, textAlign: 'center' }}>{ring.label}</span>
              </div>
            ))}
          </div>
          <h5 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.onSurface }}>Peak Activity Hours</h5>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 80, gap: 4 }}>
            {[0.25, 0.33, 0.65, 1, 0.85, 0.5, 0.2].map((h, i) => (
              <div key={i} style={{ flex: 1, background: h > 0.5 ? '#7C3AED' : h > 0.3 ? 'rgba(124,58,237,0.4)' : C.surfaceHighest, borderRadius: '3px 3px 0 0', height: `${h * 80}px`, transition: 'height 0.3s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.onSurfaceVar, marginTop: 8, fontFamily: 'monospace' }}>
            <span>08:00</span><span>14:00</span><span>20:00</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ border: '1px solid #7C3AED', boxShadow: '0 0 15px rgba(124,58,237,0.2)', background: C.surfaceHigh, borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ padding: 8, background: 'rgba(147,0,10,0.2)', borderRadius: 8 }}>
                <span className="material-symbols-outlined" style={{ color: C.error }}>warning</span>
              </div>
              <div>
                <h5 style={{ fontWeight: 700, margin: '0 0 6px 0', fontSize: 14, color: C.onSurface }}>Urgent Revision Required</h5>
                <p style={{ fontSize: 13, color: C.onSurfaceVar, margin: 0, lineHeight: 1.5 }}>Electronics Exam is in 4 days. Mastery in "Transistors" is below 50% threshold.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/focus')}
              style={{ marginTop: 16, width: '100%', padding: '8px', background: 'rgba(255,180,171,0.1)', color: C.error, border: `1px solid rgba(255,180,171,0.2)`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,180,171,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,180,171,0.1)'}
            >Start Focus Session</button>
          </div>

          <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}`, flex: 1 }}>
            <h5 style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 14, margin: '0 0 24px 0', display: 'flex', justifyContent: 'space-between', color: C.onSurface }}>
              Achievements
              <span style={{ color: C.primaryDim, fontSize: 12, fontWeight: 400 }}>View All</span>
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
              {achievements(C).map((a, i) => (
                <div key={i} style={{ aspectRatio: '1', background: C.surfaceHigh, border: `1px solid ${C.outlineVar}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: a.active ? 1 : 0.4 }}>
                  <span className="material-symbols-outlined" style={{ color: a.color, fontSize: 28 }}>{a.icon}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.onSurface }}>Current Milestone: <span style={{ color: C.primaryDim }}>100 Topics Complete</span></p>
            <div style={{ marginTop: 8, height: 6, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '82%', background: '#7C3AED' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Syllabus Coverage + Weekly Report */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 32 }}>
        <div style={{ background: C.surfaceContainer, padding: 32, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <h4 style={{ fontFamily: "'Inter'", fontSize: 18, fontWeight: 700, marginBottom: 24, color: C.onSurface }}>Syllabus Coverage Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {dynamicSyllabusRows.map(row => (
              <div key={row.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: C.onSurface }}>
                  <span>{row.name}</span>
                  <span style={{ color: C.primaryDim, fontWeight: 700 }}>{row.total}%</span>
                </div>
                <div style={{ height: 16, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ height: '100%', width: `${row.completed}%`, background: '#7C3AED' }} />
                  <div style={{ height: '100%', width: `${row.inProgress}%`, background: '#4f319c' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            {[{ color: '#7C3AED', label: 'Completed' }, { color: '#4f319c', label: 'In Progress' }, { color: C.surfaceHighest, label: 'Not Started' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, border: l.label === 'Not Started' ? `1px solid ${C.outlineVar}` : 'none' }} />
                <span style={{ fontSize: 12, color: C.onSurfaceVar }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, bottom: -40, width: 192, height: 192, background: 'rgba(124,58,237,0.1)', borderRadius: '50%', filter: 'blur(48px)' }} />
          <h4 style={{ fontFamily: "'Inter'", fontSize: 18, fontWeight: 700, marginBottom: 24, color: C.onSurface }}>Weekly Intelligence Report</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            {[{ label: 'Time Invested', val: '12.4h', sub: '/wk' }, { label: 'Deep Work Sessions', val: '18', sub: '' }].map(item => (
              <div key={item.label} style={{ padding: 16, background: C.surfaceHigh, border: `1px solid ${C.outlineVar}`, borderRadius: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.onSurfaceVar, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{item.label}</span>
                <p style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, margin: 0, color: C.onSurface }}>{item.val}<span style={{ fontSize: 14, color: C.primaryDim }}>{item.sub}</span></p>
              </div>
            ))}
          </div>
          <div style={{ background: C.surfaceHigh, padding: 20, borderRadius: 12, border: `1px solid ${C.outlineVar}`, marginBottom: 32, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="material-symbols-outlined" style={{ color: C.primaryDim, fontSize: 18 }}>chat_bubble</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.primaryDim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>AI Pilot Comment</span>
            </div>
            <p style={{ fontSize: 13, color: C.onSurfaceVar, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
              {aiComment}
            </p>
          </div>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', position: 'relative', zIndex: 1, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
            onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
          >
            <span className="material-symbols-outlined">download</span>
            Download Full Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
