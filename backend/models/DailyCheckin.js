const mongoose = require('mongoose');

const dailyCheckinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feeling: { type: String, required: true },
  stressLevel: { type: Number, min: 1, max: 10, required: true },
  energyLevel: { type: Number, min: 1, max: 10, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DailyCheckin', dailyCheckinSchema);
