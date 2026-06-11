const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendation = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });

    const prompt = `You are a mental health companion app. Generate a single, short (max 2 sentences) daily recommendation for the user. It should be actionable and positive, suggesting an activity like grounding, box breathing, walking, journaling, or just taking a break. Do not use quotes.`;

    const result = await model.generateContent(prompt);
    const recommendation = result.response.text().trim();

    res.json({ recommendation });
  } catch (error) {
    console.error('Gemini API Error (Recommendation):', error);
    res.status(500).json({ message: 'Failed to generate recommendation', recommendation: 'Take a deep breath and give yourself a moment of peace.' });
  }
};

module.exports = { getRecommendation };
