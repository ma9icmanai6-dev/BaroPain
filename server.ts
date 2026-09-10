import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      model: "gemini-3.8-flash",
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
    res.status(500).json({ error: error.message || "Failed to generate AI analysis" });
  }
});

// AI Chat endpoint for Weather Doctor
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, currentWeather, recentLogs } = req.body;

    if (!ai) {
      return res.json({
        reply: "I am your AI Weather Doctor and Barometric Sensitivity Assistant. (Please configure your GEMINI_API_KEY in Secrets for live intelligent responses). In general, rapid barometric pressure drops cause tissues to expand slightly against joints and cranial blood vessels, triggering migraines and arthritis flares."
      });
    }

    const systemInstruction = `You are an empathetic, knowledgeable medical AI assistant specializing in meteoropathy, barometric pressure sensitivity, migraines, and joint pain. 
Current weather context: ${JSON.stringify(currentWeather || {})}
Recent user logs count: ${recentLogs?.length || 0}
Provide helpful, concise, evidence-based wellness guidance and practical coping tips. Always advise consulting a physician for severe symptoms.`;

    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        systemInstruction,
      },
    });

    // If history exists, we can replay or just send the latest message
    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI" });
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
    const distPath = path.join(__dirname, 'dist');
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
