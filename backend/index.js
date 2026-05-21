require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/moods', require('./routes/moodRoutes'));
app.use('/api/journals', require('./routes/journalRoutes'));
app.use('/api/checkins', require('./routes/dailyCheckinRoutes'));
app.use('/api/gratitude', require('./routes/gratitudeRoutes'));
app.use('/api/meditation', require('./routes/meditationRoutes'));
app.use('/api/journey', require('./routes/journeyRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
