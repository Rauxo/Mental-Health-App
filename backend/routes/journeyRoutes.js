const express = require('express');
const router = express.Router();
const { getJourneyAnalysis } = require('../controllers/journeyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getJourneyAnalysis);

module.exports = router;
