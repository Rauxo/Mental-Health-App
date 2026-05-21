const GratitudeEntry = require('../models/GratitudeEntry');

const addGratitudeEntry = async (req, res) => {
  const { items } = req.body;
  try {
    const entry = await GratitudeEntry.create({
      user: req.user._id,
      items
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getGratitudeEntries = async (req, res) => {
  try {
    const entries = await GratitudeEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addGratitudeEntry, getGratitudeEntries };
