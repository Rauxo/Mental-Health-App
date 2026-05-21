const express = require('express');
const router = express.Router();
const { addMoodEntry, getMoodEntries } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addMoodEntry);
router.get('/', protect, getMoodEntries);

module.exports = router;
