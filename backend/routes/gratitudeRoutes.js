const express = require('express');
const router = express.Router();
const { addGratitudeEntry, getGratitudeEntries } = require('../controllers/gratitudeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addGratitudeEntry);
router.get('/', protect, getGratitudeEntries);

module.exports = router;
