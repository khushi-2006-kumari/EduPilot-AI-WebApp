import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { setGeneratedPlan } from '../store/slices/studySlice';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  bg: '#0D0B1A',
  primary: '#7C3AED',
  primaryDim: '#d2bbff',
  secondary: '#cebdff',
  onSurface: '#e8dfee',
  onSurfaceVar: '#ccc3d8',
  outlineVar: '#4a4455',
  cardBg: 'rgba(29,26,36,0.8)',
  cardBorder: '#4a4455',
  aiCardBorder: 'rgba(124,58,237,0.3)',
  aiCardShadow: 'rgba(124,58,237,0.15)',
  uploadCardBg: 'rgba(44,40,51,0.3)',
  uploadCardText: '#e8dfee',
  uploadCardSub: '#958da1',
  uploadBtnBg: '#37333e',
  unitBg: 'rgba(44,40,51,0.5)',
  unitBorder: 'rgba(74,68,85,0.3)',
  timeTagBg: '#37333e',
  timeTagColor: '#ccc3d8',
  roadmapDotBg: '#4a4455',
  roadmapDotBorder: '#0D0B1A',
  roadmapActiveBorder: '#0D0B1A',
  generateBtnBg: '#2c2833',
  progressTrackBg: '#37333e',
  weekdayInactiveBg: '#37333e',
};

const LIGHT = {
  bg: '#ffffff',
  primary: '#7C3AED',
  primaryDim: '#5a00c6',
  secondary: '#4f319c',
  onSurface: '#1a1523',
  onSurfaceVar: '#4a4455',
  outlineVar: '#c2bac9',
  cardBg: 'rgba(255,255,255,0.7)',
  cardBorder: 'rgba(122,117,129,0.2)',
  aiCardBorder: 'rgba(124,58,237,0.2)',
  aiCardShadow: 'rgba(124,58,237,0.05)',
  uploadCardBg: 'rgba(0,0,0,0.03)',
  uploadCardText: '#1a1523',
  uploadCardSub: '#6b6478',
  uploadBtnBg: '#ede9f5',
  unitBg: 'rgba(240,237,245,0.6)',
  unitBorder: 'rgba(122,117,129,0.2)',
  timeTagBg: '#ede9f5',
  timeTagColor: '#4a4455',
  roadmapDotBg: '#c2bac9',
  roadmapDotBorder: '#ffffff',
  roadmapActiveBorder: '#ffffff',
  generateBtnBg: '#ede9f5',
  progressTrackBg: '#e0dce8',
  weekdayInactiveBg: '#e0dce8',
};

const uploadSlots = [
  { id: 'syllabus', icon: 'description', title: 'Syllabus PDF', sub: 'Main course outline' },
  { id: 'unitlist', icon: 'list_alt', title: 'Unit List', sub: 'Chapter breakdown' },
  { id: 'exampattern', icon: 'insert_chart', title: 'Exam Pattern', sub: 'Weightage & structure' },
];

const defaultUnits = [
  {
    id: 1, label: 'Unit 1: Core Fundamentals', count: '4 topics',
    topics: [
      { name: 'Recursion & Memory', level: 'HIGH', color: '#ef4444', bg: 'rgba(239,68,68,0.2)', time: '~2 hrs' },
      { name: 'Asymptotic Analysis', level: 'MEDIUM', color: '#eab308', bg: 'rgba(234,179,8,0.2)', time: '~2 hrs' },
    ],
  },
  { id: 2, label: 'Unit 2: Linear Structures', count: '6 topics', topics: [] },
  {
    id: 3, label: 'Unit 3: Non-Linear Structures', count: '3 topics',
    topics: [
      { name: 'Graph Traversal (BFS)', level: 'LOW', color: '#22c55e', bg: 'rgba(34,197,94,0.2)', time: '~1 hr' },
    ],
  },
];

