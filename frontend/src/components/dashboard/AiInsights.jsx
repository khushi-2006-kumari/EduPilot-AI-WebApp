import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';

export function AiInsights() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAlertClick = (target, path, message) => {
    dispatch(showToast(message));
    navigate(path);
  };

  return (
    <section className="space-y-4">
      <h3 className="font-headline font-bold text-lg flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary-container text-xl">tips_and_updates</span>
        AI Insights
      </h3>

      <div className="space-y-3">
        <div 
          onClick={() => handleAlertClick('Electronics', '/syllabus', '⚡ Loading Digital Electronics syllabus breakdown...')}
          className="bg-error-container/10 border border-error/20 p-4 rounded-2xl flex gap-3 cursor-pointer hover:bg-error-container/20 transition-all active:scale-98"
        >
          <span className="material-symbols-outlined text-error text-xl shrink-0">report</span>
          <div>
            <p className="text-[10px] font-bold text-error uppercase tracking-wider">Urgent Alert</p>
            <p className="text-sm mt-1 text-on-surface leading-snug">Digital Electronics coverage is only 45%. Predicted score risk high.</p>
          </div>
        </div>

        <div 
          onClick={() => handleAlertClick('Graph Theory', '/revision', '🧠 Opening Smart Revision for Graph Theory...')}
          className="bg-orange-500/6.5 p-4 rounded-2xl flex gap-3 border border-orange-500/20 cursor-pointer hover:bg-orange-500/10 transition-all active:scale-98"
        >
          <span className="material-symbols-outlined text-orange-400 text-xl shrink-0">warning</span>
          <div>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Revision Warning</p>
            <p className="text-sm mt-1 text-on-surface leading-snug">You haven't practiced 'Graph Theory' in 12 days. Retention falling.</p>
          </div>
        </div>

        <div 
          onClick={() => handleAlertClick('Data Structures', '/analytics', '📈 Opening Analytics Dashboard for Data Structures...')}
          className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex gap-3 cursor-pointer hover:bg-green-500/20 transition-all active:scale-98"
        >
          <span className="material-symbols-outlined text-green-400 text-xl shrink-0">trending_up</span>
          <div>
            <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Positive Progress</p>
            <p className="text-sm mt-1 text-on-surface leading-snug">Data Structures score improved by 12% in recent mock tests.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

