const express = require('express');
const multer = require('multer');
const { generateNotes } = require('../controllers/notesController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Can accept either a 'file' via form-data or 'youtubeUrl' via JSON/form-data
router.post('/generate', upload.single('file'), generateNotes);

module.exports = router;