const defaultRoadmap = [
  { weeks: 'Week 1 - 2', title: 'Unit 1: Fundamentals', desc: 'Recursion, Space-Time complexity, Stack memory.', active: true },
  { weeks: 'Week 3 - 5', title: 'Unit 2: Linear Data', desc: 'Linked Lists, Queues, Hashing mechanisms.', active: false },
  { weeks: 'Week 6 - 8', title: 'Unit 3: Tree Algorithms', desc: 'AVL Trees, Heap Sort, Pathfinding traversals.', active: true },
];

// Alternate syllabus topics
const mathUnits = [
  {
    id: 1, label: 'Unit 1: Linear Algebra', count: '3 topics',
    topics: [
      { name: 'Vector Spaces & Dimension Theorem', level: 'HIGH', color: '#ef4444', bg: 'rgba(239,68,68,0.2)', time: '~3 hrs' },
      { name: 'Eigenvalues & Matrix Rotations', level: 'MEDIUM', color: '#eab308', bg: 'rgba(234,179,8,0.2)', time: '~2 hrs' },
    ],
  },
  { id: 2, label: 'Unit 2: Advanced Integration', count: '5 topics', topics: [] },
  {
    id: 3, label: 'Unit 3: Ordinary ODEs', count: '2 topics',
    topics: [
      { name: 'First-Order Integrating Factors', level: 'LOW', color: '#22c55e', bg: 'rgba(34,197,94,0.2)', time: '~1 hr' },
    ],
  },
];

const mathRoadmap = [
  { weeks: 'Week 1 - 3', title: 'Unit 1: Vector Systems', desc: 'Vector spacing, base dimensions, matrix eigenvalues.', active: true },
  { weeks: 'Week 4 - 7', title: 'Unit 2: Integration Blocks', desc: 'Partial fractions, improper double integrals.', active: false },
  { weeks: 'Week 8 - 12', title: 'Unit 3: ODE Solvers', desc: 'Homogeneous linear equations, Laplace transform.', active: true },
];

const electronicsUnits = [
  {
    id: 1, label: 'Unit 1: Semiconductor Diodes', count: '2 topics',
    topics: [
      { name: 'PN Junction Charge Curves', level: 'MEDIUM', color: '#eab308', bg: 'rgba(234,179,8,0.2)', time: '~2 hrs' },
      { name: 'Zener Diode Regulation', level: 'HIGH', color: '#ef4444', bg: 'rgba(239,68,68,0.2)', time: '~3 hrs' },
    ],
  },
  { id: 2, label: 'Unit 2: Transistor Biasing', count: '4 topics', topics: [] },
  {
    id: 3, label: 'Unit 3: Sequential Logic', count: '3 topics',
    topics: [
      { name: 'JK Flip Flops & Synchronous Counters', level: 'CRITICAL', color: '#ef4444', bg: 'rgba(239,68,68,0.2)', time: '~4 hrs' },
    ],
  },
];

const electronicsRoadmap = [
  { weeks: 'Week 1 - 3', title: 'Unit 1: Solid State Diodes', desc: 'Rectifiers, clipping circuits, Zener diodes.', active: true },
  { weeks: 'Week 4 - 8', title: 'Unit 2: BJT Amplifiers', desc: 'DC load lines, transistor small-signal circuits.', active: false },
  { weeks: 'Week 9 - 12', title: 'Unit 3: Counters & FSMs', desc: 'Latch logic, register gates, finite state machines.', active: true },
];

const defaultInsights = {
  weightage: { confidence: "84%", coreLogic: "45%", application: "30%", theory: "25%" },
  criticalFocus: { trends: ["Dynamic Programming", "Complex Graphs"], resourceTitle: "DP Patterns Masterclass" },
  weeklyCommitment: { hours: "12h / 15h", progressPercent: "80%", days: [true, true, true, false, true, true, true] }
};

