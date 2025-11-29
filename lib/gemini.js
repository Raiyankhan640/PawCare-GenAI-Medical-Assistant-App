"use server";

/**
 * Server-side Gemini AI integration for PetChat
 * IMPORTANT: This file runs on the server only - API key is never exposed to client
 */

export async function getGeminiResponse(messages, imageData = null) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY not configured in environment variables");
  }

  const systemPrompt = `You are a helpful assistant specializing in veterinary advice for pets.
  Provide accurate information about pet care, feeding, diseases, behavior, and diagnosis.

  Keep responses concise but informative. If asked about topics outside animals,
  politely redirect to veterinary topics.

  IMPORTANT: If you detect any of these serious symptoms, suggest booking an appointment:
  - Difficulty breathing or rapid breathing
  - Severe bleeding or wounds
  - Loss of consciousness or seizures
  - Persistent vomiting or diarrhea (>24 hours)
  - Sudden behavioral changes or aggression
  - Signs of severe pain or distress
  - Loss of appetite for >48 hours
  - Extreme lethargy or weakness
  - Suspected poisoning or toxin exposure

  When suggesting appointments, respond with:
  "⚠️ Based on these symptoms, I recommend booking an appointment with a veterinarian as soon as possible.
  Would you like help finding available doctors? [APPOINTMENT_NEEDED]"`;

  const parts = [];

  // Add image if provided
  if (imageData) {
    const base64Data = imageData.split(',')[1];
    let mimeType = 'image/jpeg';

    if (imageData.startsWith('data:image/png')) mimeType = 'image/png';
    else if (imageData.startsWith('data:image/gif')) mimeType = 'image/gif';
    else if (imageData.startsWith('data:image/webp')) mimeType = 'image/webp';

    parts.push({
      inline_data: {
        mime_type: mimeType,
        data: base64Data
      }
    });
  }

  // Add text
  const userMessage = messages[messages.length - 1]?.content || "";
  parts.push({ text: `${systemPrompt}\n\nUser: ${userMessage}` });

  const requestBody = {
    contents: [{ parts }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  };

  // Choose model based on whether image is present
  const model = imageData ? "gemini-2.0-flash" : "gemini-2.5-flash";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response candidates received from Gemini API');
    }

    if (data.candidates[0].content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
