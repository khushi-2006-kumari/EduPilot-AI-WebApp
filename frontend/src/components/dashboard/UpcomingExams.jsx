import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';

export function UpcomingExams() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const syllabusTopics = useSelector(state => state.study.syllabus.topics) || [];

  const exams = useMemo(() => {
    const subjectMap = {};
    syllabusTopics.forEach(topic => {
      const subj = topic.subject || 'General';
      if (!subjectMap[subj]) {
        subjectMap[subj] = { total: 0, mastered: 0 };
      }
      subjectMap[subj].total += 1;
      if (topic.status === 'mastered') {
        subjectMap[subj].mastered += 1;
      }
    });

    const colors = [
      { bg: 'bg-error', bgLight: 'bg-error/20', text: 'text-error', indicator: 'animate-pulse' },
      { bg: 'bg-orange-500', bgLight: 'bg-orange-500/20', text: 'text-orange-500', indicator: '' },
      { bg: 'bg-green-500', bgLight: 'bg-green-500/20', text: 'text-green-500', indicator: '' },
    ];

    const today = new Date();
    
    return Object.keys(subjectMap).map((subj, index) => {
      const stats = subjectMap[subj];
      const progress = Math.round((stats.mastered / stats.total) * 100) || 0;
      const theme = colors[index % colors.length];
      
      const date = new Date(today);
      date.setDate(date.getDate() + 5 + (subj.length % 10));

      return {
        name: subj,
        progress,
        theme,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    }).slice(0, 3);
  }, [syllabusTopics]);

  const handleExamClick = (subject) => {
    dispatch(showToast(`🎯 Let's revise for ${subject}! Navigating to Smart Revision...`));
    navigate('/revision');
  };

  return (
    <section className="glass-card p-6 rounded-2xl">
      <h3 className="font-headline font-bold text-lg mb-6 text-on-surface">Upcoming Exams</h3>

      <div className="space-y-6 relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant opacity-20"></div>

        {exams.length > 0 ? exams.map((exam, i) => (
          <div 
            key={i}
            onClick={() => handleExamClick(exam.name)}
            className="relative pl-10 cursor-pointer hover:bg-surface-container-high/30 p-2 rounded-xl transition-all active:scale-98"
          >
            <div className={`absolute left-2 top-3.5 w-6 h-6 ${exam.theme.bgLight} rounded-full flex items-center justify-center`}>
              <div className={`w-2.5 h-2.5 ${exam.theme.bg} rounded-full ${exam.theme.indicator}`}></div>
            </div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-bold text-on-surface">{exam.name}</p>
              <p className={`text-[11px] ${exam.theme.text} font-bold uppercase tracking-tighter`}>{exam.date}</p>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className={`h-full ${exam.theme.bg} rounded-full`} style={{ width: `${exam.progress}%` }}></div>
            </div>
            <p className="text-[9px] text-outline mt-1 font-bold italic">{exam.progress}% Syllabus covered</p>
          </div>
        )) : (
          <div className="text-center text-sm text-outline italic">No upcoming exams found. Analyze a syllabus first!</div>
        )}
      </div>
    </section>
  );
}

