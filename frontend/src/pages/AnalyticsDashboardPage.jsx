import React, { useState, useMemo } from 'react';
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

const heatColors = (C) => [C.heatEmpty, `rgba(124,58,237,0.3)`, `rgba(124,58,237,0.6)`, '#7c3aed'];

export default function AnalyticsDashboardPage() {
  const [period, setPeriod] = useState('month');
  const navigate = useNavigate();
  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  const studyState = useSelector(state => state.study);
  const { studyStats = {}, syllabus = {}, mockTests = {}, recentSessions = [], streakCount = 0 } = studyState;
  
  const topics = syllabus?.topics || [];
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.status === 'mastered').length;
  const inProgressTopics = topics.filter(t => t.status === 'needs-review' || t.status === 'in-progress').length;
  const topicProgressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Dynamic Subject Mastery
  const subjectMap = topics.reduce((acc, t) => {
    if(!acc[t.subject]) acc[t.subject] = { total: 0, completed: 0, inProgress: 0 };
    acc[t.subject].total += 1;
    if(t.status === 'mastered') acc[t.subject].completed += 1;
    if(t.status === 'needs-review' || t.status === 'in-progress') acc[t.subject].inProgress += 1;
    return acc;
  }, {});

  const dynamicSubjects = Object.keys(subjectMap).map((sub, i) => {
    const s = subjectMap[sub];
    return {
      label: sub,
      pct: Math.round((s.completed / s.total) * 100),
      color: [C.primaryDim, C.secondary, C.tertiary, C.error, C.primary][i % 5],
      dot: [C.primaryDim, C.secondary, C.tertiary, C.error, C.primary][i % 5]
    };
  });

  const dynamicSyllabusRows = Object.keys(subjectMap).map(sub => {
    const s = subjectMap[sub];
    return {
      name: sub,
      total: Math.round((s.completed / s.total) * 100) || 0,
      completed: Math.round((s.completed / s.total) * 100) || 0,
      inProgress: Math.round((s.inProgress / s.total) * 100) || 0
    };
  });

  // Calculate Overall Score from Past Results
  const pastResults = mockTests?.pastResults || [];
  const avgTestScore = pastResults.length > 0 
    ? Math.round(pastResults.reduce((acc, r) => acc + r.score, 0) / pastResults.length)
    : (syllabus?.overallScore || 0);

  // Productivity / Focus
  const productivityScore = studyStats?.avgFocus || 0;
  const productivityLabel = productivityScore > 80 ? 'Exceptional' : productivityScore > 50 ? 'Good' : 'Needs Focus';

  const aiComment = dynamicSubjects.length > 0
    ? `"Your momentum in ${dynamicSubjects[0].label} is strong. I suggest allocating more time to your weaker topics over the next 48 hours to balance your averages."`
    : `"Analyze a syllabus or take a mock test to get personalized insights."`;

  const achievements = [
    { icon: 'workspace_premium', color: C.primaryDim, active: completedTopics > 0 },
    { icon: 'local_fire_department', color: C.secondary, active: streakCount > 2 },
    { icon: 'military_tech', color: C.onSurfaceVar, active: avgTestScore > 80 },
    { icon: 'school', color: C.onSurfaceVar, active: totalTopics > 50 },
  ];

  const efficiencyRings = [
    { label: 'Consistency', pct: Math.min(100, streakCount * 10), offset: 176 - (176 * Math.min(100, streakCount * 10) / 100) },
    { label: 'Coverage', pct: topicProgressPct, offset: 176 - (176 * topicProgressPct / 100) },
    { label: 'Avg Score', pct: avgTestScore, offset: 176 - (176 * avgTestScore / 100) },
  ];

  // Dummy Heatmap generator based on recent sessions
  const heatmapData = useMemo(() => {
    const data = Array(45).fill(0);
    const recentCount = Math.min(recentSessions.length, 45);
    for(let i=0; i<recentCount; i++) {
      data[44 - i] = Math.floor(Math.random() * 3) + 1; // Fake intensity for recent days
    }
    return data;
  }, [recentSessions]);

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
            <span style={{ fontSize: 14, color: C.onSurfaceVar }}>Avg Test Score</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.primaryDim, background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 999 }}>{pastResults.length} Tests</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 40, fontWeight: 700, margin: 0 }}>{avgTestScore}%</h3>
            <div style={{ flex: 1, height: 48, display: 'flex', alignItems: 'flex-end', gap: 3, paddingBottom: 4 }}>
              {[0.3,0.5,0.65,1,0.75].map((h, i) => (
                <div key={i} style={{ flex: 1, background: `rgba(124,58,237,${h})`, borderRadius: '3px 3px 0 0', height: `${h * 48}px` }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: C.onSurfaceVar }}>Total Study Hours</span>
            <span className="material-symbols-outlined" style={{ color: C.primaryDim, fontSize: 20 }}>schedule</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 40, fontWeight: 700, margin: 0 }}>{studyStats.totalHours || 0}h</h3>
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
            <span style={{ fontSize: 12, fontWeight: 700, color: C.onSurfaceVar }}>{completedTopics}/{totalTopics}</span>
          </div>
          <h3 style={{ fontFamily: "'Inter'", fontSize: 40, fontWeight: 700, margin: '0 0 16px 0' }}>{topicProgressPct}%</h3>
          <div style={{ height: 8, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${topicProgressPct}%`, background: '#7C3AED', borderRadius: 999 }} />
          </div>
        </div>
        <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}`, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="28" fill="transparent" stroke={C.surfaceHighest} strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#7c3aed" strokeDasharray="176" strokeDashoffset={176 - (176 * productivityScore / 100)} strokeLinecap="round" strokeWidth="6" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.onSurface }}>{productivityScore}</span>
          </div>
          <div>
            <span style={{ fontSize: 14, color: C.onSurfaceVar, display: 'block', marginBottom: 4 }}>Productivity</span>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 22, fontWeight: 700, margin: 0 }}>{productivityLabel}</h3>
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
              <span style={{ fontSize: 12, color: C.onSurfaceVar }}>Last 45 days</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {heatmapData.map((val, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: heatColors(C)[val] }} />
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
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dynamicSubjects.length > 0 ? dynamicSubjects.map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
                  <span style={{ fontSize: 14, color: C.onSurface }}>{s.label}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.onSurface }}>{s.pct}%</span>
              </div>
            )) : <p style={{color: C.onSurfaceVar, fontSize: 14, textAlign: 'center'}}>No subjects found. Add a syllabus to analyze mastery.</p>}
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
              <p style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, color: C.primaryDim, margin: 0 }}>{Math.min(100, avgTestScore + 5)}%</p>
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
          {dynamicSubjects.filter(s => s.pct < 50).length > 0 && (
            <div style={{ border: '1px solid #7C3AED', boxShadow: '0 0 15px rgba(124,58,237,0.2)', background: C.surfaceHigh, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ padding: 8, background: 'rgba(147,0,10,0.2)', borderRadius: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: C.error }}>warning</span>
                </div>
                <div>
                  <h5 style={{ fontWeight: 700, margin: '0 0 6px 0', fontSize: 14, color: C.onSurface }}>Urgent Revision Required</h5>
                  <p style={{ fontSize: 13, color: C.onSurfaceVar, margin: 0, lineHeight: 1.5 }}>
                    Mastery in "{dynamicSubjects.find(s => s.pct < 50)?.label}" is below 50% threshold.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/focus')}
                style={{ marginTop: 16, width: '100%', padding: '8px', background: 'rgba(255,180,171,0.1)', color: C.error, border: `1px solid rgba(255,180,171,0.2)`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,180,171,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,180,171,0.1)'}
              >Start Focus Session</button>
            </div>
          )}

          <div style={{ background: C.surfaceContainer, padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}`, flex: 1 }}>
            <h5 style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 14, margin: '0 0 24px 0', display: 'flex', justifyContent: 'space-between', color: C.onSurface }}>
              Achievements
              <span style={{ color: C.primaryDim, fontSize: 12, fontWeight: 400 }}>View All</span>
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ aspectRatio: '1', background: C.surfaceHigh, border: `1px solid ${C.outlineVar}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: a.active ? 1 : 0.4 }}>
                  <span className="material-symbols-outlined" style={{ color: a.color, fontSize: 28 }}>{a.icon}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.onSurface }}>Current Milestone: <span style={{ color: C.primaryDim }}>{totalTopics > 0 ? `${totalTopics} Topics Analyzed` : 'Analyze a Syllabus'}</span></p>
            <div style={{ marginTop: 8, height: 6, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: totalTopics > 0 ? '100%' : '0%', background: '#7C3AED' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Syllabus Coverage + Weekly Report */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 32 }}>
        <div style={{ background: C.surfaceContainer, padding: 32, borderRadius: 12, border: `1px solid ${C.outlineVar}` }}>
          <h4 style={{ fontFamily: "'Inter'", fontSize: 18, fontWeight: 700, marginBottom: 24, color: C.onSurface }}>Syllabus Coverage Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {dynamicSyllabusRows.length > 0 ? dynamicSyllabusRows.map(row => (
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
            )) : <p style={{color: C.onSurfaceVar, fontSize: 14}}>No syllabus data available. Go to Syllabus Analyzer to upload one.</p>}
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
            {[{ label: 'Time Invested', val: `${studyStats.totalHours || 0}h`, sub: '/wk' }, { label: 'Focus Sessions', val: `${studyStats.sessionsDone || 0}`, sub: '' }].map(item => (
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