export default function SyllabusAnalyzerPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  // States
  const [openUnits, setOpenUnits] = useState({ 1: true, 3: true });
  const [selectedFiles, setSelectedFiles] = useState({});
  const [actualFiles, setActualFiles] = useState({});
  const [currentSlotId, setCurrentSlotId] = useState(null);
  
  // Custom generated topics based on selection
  const [syllabusUnits, setSyllabusUnits] = useState(null);
  const [syllabusRoadmap, setSyllabusRoadmap] = useState(null);
  const [insights, setInsights] = useState(null);
  const [completedTopics, setCompletedTopics] = useState({});

  // Analysis Loader States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [genLabel, setGenLabel] = useState('');

  const handleBrowseClick = (slotId) => {
    setCurrentSlotId(slotId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentSlotId) return;

    setSelectedFiles(prev => ({
      ...prev,
      [currentSlotId]: file.name
    }));
    setActualFiles(prev => ({
      ...prev,
      [currentSlotId]: file
    }));
  };

  const triggerAnalysis = async () => {
    const fileToUpload = actualFiles['syllabus'] || Object.values(actualFiles)[0];

    if (!fileToUpload) {
      dispatch(showToast('Please upload a file first!'));
      return;
    }

    setIsAnalyzing(true);
    setGenStep(0);
    setGenLabel('Uploading document to AI Engine...');

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await fetch('http://localhost:5000/api/syllabus/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze syllabus');
      }

      setGenStep(1);
      setGenLabel('AI weighting chapter relevance & test metrics...');

      setTimeout(() => {
        setGenStep(2);
        setGenLabel('Mapping curriculum to optimal revision timelines...');
        setTimeout(() => {
          setGenStep(3);
          setGenLabel('Finalizing custom spaced repetition schedule...');
          setTimeout(() => {
            setSyllabusUnits(data.syllabusUnits || defaultUnits);
            setSyllabusRoadmap(data.syllabusRoadmap || defaultRoadmap);
            setInsights(data.insights || defaultInsights);
            dispatch(showToast('🧠 Syllabus analyzed successfully!'));
            setIsAnalyzing(false);
          }, 800);
        }, 800);
      }, 800);

    } catch (err) {
      console.error(err);
      dispatch(showToast(err.message || 'Error analyzing syllabus.'));
      setIsAnalyzing(false);
    }
  };

  const S = {
    page: { color: C.onSurface, fontFamily: "'Inter', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    h2: { fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: 700, color: C.onSurface, margin: 0 },
    subtext: { fontSize: '16px', color: C.onSurfaceVar, marginTop: '6px' },
    aiBadge: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 16px', borderRadius: '999px',
      background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
      color: C.primaryDim, fontSize: '14px', fontWeight: 600,
    },
    uploadSection: {
      background: C.cardBg, border: `1px solid ${C.aiCardBorder}`,
      boxShadow: `0 0 15px ${C.aiCardShadow}`, borderRadius: '16px', padding: '32px',
      marginBottom: '24px',
    },
    uploadGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
    uploadCard: {
      border: `2px dashed ${C.outlineVar}`, borderRadius: '12px', padding: '24px',
      textAlign: 'center', cursor: 'pointer', background: C.uploadCardBg,
      transition: 'border-color 0.2s',
    },
    analyzeBtn: {
      width: '100%', marginTop: '32px', padding: '16px',
      background: C.primary, color: '#fff', fontFamily: "'Inter', sans-serif",
      fontSize: '16px', fontWeight: 700, border: 'none', borderRadius: '12px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '8px', boxShadow: `0 0 20px ${C.aiCardShadow}`,
      transition: 'box-shadow 0.2s',
    },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
    card: {
      background: C.cardBg, border: `1px solid ${C.cardBorder}`,
      borderRadius: '16px', padding: '24px',
    },
    aiGlowCard: {
      background: C.cardBg, border: `1px solid ${C.aiCardBorder}`,
      boxShadow: `0 0 15px ${C.aiCardShadow}`, borderRadius: '16px', padding: '24px',
      position: 'relative',
    },
    cardTitle: { fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600, color: C.onSurface, margin: 0 },
    aiBadgeSmall: {
      display: 'flex', alignItems: 'center', gap: '4px',
      background: 'rgba(124,58,237,0.1)', padding: '4px 8px', borderRadius: '999px',
    },
  };

  return (
    <div style={S.page}>
      <style>{`
        .loading-pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #7C3AED;
          animation: pulse 1.2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,image/*"
      />

      {/* Page Header */}
      <div style={S.header}>
        <div>
          <h2 style={S.h2}>Syllabus Analyzer</h2>
          <p style={S.subtext}>Upload your course document to generate an AI-powered study roadmap.</p>
        </div>
        <div style={S.aiBadge}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)', display: 'inline-block' }} />
          AI Engine: Active
        </div>
      </div>

      {/* Upload Section */}
      <div style={S.uploadSection}>
        <div style={S.uploadGrid}>
          {uploadSlots.map((slot) => {
            const hasFile = !!selectedFiles[slot.id];
            return (
              <div key={slot.title}
                style={{
                  ...S.uploadCard,
                  borderColor: hasFile ? '#7C3AED' : C.outlineVar
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = hasFile ? '#7C3AED' : C.outlineVar}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#7C3AED', display: 'block', marginBottom: 12 }}>{slot.icon}</span>
                <h4 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 14, color: C.uploadCardText, margin: '0 0 4px 0' }}>{slot.title}</h4>
                <p style={{ fontSize: 11, color: hasFile ? '#4ade80' : C.uploadCardSub, fontWeight: hasFile ? 700 : 400, textTransform: hasFile ? 'none' : 'uppercase', letterSpacing: '0.05em', marginBottom: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {hasFile ? `📄 ${selectedFiles[slot.id]}` : slot.sub}
                </p>
                <button onClick={() => handleBrowseClick(slot.id)} style={{ width: '100%', padding: '8px 16px', background: C.uploadBtnBg, border: 'none', borderRadius: 8, color: C.uploadCardText, fontSize: 12, cursor: 'pointer' }}>
                  {hasFile ? 'Replace File' : 'Browse'}
                </button>
              </div>
            );
          })}
        </div>
        <button
          style={S.analyzeBtn}
          onClick={triggerAnalysis}
          onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
          onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
        >
          Analyse with AI
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
        </button>
      </div>

      {/* 3-Column Layout or Empty State */}
      {!syllabusUnits ? (
        <div style={{ ...S.card, textAlign: 'center', padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.unitBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#7C3AED', opacity: 0.8 }}>analytics</span>
          </div>
          <h3 style={{ ...S.cardTitle, color: C.onSurface }}>Awaiting Analysis</h3>
          <p style={{ color: C.onSurfaceVar, maxWidth: 450, margin: '0 auto', fontSize: 14, lineHeight: 1.6 }}>
            Upload your syllabus or exam pattern document above and click "Analyse with AI" to generate your custom extracted topics, optimal study roadmap, and critical focus insights.
          </p>
        </div>
      ) : (
        <div style={S.grid3}>
          {/* Col 1: Extracted Topics */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: 24, justifyContent: 'space-between' }}>
            <h3 style={S.cardTitle}>Extracted Topics</h3>
            <span className="material-symbols-outlined" style={{ color: '#7C3AED' }}>segment</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {syllabusUnits.map(unit => (
              <div key={unit.id} style={{ borderRadius: 12, background: C.unitBg, border: `1px solid ${C.unitBorder}`, overflow: 'hidden' }}>
                <div
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setOpenUnits(p => ({ ...p, [unit.id]: !p[unit.id] }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: openUnits[unit.id] ? '#7C3AED' : C.onSurfaceVar }}>
                      {openUnits[unit.id] ? 'expand_more' : 'chevron_right'}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: C.onSurface }}>{unit.label}</span>
                  </div>
                  <span style={{ fontSize: 10, color: C.onSurfaceVar }}>{unit.count}</span>
                </div>
                {openUnits[unit.id] && unit.topics.length > 0 && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {unit.topics.map(topic => {
                      const isChecked = completedTopics[topic.name] !== false;
                      return (
                        <div key={topic.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={() => {
                                setCompletedTopics(prev => ({ ...prev, [topic.name]: !isChecked }));
                                dispatch(showToast(`Marked ${topic.name} as ${!isChecked ? 'completed' : 'incomplete'}`));
                              }}
                              style={{ accentColor: '#7C3AED', width: 16, height: 16, cursor: 'pointer' }} 
                            />
                            <span style={{ fontSize: 14, color: C.onSurface, textDecoration: isChecked ? 'none' : 'line-through', opacity: isChecked ? 1 : 0.6 }}>{topic.name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: topic.bg, color: topic.color }}>{topic.level}</span>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: C.timeTagBg, color: C.timeTagColor }}>{topic.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button style={{ marginTop: 24, width: '100%', padding: '12px', border: `1px solid ${C.outlineVar}`, borderRadius: 12, background: C.generateBtnBg, color: C.onSurface, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = isLight ? '#e0dce8' : '#37333e'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.generateBtnBg; }}
            onClick={triggerAnalysis}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Re-Analyse
          </button>
        </div>

        {/* Col 2: AI Study Roadmap */}
        <div style={{ ...S.card, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -80, top: -80, width: 160, height: 160, background: 'rgba(124,58,237,0.1)', filter: 'blur(80px)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <h3 style={S.cardTitle}>AI Study Roadmap</h3>
            <div style={S.aiBadgeSmall}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#7C3AED' }}>auto_awesome</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase' }}>Optimal</span>
            </div>
          </div>
          <div style={{ position: 'relative', paddingLeft: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ position: 'absolute', left: 11, top: 8, bottom: 16, width: 2, background: C.unitBorder }} />
            {syllabusRoadmap.map((node, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {node.active ? (
                  <div style={{ position: 'absolute', left: -41, top: 4, width: 24, height: 24, borderRadius: '50%', background: '#7C3AED', border: `4px solid ${C.roadmapActiveBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(167,139,250,0.4)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#fff' }}>star</span>
                  </div>
                ) : (
                  <div style={{ position: 'absolute', left: -35, top: 4, width: 12, height: 12, borderRadius: '50%', background: C.roadmapDotBg, border: `2px solid ${C.roadmapDotBorder}` }} />
                )}
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: node.active ? '#A78BFA' : C.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{node.weeks}</span>
                  <h4 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 14, color: C.onSurface, margin: '4px 0' }}>{node.title}</h4>
                  <p style={{ fontSize: 14, color: C.onSurfaceVar, margin: 0 }}>{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            style={{ marginTop: 32, width: '100%', padding: '16px', background: C.generateBtnBg, border: `1px solid ${C.outlineVar}`, borderRadius: 12, color: C.onSurface, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = isLight ? '#e0dce8' : '#37333e'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.generateBtnBg; }}
            onClick={() => {
              dispatch(setGeneratedPlan({ units: syllabusUnits, roadmap: syllabusRoadmap, insights }));
              navigate('/planner');
            }}
          >
            Generate Full Timeline
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </button>
        </div>

        {/* Col 3: Weightage & Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Weightage Chart */}
          <div style={S.card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.onSurface, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>Topic Weightage</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0', position: 'relative' }}>
              <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="65" fill="transparent" stroke={C.progressTrackBg} strokeWidth="12" />
                <circle cx="80" cy="80" r="65" fill="transparent" stroke="#7C3AED" strokeWidth="12" strokeDasharray="408" strokeDashoffset="120" strokeLinecap="round" />
                <circle cx="80" cy="80" r="65" fill="transparent" stroke="#A78BFA" strokeWidth="12" strokeDasharray="408" strokeDashoffset="300" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ display: 'block', fontFamily: "'Inter'", fontSize: 24, fontWeight: 600, color: '#7C3AED' }}>{insights.weightage.confidence}</span>
                <span style={{ display: 'block', fontSize: 8, color: C.onSurfaceVar, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.2em' }}>Confidence</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 16 }}>
              {[
                { dot: '#7C3AED', label: 'Core Logic', val: insights.weightage.coreLogic }, 
                { dot: '#A78BFA', label: 'Application', val: insights.weightage.application }, 
                { dot: C.outlineVar, label: 'Theory', val: insights.weightage.theory }
              ].map(it => (
                <div key={it.label} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: it.dot }} />
                    <span style={{ fontSize: 10, color: C.onSurfaceVar }}>{it.label}</span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.onSurface, margin: 0 }}>{it.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Focus */}
          <div style={S.aiGlowCard}>
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)' }}>AI BADGE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ color: '#7C3AED' }}>tips_and_updates</span>
              <h3 style={{ ...S.cardTitle, fontSize: 14 }}>Critical Focus</h3>
            </div>
            <p style={{ fontSize: 14, color: C.onSurfaceVar, lineHeight: 1.6, marginBottom: 24 }}>
              Past exam trends show <strong style={{ color: C.onSurface, textDecoration: 'underline' }}>{insights.criticalFocus.trends[0]}</strong> and <strong style={{ color: C.onSurface, textDecoration: 'underline' }}>{insights.criticalFocus.trends[1]}</strong> appearing in 60% of technical evaluations.
            </p>
            <div 
              onClick={() => dispatch(showToast(`🎥 Launching '${insights.criticalFocus.resourceTitle}' lecture video...`))}
              style={{ padding: 12, background: C.unitBg, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${C.unitBorder}`, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.generateBtnBg; e.currentTarget.style.borderColor = '#7C3AED'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.unitBg; e.currentTarget.style.borderColor = C.unitBorder; }}
              className="active:scale-98"
            >
              <div style={{ width: 48, height: 48, background: 'rgba(124,58,237,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#7C3AED', fontSize: 24 }}>play_circle</span>
              </div>
              <div>
                <p style={{ fontSize: 10, color: C.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Recommended Resource</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.onSurface, margin: 0 }}>{insights.criticalFocus.resourceTitle}</p>
              </div>
            </div>
          </div>

          {/* Weekly Commitment */}
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.onSurface, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Weekly Commitment</p>
              <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 14 }}>{insights.weeklyCommitment.hours}</span>
            </div>
            <div style={{ width: '100%', height: 6, background: C.progressTrackBg, borderRadius: 999, marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: insights.weeklyCommitment.progressPercent, background: '#7C3AED', borderRadius: 999, boxShadow: '0 0 10px rgba(124,58,237,0.5)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
              {insights.weeklyCommitment.days.map((active, i) => (
                <div key={i} style={{ aspectRatio: '1', background: active ? '#7C3AED' : C.weekdayInactiveBg, borderRadius: 4 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Dynamic Loader Overlay */}
      {isAnalyzing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, backgroundColor: 'rgba(15,13,22,0.8)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: C.cardBg, border: `1px solid ${C.outlineVar}`, padding: 40, borderRadius: 24, textAlign: 'center', maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <div className="loading-pulse-dot" style={{ animationDelay: '0s' }} />
              <div className="loading-pulse-dot" style={{ animationDelay: '0.2s' }} />
              <div className="loading-pulse-dot" style={{ animationDelay: '0.4s' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, color: C.onSurface, fontWeight: 700 }}>AI Syllabus Parsing</h3>
            <p style={{ margin: 0, fontSize: 14, color: C.onSurfaceVar }}>{genLabel}</p>
            <div style={{ height: 6, width: '100%', background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden', marginTop: 10 }}>
              <div style={{ height: '100%', width: `${(genStep + 1) * 25}%`, background: '#7C3AED', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
