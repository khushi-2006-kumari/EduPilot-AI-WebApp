import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

export default function SupportPage() {
  const dispatch = useDispatch();
  const faqRef = useRef(null);
  const formRef = useRef(null);
  const subjectInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Technical Support');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  // Live Chat States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hello! Welcome to EduPilot Live Support. How can I assist you with your study planner or notes generator today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);

  // Ticket list state
  const [tickets, setTickets] = useState([
    { id: '#EP-4921', issue: 'Billing Inquiry: Premium Plan', status: 'Open', date: 'Oct 24, 2023', statusColor: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
    { id: '#EP-3882', issue: 'UI Bug in Mobile Library', status: 'Resolved', date: 'Oct 20, 2023', statusColor: 'bg-green-400/10 text-green-400 border-green-400/20' },
    { id: '#EP-3105', issue: 'Feature Request: Darker OLED mode', status: 'In Review', date: 'Oct 18, 2023', statusColor: 'bg-primary/10 text-primary border-primary/20' },
  ]);

  // Collapsible FAQ state
  const [openFaqs, setOpenFaqs] = useState({ 0: true });

  const toggleFaq = (index) => {
    setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const faqData = [
    {
      q: "How do I upload my syllabus?",
      a: "To upload your syllabus, navigate to the Syllabus Analyzer tab and click the 'Upload Source' button. We support PDF, .docx, and image formats. Our AI will automatically parse the dates, topics, and objectives to build your custom academic schedule."
    },
    {
      q: "How does the AI study plan work?",
      a: "EduPilot parses your curriculum to extract topics and their respective weights. It then generates spaced-repetition revision cycles aligned with your target exam dates, adapting dynamically to your daily study logs and quiz performance."
    },
    {
      q: "Can I use EduPilot offline?",
      a: "Many features such as note reading, planner viewing, and offline revision cards are cached on your browser and work offline. However, AI chat, syllabus parsing, and mock test generation require an active connection."
    },
    {
      q: "How do I reset my password?",
      a: "Go to System Settings from the navigation bar, scroll to the Privacy & Security panel, and click 'Change Password' to receive a secure reset link in your email."
    },
    {
      q: "How are mock tests generated?",
      a: "EduPilot analyzes the topics marked as 'needs-review' or 'unstarted' in your syllabus, drawing from our academic database to construct contextually relevant multiple-choice questions that simulate real exam conditions."
    }
  ];

  // Filters FAQ list dynamically based on search
  const filteredFaqs = faqData.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket = {
      id: `#EP-${Math.floor(1000 + Math.random() * 9000)}`,
      issue: `${category}: ${subject}`,
      status: 'Open',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      statusColor: 'bg-amber-400/10 text-amber-400 border-amber-400/20'
    };

    setTickets([newTicket, ...tickets]);
    dispatch(showToast("🎟️ Support ticket submitted successfully!"));
    
    // Clear inputs
    setSubject('');
    setDescription('');
    setAttachedFile(null);
  };

  const handleLiveChatClick = () => {
    setChatOpen(true);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      let reply = "Thanks for contacting us! A support representative will review this thread and respond shortly.";
      const query = userText.toLowerCase();
      if (query.includes('billing') || query.includes('refund') || query.includes('premium')) {
        reply = "For billing inquiries, our systems process payment tokens securely. You can manage, upgrade, or cancel your subscription plan in Settings under Profile Options.";
      } else if (query.includes('syllabus') || query.includes('roadmap')) {
        reply = "To analyze a syllabus, click the Syllabus Analyzer page in the sidebar, click 'Browse' for your Syllabus PDF, and click 'Analyse with AI'. It will automatically map topics and build your custom spaced repetition calendar.";
      } else if (query.includes('bug') || query.includes('broken')) {
        reply = "I'm sorry to hear that! You can log a bug ticket directly using the form on this Support page. Please attach screenshots if possible.";
      } else if (query.includes('notes') || query.includes('generate')) {
        reply = "Notes Generator accepts PDF uploads, video links, or handwritten scans. Try pasting a YouTube link to see AI transcribe the lecture in real-time!";
      }

      setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
      setChatTyping(false);
    }, 1200);
  };

  const handleReportBugClick = () => {
    setCategory('Technical Support');
    setSubject('Bug Report: [Area]');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      subjectInputRef.current?.focus();
    }, 500);
  };

  const scrollToFaqs = () => {
    faqRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      dispatch(showToast(`📎 File attached: ${file.name}`));
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto p-4 md:p-8 animate-fade-in-up">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept="image/*,application/pdf"
      />

      {/* 1. PAGE HEADER */}
      <section className="space-y-6">
        <div>
          <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tight mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-5xl">help</span> Help &amp; Support
          </h1>
          <p className="text-on-surface-variant text-lg">How can we help you today?</p>
        </div>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest/50 border border-outline-variant rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all placeholder:text-outline/50" 
            placeholder="Search for help topics..." 
            type="text"
          />
        </div>
      </section>

      {/* 2. TOP ROW ACTION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={scrollToFaqs}
          className="glass-card p-6 rounded-xl border border-outline-variant hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div className="flex justify-between items-start">
            <div className="bg-surface-container-highest p-3 rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-all">arrow_forward</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">Browse FAQ</h3>
            <p className="text-sm text-on-surface-variant">Instant answers to common questions.</p>
          </div>
        </div>

        <div 
          onClick={handleLiveChatClick}
          className="bg-primary-container p-6 rounded-xl border border-primary/20 shadow-xl shadow-primary-container/10 hover:brightness-110 transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div className="flex justify-between items-start">
            <div className="bg-on-primary-container/20 p-3 rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            </div>
            <span className="material-symbols-outlined text-on-primary-container group-hover:translate-x-1 transition-all">arrow_forward</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-xl text-on-primary-container">Live Chat</h3>
            <p className="text-sm text-on-primary-container/80">Connect with an EduPilot expert now.</p>
          </div>
        </div>

        <div 
          onClick={handleReportBugClick}
          className="glass-card p-6 rounded-xl border border-outline-variant hover:border-error/50 transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div className="flex justify-between items-start">
            <div className="bg-surface-container-highest p-3 rounded-lg text-error">
              <span className="material-symbols-outlined text-3xl">pest_control</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-error transition-all">arrow_forward</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">Report a Bug</h3>
            <p className="text-sm text-on-surface-variant">Help us improve your academic journey.</p>
          </div>
        </div>
      </section>

      {/* 3. FAQ SECTION */}
      <section ref={faqRef} className="space-y-6 scroll-mt-24">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-headline font-bold text-on-surface">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqs[index];
            return (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen 
                    ? 'bg-surface-container border-primary' 
                    : 'glass-card border-outline-variant hover:border-outline'
                }`}
              >
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <span className={`font-medium ${isOpen ? 'text-on-surface font-bold' : 'text-on-surface'}`}>{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-outline'}`}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-on-surface-variant leading-relaxed text-sm animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
          {filteredFaqs.length === 0 && (
            <p className="text-on-surface-variant text-center py-6">No matching FAQs found for your query.</p>
          )}
        </div>
      </section>

      {/* 4. SUBMIT TICKET FORM */}
      <section ref={formRef} className="space-y-6 scroll-mt-24">
        <h2 className="text-3xl font-headline font-bold text-on-surface">Submit a Ticket</h2>
        <div className="glass-card p-8 rounded-2xl border border-outline-variant ai-glow-border">
          <form onSubmit={handleTicketSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant">Issue Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary-container outline-none"
                >
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing & Subscription">Billing &amp; Subscription</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Account Access">Account Access</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant">Subject</label>
                <input 
                  ref={subjectInputRef}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary-container outline-none" 
                  placeholder="Briefly describe the problem" 
                  type="text"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface-variant">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary-container outline-none resize-none" 
                placeholder="Detailed explanation of your issue..." 
                rows="4"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors py-2.5 px-4 border border-dashed border-outline-variant rounded-lg group cursor-pointer" 
                type="button"
              >
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">attach_file</span>
                <span className="text-sm font-medium">
                  {attachedFile ? `Attached: ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)` : "Attach Files or Screenshots"}
                </span>
              </button>
              <button 
                type="submit"
                className="bg-primary-container hover:bg-inverse-primary text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-lg shadow-primary-container/20 active:scale-95 cursor-pointer"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 5. RECENT TICKETS TABLE */}
      <section className="space-y-6">
        <h2 className="text-3xl font-headline font-bold text-on-surface">Recent Support Tickets</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-left bg-surface-container-lowest">
            <thead className="bg-surface-container-high/40 text-on-surface-variant uppercase text-xs font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {tickets.map((t, idx) => (
                <tr key={idx} className="hover:bg-surface-container-high/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-mono text-primary text-sm font-semibold">{t.id}</td>
                  <td className="px-6 py-4 text-on-surface text-sm font-medium">{t.issue}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${t.statusColor}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live Chat Side Drawer */}
      {chatOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '400px', height: '100%', background: '#15121b', borderLeft: '1px solid #4a4455', boxShadow: '-8px 0 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease-out' }}>
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .chat-msg-user {
                background: #7C3AED;
                color: #fff;
                align-self: flex-end;
                border-radius: 12px 12px 4px 12px;
              }
              .chat-msg-agent {
                background: #221e28;
                color: #e8dfee;
                align-self: flex-start;
                border-radius: 12px 12px 12px 4px;
                border: 1px solid #4a4455;
              }
            `}</style>
            
            {/* Drawer Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #4a4455', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#221e28' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#e8dfee' }}>Live Support</h3>
                  <span style={{ fontSize: 10, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} /> Agent Online
                  </span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc3d8' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-agent'} style={{ padding: '12px 16px', maxWidth: '85%', fontSize: 13, lineHeight: 1.5 }}>
                  {msg.text}
                </div>
              ))}
              {chatTyping && (
                <div className="chat-msg-agent" style={{ padding: '12px 16px', width: '60px', display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cebdff', animation: 'pulse 1s infinite' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cebdff', animation: 'pulse 1s infinite 0.2s' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cebdff', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSend} style={{ padding: '20px', borderTop: '1px solid #4a4455', background: '#221e28', display: 'flex', gap: 8 }}>
              <input 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type your message..." 
                style={{ flex: 1, background: '#0D0B1A', border: '1px solid #4a4455', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#e8dfee', outline: 'none' }}
              />
              <button type="submit" style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. FOOTER ROW */}
      <footer className="pt-12 pb-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">mail</span>
          <span className="text-sm">Need direct help? <a className="text-on-surface font-bold hover:text-primary transition-colors" href="mailto:support@edupilot.ai">support@edupilot.ai</a></span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <p className="text-xs text-outline">© 2026 EduPilot AI. All systems operational.</p>
        </div>
      </footer>
    </div>
  );
}
