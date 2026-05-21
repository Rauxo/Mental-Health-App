const express = require('express');
const router = express.Router();
const { addMeditationSession, getMeditationSessions } = require('../controllers/meditationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addMeditationSession);
router.get('/', protect, getMeditationSessions);

module.exports = router;
