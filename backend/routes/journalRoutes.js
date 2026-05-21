const express = require('express');
const router = express.Router();
const { addJournalEntry, getJournalEntries } = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addJournalEntry);
router.get('/', protect, getJournalEntries);

module.exports = router;
