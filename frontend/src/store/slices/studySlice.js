import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStudyData = createAsyncThunk(
  'study/fetchStudyData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { user } } = getState();
      if (!user || !user.token) return rejectWithValue('No user token');

      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.get('http://localhost:5000/api/studydata', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const studySlice = createSlice({
  name: 'study',
  initialState: {
    tasks: [],
    streakCount: 0,
    studyStats: {
      totalHours: 0,
      sessionsDone: 0,
      avgFocus: 0
    },
    recentSessions: [],
    activeSession: null,
    focusTime: 1500, // 25 min in seconds
    isFocusActive: false,
    focusType: 'pomodoro', // 'pomodoro' | 'short' | 'long'
    chatMessages: [],
    syllabus: { topics: [] },
    mockTests: { availableTests: [], activeTest: null, pastResults: [] },
    revisionDecks: [],
    notesList: [],
    generatedPlan: null,
    loading: false,
    error: null,
  },
  reducers: {
    setStudyData: (state, action) => {
      return { ...state, ...action.payload };
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    incrementStreak: (state) => {
      state.streakCount += 1;
    },
    setFocusTime: (state, action) => {
      state.focusTime = action.payload;
    },
    setIsFocusActive: (state, action) => {
      state.isFocusActive = action.payload;
    },
    setFocusType: (state, action) => {
      state.focusType = action.payload;
      state.isFocusActive = false;
      if (action.payload === 'pomodoro') state.focusTime = 1500;
      else if (action.payload === 'short') state.focusTime = 300;
      else if (action.payload === 'long') state.focusTime = 900;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    addSyllabusTopic: (state, action) => {
      if(!state.syllabus) state.syllabus = { topics: [] };
      if(!state.syllabus.topics) state.syllabus.topics = [];
      state.syllabus.topics.push(action.payload);
    },
    updateSyllabusTopicStatus: (state, action) => {
      const { id, status } = action.payload;
      if(state.syllabus && state.syllabus.topics) {
        const topic = state.syllabus.topics.find(t => t.id === id);
        if (topic) {
          topic.status = status;
        }
      }
    },
    setSyllabus: (state, action) => {
      state.syllabus = action.payload;
    },
    startMockTest: (state, action) => {
      const test = state.mockTests.availableTests.find(t => t.id === action.payload);
      if (test) {
        state.mockTests.activeTest = {
          ...test,
          startTime: Date.now(),
          answers: {},
          currentQuestionIndex: 0,
          questions: [
            { id: 1, text: `For the subject ${test.subject}, what is the correct asymptotic notation for the tightest bound?`, options: ["O(n) - Big O", "o(n) - Little o", "Θ(n) - Big Theta", "Ω(n) - Big Omega"], correctAnswer: 2 },
            { id: 2, text: "Which property is crucial for a Hash Function to minimize collisions?", options: ["Uniform distribution", "Monotonic increase", "Constant offset", "High computing latency"], correctAnswer: 0 },
            { id: 3, text: "In a min-heap binary tree structure, what is the level order array index of parent of node at index i?", options: ["floor(i/2)", "floor((i-1)/2)", "2*i + 1", "2*i + 2"], correctAnswer: 1 },
            { id: 4, text: "What is the primary trade-off of using adjacency matrix over adjacency list for graph storage?", options: ["Speed of edge lookup vs space consumed", "Dijkstra efficiency vs Prim efficiency", "Recursive depth vs Iterative depth", "Stack usage vs Heap usage"], correctAnswer: 0 },
            { id: 5, text: "Which of these sorting methods is stable and runs in O(n log n) worst-case time?", options: ["QuickSort", "MergeSort", "HeapSort", "SelectionSort"], correctAnswer: 1 },
          ]
        };
      }
    },
    selectTestAnswer: (state, action) => {
      const { questionId, optionIndex } = action.payload;
      if (state.mockTests.activeTest) {
        state.mockTests.activeTest.answers[questionId] = optionIndex;
      }
    },
    setActiveTestIndex: (state, action) => {
      if (state.mockTests.activeTest) {
        state.mockTests.activeTest.currentQuestionIndex = action.payload;
      }
    },
    submitActiveTest: (state) => {
      if (state.mockTests.activeTest) {
        const test = state.mockTests.activeTest;
        let score = 0;
        test.questions.forEach(q => {
          if (test.answers[q.id] === q.correctAnswer) {
            score += 20; // 5 questions, 20 points each
          }
        });
        const correctAnswers = score / 20;

        const newResult = {
          id: 'r' + (state.mockTests.pastResults.length + 1),
          title: test.title,
          subject: test.subject,
          score: score,
          date: new Date().toISOString().split('T')[0],
          totalQuestions: test.questions.length,
          correctAnswers: correctAnswers
        };

        if(!state.mockTests.pastResults) state.mockTests.pastResults = [];
        state.mockTests.pastResults.unshift(newResult);
        state.mockTests.activeTest = null;
      }
    },
    cancelMockTest: (state) => {
      state.mockTests.activeTest = null;
    },
    addNotes: (state, action) => {
      if(!state.notesList) state.notesList = [];
      state.notesList.unshift(action.payload);
    },
    addRevisionDeck: (state, action) => {
      if(!state.revisionDecks) state.revisionDecks = [];
      state.revisionDecks.unshift(action.payload);
    },
    addMockTestResult: (state, action) => {
      if(!state.mockTests) state.mockTests = { pastResults: [] };
      if(!state.mockTests.pastResults) state.mockTests.pastResults = [];
      state.mockTests.pastResults.unshift(action.payload);
    },
    setAvailableMockTests: (state, action) => {
      if(!state.mockTests) state.mockTests = { availableTests: [] };
      state.mockTests.availableTests = action.payload;
    },
    recordStudySession: (state, action) => {
      if(!state.recentSessions) state.recentSessions = [];
      if(!state.studyStats) state.studyStats = { totalHours: 0, sessionsDone: 0, avgFocus: 0 };
      
      state.recentSessions.unshift(action.payload);
      state.studyStats.sessionsDone += 1;
      
      const sessionHours = action.payload.durationMinutes / 60;
      state.studyStats.totalHours = parseFloat((state.studyStats.totalHours + sessionHours).toFixed(1));
      
      // Rough focus update
      state.studyStats.avgFocus = state.studyStats.avgFocus === 0 
        ? action.payload.focusScore 
        : Math.round((state.studyStats.avgFocus + action.payload.focusScore) / 2);
    },
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
    },
    setGeneratedPlan: (state, action) => {
      state.generatedPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudyData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudyData.fulfilled, (state, action) => {
        state.loading = false;
        // Merge fetched data onto state. Ensure objects aren't undefined.
        const data = action.payload;
        if (data.tasks) state.tasks = data.tasks;
        if (data.streakCount !== undefined) state.streakCount = data.streakCount;
        if (data.studyStats) state.studyStats = data.studyStats;
        if (data.recentSessions) state.recentSessions = data.recentSessions;
        if (data.activeSession) state.activeSession = data.activeSession;
        if (data.focusTime) state.focusTime = data.focusTime;
        if (data.isFocusActive !== undefined) state.isFocusActive = data.isFocusActive;
        if (data.focusType) state.focusType = data.focusType;
        if (data.chatMessages) state.chatMessages = data.chatMessages;
        if (data.syllabus) state.syllabus = data.syllabus;
        if (data.mockTests) state.mockTests = data.mockTests;
        if (data.revisionDecks) state.revisionDecks = data.revisionDecks;
        if (data.notesList) state.notesList = data.notesList;
        if (data.generatedPlan) state.generatedPlan = data.generatedPlan;
      })
      .addCase(fetchStudyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setStudyData,
  addTask, toggleTask, deleteTask, incrementStreak,
  setFocusTime, setIsFocusActive, setFocusType,
  addChatMessage, addSyllabusTopic, updateSyllabusTopicStatus, setSyllabus,
  startMockTest, selectTestAnswer, setActiveTestIndex, submitActiveTest, cancelMockTest,
  addNotes, addRevisionDeck, addMockTestResult, setAvailableMockTests, recordStudySession, setActiveSession, setGeneratedPlan
} = studySlice.actions;

export default studySlice.reducer;

