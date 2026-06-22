import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { useIsLight } from '../hooks/useIsLight';

const DARK = {
  bg: '#0D0B1A',
  surface: '#15121b',
  surfaceContainer: '#221e28',
  surfaceHigh: '#2c2833',
  surfaceHighest: '#37333e',
  primary: '#7C3AED',
  primaryDim: '#d2bbff',
  secondary: '#cebdff',
  onSurface: '#e8dfee',
  onSurfaceVar: '#ccc3d8',
  outlineVar: '#4a4455',
  error: '#ffb4ab',
  glassBg: 'rgba(22, 20, 38, 0.7)',
  glassBorder: 'rgba(149, 141, 161, 0.1)',
  aiGlowBorder: 'rgba(124, 58, 237, 0.4)',
  aiGlowShadow: 'rgba(124, 58, 237, 0.1)',
  overlayBg: 'rgba(15, 13, 22, 0.95)',
};

const LIGHT = {
  bg: '#ffffff',
  surface: '#f7f5fa',
  surfaceContainer: '#eae6ef',
  surfaceHigh: '#e2dce9',
  surfaceHighest: '#d9d2e0',
  primary: '#7C3AED',
  primaryDim: '#5a00c6',
  secondary: '#4f319c',
  onSurface: '#1a1523',
  onSurfaceVar: '#4a4455',
  outlineVar: '#c2bac9',
  error: '#690005',
  glassBg: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(122, 117, 129, 0.2)',
  aiGlowBorder: 'rgba(124, 58, 237, 0.2)',
  aiGlowShadow: 'rgba(124, 58, 237, 0.05)',
  overlayBg: 'rgba(247, 245, 250, 0.95)',
};

const defaultNotes = [
  {
    subjectColor: '#22d3ee', subjectBg: 'rgba(34,211,238,0.1)', subject: 'Computer Science',
    icon: 'terminal', iconColor: '#22d3ee', iconBg: 'rgba(34,211,238,0.1)',
    title: 'Asynchronous JS & Event Loop', keyTag: 'Key Concept',
    preview: 'The event loop continuously checks the call stack...', time: '2 min ago',
    isAI: true,
    content: `### Asynchronous JS & Event Loop\n\nJavaScript is a single-threaded language, meaning it has one call stack and can do one thing at a time. The event loop coordinates callbacks, promises, and the execution of asynchronous operations.\n\n### 1. Call Stack\nExecutes code synchronously. Items are pushed on top and popped off when completed.\n\n### 2. Web APIs / Node APIs\nHandles asynchronous operations like \`setTimeout\`, DOM events, and fetch requests outside the main JavaScript thread.\n\n### 3. Callback Queue / Task Queue\nWhere asynchronous callbacks wait to be executed. Once the call stack is empty, the Event Loop pushes the next callback onto the stack.\n\n### 4. Microtask Queue\nHandles Promise resolutions (\`.then\`, \`async/await\`). Microtasks take priority over macrotasks (Callback Queue).`
  },
  {
    subjectColor: '#4ade80', subjectBg: 'rgba(74,222,128,0.1)', subject: 'Biology',
    icon: 'biotech', iconColor: '#4ade80', iconBg: 'rgba(74,222,128,0.1)',
    title: 'Cellular Respiration Cycle', flashcard: true, borderLeft: '#22c55e',
    question: 'Where does glycolysis occur?',
    content: `### Cellular Respiration Overview\n\nCellular respiration is the process by which cells break down glucose to generate ATP. It consists of three primary stages:\n\n1. **Glycolysis**: Occurs in the cytoplasm. Converts glucose into 2 pyruvate molecules, yielding 2 ATP and 2 NADH.\n2. **Krebs Cycle (Citric Acid Cycle)**: Occurs in the mitochondrial matrix. Generates carbon dioxide, ATP, NADH, and FADH2.\n3. **Electron Transport Chain (ETC)**: Occurs in the inner mitochondrial membrane. Utilizes electrons from NADH and FADH2 to pump protons and synthesize the majority of ATP (~32-34 molecules).`
  },
  {
    subjectColor: '#f472b6', subjectBg: 'rgba(244,114,182,0.1)', subject: 'Literature',
    icon: 'menu_book', iconColor: '#f472b6', iconBg: 'rgba(244,114,182,0.1)',
    title: 'Modernist Themes in Woolf', tags: ['# Big Ben symbolism', '# Stream of consciousness'],
    borderLeft: '#ec4899',
    content: `### Modernist Themes in Virginia Woolf's Novels\n\nWoolf's writing exemplifies literary modernism through several defining themes and techniques:\n\n- **Stream of Consciousness**: Capturing the continuous, chaotic flow of thoughts and feelings inside characters' minds.\n- **Subjective Time vs. Objective Time**: The symbol of Big Ben striking the hours represents public, rigid time, contrasted with the fluid, emotional time experienced by characters.\n- **Fragmentation of Self**: Characters struggle with identity and the multiple facades they present to the world.`
  },
];

