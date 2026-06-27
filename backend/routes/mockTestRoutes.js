const express = require('express');
const router = express.Router();
const { generateMockTest } = require('../controllers/mockTestController');

router.post('/generate', generateMockTest);

module.exports = router;
