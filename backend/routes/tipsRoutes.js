const express = require('express');
const router = express.Router();
const { generateTips } = require('../controllers/tipsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, generateTips);

module.exports = router;
