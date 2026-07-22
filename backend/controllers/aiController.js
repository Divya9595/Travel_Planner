import { GoogleGenerativeAI } from "@google/generative-ai";
import { TRAVEL_PLANNER_PROMPT } from "../config/prompts.js";
import Content from "../models/Content.js";

function getGenAI() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const ATTRACTIONS_PROMPT = `You are a travel expert. Given a destination, return a JSON array of 12-15 famous attractions/landmarks/places to visit.

For each attraction, provide:
- name: The attraction name (specific, real place)
- type: One of "sightseeing", "food", "culture", "nature", "activity", "adventure", "shopping", "relaxation"
- description: 1-2 sentence description of why it's worth visiting
- estimatedTime: Estimated time to spend there (e.g. "2 hrs", "3 hrs", "1.5 hrs")

Return ONLY the JSON array, no markdown, no code blocks. Example:
[{"name":"Eiffel Tower","type":"sightseeing","description":"Iconic iron lattice tower offering panoramic views of Paris.","estimatedTime":"2 hrs"}]

IMPORTANT: Use ONLY valid JSON. No markdown formatting.`;

const ITINERARY_PROMPT = `You are an expert AI travel planner. Generate a detailed day-by-day itinerary based on the user's selected attractions.

RULES:
- Spread the selected attractions logically across the trip duration
- For each day, create Morning, Afternoon, and Evening time blocks
- Add food/restaurants between activities (real, specific restaurants if possible)
- Add transport between locations
- Include hotel check-in on day 1 and check-out on last day
- Match activity types: sightseeing, food, transport, hotel, activity, culture, nature, shopping, adventure, relaxation, nightlife
- Be specific with names, durations, and types

Return EXACTLY this JSON format:
{
  "destination": "Full destination name",
  "dateFrom": "YYYY-MM-DD",
  "dateTo": "YYYY-MM-DD",
  "tripDuration": "X Days",
  "travellers": 2,
  "days": [
    {
      "day": 1,
      "date": "Mon, Jan 1",
      "title": "Day title",
      "blocks": [
        {
          "time": "Morning",
          "icon": "🌅",
          "activities": [
            { "name": "Activity name", "type": "sightseeing|food|transport|hotel|activity|culture|nature|shopping|adventure|relaxation|nightlife", "duration": "2 hrs" }
          ]
        },
        {
          "time": "Afternoon",
          "icon": "☀️",
          "activities": []
        },
        {
          "time": "Evening",
          "icon": "🌙",
          "activities": []
        }
      ]
    }
  ]
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.`;

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

    // Fetch prompt from DB (fallback to static)
    let systemPrompt = TRAVEL_PLANNER_PROMPT;
    try {
      const dbPrompt = await Content.findOne({ section: "ai.prompt" });
      if (dbPrompt && dbPrompt.value) {
        systemPrompt = typeof dbPrompt.value === "string" ? dbPrompt.value : dbPrompt.value.text || TRAVEL_PLANNER_PROMPT;
      }
    } catch (e) {
      // use static fallback
    }

    // 4. Start the chat using the correct structural object layout for systemInstruction
    const chatSession = model.startChat({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
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

export const getAttractions = async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `${ATTRACTIONS_PROMPT}\n\nDestination: ${destination}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    let attractions;
    try {
      attractions = JSON.parse(response);
      if (!Array.isArray(attractions)) attractions = [];
    } catch {
      attractions = [];
    }

    res.json({ attractions });
  } catch (error) {
    console.error("Get attractions error:", error);
    res.status(500).json({ error: "Failed to fetch attractions. Please try again." });
  }
};

export const generateItineraryFromAttractions = async (req, res) => {
  try {
    const { destination, dateFrom, dateTo, travellers, selectedAttractions } = req.body;

    if (!destination || !selectedAttractions?.length) {
      return res.status(400).json({ error: "Destination and selected attractions are required" });
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: { responseMimeType: "application/json" }
    });

    const attractionsList = selectedAttractions.map((a) => `- ${a.name} (${a.type}, ~${a.estimatedTime}): ${a.description}`).join("\n");

    let dateInfo = "";
    if (dateFrom && dateTo) {
      dateInfo = `Travel dates: ${dateFrom} to ${dateTo}`;
    }

    const prompt = `${ITINERARY_PROMPT}

Destination: ${destination}
${dateInfo}
Travellers: ${travellers || 2}

Selected attractions to include:
${attractionsList}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    let itinerary;
    try {
      itinerary = JSON.parse(response);
    } catch {
      return res.status(500).json({ error: "Failed to generate itinerary. Please try again." });
    }

    res.json({ itinerary });
  } catch (error) {
    console.error("Generate itinerary error:", error);
    res.status(500).json({ error: "Failed to generate itinerary. Please try again." });
  }
};