import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export const askGemini = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const answer = result?.response?.text() || "No answer found.";
    res.json({ answer });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: err.message || "Gemini API error" });
  }
};
