import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useIsLight } from '../hooks/useIsLight';
import { addMockTestResult } from '../store/slices/studySlice';

const DARK = {
  onSurface: '#e8dfee', onSurfaceVar: '#ccc3d8', primary: '#7C3AED',
  primaryDim: '#d2bbff', secondary: '#cebdff',
  surfaceContainer: '#221e28', surfaceHigh: '#2c2833', surfaceHighest: '#37333e',
  surfaceLow: '#1d1a24', outlineVar: '#4a4455', error: '#ffb4ab',
  headerBg: 'rgba(21,18,27,0.8)',
  footerBg: '#2c2833',
};
const LIGHT = {
  onSurface: '#1a1523', onSurfaceVar: '#4a4455', primary: '#7C3AED',
  primaryDim: '#5a00c6', secondary: '#4f319c',
  surfaceContainer: '#f3f0f8', surfaceHigh: '#ede9f5', surfaceHighest: '#e4dff0',
  surfaceLow: '#faf7ff', outlineVar: '#c2bac9', error: '#ba1a1a',
  headerBg: 'rgba(245,242,252,0.92)',
  footerBg: '#ede9f5',
};

const ALL_QUESTIONS = [
  {
    q: 'What is the time complexity of binary search on a sorted array of N elements?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correct: 1,
  },
  {
    q: 'Which data structure uses the LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correct: 1,
  },
  {
    q: 'What is the worst-case time complexity of QuickSort?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    correct: 1,
  },
  {
    q: 'What is the average time complexity of MergeSort?',
    options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(log n)'],
    correct: 2,
  },
  {
    q: 'Which traversal visits nodes in sorted order for a Binary Search Tree (BST)?',
    options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
    correct: 2,
  },
  {
    q: 'What is the auxiliary space complexity of HeapSort?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correct: 0,
  },
  {
    q: 'Which data structure is typically used to implement Breadth-First Search (BFS)?',
    options: ['Stack', 'Queue', 'Priority Queue', 'BST'],
    correct: 1,
  },
  {
    q: 'What is the height of a perfectly balanced binary tree with N nodes?',
    options: ['O(N)', 'O(N²)', 'O(log N)', 'O(N log N)'],
    correct: 2,
  },
  {
    q: 'In a min-heap binary tree, where is the minimum element always located?',
    options: ['At a leaf node', 'At the root', 'In the middle level', 'Depends on insertion order'],
    correct: 1,
  },
  {
    q: 'Which algorithm finds the shortest path in a graph with non-negative edge weights?',
    options: ["Prim's", "Dijkstra's", "Kruskal's", "Bellman-Ford"],
    correct: 1,
  },
  {
    q: 'What is the worst-case time complexity of searching for an element in a Hash Table?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correct: 2,
  },
  {
    q: 'Which data structure uses pointers to both the next and the previous nodes?',
    options: ['Singly Linked List', 'Doubly Linked List', 'Queue', 'Binary Tree'],
    correct: 1,
  },
  {
    q: 'Which of the following is a stable sorting algorithm by default?',
    options: ['QuickSort', 'HeapSort', 'SelectionSort', 'MergeSort'],
    correct: 3,
  },
  {
    q: 'What is the time complexity to insert an element at the beginning of a Singly Linked List?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(1) amortized'],
    correct: 0,
  },
  {
    q: 'A graph with no cycles is called:',
    options: ['Cyclic', 'Acyclic', 'Bipartite', 'Complete'],
    correct: 1,
  },
  {
    q: 'What is the term for when two different keys hash to the same table index?',
    options: ['Collision', 'Hashing double', 'Overload', 'Conflict'],
    correct: 0,
  },
  {
    q: 'Which of the following is NOT a linear data structure?',
    options: ['Queue', 'Stack', 'Array', 'Graph'],
    correct: 3,
  },
  {
    q: 'What is the maximum number of children a binary tree node can have?',
    options: ['1', '2', '3', 'Unlimited'],
    correct: 1,
  },
  {
    q: 'Amortized time complexity of dynamic array appending is:',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correct: 0,
  },
  {
    q: 'Which algorithm is best suited for finding minimum spanning trees using an edge-centric greedy approach?',
    options: ["Kruskal's", "Dijkstra's", 'Floyd-Warshall', 'Depth First Search'],
    correct: 0,
  }
];

