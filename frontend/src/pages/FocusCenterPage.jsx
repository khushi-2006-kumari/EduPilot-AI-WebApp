import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFocusTime, setIsFocusActive, setFocusType, incrementStreak, recordStudySession, setActiveSession } from '../store/slices/studySlice';
import { showToast } from '../store/slices/uiSlice';
import { Play, Pause, RotateCcw, Volume2, Music, Coffee, CloudRain, Shield } from 'lucide-react';

export default function FocusCenterPage() {
  const dispatch = useDispatch();
  const focusTime = useSelector(state => state.study.focusTime);
  const isFocusActive = useSelector(state => state.study.isFocusActive);
  const focusType = useSelector(state => state.study.focusType);
  const activeSession = useSelector(state => state.study.activeSession);

  const timerRef = useRef(null);

  // Ambient sound state
  const [playingSound, setPlayingSound] = useState(null);

  useEffect(() => {
    if (isFocusActive && focusTime > 0) {
      timerRef.current = setInterval(() => {
        dispatch(setFocusTime(focusTime - 1));
      }, 1000);
    } else if (focusTime === 0 && isFocusActive) {
      dispatch(setIsFocusActive(false));
      clearInterval(timerRef.current);
      dispatch(incrementStreak());
      
      if (activeSession) {
        // Record the study session dynamically
        const getSubjectColors = (subject) => {
          const s = (subject || '').toLowerCase();
          if (s.includes('science') || s.includes('bio') || s.includes('chem') || s.includes('phys')) return { color: '#4ade80', bg: 'rgba(74,222,128,0.12)' };
          if (s.includes('lit') || s.includes('art') || s.includes('hist') || s.includes('read')) return { color: '#f472b6', bg: 'rgba(244,114,182,0.12)' };
          if (s.includes('math') || s.includes('cs') || s.includes('comp') || s.includes('tech')) return { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' };
          return { color: '#7C3AED', bg: 'rgba(124,58,237,0.12)' };
        };

        const style = getSubjectColors(activeSession.subject);

        dispatch(recordStudySession({
          subject: activeSession.subject,
          subjectColor: style.color,
          subjectBg: style.bg,
          type: activeSession.selectedType === 'deepwork' ? 'Deep Work' : activeSession.selectedType === 'revision' ? 'Revision' : 'Pomodoro',
          typeIcon: activeSession.selectedType === 'deepwork' ? 'center_focus_strong' : activeSession.selectedType === 'revision' ? 'history_edu' : 'timer',
          topic: activeSession.topic,
          duration: `${activeSession.totalMinutes}m`,
          durationMinutes: activeSession.totalMinutes,
          date: 'Just now',
          progress: 100,
          focusScore: Math.floor(Math.random() * 15) + 85 // Mock focus score 85-100%
        }));
        
        dispatch(showToast(`🎉 "${activeSession.sessionName}" finished! Session recorded.`));
        dispatch(setActiveSession(null));
      } else {
        dispatch(showToast("🎉 Pomodoro session finished! Streak boosted +1d."));
      }

      dispatch(setFocusType(focusType)); // Reset time
    }
    return () => clearInterval(timerRef.current);
  }, [isFocusActive, focusTime, dispatch, focusType, activeSession]);

  const handleToggleTimer = () => {
    dispatch(setIsFocusActive(!isFocusActive));
  };

  const handleReset = () => {
    dispatch(setIsFocusActive(false));
    clearInterval(timerRef.current);
    dispatch(setFocusType(focusType));
    dispatch(showToast("🔄 Timer reset."));
  };

  const handleSelectMode = (mode) => {
    dispatch(setFocusType(mode));
  };

  const handleSoundToggle = (soundName) => {
    if (playingSound === soundName) {
      setPlayingSound(null);
      dispatch(showToast("🔇 Ambient sound muted."));
    } else {
      setPlayingSound(soundName);
      dispatch(showToast(`🔊 Playing ambient sound: ${soundName.toUpperCase()}`));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate circular progress ring offsets
  const maxTime = focusType === 'pomodoro' ? 1500 : focusType === 'short' ? 300 : 900;
  const progressPercent = Math.max(0, Math.min(100, ((maxTime - focusTime) / maxTime) * 100));
  const strokeDashoffset = 502.4 - (502.4 * (100 - progressPercent)) / 100;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface flex items-center gap-2">
          <Shield className="text-primary" /> {activeSession ? activeSession.sessionName : 'Focus Command Center'}
        </h1>
        <p className="text-on-surface-variant mt-2">
          {activeSession 
            ? `Focusing on ${activeSession.topic} (${activeSession.subject}). Goal: ${activeSession.goal || 'Stay focused'}` 
            : 'Immerse yourself in clean Pomodoro study sessions. Block distractions and play white noise.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Pomodoro Timer circle view */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-10 rounded-2xl flex flex-col items-center justify-center space-y-8">

            {/* Mode selection buttons */}
            <div className="flex gap-2.5 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/20">
              <button
                onClick={() => handleSelectMode('pomodoro')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${focusType === 'pomodoro' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-outline hover:text-on-surface'
                  }`}
              >
                Pomodoro
              </button>
              <button
                onClick={() => handleSelectMode('short')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${focusType === 'short' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-outline hover:text-on-surface'
                  }`}
              >
                Short Break
              </button>
              <button
                onClick={() => handleSelectMode('long')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${focusType === 'long' ? 'bg-[#7C3AED] text-white shadow-md' : 'text-outline hover:text-on-surface'
                  }`}
              >
                Long Break
              </button>
            </div>

            {/* Glowing Timer Circle */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle className="text-outline-variant/10" cx="100" cy="100" fill="transparent" r="80" stroke="currentColor" strokeWidth="6"></circle>
                <circle
                  className={`text-primary transition-all duration-300 ${isFocusActive ? 'animate-glow-pulse' : ''}`}
                  cx="100"
                  cy="100"
                  fill="transparent"
                  r="80"
                  stroke="currentColor"
                  strokeDasharray="502.4"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="6"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center space-y-1">
                <span className="font-headline font-extrabold text-5xl text-on-surface tracking-tight">{formatTime(focusTime)}</span>
                <span className="text-[10px] text-outline font-bold uppercase tracking-widest">{isFocusActive ? 'Focus active' : 'Paused'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <button
                onClick={handleToggleTimer}
                className="w-16 h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer  shadow-[#7C3AED]/25"
              >
                {isFocusActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              <button
                onClick={handleReset}
                className="w-16 h-16 bg-surface-container border border-outline-variant/30 text-outline hover:text-on-surface rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Ambient Sounds / Soundboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h2 className="font-headline font-bold text-lg text-on-surface">Ambiance Tracks</h2>
            <p className="text-xs text-outline">Mix background frequencies to block peripheral auditory noise.</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSoundToggle('rain')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${playingSound === 'rain'
                  ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                  : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                <CloudRain className="w-7 h-7" />
                <span className="text-xs font-bold">Rain Fall</span>
              </button>

              <button
                onClick={() => handleSoundToggle('cafe')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${playingSound === 'cafe'
                  ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                  : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                <Coffee className="w-7 h-7" />
                <span className="text-xs font-bold">Coffee Shop</span>
              </button>

              <button
                onClick={() => handleSoundToggle('forest')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${playingSound === 'forest'
                  ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                  : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                <Music className="w-7 h-7" />
                <span className="text-xs font-bold">Zen Forest</span>
              </button>

              <button
                onClick={() => handleSoundToggle('white-noise')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${playingSound === 'white-noise'
                  ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                  : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                <Volume2 className="w-7 h-7" />
                <span className="text-xs font-bold">Brownian Noise</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
