import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';
import env from '../config/env.js';

const RULE_BASED_RESPONSES = [
  { keywords: ['hello', 'hi', 'hey'], reply: 'Hello! I am your AI Farming Assistant. Ask me about crop diseases, weather, or fertilizers.' },
  { keywords: ['fertilizer'], reply: 'For fertilizer recommendations, please upload a photo of your crop or tell me the crop and disease name.' },
  { keywords: ['weather'], reply: 'You can check live weather and disease risk predictions on the Weather page.' },
  { keywords: ['price', 'market'], reply: 'Check the Market Prices page for live mandi rates on your crop.' },
];

const ruleBasedReply = (message) => {
  const lower = message.toLowerCase();
  const match = RULE_BASED_RESPONSES.find((r) => r.keywords.some((k) => lower.includes(k)));
  return match ? match.reply : null;
};

export const chatWithBot = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (env.GEMINI_API_KEY) {
    try {
      const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          contents: [
            ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
            { role: 'user', parts: [{ text: `You are an expert agricultural assistant helping Indian farmers. Answer concisely and practically: ${message}` }] },
          ],
        }
      );
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      return success(res, 200, 'Chatbot response', { reply, source: 'gemini' });
    } catch (err) {
      // fall through to rule-based
    }
  }

  const reply = ruleBasedReply(message) || "I'm currently running in offline mode. Try asking about diseases, fertilizers, weather, or market prices. Configure GEMINI_API_KEY for full AI chat.";
  success(res, 200, 'Chatbot response', { reply, source: 'rule-based' });
});
