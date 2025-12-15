import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

async function listModels() {
  try {
    const response = await genAI.listModels();
    console.log("Available models:");
    response.models.forEach((model) => {
      console.log(`- ${model.name}: ${model.displayName}`);
    });
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listModels();