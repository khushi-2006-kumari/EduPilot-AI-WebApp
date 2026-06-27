const express = require('express');
const router = express.Router();
const { getStudyData, updateStudyData } = require('../controllers/studyDataController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getStudyData)
  .put(protect, updateStudyData);

module.exports = router;
