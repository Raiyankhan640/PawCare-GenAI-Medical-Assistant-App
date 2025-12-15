import { Tool } from "langchain/tools";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiTool extends Tool {
  constructor(apiKey) {
    super();
    this.name = "vetai_chat";
    this.description = "Answer veterinary-related questions about pets, cattle, and farm animals. Do not use for location-based queries; use vet_clinics_near_me instead.";
    try {
      console.log("Initializing GeminiTool with API key:", apiKey ? "Set" : "Missing");
      this.client = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-2.5-flash" });
      console.log("GeminiTool client initialized");
    } catch (err) {
      console.error("GeminiTool initialization failed:", err.message);
      throw err;
    }
  }

  async _call(input) {
    try {
      console.log("GeminiTool processing input:", input);
      const result = await this.client.generateContent(input);
      const responseText = result.response.text();
      console.log("GeminiTool response:", responseText);
      return responseText;
    } catch (err) {
      console.error("GeminiTool _call error:", err.message);
      throw new Error(`Failed to process input: ${err.message}`);
    }
  }
}