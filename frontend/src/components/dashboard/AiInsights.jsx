import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';

export function AiInsights() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const syllabusTopics = useSelector(state => state.study.syllabus.topics) || [];
  
  const insights = useMemo(() => {
    const list = [];
    
    // Urgent Alert for unstarted
    const unstarted = syllabusTopics.filter(t => t.status === 'unstarted');
    if (unstarted.length > 0) {
      list.push({
        type: 'alert',
        subject: unstarted[0].subject || unstarted[0].title,
        title: 'Urgent Alert',
        desc: `${unstarted[0].title} is still unstarted. Predicted score risk high.`,
        icon: 'report',
        bgClass: 'bg-error-container/10',
        borderClass: 'border-error/20',
        iconClass: 'text-error',
        hoverClass: 'hover:bg-error-container/20',
        path: '/syllabus',
        msg: `⚡ Loading ${unstarted[0].subject || 'Syllabus'} breakdown...`
      });
    } else {
      list.push({
        type: 'alert',
        subject: 'General',
        title: 'Urgent Alert',
        desc: `No critical pending topics found! Keep up the good work.`,
        icon: 'report',
        bgClass: 'bg-error-container/10',
        borderClass: 'border-error/20',
        iconClass: 'text-error',
        hoverClass: 'hover:bg-error-container/20',
        path: '/syllabus',
        msg: `⚡ Loading syllabus breakdown...`
      });
    }

    // Warning for needs-review
    const weak = syllabusTopics.filter(t => t.status === 'needs-review');
    if (weak.length > 0) {
      list.push({
        type: 'warning',
        subject: weak[0].subject || weak[0].title,
        title: 'Revision Warning',
        desc: `You need to practice '${weak[0].title}'. Retention falling.`,
        icon: 'warning',
        bgClass: 'bg-orange-500/10',
        borderClass: 'border-orange-500/20',
        iconClass: 'text-orange-400',
        hoverClass: 'hover:bg-orange-500/20',
        path: '/mocktest',
        msg: `🧠 Opening Mock Test Generator...`
      });
    }

    // Positive for mastered
    const mastered = syllabusTopics.filter(t => t.status === 'mastered');
    if (mastered.length > 0) {
      list.push({
        type: 'positive',
        subject: mastered[0].subject || mastered[0].title,
        title: 'Positive Progress',
        desc: `'${mastered[0].title}' mastery is solid. Score improved recently.`,
        icon: 'trending_up',
        bgClass: 'bg-green-500/10',
        borderClass: 'border-green-500/20',
        iconClass: 'text-green-400',
        hoverClass: 'hover:bg-green-500/20',
        path: '/analytics',
        msg: `📈 Opening Analytics Dashboard...`
      });
    }

    return list.slice(0, 3);
  }, [syllabusTopics]);

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
        {insights.map((insight, i) => (
          <div 
            key={i}
            onClick={() => handleAlertClick(insight.subject, insight.path, insight.msg)}
            className={`${insight.bgClass} border ${insight.borderClass} p-4 rounded-2xl flex gap-3 cursor-pointer ${insight.hoverClass} transition-all active:scale-98`}
          >
            <span className={`material-symbols-outlined ${insight.iconClass} text-xl shrink-0`}>{insight.icon}</span>
            <div>
              <p className={`text-[10px] font-bold ${insight.iconClass} uppercase tracking-wider`}>{insight.title}</p>
              <p className="text-sm mt-1 text-on-surface leading-snug">{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

