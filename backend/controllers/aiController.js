import { GoogleGenerativeAI } from "@google/generative-ai";
import { TRAVEL_PLANNER_PROMPT } from "../config/prompts.js";


const chatHistories = {};

function getChatHistory(sessionId) {
  if (!chatHistories[sessionId]) {
    chatHistories[sessionId] = [];
  }
  return chatHistories[sessionId];
}

export const chat = async (req, res) => {
  try {
    // 1. FIRST, extract variables from the request body
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 2. Safely grab the API Key at runtime
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey); 

    // 3. Configure the model with native JSON output enforcement
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const sid = sessionId || "default";
    const history = getChatHistory(sid);

    // 4. Start the chat using the correct structural object layout for systemInstruction
    const chatSession = model.startChat({
      systemInstruction: {
        parts: [{ text: TRAVEL_PLANNER_PROMPT }]
      }, 
      history: history,
    });

    // 5. Fire off the message to Gemini
    const result = await chatSession.sendMessage(message);
    const response = result.response.text().trim();

    // 6. Manage chat history logs
    history.push({ role: "user", parts: [{ text: message }] });
    history.push({ role: "model", parts: [{ text: response }] });

    if (history.length > 20) {
      chatHistories[sid] = history.slice(-20);
    }

    // 7. Parse output strings into structured objects
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      parsed = { reply: response, itinerary: null };
    }

    // 8. Respond back to your frontend widget
    res.json({
      reply: parsed.reply || response,
      itinerary: parsed.itinerary || null,
    });

  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};