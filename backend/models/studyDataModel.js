const mongoose = require('mongoose');

const studyDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  tasks: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  streakCount: {
    type: Number,
    default: 0
  },
  studyStats: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      totalHours: 0,
      sessionsDone: 0,
      avgFocus: 0
    }
  },
  recentSessions: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  activeSession: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  focusTime: {
    type: Number,
    default: 1500
  },
  isFocusActive: {
    type: Boolean,
    default: false
  },
  focusType: {
    type: String,
    default: 'pomodoro'
  },
  chatMessages: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  syllabus: {
    type: mongoose.Schema.Types.Mixed,
    default: { topics: [] }
  },
  mockTests: {
    type: mongoose.Schema.Types.Mixed,
    default: { availableTests: [], activeTest: null, pastResults: [] }
  },
  revisionDecks: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  notesList: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  generatedPlan: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true,
  minimize: false // prevents mongoose from removing empty objects
});

const StudyData = mongoose.model('StudyData', studyDataSchema);
module.exports = StudyData;
