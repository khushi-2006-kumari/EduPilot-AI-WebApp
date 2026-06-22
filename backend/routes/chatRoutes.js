const express = require('express');
const router = express.Router();
const { solveDoubt } = require('../controllers/chatController');

router.post('/', solveDoubt);

module.exports = router;
