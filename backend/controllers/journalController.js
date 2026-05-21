const Journal = require('../models/Journal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Analyze this journal entry for emotional summary and stress patterns. 
Return ONLY a valid JSON object like {"emotionalSummary": "...", "stressPattern": "..."}. Do not include markdown code blocks.`;

const addJournalEntry = async (req, res) => {
  const { content } = req.body;
  try {
    // Basic AI analysis
    let emotionalSummary = '';
    let stressPattern = '';

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      });
      const result = await model.generateContent(content);
      const aiAnalysis = JSON.parse(result.response.text() || '{}');
      emotionalSummary = aiAnalysis.emotionalSummary || '';
      stressPattern = aiAnalysis.stressPattern || '';
    } catch (aiError) {
      console.error('AI Analysis failed:', aiError);
    }

    const entry = await Journal.create({
      user: req.user._id,
      content,
      emotionalSummary,
      stressPattern
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getJournalEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addJournalEntry, getJournalEntries };
