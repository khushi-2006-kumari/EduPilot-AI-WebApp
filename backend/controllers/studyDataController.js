const StudyData = require('../models/studyDataModel');

// @desc    Get study data for user
// @route   GET /api/studydata
// @access  Private
const getStudyData = async (req, res) => {
  try {
    let studyData = await StudyData.findOne({ user: req.user._id });

    // If it doesn't exist, create an empty skeleton based on the model defaults
    if (!studyData) {
      studyData = await StudyData.create({
        user: req.user._id
      });
    }

    res.json(studyData);
  } catch (error) {
    console.error('Error fetching study data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update study data for user
// @route   PUT /api/studydata
// @access  Private
const updateStudyData = async (req, res) => {
  try {
    // req.body should contain the state from Redux (excluding non-serializable fields if any)
    const { 
      tasks, streakCount, studyStats, recentSessions, activeSession, 
      focusTime, isFocusActive, focusType, chatMessages, 
      syllabus, mockTests, revisionDecks, notesList, generatedPlan 
    } = req.body;

    let studyData = await StudyData.findOne({ user: req.user._id });

    if (!studyData) {
      studyData = new StudyData({ user: req.user._id });
    }

    // Update fields
    if (tasks !== undefined) studyData.tasks = tasks;
    if (streakCount !== undefined) studyData.streakCount = streakCount;
    if (studyStats !== undefined) studyData.studyStats = studyStats;
    if (recentSessions !== undefined) studyData.recentSessions = recentSessions;
    if (activeSession !== undefined) studyData.activeSession = activeSession;
    if (focusTime !== undefined) studyData.focusTime = focusTime;
    if (isFocusActive !== undefined) studyData.isFocusActive = isFocusActive;
    if (focusType !== undefined) studyData.focusType = focusType;
    if (chatMessages !== undefined) studyData.chatMessages = chatMessages;
    if (syllabus !== undefined) studyData.syllabus = syllabus;
    if (mockTests !== undefined) studyData.mockTests = mockTests;
    if (revisionDecks !== undefined) studyData.revisionDecks = revisionDecks;
    if (notesList !== undefined) studyData.notesList = notesList;
    if (generatedPlan !== undefined) studyData.generatedPlan = generatedPlan;

    // We must tell mongoose that mixed types have changed
    studyData.markModified('tasks');
    studyData.markModified('studyStats');
    studyData.markModified('recentSessions');
    studyData.markModified('activeSession');
    studyData.markModified('chatMessages');
    studyData.markModified('syllabus');
    studyData.markModified('mockTests');
    studyData.markModified('revisionDecks');
    studyData.markModified('notesList');
    studyData.markModified('generatedPlan');

    const updatedData = await studyData.save();
    res.json(updatedData);

  } catch (error) {
    console.error('Error updating study data:', error);
    res.status(500).json({ message: 'Server error updating data' });
  }
};

module.exports = {
  getStudyData,
  updateStudyData
};
