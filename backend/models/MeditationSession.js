const mongoose = require('mongoose');

const meditationSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['Stress Relief', 'Anxiety Relief', 'Focus', 'Quick Calm', 'Sleep Relax'],
    required: true
  },
  duration: { type: Number, required: true }, // in seconds
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MeditationSession', meditationSessionSchema);
