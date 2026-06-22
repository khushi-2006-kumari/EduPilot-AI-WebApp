import { createSlice } from '@reduxjs/toolkit';

const initialTasks = [
  { id: 1, text: "Data Structures & Algos: Complexity Analysis", category: "Complexity Analysis", completed: true, priority: "normal" },
  { id: 2, text: "Maths II: Calculus - Integration by parts", category: "Integration by parts", completed: false, priority: "high" },
  { id: 3, text: "Digital Electronics: Flip Flops (JK & MS)", category: "Flip Flops (JK & MS)", completed: false, priority: "normal" }
];

const initialSyllabus = {
  fileName: "CS-201_Data_Structures_Syllabus.pdf",
  analyzed: true,
  analysisDate: "2026-05-29",
  overallScore: 82,
  topics: [
    { id: 1, title: "Asymptotic Analysis (Big O, Omega, Theta)", weight: "High", complexity: "Medium", status: "mastered", subject: "Data Structures" },
    { id: 2, title: "Binary Search Trees & AVL Rotations", weight: "Critical", complexity: "High", status: "needs-review", subject: "Data Structures" },
    { id: 3, title: "Graph Traversals (BFS, DFS) & Dijkstra", weight: "Critical", complexity: "High", status: "unstarted", subject: "Data Structures" },
    { id: 4, title: "Hash Tables & Collision Resolution Techniques", weight: "Medium", complexity: "Medium", status: "in-progress", subject: "Data Structures" },
    { id: 5, title: "Stack & Queue Implementations using Lists", weight: "High", complexity: "Easy", status: "mastered", subject: "Data Structures" },
  ]
};

const initialMockTests = {
  availableTests: [
    { id: 't1', title: "Data Structures & Algorithms - Midterm Prep", subject: "Computer Science", questionsCount: 5, duration: 10, difficulty: "Medium" },
    { id: 't2', title: "Calculus II - Integration & Limits Quiz", subject: "Mathematics", questionsCount: 5, duration: 10, difficulty: "Hard" },
    { id: 't3', title: "Sequential Circuits & Flip Flops Assessment", subject: "Digital Electronics", questionsCount: 5, duration: 10, difficulty: "Easy" }
  ],
  activeTest: null,
  pastResults: [
    { id: 'r1', title: "Data Structures - Diagnostic", subject: "Computer Science", score: 80, date: "2026-05-26", totalQuestions: 5, correctAnswers: 4 },
    { id: 'r2', title: "Calculus - Derivatives Prep", subject: "Mathematics", score: 100, date: "2026-05-24", totalQuestions: 5, correctAnswers: 5 },
    { id: 'r3', title: "Logic Gates - Quick Test", subject: "Digital Electronics", score: 60, date: "2026-05-20", totalQuestions: 5, correctAnswers: 3 }
  ]
};

const initialRevisionDecks = [
  {
    id: 'd1',
    title: "Vivid Memory: Big-O Complexities",
    subject: "Computer Science",
    cards: [
      { id: 'c1_1', front: "What is the worst-case time complexity of QuickSort?", back: "O(n^2) when pivot is chosen poorly and splits are highly unbalanced." },
      { id: 'c1_2', front: "What is the average time complexity of MergeSort?", back: "O(n log n) - always takes this time because partitioning is uniform and merge cost is O(n)." },
      { id: 'c1_3', front: "What is the space complexity of HeapSort?", back: "O(1) auxiliary space - it is an in-place sorting algorithm." }
    ]
  },
  {
    id: 'd2',
    title: "Integration Formulas",
    subject: "Mathematics",
    cards: [
      { id: 'c2_1', front: "Integrate: ∫ x e^x dx", back: "(x - 1)e^x + C (using Integration by Parts)" },
      { id: 'c2_2', front: "Integrate: ∫ sec(x) dx", back: "ln|sec(x) + tan(x)| + C" }
    ]
  }
];

const initialNotes = [
  { id: 'n1', title: "QuickSort Partitioning Strategies & Code", subject: "Computer Science", summary: "QuickSort uses a divide-and-conquer paradigm. Lomuto partition vs Hoare partition. Average complexity O(n log n). Worst case O(n^2). In-place and non-stable.", tags: ["Sorting", "Algorithms", "Midterm"] },
  { id: 'n2', title: "JK Flip Flops & Excitation Tables", subject: "Digital Electronics", summary: "JK Flip Flop resolves the forbidden state of SR flip flop. When J=1 and K=1, state toggles (Q_next = Q'). Used in counters.", tags: ["Circuits", "Digital", "Revision"] }
];

const studySlice = createSlice({
  name: 'study',
  initialState: {
    tasks: initialTasks,
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
    chatMessages: [
      {
        id: 1,
        sender: 'ai',
        text: "QuickSort has an average complexity of O(n log n). This happens because the partition process takes O(n) and the tree depth is log n on average. Would you like to see the worst-case scenario analysis?",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVni6EnII7t3lP8Rs8Igz-gna1SK8fMH2sIXKL_UaRgYuuS4Nja5WuLowGNp_r1csSQl1IwT74IHSMFYiewFAtmyG9L0L7eRBhwtc08Nt6Mo1w_Ij0JqTJzmih9CW1CtjWFXxGDok4I2TLbVRNeeNyGQElbgT_PrwBpMSLS1eih3l-tQ0koxeFG8UxFfnz01XjT1xxgsClKQmdxs9Em6dq9Or6aJVU9gUoPYWwvq-J1EQ58RSeoPJOSYJxD_zZwRYZYckAPeycz7s4"
      }
    ],
    syllabus: initialSyllabus,
    mockTests: initialMockTests,
    revisionDecks: initialRevisionDecks,
    notesList: initialNotes,
    generatedPlan: null,
  },
  reducers: {
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
      state.syllabus.topics.push(action.payload);
    },
    updateSyllabusTopicStatus: (state, action) => {
      const { id, status } = action.payload;
      const topic = state.syllabus.topics.find(t => t.id === id);
      if (topic) {
        topic.status = status;
      }
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

        state.mockTests.pastResults.unshift(newResult);
        state.mockTests.activeTest = null;
      }
    },
    cancelMockTest: (state) => {
      state.mockTests.activeTest = null;
    },
    addNotes: (state, action) => {
      state.notesList.unshift(action.payload);
    },
    addRevisionDeck: (state, action) => {
      state.revisionDecks.unshift(action.payload);
    },
    addMockTestResult: (state, action) => {
      state.mockTests.pastResults.unshift(action.payload);
    },
    recordStudySession: (state, action) => {
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
  }
});

export const {
  addTask, toggleTask, deleteTask, incrementStreak,
  setFocusTime, setIsFocusActive, setFocusType,
  addChatMessage, addSyllabusTopic, updateSyllabusTopicStatus,
  startMockTest, selectTestAnswer, setActiveTestIndex, submitActiveTest, cancelMockTest,
  addNotes, addRevisionDeck, addMockTestResult, recordStudySession, setActiveSession, setGeneratedPlan
} = studySlice.actions;

export default studySlice.reducer;

