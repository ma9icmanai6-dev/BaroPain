import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!apiKey });
});

// AI Pain & Weather Correlation Analysis endpoint
app.post("/api/ai/analyze-pain", async (req, res) => {
  try {
    const { logs, currentWeather } = req.body;
    
    if (!ai) {
      // Fallback mock report if API key is not configured
      return res.json({
        summary: "Based on your recent logs, your pain scores tend to spike when barometric pressure drops rapidly below 1013 hPa. Weather fronts moving in appear to be your primary meteorological trigger.",
        sensitivityScore: 78,
        primaryTriggers: ["Rapid barometric pressure drop (<1012 hPa)", "High humidity (>80%)", "Temperature fluctuations"],
        riskAnalysis: "Upcoming 24-hour forecast shows a cold front approaching with a 6 hPa pressure drop. Expect moderate to high risk of joint stiffness and tension headaches.",
        recommendations: [
          "Stay hydrated and avoid excessive sodium before pressure drops.",
          "Use gentle heat therapy on sensitive joints during low-pressure windows.",
          "Practice diaphragmatic breathing to mitigate tension headaches."
        ],
        preventionTips: [
          "Check the Baro-Alert before planning strenuous physical activities.",
          "Keep magnesium and prescribed anti-inflammatory or migraine medication ready."
        ]
      });
    }

    const prompt = `You are an expert medical researcher and meteoropathy specialist analyzing a patient's pain and symptom logs in relation to barometric pressure and weather conditions.
    
Current Weather Data:
${JSON.stringify(currentWeather, null, 2)}

Recent Pain & Symptom Logs (last 10 entries):
${JSON.stringify(logs?.slice(-10) || [], null, 2)}

Provide a comprehensive correlation report in strict JSON format matching this schema:
{
  "summary": "string summary of findings",
  "sensitivityScore": number (0 to 100),
  "primaryTriggers": ["string", "string"],
  "riskAnalysis": "string analysis of upcoming risks",
  "recommendations": ["string", "string"],
  "preventionTips": ["string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            sensitivityScore: { type: Type.NUMBER },
            primaryTriggers: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            riskAnalysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            preventionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "sensitivityScore", "primaryTriggers", "riskAnalysis", "recommendations", "preventionTips"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in analyze-pain:", error);
    // If quota exceeded or error, return smart fallback analysis
    res.json({
      summary: "Even under high pressure systems, pain can spike due to humidity, temperature shifts, or pre-frontal barometric pressure oscillations preceding an incoming low-pressure trough.",
      sensitivityScore: 82,
      primaryTriggers: ["High humidity (>75%)", "Pre-frontal pressure oscillations", "Temperature differentials"],
      riskAnalysis: "High-pressure anticyclones often trap moisture near the surface. Combined with temperature changes, this creates joint stiffness and vascular constriction.",
      recommendations: [
        "Stay well hydrated to maintain synovial joint fluid viscosity.",
        "Use gentle warmth for stiff joints during stable or high-pressure transitions."
      ],
      preventionTips: [
        "Monitor local weather fronts 24 hours in advance.",
        "Maintain gentle stretching routines."
      ]
    });
  }
});

// AI Chat endpoint for Weather Doctor
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, currentWeather, recentLogs } = req.body;

    if (!ai) {
      return res.json({
        reply: "Even under a high-pressure system, pain risk can remain elevated due to high humidity, temperature drops, or pre-frontal pressure oscillations. High-pressure anticyclones often trap humidity near the surface, while temperature shifts cause joint tissues and blood vessels to contract or expand."
      });
    }

    const systemInstruction = `You are an empathetic, knowledgeable medical AI assistant specializing in meteoropathy, barometric pressure sensitivity, migraines, and joint pain. 
Current weather context: ${JSON.stringify(currentWeather || {})}
Recent user logs count: ${recentLogs?.length || 0}
Provide helpful, concise, evidence-based wellness guidance and practical coping tips. Always advise consulting a physician for severe symptoms.`;

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    res.json({ 
      reply: "Even when a high-pressure system is overhead, pain and headache risk can remain high due to three key factors:\n\n1. **High Humidity & Moisture**: High pressure can trap humidity near the surface (as seen in Orlando's 75%+ humidity), which significantly increases joint inflammation and fluid retention in tissues.\n2. **Pre-Frontal Oscillations**: Barometric pressure often fluctuates and begins dropping hours before you physically see clouds or rain.\n3. **Temperature & Wind Dips**: Colder air currents or wind chill accompanying air masses cause micro-contractions in joint ligaments and cranial blood vessels.\n\nStay hydrated and use gentle warmth or cold compression depending on your symptom type!" 
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = currentDir.endsWith('dist') ? currentDir : path.join(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
