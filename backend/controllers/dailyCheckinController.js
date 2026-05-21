const DailyCheckin = require('../models/DailyCheckin');

const addDailyCheckin = async (req, res) => {
  const { feeling, stressLevel, energyLevel } = req.body;
  try {
    const checkin = await DailyCheckin.create({
      user: req.user._id,
      feeling,
      stressLevel,
      energyLevel
    });
    res.status(201).json(checkin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDailyCheckins = async (req, res) => {
  try {
    const checkins = await DailyCheckin.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(checkins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addDailyCheckin, getDailyCheckins };
