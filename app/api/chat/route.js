import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are PawCare AI, a professional veterinary assistant specializing in pet healthcare and medication guidance.

Your expertise includes:
1. Pet health assessment and symptom analysis
2. Medication recommendations with proper dosages
3. Emergency care guidance
4. Preventive care and nutrition advice
5. Common pet diseases and treatments

Guidelines:
- Always ask for pet details (type, age, weight, breed) if not provided
- Provide clear, structured responses with bullet points when appropriate
- Include dosage information based on pet weight when recommending medications
- Always mention potential side effects and contraindications
- Emphasize when professional veterinary care is necessary
- Use emojis sparingly to make responses friendly (🐾 🩺 💊)
- Format medication names in **bold**
- Keep responses concise but comprehensive

IMPORTANT DISCLAIMERS to include when relevant:
- "This is general guidance only. Please consult a licensed veterinarian for diagnosis."
- "In emergency situations, seek immediate veterinary care."
- "Never give human medications to pets without veterinary approval."

Respond in a warm, professional tone that reassures pet owners while being medically accurate.`;

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const { message, history = [], image = null } = await request.json();

        if (!message && !image) {
            return NextResponse.json(
                { error: "Message or image is required" },
                { status: 400 }
            );
        }

        // Build conversation history for context
        const contents = [];

        // Add system prompt as first message
        contents.push({
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }]
        });
        contents.push({
            role: "model",
            parts: [{ text: "I understand. I'm PawCare AI, your professional veterinary assistant. I'm ready to help with pet health questions, medication guidance, and care advice. How can I assist you and your pet today? 🐾" }]
        });

        // Add conversation history
        history.forEach((msg) => {
            contents.push({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            });
        });

        // Add current message (with image if provided)
        const currentMessageParts = [];
        
        if (image) {
            // Extract base64 data and mime type from data URL
            const base64Data = image.split(',')[1];
            let mimeType = 'image/jpeg';
            
            if (image.startsWith('data:image/png')) mimeType = 'image/png';
            else if (image.startsWith('data:image/gif')) mimeType = 'image/gif';
            else if (image.startsWith('data:image/webp')) mimeType = 'image/webp';
            
            currentMessageParts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                }
            });
        }
        
        if (message) {
            currentMessageParts.push({ text: message });
        }

        contents.push({
            role: "user",
            parts: currentMessageParts
        });

        const requestBody = {
            contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500,
                topP: 0.9,
                topK: 40
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            console.error("API Key length:", GEMINI_API_KEY?.length || 0);
            console.error("API Key starts with:", GEMINI_API_KEY?.substring(0, 10) || "NOT SET");
            return NextResponse.json(
                { error: "Failed to get AI response - Check API key" },
                { status: 500 }
            );
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            return NextResponse.json(
                { error: "No response from AI" },
                { status: 500 }
            );
        }

        const aiResponse = data.candidates[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            return NextResponse.json(
                { error: "Invalid AI response format" },
                { status: 500 }
            );
        }

        return NextResponse.json({ response: aiResponse });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