const defaultLibrary = [
  {
    subject: 'Economics', subjectColor: '#22d3ee', subjectBg: 'rgba(34,211,238,0.2)',
    title: 'Principles of Microeconomics', source: 'PDF Source', time: '2h ago',
    keyPoints: 42, flashcards: 128, progress: 65, progressColor: '#7C3AED',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=60',
    content: `### Principles of Microeconomics\n\nMicroeconomics explores the decisions made by individuals and businesses regarding resources allocation and pricing of goods.\n\n### Key Concepts\n- **Supply and Demand**: The core pricing mechanism of open markets.\n- **Elasticity**: How responsive consumers are to price changes.\n- **Marginal Utility**: The satisfaction added by consuming one additional unit.`
  },
  {
    subject: 'Science', subjectColor: '#4ade80', subjectBg: 'rgba(74,222,128,0.2)',
    title: 'Organic Chemistry: Alkane reactions', source: 'YouTube', time: '1 day ago',
    keyPoints: 18, flashcards: 34, progress: 12, progressColor: '#ffb4ab',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=60',
    content: `### Organic Chemistry: Alkane Reactions\n\nAlkanes are saturated hydrocarbons containing only single bonds. Although relatively unreactive, they participate in several key chemical reactions:\n\n- **Combustion**: Highly exothermic reaction with oxygen producing CO2 and H2O.\n- **Halogenation**: Free radical substitution reaction where alkanes react with halogens (chlorine, bromine) in the presence of UV light.\n- **Cracking**: Breaking down long-chain alkanes into smaller, more useful alkenes and alkanes using heat and catalysts.`
  },
  {
    subject: 'Arts', subjectColor: '#f472b6', subjectBg: 'rgba(244,114,182,0.2)',
    title: 'Architecture of Ancient Greece', source: 'Handwritten', time: '4 days ago',
    keyPoints: 64, flashcards: 192, progress: 98, progressColor: '#cebdff',
    img: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=60',
    content: `### Architecture of Ancient Greece\n\nClassical Greek architecture is celebrated for its formal symmetry, columns, and structural harmony.\n\n### Primary Orders\n1. **Doric**: Simple, heavy columns with plain capitals, exemplified by the Parthenon.\n2. **Ionic**: Slender, fluted columns characterized by scroll-like volutes.\n3. **Corinthian**: Ornate capitals decorated with stylized acanthus leaves.`
  },
];

const biologyCards = [
  { id: 1, front: "What is the primary product of the Krebs cycle during aerobic respiration?", back: "NADH, FADH2, ATP, and CO2 (NADH and FADH2 feed the Electron Transport Chain)." },
  { id: 2, front: "Where does glycolysis occur in the cell?", back: "The cytoplasm (it does not require oxygen and splits glucose into two pyruvate molecules)." },
  { id: 3, front: "What is the net gain of ATP molecules from glycolysis?", back: "2 ATP molecules (4 are produced, but 2 are consumed in the preparatory phase)." },
  { id: 4, front: "Which enzyme synthesizes ATP in the mitochondria using a proton gradient?", back: "ATP Synthase (acting as a molecular turbine driven by the flow of H+ ions)." },
  { id: 5, front: "What is the final electron acceptor in the Electron Transport Chain?", back: "Oxygen (O2), which combines with protons to form water (H2O)." }
];

