const express = require('express');
const router = express.Router();
const { chatWithAI, getChatHistory, clearChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, chatWithAI);
router.get('/', protect, getChatHistory);
router.delete('/', protect, clearChatHistory);

module.exports = router;
