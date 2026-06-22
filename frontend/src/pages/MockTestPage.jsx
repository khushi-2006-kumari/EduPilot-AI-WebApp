import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  onSurface: '#e8dfee', onSurfaceVar: '#ccc3d8', outline: '#958da1',
  primary: '#7C3AED', primaryDim: '#d2bbff', secondary: '#cebdff', tertiary: '#c9c4d9',
  surfaceContainer: '#221e28', surfaceHigh: '#2c2833', surfaceHighest: '#37333e',
  surfaceLow: '#1d1a24', surfaceLowest: '#100d16', outlineVar: '#4a4455', error: '#ffb4ab',
};
const LIGHT = {
  onSurface: '#1a1523', onSurfaceVar: '#4a4455', outline: '#7a7581',
  primary: '#7C3AED', primaryDim: '#5a00c6', secondary: '#4f319c', tertiary: '#5a5471',
  surfaceContainer: '#f3f0f8', surfaceHigh: '#ede9f5', surfaceHighest: '#e4dff0',
  surfaceLow: '#faf7ff', surfaceLowest: '#ffffff', outlineVar: '#c2bac9', error: '#ba1a1a',
};

export default function MockTestPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  const generatedPlan = useSelector(state => state.study.generatedPlan);

  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [qCount, setQCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState('60m');
  const [focusWeak, setFocusWeak] = useState(true);
  const [focusPYQ, setFocusPYQ] = useState(false);
  const [focusHigh, setFocusHigh] = useState(true);
  const [activeFormat, setActiveFormat] = useState(['mcq']);

  const toggleFormat = (key) => {
    setActiveFormat(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);
  };

  const allSubjectsOption = { icon: 'grid_view', label: 'All Subjects', sub: 'Adaptive Mix', tag: 'Global Sync', tagBg: C.surfaceHighest, border: 'transparent', iconColor: C.primaryDim };
  
  const dynamicSubjects = generatedPlan?.units?.map((u, i) => ({
    icon: i === 0 ? 'account_tree' : i === 1 ? 'functions' : 'memory',
    label: u.label.split(': ')[1] || u.label,
    sub: u.count,
    tag: i === 0 ? 'Mastered' : 'Needs Focus',
    tagBg: i === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(255,180,171,0.1)',
    tagColor: i === 0 ? '#4ade80' : C.error,
    border: i === 0 ? '#7C3AED' : C.secondary,
    lastScore: i === 0 ? '94%' : '62%',
    scoreColor: i === 0 ? '#7C3AED' : C.secondary,
    iconColor: i === 0 ? '#7C3AED' : C.secondary
  })) || [
    { icon: 'account_tree', label: 'Data Structures', sub: '24 Topics Available', tag: 'Stable', tagBg: 'rgba(34,197,94,0.1)', tagColor: '#4ade80', border: C.primaryDim, lastScore: '88%', scoreColor: C.primaryDim },
    { icon: 'functions', label: 'Maths', sub: '18 Topics Available', tag: 'Needs Focus', tagBg: 'rgba(255,180,171,0.1)', tagColor: C.error, border: C.secondary, lastScore: '62%', scoreColor: C.secondary },
    { icon: 'memory', label: 'Electronics', sub: '12 Topics Available', tag: 'Average', tagBg: C.surfaceHighest, tagColor: C.outline, border: C.tertiary, lastScore: '75%', scoreColor: C.tertiary },
    { icon: 'terminal', label: 'Algorithms', sub: '30 Topics Available', tag: 'Mastered', tagBg: 'rgba(34,197,94,0.1)', tagColor: '#4ade80', border: '#7C3AED', lastScore: '94%', scoreColor: '#7C3AED' },
  ];

  const displaySubjects = [allSubjectsOption, ...dynamicSubjects];

  const historyCards = [
    { subject: 'Algorithms', subjectColor: C.primaryDim, subjectBg: 'rgba(210,187,255,0.1)', score: '92%', change: '+4% improved', changeColor: '#4ade80', time: '2d ago', duration: '42m 15s', answers: '18/20', isPrimary: false },
    { subject: 'Calculus III', subjectColor: C.secondary, subjectBg: 'rgba(206,189,255,0.1)', score: '58%', change: '-12% dropped', changeColor: C.error, time: '4d ago', duration: '58m 04s', answers: '11/20', isPrimary: true },
    { subject: 'Electronics', subjectColor: C.tertiary, subjectBg: 'rgba(201,196,217,0.1)', score: '78%', change: 'First attempt', changeColor: C.outline, time: '1w ago', duration: '35m 12s', answers: '15/20', isPrimary: false },
  ];

  const pyqTopics = generatedPlan?.units?.[0]?.topics?.slice(0, 4).map((t, i) => ({
    name: t.name,
    sub: t.time || 'Subtopics',
    trend: i % 2 === 0 ? 'trending_up' : 'trending_flat',
    trendColor: i % 2 === 0 ? C.primaryDim : C.outline,
    tag: i % 2 === 0 ? 'Priority' : 'Steady',
    tagColor: i % 2 === 0 ? C.primaryDim : C.outline,
    tagBg: i % 2 === 0 ? 'rgba(124,58,237,0.1)' : C.surfaceHighest
  })) || [
    { name: 'Dynamic Programming', sub: 'Knapsack, LCS Variants', trend: 'trending_up', trendColor: C.primaryDim, tag: 'Priority', tagColor: C.primaryDim, tagBg: 'rgba(124,58,237,0.1)' },
    { name: 'Binary Search Trees', sub: 'AVLs & Balancing', trend: 'trending_flat', trendColor: C.outline, tag: 'Steady', tagColor: C.outline, tagBg: C.surfaceHighest },
    { name: 'Graph Theory', sub: 'Dijkstra, MST', trend: 'trending_up', trendColor: C.primaryDim, tag: 'Priority', tagColor: C.primaryDim, tagBg: 'rgba(124,58,237,0.1)' },
    { name: 'Red-Black Trees', sub: 'Complex Operations', trend: 'trending_down', trendColor: C.error, tag: 'Niche', tagColor: C.error, tagBg: 'rgba(255,180,171,0.1)' },
  ];

  return (
    <div style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 800, color: C.onSurface, margin: 0, letterSpacing: '-0.02em' }}>Mock Test Generator</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 999 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.primaryDim }}>auto_awesome</span>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.primaryDim }}>AI Generated</span>
            </div>
          </div>
          <p style={{ color: C.onSurfaceVar, fontSize: 16 }}>AI-generated tests tailored to your syllabus and weak areas</p>
        </div>
      </div>

      {/* Subject Selector */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, margin: 0, color: C.onSurface }}>Select Subject</h3>
          <button style={{ color: C.primaryDim, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
        </div>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
          {displaySubjects.map((s, i) => {
            const isSelected = selectedSubject === s.label;
            return (
              <div 
                key={i} 
                onClick={() => {
                  setSelectedSubject(s.label);
                  dispatch(showToast(`Selected subject: ${s.label}`));
                }}
                style={{ 
                  minWidth: 200, 
                  flexShrink: 0, 
                  padding: 20, 
                  borderRadius: 12, 
                  background: isSelected ? C.surfaceHigh : C.surfaceContainer, 
                  border: isSelected ? `2px solid ${C.primary}` : `1px solid ${C.outlineVar}`, 
                  borderLeft: isSelected ? `6px solid ${C.primary}` : (s.border !== 'transparent' ? `4px solid ${s.border}` : `1px solid ${C.outlineVar}`), 
                  cursor: 'pointer', 
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 15px ${C.primary}33` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: `${s.iconColor}1a`, display: 'flex', alignItems: 'center', justifycontent: 'center', color: s.iconColor }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{s.icon}</span>
                  </div>
                  {s.lastScore && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: 10, color: C.outline, textTransform: 'uppercase', fontWeight: 700 }}>Last Score</span>
                      <span style={{ fontWeight: 700, color: s.scoreColor }}>{s.lastScore}</span>
                    </div>
                  )}
                </div>
                <h4 style={{ fontWeight: 700, color: C.onSurface, margin: '0 0 4px 0', fontSize: 14 }}>{s.label}</h4>
                <p style={{ fontSize: 12, color: C.outline, marginBottom: 12 }}>{s.sub}</p>
                <span style={{ padding: '2px 8px', background: s.tagBg || C.surfaceHighest, color: s.tagColor || C.onSurface, fontSize: 10, borderRadius: 999, border: `1px solid ${s.tagBg ? s.tagColor || C.outlineVar : C.outlineVar}` }}>{s.tag}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Config + PYQ */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginBottom: 40 }}>
        <div style={{ background: C.surfaceContainer, borderRadius: 12, padding: 32, border: `1px solid ${C.outlineVar}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: 24, opacity: 0.05, pointerEvents: 'none', color: C.onSurface }}>
            <span className="material-symbols-outlined" style={{ fontSize: 120 }}>tune</span>
          </div>
          <h3 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, marginBottom: 32, color: C.onSurface }}>Test Parameters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginBottom: 40 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.outline, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Question Format</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['mcq', 'Multiple Choice'], ['tf', 'True / False'], ['fill', 'Fill in the Blanks']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 14, color: C.onSurface }}>
                    <input type="checkbox" checked={activeFormat.includes(key)} onChange={() => toggleFormat(key)} style={{ accentColor: '#7C3AED', width: 20, height: 20 }} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.outline, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Difficulty</label>
                <select style={{ width: '100%', background: C.surfaceLowest, border: `1px solid ${C.outlineVar}`, borderRadius: 8, padding: '8px 12px', color: C.onSurface, fontSize: 14 }}>
                  <option>Mixed (Recommended)</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert / Olympiad</option>
                </select>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.outline, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Questions</label>
                  <span style={{ fontWeight: 700, color: C.primaryDim, fontSize: 14 }}>{qCount}</span>
                </div>
                <input type="range" min="5" max="50" value={qCount} onChange={e => setQCount(Number(e.target.value))} style={{ width: '100%', accentColor: '#7C3AED' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.outline, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Time Limit</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['30m', '60m', '90m'].map(t => (
                    <button key={t} onClick={() => setTimeLimit(t)} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: t === timeLimit ? 700 : 400, border: `1px solid ${t === timeLimit ? '#7C3AED' : C.outlineVar}`, background: t === timeLimit ? 'rgba(124,58,237,0.1)' : 'transparent', color: t === timeLimit ? C.primaryDim : C.onSurface, cursor: 'pointer' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.outline, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>AI Focus</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Weak Topics', icon: 'trending_down', iconColor: C.error, val: focusWeak, set: setFocusWeak },
                  { label: 'PYQ Inclusion', icon: 'history', iconColor: C.secondary, val: focusPYQ, set: setFocusPYQ },
                  { label: 'High Yield', icon: 'star', iconColor: C.primaryDim, val: focusHigh, set: setFocusHigh },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, background: C.surfaceLowest, border: `1px solid ${C.outlineVar}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: item.iconColor }}>{item.icon}</span>
                      <span style={{ fontSize: 14, color: C.onSurface }}>{item.label}</span>
                    </div>
                    <div onClick={() => item.set(!item.val)} style={{ width: 40, height: 20, borderRadius: 999, background: item.val ? '#7C3AED' : C.outlineVar, position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'left 0.2s', left: item.val ? 22 : 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/mocktest/active', { state: { subject: selectedSubject } })} 
            style={{ width: '100%', padding: '20px', background: '#7C3AED', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
            onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>auto_awesome</span>
            Generate Test with AI
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_forward</span>
          </button>
        </div>

        <div style={{ background: C.surfaceContainer, borderRadius: 12, border: `1px solid ${C.outlineVar}`, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ padding: 8, background: 'rgba(206,189,255,0.1)', borderRadius: 8 }}>
              <span className="material-symbols-outlined" style={{ color: C.secondary }}>analytics</span>
            </div>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, margin: 0, color: C.onSurface }}>PYQ Intelligence</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 16, borderRadius: 8, background: C.surfaceLowest, border: `1px solid ${C.outlineVar}` }}>
              <p style={{ fontSize: 10, color: C.outline, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Repeated</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', color: C.onSurface }}>42%</p>
              <div style={{ height: 4, background: C.surfaceHighest, borderRadius: 999 }}>
                <div style={{ height: '100%', width: '42%', background: C.secondary }} />
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, background: C.surfaceLowest, border: `1px solid ${C.outlineVar}` }}>
              <p style={{ fontSize: 10, color: C.outline, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Predictions</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, color: C.primaryDim, margin: '0 0 4px 0' }}>12</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.primaryDim }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>trending_up</span>
                High accuracy
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.outline, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>High-Yield Topics</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {pyqTopics.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: 8, border: '1px solid transparent', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surfaceHigh; e.currentTarget.style.borderColor = C.outlineVar; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: C.onSurface }}>{t.name}</span>
                  <span style={{ fontSize: 12, color: C.outline }}>{t.sub}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: t.trendColor, fontSize: 16 }}>{t.trend}</span>
                  <span style={{ padding: '2px 8px', background: t.tagBg, color: t.tagColor, fontSize: 10, borderRadius: 999, border: `1px solid ${t.tagColor}4d` }}>{t.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, margin: 0, color: C.onSurface }}>Recent Performance</h3>
          <button style={{ padding: 8, background: C.surfaceHigh, border: `1px solid ${C.outlineVar}`, borderRadius: 8, cursor: 'pointer', color: C.outline, display: 'flex', alignItems: 'center', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceHighest}
            onMouseLeave={e => e.currentTarget.style.background = C.surfaceHigh}
            onClick={() => dispatch(showToast('Filters updated!'))}
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {historyCards.map((card, i) => (
            <div key={i} style={{ padding: 20, borderRadius: 12, background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ padding: '2px 8px', background: card.subjectBg, color: card.subjectColor, fontSize: 10, fontWeight: 700, borderRadius: 4, textTransform: 'uppercase' }}>{card.subject}</span>
                <span style={{ fontSize: 12, color: C.outline }}>{card.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
                <span style={{ fontFamily: "'Inter'", fontSize: 32, fontWeight: 700, color: C.onSurface }}>{card.score}</span>
                <span style={{ fontSize: 12, color: card.changeColor, marginBottom: 4 }}>{card.change}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.outline, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>timer</span>
                  {card.duration}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>task_alt</span>
                  {card.answers}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => navigate('/mocktest/results')}
                  style={{ padding: '8px', fontSize: 11, fontWeight: 700, border: `1px solid ${C.outlineVar}`, borderRadius: 12, background: C.surfaceContainer, color: C.onSurface, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
                  onMouseLeave={e => e.currentTarget.style.background = C.surfaceContainer}
                >Review</button>
                <button onClick={() => navigate('/mocktest/active')} style={{ padding: '8px', fontSize: 11, fontWeight: 700, border: `1px solid ${card.isPrimary ? '#7C3AED' : 'rgba(210,187,255,0.3)'}`, borderRadius: 6, background: card.isPrimary ? '#7C3AED' : 'rgba(124,58,237,0.1)', color: card.isPrimary ? '#fff' : C.primaryDim, cursor: 'pointer' }}>Retake</button>
              </div>
            </div>
          ))}
          <div style={{ padding: 20, borderRadius: 12, background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.surfaceHighest, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: C.outline }}>history</span>
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.onSurface }}>View All History</p>
            <p style={{ fontSize: 10, color: C.outline, marginTop: 4 }}>12 tests taken this month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