export default function NotesGeneratorPage() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Stateful items lists
  const [libraryList, setLibraryList] = useState([]);
  const [recentList, setRecentList] = useState([]);

  // Interactivity states
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [readerNote, setReaderNote] = useState(null);
  const [flippedRecent, setFlippedRecent] = useState({});

  // Loading generation simulation
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [genLabel, setGenLabel] = useState('');

  // Flashcards carousel states
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());
  const [masteredCards, setMasteredCards] = useState(new Set());

  const isLight = useIsLight();
  const colors = isLight ? LIGHT : DARK;

  const glassFull = { 
    background: colors.glassBg, 
    backdropFilter: 'blur(12px)', 
    border: `1px solid ${colors.glassBorder}` 
  };

  const aiGlow = { 
    border: `1px solid ${colors.aiGlowBorder}`, 
    boxShadow: `0 0 15px ${colors.aiGlowShadow}` 
  };

  // Flip carousel card
  const toggleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const nextCard = () => {
    setIsCardFlipped(false);
    setCardIndex((prev) => (prev + 1) % biologyCards.length);
  };

  const prevCard = () => {
    setIsCardFlipped(false);
    setCardIndex((prev) => (prev - 1 + biologyCards.length) % biologyCards.length);
  };

  const toggleBookmark = (id) => {
    const next = new Set(bookmarkedCards);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setBookmarkedCards(next);
  };

  const toggleMastered = (id) => {
    const next = new Set(masteredCards);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setMasteredCards(next);
  };

  const getSubjectColors = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('science') || s.includes('bio') || s.includes('chem') || s.includes('phys')) return { color: '#4ade80', bg: 'rgba(74,222,128,0.2)', icon: 'biotech' };
    if (s.includes('lit') || s.includes('art') || s.includes('hist') || s.includes('read')) return { color: '#f472b6', bg: 'rgba(244,114,182,0.2)', icon: 'menu_book' };
    if (s.includes('math') || s.includes('cs') || s.includes('comp') || s.includes('tech')) return { color: '#22d3ee', bg: 'rgba(34,211,238,0.2)', icon: 'terminal' };
    return { color: '#7C3AED', bg: 'rgba(124,58,237,0.2)', icon: 'school' };
  };

  // YouTube note generator
  const handleYoutubeGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!youtubeUrl.trim()) {
      dispatch(showToast('⚠️ Please paste a YouTube link first.'));
      return;
    }
    
    setIsGenerating(true);
    setGenStep(0);
    setGenLabel('Connecting to AI and fetching transcript...');

    try {
      const response = await fetch('http://localhost:5000/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate notes');

      const style = getSubjectColors(data.subject);

      const newNote = {
        subject: data.subject || 'General',
        subjectColor: style.color,
        subjectBg: style.bg,
        title: data.title || 'YouTube Notes',
        source: 'YouTube Link',
        time: 'Just now',
        keyPoints: data.keyPointsCount || 0,
        flashcards: data.flashcardsCount || 0,
        progress: 0,
        progressColor: style.color,
        img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=60',
        content: data.content
      };

      setLibraryList(prev => [newNote, ...prev]);
      setRecentList(prev => [{
        subjectColor: style.color,
        subjectBg: style.bg,
        subject: newNote.subject,
        icon: 'movie',
        iconColor: style.color,
        iconBg: style.bg,
        title: newNote.title,
        preview: data.preview || 'Generated study notes from YouTube lecture...',
        time: 'Just now',
        isAI: true,
        content: newNote.content,
        question: data.sampleFlashcard?.question,
        answer: data.sampleFlashcard?.answer,
        tags: data.tags,
        flashcard: !!data.sampleFlashcard
      }, ...prev]);

      dispatch(showToast('✅ Study guide generated from video!'));
    } catch (err) {
      console.error(err);
      dispatch(showToast('❌ ' + err.message));
    } finally {
      setIsGenerating(false);
      setYoutubeUrl('');
    }
  };

  // Handwritten scanner simulated drop zone/click
  const triggerFileScanner = () => {
    fileInputRef.current?.click();
  };

  // Handwritten scanner / file upload
  const handleScanFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    setGenStep(0);
    setGenLabel(`Uploading and analyzing ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/notes/generate', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze file');

      const style = getSubjectColors(data.subject);

      const newNote = {
        subject: data.subject || 'General',
        subjectColor: style.color,
        subjectBg: style.bg,
        title: data.title || `Scan: ${file.name.replace(/\.[^/.]+$/, "")}`,
        source: 'Document Scan',
        time: 'Just now',
        keyPoints: data.keyPointsCount || 0,
        flashcards: data.flashcardsCount || 0,
        progress: 0,
        progressColor: style.color,
        img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=60',
        content: data.content
      };

      setLibraryList(prev => [newNote, ...prev]);
      setRecentList(prev => [{
        subjectColor: style.color,
        subjectBg: style.bg,
        subject: newNote.subject,
        icon: 'qr_code_scanner',
        iconColor: style.color,
        iconBg: style.bg,
        title: newNote.title,
        preview: data.preview || 'AI Synthesized text from scan...',
        time: 'Just now',
        isAI: true,
        content: newNote.content,
        question: data.sampleFlashcard?.question,
        answer: data.sampleFlashcard?.answer,
        tags: data.tags,
        flashcard: !!data.sampleFlashcard
      }, ...prev]);

      dispatch(showToast('✅ Document notes successfully compiled!'));
    } catch (err) {
      console.error(err);
      dispatch(showToast('❌ ' + err.message));
    } finally {
      setIsGenerating(false);
      e.target.value = ''; // reset file input
    }
  };

  const filteredLibrary = activeTab === 'All' 
    ? libraryList 
    : libraryList.filter(card => card.source.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div style={{ color: colors.onSurface, fontFamily: "'Inter', sans-serif" }}>
      {/* 3D Flip styles in head */}
      <style>{`
        .flip-card-container {
          perspective: 1000px;
          width: 100%;
          height: 100%;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
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
        onChange={handleScanFileSelected} 
        accept="image/*,application/pdf"
      />

      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 40 }}>
        <div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 700, color: colors.onSurface, margin: 0, letterSpacing: '-0.02em' }}>Notes Generator</h2>
          <p style={{ color: colors.onSurfaceVar, fontSize: 16, marginTop: 8 }}>Transform your raw materials into structured, AI-enhanced study guides in seconds</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: colors.surfaceContainer, padding: '8px 16px', borderRadius: 999, border: `1px solid ${colors.outlineVar}` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: colors.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Flashcard Mode</span>
            <button onClick={() => setFlashcardOpen(true)} style={{ width: 40, height: 20, background: 'rgba(124,58,237,0.3)', borderRadius: 999, position: 'relative', cursor: 'pointer', border: 'none' }}>
              <div style={{ width: 16, height: 16, background: '#7C3AED', borderRadius: '50%', position: 'absolute', top: 2, right: 2 }} />
            </button>
          </div>
          <div style={{ width: 256 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: colors.onSurfaceVar }}>Storage usage</span>
              <span style={{ color: '#7C3AED', fontWeight: 700 }}>1.2 GB / 5 GB</span>
            </div>
            <div style={{ height: 6, width: '100%', background: colors.surfaceHighest, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '24%', background: '#7C3AED' }} />
            </div>
            <p style={{ fontSize: 10, color: colors.onSurfaceVar, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginTop: 6 }}>{libraryList.length} notes generated total</p>
          </div>
        </div>
      </div>

      {/* Row 1: Source + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 32, marginBottom: 40 }}>
        {/* New Source Material */}
        <div style={{ ...glassFull, ...aiGlow, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ color: '#7C3AED' }}>add_circle</span>
            New Source Material
          </h3>
          
          <div 
            onClick={triggerFileScanner}
            style={{ flex: 1, border: `2px dashed ${colors.outlineVar}`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, cursor: 'pointer', transition: 'all 0.2s', marginBottom: 16 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.background = 'rgba(124,58,237,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.outlineVar; e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: colors.surfaceHighest, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ color: '#7C3AED' }}>upload_file</span>
            </div>
            <p style={{ fontWeight: 700, color: colors.onSurface, marginBottom: 4 }}>Drag & drop files here</p>
            <p style={{ fontSize: 12, color: colors.onSurfaceVar }}>Support for PDF, PPTX, MP4 (up to 50MB)</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
            {[{ icon: 'picture_as_pdf', label: 'PDF', color: '#bea8ff' }, { icon: 'slideshow', label: 'PPT', color: '#7C3AED' }, { icon: 'movie', label: 'Video', color: '#cebdff' }].map(t => (
              <button onClick={triggerFileScanner} key={t.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px', borderRadius: 8, background: colors.surfaceContainer, border: 'none', color: colors.onSurface, cursor: 'pointer', transition: 'background 0.2s' }}>
                <span className="material-symbols-outlined" style={{ color: t.color }}>{t.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleYoutubeGenerate} style={{ position: 'relative', marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.onSurfaceVar, fontSize: 18 }}>link</span>
            <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="Paste YouTube link here..." style={{ width: '100%', background: colors.bg, border: `1px solid ${colors.outlineVar}`, borderRadius: 8, padding: '10px 96px 10px 40px', fontSize: 14, color: colors.onSurface, outline: 'none', boxSizing: 'border-box' }} />
            <button type="submit" style={{ position: 'absolute', right: 6, top: 6, bottom: 6, padding: '0 12px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Generate <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </button>
          </form>

          <button
            onClick={triggerFileScanner}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12, border: `1px solid ${colors.outlineVar}`, background: colors.surfaceContainer, color: colors.onSurface, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = colors.surfaceHigh}
            onMouseLeave={e => e.currentTarget.style.background = colors.surfaceContainer}
          >
            <span className="material-symbols-outlined">qr_code_scanner</span>
            Scan Handwritten Notes
          </button>
        </div>

        {/* Recently Generated */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 8px' }}>
            <h3 style={{ fontFamily: "'Inter'", fontSize: 20, fontWeight: 700, margin: 0 }}>Recently Generated</h3>
            <button onClick={() => dispatch(showToast('📖 Loading all notes...'))} style={{ fontSize: 14, fontWeight: 700, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer' }}>View History</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentList.map((note, i) => (
              <div key={i} style={{ ...glassFull, borderRadius: 12, padding: 20, borderLeft: note.borderLeft ? `4px solid ${note.borderLeft}50` : undefined, borderLeftWidth: note.borderLeft ? 4 : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: note.subjectBg, color: note.subjectColor, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>{note.subject}</span>
                    {note.isAI && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: 'rgba(124,58,237,0.1)', color: '#7C3AED', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span> AI Enhanced</span>}
                    {note.flashcard && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: note.subjectBg, color: note.subjectColor, borderRadius: 999, textTransform: 'uppercase' }}>Flashcard On</span>}
                    {note.time && <span style={{ fontSize: 10, color: colors.onSurfaceVar }}>{note.time}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 40, height: 40, background: note.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: note.iconColor }}>
                    <span className="material-symbols-outlined">{note.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontWeight: 700, fontSize: 16, color: colors.onSurface, margin: '0 0 8px 0' }}>{note.title}</h4>
                    {note.keyTag && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 9, fontWeight: 900, background: colors.surfaceHighest, padding: '2px 6px', borderRadius: 4, color: colors.onSurfaceVar, textTransform: 'uppercase' }}>Key Concept</span>
                        <p style={{ fontSize: 12, color: colors.onSurfaceVar, fontStyle: 'italic', margin: 0 }}>{note.preview}</p>
                      </div>
                    )}

                    {note.question && (
                      <div style={{ background: colors.surfaceContainer, padding: '10px', borderRadius: 8, border: `1px solid ${colors.outlineVar}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: colors.onSurfaceVar }}><span style={{ fontWeight: 700, color: '#7C3AED', marginRight: 4 }}>Q:</span>{note.question}</span>
                          <button onClick={() => setFlippedRecent(prev => ({ ...prev, [i]: !prev[i] }))} style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            {flippedRecent[i] ? 'Hide Answer' : 'Flip Card'} <span className="material-symbols-outlined" style={{ fontSize: 12 }}>flip</span>
                          </button>
                        </div>
                        {flippedRecent[i] && (
                          <div style={{ borderTop: `1px solid ${colors.outlineVar}`, paddingTop: 8, fontSize: 12, color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>done</span>
                            Answer: Glycolysis occurs in the cytoplasm.
                          </div>
                        )}
                      </div>
                    )}

                    {note.tags && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {note.tags.map(tag => <span key={tag} style={{ fontSize: 9, background: colors.surfaceContainer, padding: '2px 8px', borderRadius: 999, color: colors.onSurfaceVar, border: `1px solid rgba(74,68,85,0.2)` }}>{tag}</span>)}
                      </div>
                    )}
                  </div>
                  <button onClick={() => setReaderNote(note)} style={{ flexShrink: 0, background: 'rgba(124,58,237,0.1)', color: '#7C3AED', fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', alignSelf: 'center' }}>Open Reader</button>
                </div>
              </div>
            ))}
            {recentList.length === 0 && (
              <div style={{ ...glassFull, borderRadius: 12, padding: 32, textAlign: 'center', color: colors.onSurfaceVar, border: `1px dashed ${colors.outlineVar}` }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>article</span>
                <p style={{ margin: 0, fontSize: 14 }}>No notes generated yet.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: 12, opacity: 0.7 }}>Upload a document or paste a link to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Library */}
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${colors.outlineVar}`, paddingBottom: 16, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, margin: 0 }}>Your Notes Library</h3>
          <div style={{ display: 'flex', background: colors.surfaceContainer, padding: 4, borderRadius: 8 }}>
            {['All', 'PDF', 'YouTube', 'Handwritten'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 16px', borderRadius: 6, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', background: activeTab === tab ? colors.primary : 'transparent', color: activeTab === tab ? '#fff' : colors.onSurfaceVar, transition: 'all 0.2s' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {filteredLibrary.map((card, i) => (
            <div key={i} style={{ ...glassFull, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 128, background: colors.surfaceHigh, position: 'relative', overflow: 'hidden' }}>
                <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${colors.surface}, transparent)` }} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span style={{ background: card.subjectBg, backdropFilter: 'blur(12px)', color: card.subjectColor, fontSize: 9, fontWeight: 900, padding: '4px 8px', borderRadius: 4, border: `1px solid ${card.subjectColor}4d`, textTransform: 'uppercase' }}>{card.subject}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
                  <span style={{ background: '#7C3AED', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span> AI
                  </span>
                </div>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: colors.onSurface, marginBottom: 4, lineHeight: 1.3 }}>{card.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.onSurfaceVar }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>picture_as_pdf</span>
                    <span>{card.source} • {card.time}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[{ icon: 'key_visualizer', label: 'Key Points', val: card.keyPoints, color: '#7C3AED' }, { icon: 'style', label: 'Flashcards', val: card.flashcards, color: '#cebdff' }].map(stat => (
                    <div key={stat.label} style={{ background: colors.surfaceContainer, padding: 10, borderRadius: 12, border: `1px solid ${colors.outlineVar}`, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4, color: stat.color }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{stat.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</span>
                      </div>
                      <span style={{ fontFamily: "'Inter'", fontSize: 22, fontWeight: 700 }}>{stat.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                      <span style={{ color: colors.onSurfaceVar }}>Review Progress</span>
                      <span style={{ color: card.progressColor }}>{card.progress}%</span>
                    </div>
                    <div style={{ height: 6, width: '100%', background: colors.surfaceContainer, borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${card.progress}%`, background: `linear-gradient(to right, #7C3AED, ${card.progressColor})`, borderRadius: 999 }} />
                    </div>
                  </div>
                  <button onClick={() => setReaderNote(card)} style={{ flexShrink: 0, background: 'rgba(124,58,237,0.1)', color: '#7C3AED', fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Open Reader</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredLibrary.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: colors.onSurfaceVar }}>
            <p style={{ margin: 0, fontSize: 14 }}>Your library is currently empty.</p>
          </div>
        )}
      </div>

      {/* Note Reader Modal */}
      {readerNote && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(15, 13, 22, 0.85)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 640, width: '100%', backgroundColor: colors.surface, border: `1px solid ${colors.outlineVar}`, borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.outlineVar}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.surfaceContainer }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 900, background: 'rgba(124,58,237,0.15)', color: '#7C3AED', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{readerNote.subject}</span>
                <h3 style={{ margin: '6px 0 0', fontWeight: 700, fontSize: 18, color: colors.onSurface }}>{readerNote.title}</h3>
              </div>
              <button onClick={() => setReaderNote(null)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: colors.onSurfaceVar, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ padding: 24, overflowY: 'auto', fontSize: 14, lineHeight: 1.6, color: colors.onSurface }}>
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {readerNote.content || `
### Detailed Concept Notes
This study guide summarizes the core ideas, diagrams, and formulas related to **${readerNote.title}**.

### 1. Introduction
Modern academic standards require understanding both the mathematical underpinnings and empirical behaviors of systems. Here we lay out the foundations.

### 2. Deep Dive
- **Core Elements**: The structural dependencies.
- **Key Equation**: E = mc² or equivalent bounds.
- **Tradeoffs**: Performance vs. space allocation.

### 3. Application Examples
- **Case A**: Distributed networks.
- **Case B**: Dynamic caching.

### 4. Summary & Takeaways
Always verify boundary conditions. Revision cycles should be spaced at 1-day, 3-day, and 7-day intervals.
                `}
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.outlineVar}`, display: 'flex', justifyContent: 'flex-end', background: colors.surfaceContainer }}>
              <button onClick={() => setReaderNote(null)} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Close Reader</button>
            </div>
          </div>
        </div>
      )}

      {/* Flashcard Practice Overlay (Stateful Carousel with 3D Flip) */}
      {flashcardOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: colors.overlayBg, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 576, width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, margin: 0 }}>Flashcard Mode</h3>
              <button onClick={() => setFlashcardOpen(false)} style={{ padding: 8, background: colors.surfaceContainer, borderRadius: '50%', border: 'none', cursor: 'pointer', color: colors.onSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* 3D Flip Card Container */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
              <div style={{ position: 'absolute', width: '90%', height: '90%', background: colors.surfaceHigh, borderRadius: 24, border: `1px solid ${colors.outlineVar}`, transform: 'translateY(16px) rotate(-2deg)', opacity: 0.3, left: '5%' }} />
              <div style={{ position: 'absolute', width: '95%', height: '95%', background: colors.surfaceHigh, borderRadius: 24, border: `1px solid ${colors.outlineVar}`, transform: 'translateY(8px) rotate(1deg)', opacity: 0.6, left: '2.5%' }} />
              
              <div className="flip-card-container" onClick={toggleCardFlip}>
                <div className={`flip-card-inner ${isCardFlipped ? 'flipped' : ''}`}>
                  {/* Front Side */}
                  <div className="flip-card-front" style={{ ...glassFull, border: '2px solid rgba(124,58,237,0.4)', padding: 48, background: colors.glassBg }}>
                    <span style={{ color: '#7C3AED', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Biology • Card {cardIndex + 1} of {biologyCards.length}</span>
                    <h2 style={{ fontFamily: "'Inter'", fontSize: 24, fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                      {biologyCards[cardIndex].front}
                    </h2>
                    <p style={{ marginTop: 32, color: colors.onSurfaceVar, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="material-symbols-outlined">touch_app</span> Tap to reveal answer
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      {bookmarkedCards.has(biologyCards[cardIndex].id) && <span style={{ background: 'rgba(124,58,237,0.15)', color: '#7C3AED', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>★ Bookmarked</span>}
                      {masteredCards.has(biologyCards[cardIndex].id) && <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>✓ Mastered</span>}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="flip-card-back" style={{ ...glassFull, border: '2px solid rgba(124,58,237,0.8)', padding: 48, background: colors.surfaceHigh }}>
                    <span style={{ color: '#cebdff', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Biology • Answer</span>
                    <h2 style={{ fontFamily: "'Inter'", fontSize: 22, fontWeight: 600, lineHeight: 1.4, margin: 0, color: '#4ade80' }}>
                      {biologyCards[cardIndex].back}
                    </h2>
                    <p style={{ marginTop: 32, color: colors.onSurfaceVar, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="material-symbols-outlined">touch_app</span> Tap to view question again
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
              <button onClick={prevCard} style={{ width: 56, height: 56, borderRadius: '50%', background: colors.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: colors.onSurface }} title="Previous Card">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              
              <button 
                onClick={() => toggleMastered(biologyCards[cardIndex].id)} 
                style={{ width: 64, height: 64, borderRadius: '50%', background: masteredCards.has(biologyCards[cardIndex].id) ? '#16a34a' : colors.surfaceHigh, border: '1px solid rgba(74,68,85,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
                title="Mark as Mastered"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{masteredCards.has(biologyCards[cardIndex].id) ? 'verified' : 'check'}</span>
              </button>

              <button 
                onClick={() => toggleBookmark(biologyCards[cardIndex].id)} 
                style={{ width: 64, height: 64, borderRadius: '50%', background: bookmarkedCards.has(biologyCards[cardIndex].id) ? '#ea580c' : colors.surfaceHigh, border: '1px solid rgba(74,68,85,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
                title="Bookmark Card"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{bookmarkedCards.has(biologyCards[cardIndex].id) ? 'star' : 'bookmark'}</span>
              </button>

              <button onClick={nextCard} style={{ width: 56, height: 56, borderRadius: '50%', background: colors.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: colors.onSurface }} title="Next Card">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating note generation overlay (during simulator) */}
      {isGenerating && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, backgroundColor: 'rgba(15,13,22,0.8)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: colors.surface, border: `1px solid ${colors.outlineVar}`, padding: 40, borderRadius: 24, textAlign: 'center', maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <div className="loading-pulse-dot" style={{ animationDelay: '0s' }} />
              <div className="loading-pulse-dot" style={{ animationDelay: '0.2s' }} />
              <div className="loading-pulse-dot" style={{ animationDelay: '0.4s' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, color: colors.onSurface, fontWeight: 700 }}>AI Generator Loading</h3>
            <p style={{ margin: 0, fontSize: 14, color: colors.onSurfaceVar }}>{genLabel}</p>
            <div style={{ height: 6, width: '100%', background: colors.surfaceHighest, borderRadius: 999, overflow: 'hidden', marginTop: 10 }}>
              <div style={{ height: '100%', width: `${(genStep + 1) * 25}%`, background: '#7C3AED', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={triggerFileScanner} style={{ position: 'fixed', bottom: 32, right: 32, width: 56, height: 56, background: '#7C3AED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#fff', zIndex: 40, transition: 'background 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = '#6D28D9'}
        onMouseLeave={e => e.currentTarget.style.background = '#7C3AED'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add</span>
      </button>
    </div>
  );
}
