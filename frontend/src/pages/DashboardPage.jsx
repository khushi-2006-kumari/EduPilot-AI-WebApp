import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toggleTask, setFocusType, setIsFocusActive, addChatMessage, showToast } from '../store';
import { TodaysPlan } from '../components/dashboard/TodaysPlan';
import { DoubtSolver } from '../features/doubt-solver/DoubtSolver';
import { SubjectCards } from '../components/dashboard/SubjectCards';
import { AiInsights } from '../components/dashboard/AiInsights';
import { UpcomingExams } from '../components/dashboard/UpcomingExams';
import { StudyActivity } from '../components/dashboard/StudyActivity';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Redux Selectors
  const user = useSelector(state => state.auth.user);
  const tasks = useSelector(state => state.study.tasks);
  const streakCount = useSelector(state => state.study.streakCount);
  const focusTime = useSelector(state => state.study.focusTime);
  const focusType = useSelector(state => state.study.focusType);
  const isFocusActive = useSelector(state => state.study.isFocusActive);
  const chatMessages = useSelector(state => state.study.chatMessages);
  const mockTestResults = useSelector(state => state.study.mockTests.pastResults);
  const syllabusTopics = useSelector(state => state.study.syllabus.topics);

  // Local state for chat inputs
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Calculated Progress Ring percentages
  const completedTaskCount = useMemo(() => {
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  const totalTopics = syllabusTopics ? syllabusTopics.length : 1;
  const masteredTopicsCount = syllabusTopics ? syllabusTopics.filter(t => t.status === 'mastered').length : 0;
  
  const currentCompletedTopics = useMemo(() => {
    return masteredTopicsCount + completedTaskCount;
  }, [masteredTopicsCount, completedTaskCount]);

  const syllabusProgressPercent = useMemo(() => {
    if (totalTopics === 0) return 0;
    return Math.min(100, Math.round((currentCompletedTopics / totalTopics) * 100));
  }, [currentCompletedTopics, totalTopics]);

  const mockTestStats = useMemo(() => {
    if (!mockTestResults || mockTestResults.length === 0) return { count: 0, avg: 0 };
    const totalScore = mockTestResults.reduce((acc, r) => acc + (r.score || 0), 0);
    return {
      count: mockTestResults.length,
      avg: Math.round(totalScore / mockTestResults.length)
    };
  }, [mockTestResults]);

  const triggerToast = (msg) => {
    dispatch(showToast(msg));
  };

  const handleToggleTask = (id) => {
    dispatch(toggleTask(id));
  };

  const handleSelectFocusType = (type) => {
    dispatch(setFocusType(type));
  };

  const handleSetIsFocusActive = (val) => {
    dispatch(setIsFocusActive(val));
  };

  const handleSendDoubt = async (e, presetText = null) => {
    if (e) e.preventDefault();
    const query = presetText || userInput;
    if (!query.trim()) return;

    dispatch(addChatMessage({
      id: Date.now(),
      sender: 'user',
      text: query
    }));

    if (!presetText) setUserInput('');
    setIsAiTyping(true);

    try {
      // Prepare history for context
      const history = chatMessages.map(msg => ({
        role: msg.sender,
        text: msg.text
      }));

      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.post('http://localhost:5000/api/chat', {
        question: query,
        history,
        deepMode: false
      }, config);

      dispatch(addChatMessage({
        id: Date.now() + 1,
        sender: 'ai',
        text: data.answer
      }));
    } catch (error) {
      console.error('Chat error:', error);
      dispatch(addChatMessage({
        id: Date.now() + 1,
        sender: 'ai',
        text: "Sorry, I encountered an error. Please try again."
      }));
      triggerToast('AI Service Error');
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Greet Banner */}
      <div className="space-y-4">
        <div>
          <h2 className="font-headline text-3xl font-bold text-on-surface">{getGreeting()}, {user?.name || 'Khushi'}! 👋</h2>
          <p className="text-on-surface-variant mt-2 font-medium">
            You have <span className="text-primary font-bold">{tasks.filter(t => !t.completed).length} tasks</span> pending and <span className="text-secondary font-bold">{totalTopics - currentCompletedTopics} topics</span> left to master.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/syllabus')}
            className="px-6 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Analyze Syllabus
          </button>
          <button
            onClick={() => navigate('/mocktest')}
            className="px-6 py-3 bg-surface-container-highest text-on-surface border border-outline-variant/30 rounded-xl font-bold flex items-center gap-2 hover:bg-surface-bright transition-all active:scale-95 text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">quiz</span>
            Start Mock Test
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1: Syllabus Progress */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 hover:ai-glow transition-all">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-outline-variant/20" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle
                className="text-primary progress-ring__circle"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * syllabusProgressPercent) / 100}
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
            </svg>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-headline font-bold text-sm text-on-surface">{syllabusProgressPercent}%</span>
          </div>
          <div>
            <h3 className="text-outline text-[10px] font-bold uppercase tracking-widest mb-1">Syllabus Progress</h3>
            <p className="text-on-surface font-bold text-lg leading-none">{currentCompletedTopics}/{totalTopics} topics</p>
            <p className="text-green-400 text-[10px] flex items-center gap-1 mt-1 font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span> ↑ 5%
            </p>
          </div>
        </div>

        {/* Stat 2: Mock Tests */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 hover:ai-glow transition-all">
          <div className="w-14 h-14 bg-secondary-container/10 rounded-full flex items-center justify-center border border-secondary-container/30 shrink-0">
            <span className="material-symbols-outlined text-secondary text-2xl">task_alt</span>
          </div>
          <div>
            <h3 className="text-outline text-[10px] font-bold uppercase tracking-widest mb-1">Mock Tests</h3>
            <p className="text-on-surface font-bold text-lg leading-none">{mockTestStats.count} Completed</p>
            <p className="text-outline text-[10px] mt-1 uppercase font-bold tracking-tight">Avg score: <span className="text-secondary font-bold">{mockTestStats.avg}%</span></p>
          </div>
        </div>

        {/* Stat 3: Topics Mastery */}
        <div className="glass-card p-6 rounded-2xl space-y-3 hover:ai-glow transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-outline text-[10px] font-bold uppercase tracking-widest">Topics Mastery</h3>
            <div className="w-7 h-7 bg-surface-container rounded-lg flex items-center justify-center border border-outline-variant/20">
              <span className="material-symbols-outlined text-sm text-outline">book</span>
            </div>
          </div>
          <p className="text-on-surface font-bold text-3xl leading-none">{currentCompletedTopics}</p>
          <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-primary-container h-full rounded-full" style={{ width: `${syllabusProgressPercent}%` }}></div>
          </div>
          <p className="text-outline text-[9px] font-bold uppercase tracking-tight">+18 topics this month</p>
        </div>

        {/* Stat 4: Activity Streak */}
        <div className="glass-card p-6 rounded-2xl hover:ai-glow transition-all border-primary-container/20">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500 animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <span className="text-2xl font-headline font-bold text-on-surface">{streakCount}</span>
            </div>
            <span className="px-2 py-0.5 bg-primary-container/10 text-primary-container text-[10px] font-bold rounded uppercase border border-primary-container/20 tracking-tighter">Top 5% Badge</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            <div className="h-5 w-full bg-primary-container/20 rounded-sm"></div>
            <div className="h-5 w-full bg-primary-container/40 rounded-sm"></div>
            <div className="h-5 w-full bg-primary-container/60 rounded-sm"></div>
            <div className="h-5 w-full bg-primary-container/80 rounded-sm"></div>
            <div className="h-5 w-full bg-primary-container rounded-sm"></div>
            <div className="h-5 w-full bg-surface-container-low rounded-sm"></div>
            <div className="h-5 w-full bg-surface-container-low rounded-sm"></div>
          </div>
          <p className="text-outline text-[9px] text-center mt-2 uppercase font-bold tracking-widest">Activity Velocity</p>
        </div>
      </div>

      {/* Main Grid Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side (Today's Plan, Focus pomodoro, AI doubt solver, subject proficiencies) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <TodaysPlan tasks={tasks} toggleTask={handleToggleTask} />
          </div>

          <DoubtSolver
            chatMessages={chatMessages}
            isAiTyping={isAiTyping}
            userInput={userInput}
            setUserInput={setUserInput}
            handleSendDoubt={handleSendDoubt}
            setChatMessages={() => { }}
            triggerToast={triggerToast}
          />

          <SubjectCards />
        </div>

        {/* Right Side */}
        <div className="lg:col-span-4 space-y-8">
          <AiInsights />
          <UpcomingExams />
          <StudyActivity />
        </div>
      </div>
    </div>
  );
}
