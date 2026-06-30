import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  onSurface: '#e8dfee', onSurfaceVar: '#ccc3d8', outline: '#958da1',
  primary: '#7C3AED', primaryDim: '#d2bbff', secondary: '#cebdff', tertiary: '#c9c4d9',
  surfaceContainer: '#221e28', surfaceHigh: '#2c2833', surfaceHighest: '#37333e',
  surfaceLow: '#1d1a24', outlineVar: '#4a4455', error: '#ffb4ab',
};
const LIGHT = {
  onSurface: '#1a1523', onSurfaceVar: '#4a4455', outline: '#7a7581',
  primary: '#7C3AED', primaryDim: '#5a00c6', secondary: '#4f319c', tertiary: '#5a5471',
  surfaceContainer: '#f3f0f8', surfaceHigh: '#ede9f5', surfaceHighest: '#e4dff0',
  surfaceLow: '#faf7ff', outlineVar: '#c2bac9', error: '#ba1a1a',
};

const subjectBreakdown = [
  { label: 'Sorting Algorithms', score: 100, color: '#4ade80', status: 'Mastered' },
  { label: 'Binary Search', score: 90, status: 'Strong' },
  { label: 'Graph Traversal', score: 60, color: '#facc15', status: 'Good' },
  { label: 'Dynamic Programming', score: 30, status: 'Weak' },
];

