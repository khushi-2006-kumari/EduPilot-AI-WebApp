import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  onSurface: '#e8dfee', onSurfaceVar: '#ccc3d8',
  primary: '#7C3AED', primaryDim: '#d2bbff', secondary: '#cebdff',
  surfaceContainer: '#221e28', surfaceHigh: '#2c2833', surfaceHighest: '#37333e',
  surfaceLow: '#1d1a24', surfaceLowest: '#100d16', outlineVar: '#4a4455', error: '#ffb4ab',
  panelBg: 'rgba(16,13,22,0.5)',
  inputBarBg: 'rgba(21,18,27,0.8)',
};
const LIGHT = {
  onSurface: '#1a1523', onSurfaceVar: '#4a4455',
  primary: '#7C3AED', primaryDim: '#5a00c6', secondary: '#4f319c',
  surfaceContainer: '#f3f0f8', surfaceHigh: '#ede9f5', surfaceHighest: '#e4dff0',
  surfaceLow: '#faf7ff', surfaceLowest: '#ffffff', outlineVar: '#c2bac9', error: '#ba1a1a',
  panelBg: 'rgba(240,237,248,0.8)',
  inputBarBg: 'rgba(245,242,252,0.95)',
};

const suggestions = [
  { icon: 'calculate', title: 'Solve a Math Problem', desc: 'Step-by-step calculus or algebra derivation.' },
  { icon: 'terminal', title: 'Debug Code', desc: 'Find errors in Python, C++, or React projects.' },
  { icon: 'science', title: 'Explain a Concept', desc: 'Simplify complex theories for exams.' },
  { icon: 'auto_awesome', title: 'Study Tips', desc: 'Custom revision techniques for your subjects.' },
];

export default function DoubtSolverPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();
  const isLight = useIsLight();
  const C = isLight ? LIGHT : DARK;

  const handleSuggest = (title) => {
    setInput(`Help me ${title.toLowerCase()}...`);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const history = [...messages];
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.text, history })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Error: " + (data.error || "Something went wrong.") }]);
        dispatch(showToast('Failed to get AI response.'));
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection error. Make sure the backend is running." }]);
      dispatch(showToast('Connection error.'));
    } finally {
      setIsTyping(false);
    }
  };

  const hasConversation = messages.length > 0;

  return (
    <div style={{ color: C.onSurface, fontFamily: "'Inter', sans-serif", margin: '-32px -40px', height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden', position: 'relative' }}>
      {/* Floating blobs */}
      <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', borderRadius: '50%', top: 80, right: 160, zIndex: 0, filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', borderRadius: '50%', bottom: 80, left: 80, zIndex: 0, filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Center: Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', zIndex: 1 }}>
        {!hasConversation ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
            <div style={{ maxWidth: 672, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 32 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(124,58,237,0.15)', borderRadius: '50%', filter: 'blur(32px)' }} />
                <div style={{ position: 'relative', width: '100%', height: '100%', border: '1px solid #7C3AED', boxShadow: '0 0 12px rgba(124,58,237,0.2)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.surfaceContainer, overflow: 'hidden' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 72, color: C.primaryDim }}>smart_toy</span>
                </div>
              </div>
              <h2 style={{ fontFamily: "'Inter'", fontSize: 40, fontWeight: 700, marginBottom: 16, textAlign: 'center', letterSpacing: '-0.02em', color: C.onSurface }}>Ask your first doubt</h2>
              <p style={{ color: C.onSurfaceVar, fontSize: 16, textAlign: 'center', marginBottom: 48, maxWidth: 480 }}>
                Get instant, step-by-step solutions to your academic queries. From quantum physics to complex code, I'm here to help.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, width: '100%', maxWidth: 576 }}>
                {suggestions.map(s => (
                  <button key={s.title} onClick={() => handleSuggest(s.title)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 24, borderRadius: 12, border: `1px solid ${C.outlineVar}`, background: C.surfaceLow, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', color: C.onSurface }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; e.currentTarget.style.background = C.surfaceContainer; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.outlineVar; e.currentTarget.style.background = C.surfaceLow; }}
                  >
                    <span className="material-symbols-outlined" style={{ color: C.primaryDim, marginBottom: 12, fontSize: 28 }}>{s.icon}</span>
                    <h4 style={{ fontWeight: 700, fontSize: 14, margin: '0 0 6px 0', color: C.onSurface }}>{s.title}</h4>
                    <p style={{ fontSize: 13, color: C.onSurfaceVar, margin: 0 }}>{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fff' }}>smart_toy</span>
                  </div>
                )}
                <div style={{ maxWidth: '70%', padding: '14px 18px', borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', background: msg.role === 'user' ? '#7C3AED' : C.surfaceContainer, border: msg.role === 'ai' ? `1px solid ${C.outlineVar}` : 'none', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: msg.role === 'user' ? '#fff' : C.onSurface }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fff' }}>smart_toy</span>
                </div>
                <div style={{ padding: '14px 20px', borderRadius: '20px 20px 20px 4px', background: C.surfaceContainer, border: `1px solid ${C.outlineVar}`, display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[0, 1, 2].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: C.primaryDim, animation: `pulse 1s ease-in-out ${d * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Bar */}
        <div style={{ padding: 24, borderTop: `1px solid ${C.outlineVar}`, background: C.inputBarBg, backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ border: '1px solid #7C3AED', boxShadow: '0 0 12px rgba(124,58,237,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', padding: 8, background: C.surfaceContainer, gap: 8 }}>
              <button onClick={() => dispatch(showToast('📎 File attachment coming soon (Demo)'))} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: C.onSurfaceVar }}>
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your academic doubt here..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: C.onSurface, padding: '12px 8px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 8 }}>
                <span style={{ fontSize: 10, background: C.surfaceHighest, color: C.onSurfaceVar, padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace', textTransform: 'uppercase' }}>Ctrl + Enter</span>
                <button onClick={handleSend} style={{ width: 40, height: 40, borderRadius: 10, background: '#7C3AED', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6, color: C.onSurface }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                <span style={{ fontSize: 11 }}>Academic Accuracy Mode</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6, color: C.onSurface }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>draw</span>
                <span style={{ fontSize: 11 }}>LaTeX Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