export default function ActiveMockTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  const subjectName = location.state?.subject || 'Data Structures';
  const timeLimitStr = location.state?.timeLimit || '30m';
  const initialTime = parseInt(timeLimitStr.replace('m', '')) * 60 || 30 * 60;
  const qCount = location.state?.qCount || 20;

  const generatedQuestions = location.state?.questions || ALL_QUESTIONS;
  const questions = generatedQuestions.slice(0, Math.min(qCount, generatedQuestions.length));

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const qData = questions[currentQ];
  const selected = selectedAnswers[currentQ];

  const handleSelectOption = (idx) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQ] = idx;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setCurrentQ(q => Math.max(0, q - 1));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / questions.length) * 100);

    const testResult = {
      id: 'r' + Date.now(),
      title: `${subjectName} - AI Assessment`,
      subject: subjectName === 'All Subjects' ? 'Computer Science' : subjectName,
      score: score,
      date: new Date().toISOString().split('T')[0],
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      userAnswers: selectedAnswers,
      questionsData: questions // save for results page
    };

    dispatch(addMockTestResult(testResult));
    navigate('/mocktest/results');
  };

  return (
    <div style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif", margin: '-32px -40px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: `1px solid ${C.outlineVar}`, background: C.headerBg, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined" style={{ color: C.primaryDim }}>school</span>
          <h1 style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 18, margin: 0, color: C.onSurface }}>Mock Test • {subjectName}</h1>
        </div>
        <div style={{ flex: 1, maxWidth: 400, padding: '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: C.onSurfaceVar }}>Question {currentQ + 1} of {questions.length}</span>
            <span style={{ fontSize: 12, color: C.primaryDim, fontWeight: 700 }}>{Math.round((currentQ + 1) / questions.length * 100)}% Complete</span>
          </div>
          <div style={{ height: 6, background: C.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(currentQ + 1) / questions.length * 100}%`, background: `linear-gradient(to right, ${C.primary}, ${C.primaryDim})` }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: isLight ? 'rgba(186,26,26,0.08)' : 'rgba(255,180,171,0.1)', border: `1px solid ${isLight ? 'rgba(186,26,26,0.3)' : 'rgba(255,180,171,0.3)'}`, borderRadius: 8 }}>
            <span className="material-symbols-outlined" style={{ color: C.error, fontSize: 16 }}>timer</span>
            <span style={{ fontFamily: "'Inter'", fontWeight: 700, color: C.error, fontSize: 18, letterSpacing: '0.08em' }}>{mins}:{secs}</span>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Question canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ background: C.surfaceContainer, borderRadius: 12, padding: 32, border: `1px solid ${C.outlineVar}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ padding: '4px 12px', background: '#7C3AED', color: '#fff', borderRadius: 6, fontWeight: 700, fontFamily: "'Inter'" }}>Q{currentQ + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(206,189,255,0.1)', border: `1px solid rgba(206,189,255,0.3)`, borderRadius: 999 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12, color: C.secondary }}>auto_awesome</span>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.secondary }}>AI Generated</span>
                </div>
              </div>
              <h2 style={{ fontFamily: "'Inter'", fontSize: 22, fontWeight: 700, lineHeight: 1.4, margin: 0, color: C.onSurface }}>
                {qData.q}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {qData.options.map((opt, i) => {
                const letter = ['A', 'B', 'C', 'D'][i];
                const isSelected = selected === i;
                return (
                  <button key={i} onClick={() => handleSelectOption(i)} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 8, textAlign: 'left',
                    background: isSelected ? C.surfaceHigh : C.surfaceLow,
                    border: isSelected ? `2px solid ${C.primaryDim}` : `1px solid ${C.outlineVar}`,
                    color: C.onSurface, cursor: 'pointer', transition: 'all 0.15s', width: '100%',
                  }}>
                    <span style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: isSelected ? '#7C3AED' : C.surfaceHighest, color: isSelected ? '#fff' : C.onSurfaceVar, fontWeight: 700, fontFamily: "'Inter'", flexShrink: 0 }}>{letter}</span>
                    <span style={{ fontSize: 15, color: C.onSurface }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {panelOpen && (
          <div style={{ width: 320, borderLeft: `1px solid ${C.outlineVar}`, display: 'flex', flexDirection: 'column', background: C.surfaceLow }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.outlineVar}`, background: C.surfaceContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Inter'", fontWeight: 700, margin: 0, color: C.onSurface }}>Questions Overview</h3>
              <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.onSurfaceVar }}>
                <span className="material-symbols-outlined">dock_to_right</span>
              </button>
            </div>
            <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
                {Array.from({ length: questions.length }, (_, i) => {
                  const isAnswered = selectedAnswers[i] !== null;
                  const isCurrent = i === currentQ;
                  return (
                    <div key={i} onClick={() => setCurrentQ(i)} style={{
                      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: "'Inter'", cursor: 'pointer',
                      transition: 'all 0.15s',
                      border: isCurrent ? `1px solid ${C.primaryDim}` : `1px solid ${isAnswered ? 'rgba(206,189,255,0.3)' : C.outlineVar}`,
                      background: isCurrent ? '#7C3AED' : isAnswered ? 'rgba(79,49,156,0.4)' : C.surfaceHighest,
                      color: isCurrent ? '#fff' : isAnswered ? C.secondary : C.onSurfaceVar,
                      boxShadow: 'none',
                    }}>{i + 1}</div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { dot: '#7C3AED', label: 'Current Question' },
                  { dot: 'rgba(79,49,156,0.8)', label: `Attempted (${selectedAnswers.filter(a => a !== null).length})` },
                  { dot: 'transparent', label: `Unattempted (${selectedAnswers.filter(a => a === null).length})`, border: C.outlineVar },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.dot, border: item.border ? `1px solid ${item.border}` : 'none' }} />
                    <span style={{ fontSize: 14, color: C.onSurfaceVar }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 24, borderTop: `1px solid ${C.outlineVar}` }}>
              <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 14, color: C.primaryDim, lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', flexShrink: 0, marginTop: 2 }}>tips_and_updates</span>
                  AI Tip: Take your time. You can jump back to any question by clicking its number in the grid.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ height: 80, background: C.footerBg, borderTop: `1px solid ${C.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handlePrev} disabled={currentQ === 0} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: `1px solid ${C.outlineVar}`, background: 'transparent', color: C.onSurfaceVar, fontWeight: 700, fontFamily: "'Inter'", cursor: currentQ === 0 ? 'not-allowed' : 'pointer', fontSize: 14, opacity: currentQ === 0 ? 0.4 : 1 }}>
            <span className="material-symbols-outlined">arrow_back</span>
            Previous
          </button>
          <button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, background: '#7C3AED', color: '#fff', border: 'none', fontWeight: 700, fontFamily: "'Inter'", cursor: 'pointer', fontSize: 14, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
            onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
          >
            {currentQ === questions.length - 1 ? 'Submit Test' : 'Next'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!panelOpen && (
            <button onClick={() => setPanelOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.outlineVar}`, background: C.surfaceContainer, color: C.onSurface, fontWeight: 700, fontFamily: "'Inter'", cursor: 'pointer', fontSize: 13 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>dock_to_right</span>
              Show Panel
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 24px', background: C.surfaceContainer, borderRadius: 999, border: `1px solid ${C.outlineVar}` }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: Math.min(12, questions.length) }, (_, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === currentQ ? C.primaryDim : selectedAnswers[i] !== null ? 'rgba(79,49,156,0.8)' : C.outlineVar }} />
              ))}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.12em', marginLeft: 8 }}>Navigation</span>
          </div>
        </div>
        <button onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 32px', borderRadius: 12, background: isLight ? 'rgba(186,26,26,0.08)' : 'rgba(147,0,10,0.2)', color: isLight ? C.error : '#ffdad6', border: `1px solid ${isLight ? 'rgba(186,26,26,0.3)' : 'rgba(255,180,171,0.3)'}`, fontWeight: 700, fontFamily: "'Inter'", cursor: 'pointer', fontSize: 14 }}>
          <span className="material-symbols-outlined">flag</span>
          Submit Test
        </button>
      </div>
    </div>
  );
}
