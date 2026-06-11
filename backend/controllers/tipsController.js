const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTips = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 800,
      }
    });

    const prompt = `Generate 3 unique, actionable daily tips and tricks for mental health and wellness. 
One of the tips MUST be a daily affirmation.
Each tip should have:
- title: A short catchy title (max 5 words)
- text: A brief description or affirmation phrase (max 2 sentences)
- icon: A valid Ionicons icon name (e.g. 'leaf-outline', 'water-outline', 'sunny-outline', 'heart-outline', 'happy-outline', 'body-outline', 'fitness-outline', 'moon-outline', 'book-outline', 'cafe-outline')

Return ONLY a valid JSON array of objects. Do not wrap in markdown tags like \`\`\`json.
Example format:
[
  { "id": "1", "title": "Example Title", "text": "Example text.", "icon": "leaf-outline" }
]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const tips = JSON.parse(text);
    
    // Ensure IDs are strings and present
    const formattedTips = tips.map((tip, index) => ({
      id: tip.id ? String(tip.id) : String(index + 1),
      title: tip.title || 'Tip',
      text: tip.text || 'Practice mindfulness today.',
      icon: tip.icon || 'leaf-outline'
    }));

    res.json(formattedTips);
  } catch (error) {
    console.error('Gemini API Error (Tips):', error);
    res.status(500).json({ message: 'Failed to generate tips' });
  }
};

module.exports = { generateTips };
