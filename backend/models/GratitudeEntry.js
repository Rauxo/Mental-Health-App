const mongoose = require('mongoose');

const gratitudeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: String, required: true }] // Array of 3 strings
}, { timestamps: true });

module.exports = mongoose.model('GratitudeEntry', gratitudeEntrySchema);
