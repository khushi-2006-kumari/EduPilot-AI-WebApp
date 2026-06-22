import React from 'react';

export function FocusCenter({
  focusTime,
  focusType,
  isFocusActive,
  handleSelectFocusType,
  setIsFocusActive
}) {
  const maxTime = focusType === 'pomodoro' ? 1500 : focusType === 'short' ? 300 : 900;
  const progressOffset = 283 - (283 * focusTime) / maxTime; //make circular progress bar

  return (
    <section className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group h-full">
      <h3 className="font-headline font-bold text-lg mb-6 self-start text-on-surface">Focus Center</h3>

      <div className="relative w-36 h-36 mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-outline-variant/20" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="4"></circle>
          <circle
            className="text-cyan-400 progress-ring__circle animate-pulse"
            cx="50"
            cy="50"
            fill="transparent"
            r="45"
            stroke="currentColor"
            strokeDasharray="283"
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            strokeWidth="4"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-headline font-bold tracking-tighter text-on-surface">
            {Math.floor(focusTime / 60)}:{String(focusTime % 60).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-outline uppercase tracking-widest font-bold">Focus Mode</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleSelectFocusType('pomodoro')}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${focusType === 'pomodoro' ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline hover:text-on-surface'
            }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => handleSelectFocusType('short')}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${focusType === 'short' ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline hover:text-on-surface'
            }`}
        >
          Short Break
        </button>
        <button
          onClick={() => handleSelectFocusType('long')}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${focusType === 'long' ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline hover:text-on-surface'
            }`}
        >
          Long Break
        </button>
      </div>

      <button
        onClick={() => setIsFocusActive(!isFocusActive)}
        className="w-full py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] transition-all active:scale-95 text-sm"
      >
        {isFocusActive ? 'Pause Session' : 'Start Session'}
      </button>
    </section>
  );
}
