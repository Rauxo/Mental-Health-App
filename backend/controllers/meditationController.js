const MeditationSession = require('../models/MeditationSession');

const addMeditationSession = async (req, res) => {
  const { category, duration, completed } = req.body;
  try {
    const session = await MeditationSession.create({
      user: req.user._id,
      category,
      duration,
      completed
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMeditationSessions = async (req, res) => {
  try {
    const sessions = await MeditationSession.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addMeditationSession, getMeditationSessions };
