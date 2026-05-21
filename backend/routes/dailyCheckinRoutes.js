const express = require('express');
const router = express.Router();
const { addDailyCheckin, getDailyCheckins } = require('../controllers/dailyCheckinController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addDailyCheckin);
router.get('/', protect, getDailyCheckins);

module.exports = router;
