const MoodEntry = require('../models/MoodEntry');

const addMoodEntry = async (req, res) => {
  const { mood, notes } = req.body;
  try {
    const entry = await MoodEntry.create({ user: req.user._id, mood, notes });
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMoodEntries = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addMoodEntry, getMoodEntries };
