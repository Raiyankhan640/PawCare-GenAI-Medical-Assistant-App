import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are a knowledgeable veterinary assistant specializing in cattle, pets, and farm animals.
Your role is to provide helpful, accurate, and compassionate advice about animal health, diseases, treatment options,
and general veterinary questions. Always remind users to consult with a licensed veterinarian for serious medical concerns.`;

export async function POST(request) {
  try {
    // Check if API key is configured
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, imageData, imageMimeType } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build the request payload
    let requestBody;

    if (imageData && imageMimeType) {
      // Image + text query
      requestBody = {
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: imageMimeType,
                data: imageData
              }
            },
            {
              text: message
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      };
    } else {
      // Text-only query
      requestBody = {
        contents: [{
          parts: [{
            text: SYSTEM_PROMPT + '\n\nUser: ' + message
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      };
    }

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the text response
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
