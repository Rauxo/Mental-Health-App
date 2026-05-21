const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { 
    type: String, 
    enum: ['Happy', 'Calm', 'Neutral', 'Sad', 'Angry', 'Anxious'],
    required: true 
  },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
