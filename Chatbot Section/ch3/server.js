import express from "express";
import dotenv from "dotenv";
import { createVetAgent } from "./agent.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let agent;
(async () => {
  try {
    console.log("Initializing agent...");
    agent = await createVetAgent({
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      geminiKey: process.env.GEMINI_KEY,
    });
    console.log("Agent initialized successfully");
  } catch (err) {
    console.error("Failed to initialize agent:", err.message, err.stack);
  }
})();

app.post("/chat", async (req, res) => {
  try {
    const { message, lat, lng } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!agent) {
      throw new Error("Agent is not initialized");
    }
    let input = message;
    if (lat && lng) {
      input += `\nUser location: {"lat": ${lat}, "lng": ${lng}}`;
    } else {
      input += `\nUser location: not provided`;
    }
    console.log("Processing /chat request with input:", input);
    const result = await agent.call({ input });
    console.log("Agent response:", result.output);
    res.json({ reply: result.output });
  } catch (err) {
    console.error("Error in /chat endpoint:", err.message, err.stack);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

app.listen(3000, () => console.log("🚀 VetAI backend running at http://localhost:3000"));