export default function MockTestResultsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('review');
  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  const pastResults = useSelector(state => state.study.mockTests.pastResults);
  const latestResult = pastResults[0];

  const scorePct = latestResult ? latestResult.score : 90;
  const correctCount = latestResult ? latestResult.correctAnswers : 18;
  const totalCount = latestResult ? latestResult.totalQuestions : 20;
  const subjectName = latestResult ? latestResult.title : "Data Structures AI Assessment";

  // Compute per-row colors using C (needed since error/primaryDim depend on theme)
  const breakdown = [
    { ...subjectBreakdown[0] },
    { ...subjectBreakdown[1], color: C.primaryDim },
    { ...subjectBreakdown[2] },
    { ...subjectBreakdown[3], color: C.error },
  ];

  const reviewQuestions = [];
  if (latestResult && latestResult.questionsData && latestResult.userAnswers) {
    latestResult.questionsData.forEach((q, idx) => {
      const userAnsIdx = latestResult.userAnswers[idx];
      const isCorrect = userAnsIdx === q.correct;
      const letters = ['A', 'B', 'C', 'D'];
      reviewQuestions.push({
        num: idx + 1,
        q: q.q,
        isCorrect: isCorrect,
        yourAnswer: userAnsIdx !== null ? q.options[userAnsIdx] : 'Unattempted',
        correct: q.options[q.correct],
        explanation: isCorrect ? null : `The correct answer was ${letters[q.correct]}: ${q.options[q.correct]}.`
      });
    });
  } else {
    reviewQuestions.push(
      { num: 3, q: 'What is the height of a balanced BST with n nodes?', isCorrect: false, yourAnswer: 'O(n)', correct: 'O(log n)', explanation: 'A balanced BST maintains a height of O(log n) by ensuring the difference of heights of left and right subtrees is at most 1.' },
      { num: 7, q: 'Which traversal visits nodes in sorted order for a BST?', isCorrect: true, yourAnswer: 'In-order', correct: 'In-order' },
      { num: 12, q: "Dijkstra's algorithm fails with...", isCorrect: false, yourAnswer: 'Unweighted graphs', correct: 'Negative weight edges', explanation: "Dijkstra's greedy approach assumes non-negative weights. Negative edges can invalidate its shortest-path guarantee." },
    );
  }

  // Calculate Dash Offset for circular progress (radius = 90, circumference = 2 * pi * 90 = 565.48)
  const strokeDashoffset = 565.5 - (565.5 * scorePct) / 100;

  return (
    <div style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Score Section */}
      <div style={{ textAlign: 'center', marginBottom: 48, position: 'relative', padding: '32px 0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'rgba(124,58,237,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
            {subjectName} • {totalCount} Questions
          </p>
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="90" fill="transparent" stroke={C.surfaceHighest} strokeWidth="12" />
              <circle cx="100" cy="100" r="90" fill="transparent" stroke="#7C3AED" strokeWidth="12" strokeDasharray="565.5" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Inter'", fontSize: 48, fontWeight: 800, color: C.onSurface, lineHeight: 1 }}>{scorePct}%</span>
              <span style={{ fontSize: 12, color: C.onSurfaceVar, fontWeight: 700 }}>{correctCount} / {totalCount} correct</span>
            </div>
          </div>
          <h2 style={{ fontFamily: "'Inter'", fontSize: 32, fontWeight: 700, margin: '0 0 8px 0', color: C.onSurface }}>
            {scorePct >= 80 ? 'Excellent Performance! 🎉' : scorePct >= 50 ? 'Good Job! 👍' : 'Keep Practicing! 💪'}
          </h2>
          <p style={{ color: C.onSurfaceVar, fontSize: 16 }}>
            {scorePct >= 85 ? 'Top 12% of all students in Data Structures' : 'Continue using AI revisions to master weak areas'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 }}>
            <button onClick={() => navigate('/mocktest')} style={{ padding: '12px 24px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
              onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
            >Retake Test</button>
            <button onClick={() => { setActiveTab('review'); document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ padding: '12px 24px', background: C.surfaceContainer, color: C.onSurface, border: `1px solid ${C.outlineVar}`, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
              onMouseLeave={e => e.currentTarget.style.background = C.surfaceContainer}
            >Review Answers</button>
            <button style={{ padding: '12px 24px', background: C.surfaceContainer, color: C.onSurface, border: `1px solid ${C.outlineVar}`, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
              onMouseLeave={e => e.currentTarget.style.background = C.surfaceContainer}
              onClick={() => { if (navigator.share) { navigator.share({ title: 'My Mock Test Result', text: `I scored ${scorePct}% on Data Structures Mock Test on EduPilot AI! 🎉`, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); dispatch(showToast('✅ Result link copied to clipboard!')); }}}
            >Share Result</button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: 'task_alt', label: 'Correct', val: '18', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
          { icon: 'cancel', label: 'Incorrect', val: '2', color: C.error, bg: isLight ? 'rgba(186,26,26,0.1)' : 'rgba(255,180,171,0.1)' },
          { icon: 'timer', label: 'Time Taken', val: '42m 15s', color: C.primaryDim, bg: 'rgba(124,58,237,0.1)' },
          { icon: 'trending_up', label: 'Improvement', val: '+4%', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: 12, color: C.onSurfaceVar, margin: '0 0 4px 0' }}>{s.label}</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 22, fontWeight: 700, color: s.color, margin: 0 }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div id="review-section" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: C.surfaceLow, padding: 4, borderRadius: 12, marginBottom: 24 }}>
            {[['review', 'Question Review'], ['breakdown', 'Topic Breakdown'], ['insights', 'AI Insights']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, background: activeTab === key ? C.surfaceContainer : 'transparent', color: activeTab === key ? C.onSurface : C.onSurfaceVar, transition: 'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviewQuestions.map((q, i) => (
                <div key={i} style={{ background: C.surfaceContainer, border: `1px solid ${q.isCorrect ? 'rgba(74,222,128,0.3)' : 'rgba(255,180,171,0.3)'}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: q.isCorrect ? 'rgba(74,222,128,0.2)' : 'rgba(255,180,171,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: q.isCorrect ? '#4ade80' : C.error }}>{q.isCorrect ? 'check' : 'close'}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.onSurfaceVar }}>Question {q.num}</span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, lineHeight: 1.5, color: C.onSurface }}>{q.q}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ padding: '8px 12px', borderRadius: 8, background: q.isCorrect ? 'rgba(74,222,128,0.1)' : 'rgba(255,180,171,0.1)', border: `1px solid ${q.isCorrect ? 'rgba(74,222,128,0.3)' : 'rgba(255,180,171,0.3)'}` }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: q.isCorrect ? '#4ade80' : C.error, textTransform: 'uppercase', margin: '0 0 4px 0' }}>Your Answer</p>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: C.onSurface }}>{q.yourAnswer}</p>
                      </div>
                      {!q.isCorrect && (
                        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Correct Answer</p>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: C.onSurface }}>{q.correct}</p>
                        </div>
                      )}
                    </div>
                    {q.explanation && (
                      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)', display: 'flex', gap: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.primaryDim, flexShrink: 0 }}>tips_and_updates</span>
                        <p style={{ fontSize: 13, color: C.onSurfaceVar, margin: 0, lineHeight: 1.5 }}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div style={{ background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: "'Inter'", fontSize: 18, fontWeight: 700, marginBottom: 24, color: C.onSurface }}>Topic-wise Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {breakdown.map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: C.onSurface }}>{s.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.status}</span>
                        <span style={{ fontWeight: 700, color: s.color }}>{s.score}%</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.score}%`, background: s.color, borderRadius: 999, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: 'auto_awesome', title: 'Strength Identified', body: 'Your sorting algorithm performance is in the top 5% of students. Focus on Dynamic Programming next to achieve a balanced skill set.', color: C.primaryDim, bg: 'rgba(124,58,237,0.05)', border: 'rgba(124,58,237,0.15)' },
                { icon: 'warning', title: 'Focus Area Alert', body: 'Dynamic Programming is your weakest area at 30%. The upcoming exam patterns show 25% questions from this topic. Urgent revision required.', color: C.error, bg: isLight ? 'rgba(186,26,26,0.05)' : 'rgba(255,180,171,0.05)', border: isLight ? 'rgba(186,26,26,0.15)' : 'rgba(255,180,171,0.15)' },
                { icon: 'schedule', title: 'Optimal Study Time', body: 'Based on your test patterns, you perform 18% better in morning sessions. Schedule your next mock test between 9-11 AM for best results.', color: '#4ade80', bg: 'rgba(74,222,128,0.05)', border: 'rgba(74,222,128,0.15)' },
              ].map((item, i) => (
                <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: 20, display: 'flex', gap: 16 }}>
                  <span className="material-symbols-outlined" style={{ color: item.color, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <h4 style={{ fontWeight: 700, color: item.color, margin: '0 0 8px 0', fontSize: 14 }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: C.onSurfaceVar, margin: 0, lineHeight: 1.6 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Summary + Next Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 16, fontWeight: 700, marginBottom: 20, color: C.onSurface }}>Subject Mastery Rings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {breakdown.map(s => (
                <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'relative', width: 60, height: 60 }}>
                    <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="30" cy="30" r="24" fill="transparent" stroke={C.surfaceHighest} strokeWidth="6" />
                      <circle cx="30" cy="30" r="24" fill="transparent" stroke={s.color} strokeWidth="6" strokeDasharray="150.8" strokeDashoffset={150.8 * (1 - s.score / 100)} />
                    </svg>
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: C.onSurface }}>{s.score}%</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.onSurfaceVar, textAlign: 'center' }}>{s.label.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: C.onSurface }}>
              <span className="material-symbols-outlined" style={{ color: C.primaryDim }}>auto_awesome</span>
              AI Next Steps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Revise Dynamic Programming (Weak Area)', 'Practice 10 Graph questions', 'Schedule revision in Smart Revision'].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(124,58,237,0.05)', borderRadius: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: C.onSurfaceVar }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 16, fontWeight: 700, marginBottom: 16, color: C.onSurface }}>Score History</h3>
            <div style={{ height: 80, position: 'relative' }}>
              <svg width="100%" height="80" preserveAspectRatio="none">
                <path d="M0 60 L80 55 L160 65 L240 40 L320 25 L400 15" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                {[{cx:'0%',cy:60},{cx:'20%',cy:55},{cx:'40%',cy:65},{cx:'60%',cy:40},{cx:'80%',cy:25},{cx:'100%',cy:15}].map((p, i) => (
                  <circle key={i} cx={p.cx} cy={p.cy} r="4" fill={C.primaryDim} />
                ))}
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.onSurfaceVar, marginTop: 8 }}>
              {['72%', '74%', '68%', '80%', '85%', '90%'].map((v, i) => <span key={i}>{v}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
