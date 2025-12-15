import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { VetClinicsNearMeTool } from "./tools/VetClinicsNearMeTool.js";
import { GeminiTool } from "./tools/GeminiTool.js";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";

export async function createVetAgent({ googleMapsKey, geminiKey }) {
  console.log("Creating VetAgent with keys:", {
    googleMapsKey: googleMapsKey ? "Set" : "Missing",
    geminiKey: geminiKey ? "Set" : "Missing",
  });
  try {
    const tools = [
      new VetClinicsNearMeTool(googleMapsKey),
      new GeminiTool(geminiKey),
    ];
    console.log("Tools initialized:", tools.map(t => t.name));

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: geminiKey,
      temperature: 0,
    });
    console.log("LLM initialized");

    const prompt = await pull("hwchase17/react");
    prompt.partialVariables = {
      tools: tools.map(t => `${t.name}: ${t.description}`).join("\n"),
      tool_names: tools.map(t => t.name).join(", "),
      prefix: `You are a helpful veterinary assistant. For queries about finding veterinary clinics (e.g., "find vet clinic near me", "vet clinics nearby"), use the vet_clinics_near_me tool if the input includes latitude and longitude (e.g., "User location: {\"lat\": 37.7749, \"lng\": -122.4194}"). If no location is provided, respond with "Please enable location sharing or provide your city." For other veterinary-related questions (e.g., pet care, animal health), use the vetai_chat tool. Use the following format strictly:\n\nQuestion: the input question\nThought: you should always think step-by-step\nAction:\n\`\`\`$JSON_BLOB\`\`\`\nObservation: the result of the action\n... (repeat as needed)\nThought: I now know the final answer\nFinal Answer: the final answer to the original question\n\nBegin!\nReminder: Use tools only when necessary and handle missing data gracefully.`
    };

    const agent = await createReactAgent({ llm, tools, prompt });
    const executor = new AgentExecutor({ agent, tools, verbose: true, maxIterations: 3 });
    console.log("Agent executor initialized successfully");
    return executor;
  } catch (err) {
    console.error("Error initializing agent:", err.message, err.stack);
    throw err;
  }
}