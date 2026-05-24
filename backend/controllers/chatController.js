const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a calm, empathetic AI mental wellness companion built directly into this app. 
Your ONLY purpose is to provide emotional support, discuss mental wellness, stress relief, anxiety, and mindfulness.
CRITICAL RULES:
1. NEVER discuss app design, app architecture, coding, or how to build software. 
2. If the user asks you to build, design, or change the app, you MUST refuse and remind them that you are just here to listen to their feelings.
3. You are NOT a doctor. Never provide medical diagnoses.
4. Keep responses concise, warm, and conversational.`;

const chatWithAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  try {
    let history = await ChatHistory.findOne({ user: userId });
    if (!history) {
      history = await ChatHistory.create({ user: userId, messages: [] });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 500,
      }
    });

    const geminiHistory = history.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text() || "I'm here to listen.";

    // Save to DB
    history.messages.push({ role: 'user', content: message });
    history.messages.push({ role: 'assistant', content: aiResponse });
    await history.save();

    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ message: 'Failed to communicate with AI' });
  }
};

const getChatHistory = async (req, res) => {
  const userId = req.user._id;
  try {
    const history = await ChatHistory.findOne({ user: userId });
    res.json(history ? history.messages : []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

const clearChatHistory = async (req, res) => {
  const userId = req.user._id;
  try {
    await ChatHistory.findOneAndDelete({ user: userId });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear history' });
  }
};

module.exports = { chatWithAI, getChatHistory, clearChatHistory };
