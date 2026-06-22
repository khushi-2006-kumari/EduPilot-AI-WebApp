import React from 'react';

export function DoubtSolver({
  chatMessages,//array of all chat msgs to display
  isAiTyping,
  userInput,  //current text in the input box
  setUserInput,
  handleSendDoubt, //function that sends msg to AI
  setChatMessages, //function to update/reset chat msgs
  triggerToast
}) {
  return (
    <section className="glass-card rounded-2xl overflow-hidden ai-glow">
      <div className="bg-surface-container-high/60 p-4 border-b border-outline-variant/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <h3 className="font-headline font-bold text-sm text-on-surface">AI Doubt Solver</h3>
        </div>
        <button
          onClick={() => setChatMessages([{
            id: Date.now(),
            sender: 'ai',
            text: 'Chat logs reset. Ask me an academic doubt.',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVni6EnII7t3lP8Rs8Igz-gna1SK8fMH2sIXKL_UaRgYuuS4Nja5WuLowGNp_r1csSQl1IwT74IHSMFYiewFAtmyG9L0L7eRBhwtc08Nt6Mo1w_Ij0JqTJzmih9CW1CtjWFXxGDok4I2TLbVRNeeNyGQElbgT_PrwBpMSLS1eih3l-tQ0koxeFG8UxFfnz01XjT1xxgsClKQmdxs9Em6dq9Or6aJVU9gUoPYWwvq-J1EQ58RSeoPJOSYJxD_zZwRYZYckAPeycz7s4'
          }])}
          className="text-outline hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="p-6 space-y-4 max-h-[260px] overflow-y-auto pr-1">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden border ${msg.sender === 'ai' ? 'bg-primary-container shadow-lg shadow-primary-container/20 border-primary-container/30' : 'bg-surface-container-highest border-outline-variant/30'
              }`}>
              {msg.sender === 'ai' ? (
                <span className="material-symbols-outlined text-sm text-white">psychology</span>
              ) : (
                <span className="material-symbols-outlined text-sm text-white">person</span>
              )}
            </div>

            <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${msg.sender === 'ai'
              ? 'bg-surface-container rounded-tl-none border-outline-variant/20 text-on-surface-variant'
              : 'bg-primary-container/15 text-on-surface rounded-tr-none border-primary-container/20'
              }`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isAiTyping && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary-container shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-white animate-spin">sync</span>
            </div>
            <div className="bg-surface-container p-4 rounded-2xl rounded-tl-none border border-outline-variant/20 text-xs text-outline italic">
              Tutor is compiling synthesis...
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 ml-12 pb-4 px-6">
        <button onClick={() => handleSendDoubt(null, "Worst case scenario analysis")} className="px-4 py-1.5 border border-outline-variant/30 rounded-full text-[10px] font-bold text-outline hover:bg-surface-container-high hover:text-on-surface transition-all uppercase tracking-tight">Worst case scenario</button>
        <button onClick={() => handleSendDoubt(null, "Comparison of QuickSort with MergeSort")} className="px-4 py-1.5 border border-outline-variant/30 rounded-full text-[10px] font-bold text-outline hover:bg-surface-container-high hover:text-on-surface transition-all uppercase tracking-tight">Comparison with MergeSort</button>

      </div>
      {/*null : no form event (no reload risk)*/}

      <div className="p-4 bg-background/50 border-t border-outline-variant/20">
        <form onSubmit={handleSendDoubt} className="relative flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/20">
          <button type="button" onClick={() => triggerToast("Click preset doubt buttons below or type an explanation query.")} className="p-2 text-outline hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
          </button>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-on-surface outline-none"
            placeholder="Explain a concept or paste code..."
            type="text"
          />
          <button type="submit" className="w-10 h-10 bg-primary-container text-white rounded-lg flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary-container/10 shrink-0">
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </section>
  );
}
