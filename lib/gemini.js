"use server";

/**
 * Server-side Gemini AI integration for PetChat
 * IMPORTANT: This file runs on the server only - API key is never exposed to client
 */

/**
 * Detect user intent for message routing
 * Returns "CLINIC_SEARCH" for clinic-related queries, "GENERAL" otherwise
 */
export async function detectIntent(userMessage) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("GEMINI_API_KEY not configured");
    return "GENERAL"; // Safe fallback
  }

  // Simple keyword-based detection as primary check
  const message = userMessage.toLowerCase();
  const locationKeywords = ['near me', 'nearby', 'closest', 'nearest', 'around me', 'in my area'];
  const vetKeywords = ['vet', 'clinic', 'hospital', 'veterinarian', 'veterinary'];

  const hasLocation = locationKeywords.some(keyword => message.includes(keyword));
  const hasVet = vetKeywords.some(keyword => message.includes(keyword));
  const hasFind = message.includes('find') || message.includes('locate') || message.includes('show') || message.includes('search');

  // If message has location keywords + vet keywords, it's definitely a clinic search
  if (hasLocation && hasVet) {
    console.log("Intent: CLINIC_SEARCH (keyword match)");
    return "CLINIC_SEARCH";
  }

  // If message has "find/locate/show" + vet keywords, it's also clinic search
  if (hasFind && hasVet) {
    console.log("Intent: CLINIC_SEARCH (keyword match)");
    return "CLINIC_SEARCH";
  }

  const classificationPrompt = `Classify the user's intent into ONE category.

Options:
- {"intent": "CLINIC_SEARCH"} - User wants to find nearby veterinary clinics, hospitals, or vets
- {"intent": "GENERAL"} - General veterinary questions, health advice, medication queries

Examples of CLINIC_SEARCH (ANY mention of "near me", "nearby", "closest", "find vet/clinic"):
- "find nearby vet"
- "vets near me"
- "vet near me"
- "veterinary clinic near me"
- "where is the closest animal hospital"
- "show me vets in my area"
- "I need a vet nearby"
- "find veterinarian"
- "locate vet clinic"
- "nearest vet"

Examples of GENERAL (health/medical questions WITHOUT location):
- "my dog is sick"
- "cat medication for fleas"
- "what should I feed my puppy"
- "symptoms of parvo"
- "is my pet okay"

IMPORTANT: If the message contains ANY words like "near", "nearby", "closest", "find", "locate" combined with "vet" or "clinic", it is CLINIC_SEARCH.

User message: "${userMessage}"

Respond with ONLY ONE of the JSON objects above. No explanations.`;

  const requestBody = {
    contents: [{ parts: [{ text: classificationPrompt }] }],
    generationConfig: {
      temperature: 0.0, // Deterministic classification
      maxOutputTokens: 50,
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      console.error("Intent detection API error:", response.status);
      return "GENERAL"; // Fallback on error
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{.*?\}/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.intent === "CLINIC_SEARCH" ? "CLINIC_SEARCH" : "GENERAL";
    }

    return "GENERAL"; // Fallback if no valid JSON
  } catch (error) {
    console.error("Error in detectIntent:", error);
    return "GENERAL"; // Safe fallback
  }
}

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
