const express = require('express');
const multer = require('multer');
const router = express.Router();
const { analyzeSyllabus } = require('../controllers/syllabusController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  }
});

router.post('/analyze', upload.single('file'), analyzeSyllabus);

module.exports = router;
