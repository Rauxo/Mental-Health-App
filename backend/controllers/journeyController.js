const MoodEntry = require('../models/MoodEntry');
const Journal = require('../models/Journal');
const MeditationSession = require('../models/MeditationSession');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * GET /api/journey
 * Returns AI‑generated analysis of the user's recent mood, journal and meditation data.
 */
const getJourneyAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    // -------------------------------------------------------------------
    // 1️⃣  Gather recent data (last 10 entries each for simplicity)
    // -------------------------------------------------------------------
    const moods = await MoodEntry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);
    const journals = await Journal.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    const meditations = await MeditationSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // -------------------------------------------------------------------
    // 2️⃣  If there is no data, return a sensible default so the UI can render
    // -------------------------------------------------------------------
    if (!moods.length && !journals.length) {
      return res.json({
        score: 50,
        chartData: [0, 0, 0, 0, 0, 0, 0],
        analysis: "You haven't logged enough data yet. Start tracking your mood and journaling to see your wellness journey!",
        suggestions: ["Log your first mood", "Write a journal entry", "Try a quick meditation"]
      });
    }

    // -------------------------------------------------------------------
    // 3️⃣  Build a concise prompt for Gemini
    // -------------------------------------------------------------------
    const moodMap = moods
      .map(m => `Mood: ${m.mood}, Intensity: ${m.intensity}, Date: ${m.createdAt}`)
      .join(' | ');
    const journalMap = journals
      .map(j => `Journal: "${j.content.substring(0, 50)}..."`)
      .join(' | ');
    const meditationMap = meditations
      .map(m => `Meditation: ${m.category} for ${m.duration}s`)
      .join(' | ');

    const prompt = `\nYou are an expert mental‑health analyst. Below is recent wellness data for a user.\n\nMoods: ${moodMap}\nJournals: ${journalMap}\nMeditations: ${meditationMap}\n\nAnalyze this data and return a JSON object **exactly** in the following shape (no markdown, no extra text):\n{\n  "score": <1‑100>,\n  "chartData": [<7 numbers 1‑10 representing the last 7‑day trend>],\n  "analysis": "<2‑3 sentence empathetic professional analysis>",\n  "suggestions": ["<tip 1>", "<tip 2>", "<tip 3>"]\n}\n`;

    // -------------------------------------------------------------------
    // 4️⃣  Call Gemini
    // -------------------------------------------------------------------
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();

    // Strip possible markdown fences that Gemini sometimes adds
    if (textResult.startsWith('```json')) {
      textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (textResult.startsWith('```')) {
      textResult = textResult.replace(/```/g, '').trim();
    }

    const aiData = JSON.parse(textResult);
    // Append raw entries so the frontend can list them with dates
    const response = {
      ...aiData,
      moods: moods.map(m => ({ mood: m.mood, intensity: m.intensity, date: m.createdAt })),
      journals: journals.map(j => ({ content: j.content, date: j.createdAt })),
      meditations: meditations.map(m => ({ category: m.category, duration: m.duration, date: m.createdAt })),
    };
    return res.json(response);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return res.status(500).json({ message: 'Failed to generate journey analysis' });
  }
};

module.exports = { getJourneyAnalysis };
