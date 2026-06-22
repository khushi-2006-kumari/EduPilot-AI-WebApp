import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';

export function SubjectCards() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const syllabusTopics = useSelector(state => state.study.syllabus.topics);

  const dynamicSubjects = useMemo(() => {
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
      { border: 'border-primary-container', bg: 'bg-primary-container', text: 'text-primary-container' },
      { border: 'border-cyan-400', bg: 'bg-cyan-400', text: 'text-cyan-400' },
      { border: 'border-orange-500', bg: 'bg-orange-500', text: 'text-orange-500' },
      { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-500' },
    ];

    return Object.keys(subjectMap).map((subj, index) => {
      const stats = subjectMap[subj];
      const progress = Math.round((stats.mastered / stats.total) * 100) || 0;
      const theme = colors[index % colors.length];
      return {
        name: subj,
        progress,
        theme
      };
    });
  }, [syllabusTopics]);

  const handleSubjectClick = (subject, path, msg) => {
    dispatch(showToast(msg));
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {dynamicSubjects.map((subj, i) => (
        <div 
          key={i}
          onClick={() => handleSubjectClick(subj.name, '/syllabus', `📚 Loading ${subj.name} syllabus...`)}
          className={`glass-card p-5 rounded-2xl border-l-4 ${subj.theme.border} cursor-pointer hover:brightness-110 active:scale-98 transition-all`}
        >
          <p className="font-bold text-sm text-on-surface">{subj.name}</p>
          <div className="flex justify-between items-center mt-3 mb-1">
            <span className="text-[10px] text-outline font-bold uppercase">{subj.progress < 100 ? 'In Progress' : 'Completed'}</span>
            <span className={`${subj.theme.text} font-bold text-xs`}>{subj.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div className={`h-full ${subj.theme.bg}`} style={{ width: `${subj.progress}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

