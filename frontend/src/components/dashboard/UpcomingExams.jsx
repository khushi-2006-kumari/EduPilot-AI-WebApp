import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';

export function UpcomingExams() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleExamClick = (subject) => {
    dispatch(showToast(`🎯 Let's revise for ${subject}! Navigating to Smart Revision...`));
    navigate('/revision');
  };

  return (
    <section className="glass-card p-6 rounded-2xl">
      <h3 className="font-headline font-bold text-lg mb-6 text-on-surface">Upcoming Exams</h3>

      <div className="space-y-6 relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant opacity-20"></div>

        <div 
          onClick={() => handleExamClick('Data Structures')}
          className="relative pl-10 cursor-pointer hover:bg-surface-container-high/30 p-2 rounded-xl transition-all active:scale-98"
        >
          <div className="absolute left-2 top-3.5 w-6 h-6 bg-error/20 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-error rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-bold text-on-surface">Data Structures</p>
            <p className="text-[11px] text-error font-bold italic uppercase tracking-tighter">Oct 22</p>
          </div>
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-error w-[65%] rounded-full"></div>
          </div>
          <p className="text-[9px] text-outline mt-1 font-bold italic">65% Syllabus covered</p>
        </div>

        <div 
          onClick={() => handleExamClick('Maths II')}
          className="relative pl-10 cursor-pointer hover:bg-surface-container-high/30 p-2 rounded-xl transition-all active:scale-98"
        >
          <div className="absolute left-2 top-3.5 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-bold text-on-surface">Maths II</p>
            <p className="text-[11px] text-outline font-bold uppercase tracking-tighter">Oct 25</p>
          </div>
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[80%] rounded-full"></div>
          </div>
          <p className="text-[9px] text-outline mt-1 font-bold italic">80% Syllabus covered</p>
        </div>

        <div 
          onClick={() => handleExamClick('Electronics')}
          className="relative pl-10 cursor-pointer hover:bg-surface-container-high/30 p-2 rounded-xl transition-all active:scale-98"
        >
          <div className="absolute left-2 top-3.5 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-bold text-on-surface">Electronics</p>
            <p className="text-[11px] text-outline font-bold uppercase tracking-tighter">Oct 29</p>
          </div>
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[45%] rounded-full"></div>
          </div>
          <p className="text-[9px] text-outline mt-1 font-bold italic">45% Syllabus covered</p>
        </div>
      </div>
    </section>
  );
}

