import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';

export function StudyActivity() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(showToast('📊 Loading detailed analytics & study logs...'));
    navigate('/analytics');
  };

  return (
    <section 
      onClick={handleClick}
      className="glass-card p-6 rounded-2xl cursor-pointer hover:bg-surface-container-high/30 transition-all active:scale-98"
    >
      <h3 className="font-headline font-bold text-[10px] mb-4 uppercase tracking-widest text-outline flex justify-between items-center">
        <span>Study Activity</span>
        <span className="material-symbols-outlined text-[12px] text-outline/60">open_in_new</span>
      </h3>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="grid grid-cols-10 grid-rows-3 gap-1.5 shrink-0">
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/40"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/80"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/20"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/60"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/20"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/40"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/80"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/60"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/20"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/40"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/60"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/80"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/20"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/60"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/80"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/40"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/60"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/80"></div>
          <div className="w-4 h-4 rounded-sm bg-primary-container/10"></div>
          <div className="w-4 h-4 rounded-sm bg-surface-container-highest/50 border border-outline-variant/20"></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] text-outline uppercase tracking-widest font-bold">
        <span>Sep 14</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-px bg-primary-container/10"></div>
            <div className="w-2 h-2 rounded-px bg-primary-container/40"></div>
            <div className="w-2 h-2 rounded-px bg-primary-container/70"></div>
            <div className="w-2 h-2 rounded-px bg-primary-container"></div>
          </div>
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </section>
  );
}

