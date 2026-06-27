import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  onSurface: '#e8dfee', onSurfaceVar: '#ccc3d8', primary: '#7C3AED',
  surfaceContainer: '#221e28', surfaceHigh: '#2c2833', surfaceHighest: '#37333e',
  outlineVar: '#4a4455', error: '#ffb4ab', secondary: '#cebdff',
  cardBg: 'rgba(34,30,40,0.6)',
  streakBg: 'rgba(44,40,51,0.5)',
};
const LIGHT = {
  onSurface: '#1a1523', onSurfaceVar: '#4a4455', primary: '#7C3AED',
  surfaceContainer: '#f3f0f8', surfaceHigh: '#ede9f5', surfaceHighest: '#e4dff0',
  outlineVar: '#c2bac9', error: '#ba1a1a', secondary: '#4f319c',
  cardBg: 'rgba(255,255,255,0.7)',
  streakBg: 'rgba(240,237,248,0.7)',
};

const sessionTypes = [
  { icon: 'menu_book', label: 'Read & Recall' },
  { icon: 'style', label: 'Flashcards' },
  { icon: 'edit_note', label: 'Write & Test' },
  { icon: 'auto_fix_high', label: 'Adaptive Quiz' },
];

export default function SmartRevisionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeType, setActiveType] = useState(1);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects (AI Recommended)');
  const [selectedDuration, setSelectedDuration] = useState('30 mins');
  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  const syllabus = useSelector(state => state.study.syllabus);
  const mockTests = useSelector(state => state.study.mockTests);
  const streakCount = useSelector(state => state.study.streakCount);

  const topics = syllabus?.topics || [];
  const total = topics.length || 85;
  const mastered = topics.filter(t => t.status === 'mastered').length || 34;
  const weak = topics.filter(t => t.status === 'needs-review').length || 18;
  const revised = topics.filter(t => t.status === 'in-progress' || t.status === 'mastered').length || 52;

  const dueTopics = topics.filter(t => t.status === 'needs-review').map(t => ({
    status: 'Overdue',
    statusColor: C.error,
    code: t.subject.substring(0, 6).toUpperCase(),
    title: t.title,
    desc: `Complexity: ${t.complexity}, Weight: ${t.weight}`,
    diff: t.complexity,
    time: 'Due Now'
  }));

  const weakAreas = topics.filter(t => t.status === 'needs-review').slice(0, 3).map(t => ({
    label: t.title.substring(0, 15) + (t.title.length > 15 ? '...' : ''),
    pct: 45,
    color: C.error
  }));

  if (weakAreas.length === 0 && topics.length > 0) {
    weakAreas.push({ label: topics[0].title.substring(0, 15) + '...', pct: 85, color: '#4ade80' });
  }

  const recentActivity = mockTests?.pastResults?.slice(0, 3).map(r => ({
    icon: r.score >= 80 ? 'check' : r.score < 60 ? 'priority_high' : 'rotate_left',
    iconColor: r.score >= 80 ? '#4ade80' : r.score < 60 ? C.error : C.secondary,
    iconBg: r.score >= 80 ? 'rgba(74,222,128,0.2)' : r.score < 60 ? 'rgba(255,180,171,0.2)' : 'rgba(206,189,255,0.2)',
    title: r.title,
    score: `${r.correctAnswers}/${r.totalQuestions}`,
    type: `Mock Test • ${r.subject}`,
    time: r.date,
    scoreColor: r.score < 60 ? C.error : undefined
  })) || [];



  const cardStyle = { background: C.cardBg, backdropFilter: 'blur(12px)', border: `1px solid ${C.outlineVar}`, borderRadius: 12, padding: 24 };

  return (
    <div style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 700, margin: 0, color: C.onSurface }}>Smart Revision</h2>
            <span style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(74,222,128,0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              Spaced Repetition ON
            </span>
          </div>
          <p style={{ color: C.onSurfaceVar, maxWidth: 500 }}>Optimizing your long-term memory through AI-driven spaced repetition algorithms. Focus on what you're about to forget.</p>
        </div>
        <button
          onClick={() => { dispatch(showToast('🚀 Revision session started!')); navigate('/session'); }}
          style={{ background: '#7C3AED', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
          onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
        >
          <span className="material-symbols-outlined">play_circle</span>
          Start Revision Session
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 5fr 3fr', gap: 24, marginBottom: 24 }}>
        {/* Left: Due for Revision */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, margin: 0, color: C.onSurface }}>
              <span className="material-symbols-outlined" style={{ color: C.primary }}>schedule</span>
              Due for Revision
            </h3>
            <span style={{ background: 'rgba(255,180,171,0.1)', color: C.error, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, border: `1px solid ${C.error}33` }}>{dueTopics.length} OVERDUE</span>
          </div>
          <div style={{ display: 'flex', gap: 16, borderBottom: `1px solid ${C.outlineVar}`, marginBottom: 16 }}>
            {['All', 'Overdue', 'Today', 'Upcoming'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ paddingBottom: 8, border: 'none', background: 'none', color: t === activeTab ? C.primary : C.onSurfaceVar, fontWeight: t === activeTab ? 700 : 400, fontSize: 14, cursor: 'pointer', borderBottom: t === activeTab ? `2px solid ${C.primary}` : '2px solid transparent', marginBottom: -1 }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dueTopics.map((topic, i) => (
              <div key={i} style={{ background: C.surfaceContainer, padding: 16, borderRadius: 8, border: `1px solid ${C.outlineVar}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: topic.statusColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{topic.status} • High Priority</span>
                  <span style={{ background: C.surfaceHighest, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500, color: C.onSurfaceVar }}>{topic.code}</span>
                </div>
                <h4 style={{ fontWeight: 700, color: C.onSurface, margin: '0 0 4px 0' }}>{topic.title}</h4>
                <p style={{ fontSize: 12, color: C.onSurfaceVar, marginBottom: 12 }}>{topic.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ background: C.surfaceHigh, padding: '2px 8px', borderRadius: 4, fontSize: 10, color: C.onSurfaceVar }}>{topic.diff}</span>
                    <span style={{ background: C.surfaceHigh, padding: '2px 8px', borderRadius: 4, fontSize: 10, color: C.onSurfaceVar }}>{topic.time}</span>
                  </div>
                  <button onClick={() => { dispatch(showToast(`📚 Starting revision: ${topic.title}`)); navigate('/session'); }} style={{ color: C.primary, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', background: 'none', border: 'none', cursor: 'pointer' }}>Revise Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Revision Overview + Subject Rings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, margin: 0, color: C.onSurface }}>
                <span className="material-symbols-outlined" style={{ color: C.primary }}>analytics</span>
                Revision Overview
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', padding: '4px 12px', borderRadius: 999 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.primary }}>auto_awesome</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.primary, textTransform: 'uppercase' }}>AI Tracked</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
              {[{val:total,label:'Total',color:C.onSurface},{val:revised,label:'Revised',color:C.primary},{val:weak,label:'Weak',color:C.error},{val:mastered,label:'Mastered',color:'#4ade80'}].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: 12, background: C.surfaceContainer, borderRadius: 8, border: `1px solid ${C.outlineVar}` }}>
                  <div style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: C.onSurfaceVar, textTransform: 'uppercase', fontWeight: 700 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: C.onSurfaceVar, letterSpacing: '0.08em', marginBottom: 16 }}>Daily Revision Load</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginBottom: 24 }}>
              {[
                { day: 'Monday', o: 0.2, load: 'Light' },
                { day: 'Tuesday', o: 0.4, load: 'Moderate' },
                { day: 'Wednesday', o: 0.1, load: 'Minimal' },
                { day: 'Thursday', o: 0.8, load: 'Heavy' },
                { day: 'Friday', o: 0.3, load: 'Moderate' },
                { day: 'Saturday', o: 0.6, load: 'Heavy' },
                { day: 'Sunday', o: 0.9, load: 'Critical' }
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => dispatch(showToast(`📅 ${item.day} Revision Load: ${item.load} (${Math.round(item.o * 10)} topics)`))}
                  style={{ height: 24, borderRadius: 4, background: `rgba(124,58,237,${item.o})`, border: item.o > 0.7 ? `1px solid rgba(124,58,237,0.5)` : 'none', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  title={`${item.day}: ${item.load} Load`}
                />
              ))}
            </div>
            <div style={{ border: '1px solid #7c3aed', boxShadow: '0 0 10px rgba(124,58,237,0.15)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.streakBg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.2)', color: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>local_fire_department</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, color: C.onSurface }}>{streakCount} Days Streak</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVar }}>Consistency Score: <span style={{ color: '#4ade80', fontWeight: 700 }}>{Math.min(100, streakCount * 12 + 20)}%</span></div>
                </div>
              </div>
              <span className="material-symbols-outlined" style={{ color: C.onSurfaceVar, opacity: 0.4 }}>trending_up</span>
            </div>
          </div>

          <div style={cardStyle}>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: C.onSurfaceVar, letterSpacing: '0.08em', marginBottom: 16 }}>Subject Retention Rings</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              {[
                { label: 'Overall', pct: Math.round((mastered/total)*100) || 78, color: C.primary, offset: 40 },
                { label: 'Recent', pct: Math.round((revised/total)*100) || 45, color: C.secondary, offset: 100 },
                { label: 'Pending', pct: Math.round((weak/total)*100) || 66, color: isLight ? '#7a7581' : '#c9c4d9', offset: 60 },
              ].map((ring, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke={C.surfaceHighest} strokeWidth="6" />
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke={ring.color} strokeWidth="6" strokeDasharray="175.9" strokeDashoffset={ring.offset} />
                    </svg>
                    <span style={{ position: 'absolute', fontSize: 10, fontWeight: 700, color: C.onSurface }}>{ring.pct}%</span>
                  </div>
                  <span style={{ fontSize: 10, marginTop: 8, fontWeight: 700, color: C.onSurfaceVar, textAlign: 'center' }}>{ring.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Weak Areas */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: C.onSurface }}>
            <span className="material-symbols-outlined" style={{ color: C.error }}>psychology</span>
            Weak Areas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', width: 128, height: 72, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 128, height: 128, border: `12px solid ${C.surfaceHighest}`, borderRadius: '50%', top: 0, left: 0 }} />
              <div style={{ position: 'absolute', width: 128, height: 128, border: '12px solid #7C3AED', borderTop: '12px solid transparent', borderRight: '12px solid transparent', borderRadius: '50%', top: 0, left: 0, transform: 'rotate(45deg)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, color: C.onSurface }}>{Math.round((mastered/total)*100) || 68}%</span>
                <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: C.onSurfaceVar }}>LTM Score</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {weakAreas.map(w => (
              <div key={w.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, marginBottom: 4, color: C.onSurface }}>
                  <span>{w.label}</span>
                  <span style={{ color: w.color }}>{w.pct}% Retained</span>
                </div>
                <div style={{ height: 6, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${w.pct}%`, background: w.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(124,58,237,0.05)', borderRadius: 8, border: '1px solid rgba(124,58,237,0.2)', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.primary }}>auto_awesome</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.primary, textTransform: 'uppercase' }}>AI Memory Insight</span>
            </div>
            <p style={{ fontSize: 12, color: C.onSurfaceVar, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
              "Graph Algorithms retention is dropping faster than average. Your forgetting curve suggests a high-intensity review is needed within 48 hours."
            </p>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 24 }}>
        <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden', padding: 32 }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, background: 'rgba(124,58,237,0.1)', borderRadius: '50%', filter: 'blur(48px)' }} />
          <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 20, marginBottom: 24, color: C.onSurface }}>Setup Revision Session</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: C.onSurfaceVar, letterSpacing: '0.12em', marginBottom: 12 }}>Select Subject</label>
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ width: '100%', background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, borderRadius: 12, padding: '12px 16px', color: C.onSurface, fontSize: 14 }}>
                  <option>All Subjects (AI Recommended)</option>
                  <option>Computer Science</option>
                  <option>Advanced Mathematics</option>
                  <option>Electrical Engineering</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: C.onSurfaceVar, letterSpacing: '0.12em', marginBottom: 12 }}>Duration</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['15 mins', '30 mins', '60 mins'].map((d) => (
                    <button key={d} onClick={() => setSelectedDuration(d)} style={{ flex: 1, padding: '8px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: d === selectedDuration ? `1px solid ${C.primary}` : `1px solid ${C.outlineVar}`, background: d === selectedDuration ? 'rgba(124,58,237,0.2)' : C.surfaceHighest, color: d === selectedDuration ? C.primary : C.onSurface, cursor: 'pointer' }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: C.onSurfaceVar, letterSpacing: '0.12em', marginBottom: 12 }}>Session Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {sessionTypes.map((t, i) => (
                  <button key={i} onClick={() => setActiveType(i)} style={{ padding: 16, background: i === activeType ? 'rgba(124,58,237,0.08)' : C.surfaceContainer, border: i === activeType ? `1px solid ${C.primary}` : `1px solid ${C.outlineVar}`, borderRadius: 12, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <span className="material-symbols-outlined" style={{ color: C.primary, display: 'block', marginBottom: 8 }}>{t.icon}</span>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.onSurface }}>{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 32, borderTop: `1px solid ${C.outlineVar}`, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { 
                const selectedSubClean = selectedSubject.includes('All Subjects') ? 'Computer Science' : selectedSubject;
                dispatch(showToast(`🎯 Starting ${sessionTypes[activeType].label} session for ${selectedSubClean}!`)); 
                navigate('/session', { state: { subject: selectedSubClean, type: sessionTypes[activeType].id === 'auto_fix_high' ? 'revision' : sessionTypes[activeType].id === 'style' ? 'revision' : 'pomodoro', topic: 'Smart Revision Topic' } }); 
              }}
              style={{ background: '#7C3AED', color: '#fff', padding: '16px 40px', borderRadius: 12, fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
              onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
            >
              Begin Session
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: C.onSurface }}>
            <span className="material-symbols-outlined" style={{ color: C.onSurfaceVar }}>history</span>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {recentActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                {i < recentActivity.length - 1 && <div style={{ position: 'absolute', left: 14, top: 32, bottom: -24, width: 1, background: C.outlineVar }} />}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: act.iconBg, color: act.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${act.iconColor}4d`, zIndex: 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{act.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: C.onSurface }}>{act.title}</h4>
                    <span style={{ color: act.scoreColor || C.primary, fontWeight: 700, fontSize: 14 }}>{act.score}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.onSurfaceVar, marginBottom: 4 }}>{act.type}</p>
                  <span style={{ fontSize: 10, color: C.onSurfaceVar, opacity: 0.7 }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
