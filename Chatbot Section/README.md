# PawCare AI Chatbot - React Conversion Documentation

## Overview
This document describes the conversion of the PawCare veterinary AI chatbot from vanilla JavaScript to React, integrating it as a global floating widget in the Next.js application.

## Conversion Summary

### Original Implementation
- **Technology**: Vanilla JavaScript (ES6+)
- **Architecture**: Class-based with single `Chatbot` class
- **UI**: Standalone HTML/CSS application
- **API**: Direct client-side calls to Google Gemini AI
- **Location**: `Chatbot Section/` folder (standalone files)

### New Implementation
- **Technology**: React 19 with Next.js 15.5.6
- **Architecture**: Functional components with custom hooks
- **UI**: Global floating widget accessible from all pages
- **API**: Secure server-side API route
- **Location**: Integrated throughout the application

---

## Features

### ✅ Preserved from Original
All features from the vanilla JS implementation have been maintained:

1. **Text Chat**
   - Send/receive messages with AI
   - Real-time conversation interface
   - Timestamps on all messages

2. **Voice Input**
   - Speech-to-text using Web Speech API
   - Visual recording indicator
   - Live transcript display
   - Browser compatibility detection

3. **Image Upload & Analysis**
   - Upload images for AI analysis
   - Preview before sending
   - Support for JPEG, PNG, GIF, WebP
   - Base64 encoding for API transmission

4. **Session Persistence**
   - Chat history saved to sessionStorage
   - Survives page refreshes
   - Auto-cleared when browser tab closes

5. **Responsive Design**
   - Works on desktop, tablet, and mobile
   - Touch-friendly interface
   - Mobile-optimized layout

### ✨ New Enhancements

1. **Global Floating Widget**
   - Accessible from any page in the application
   - Floating button in bottom-right corner
   - Smooth open/close animations
   - Keyboard shortcuts (Escape to close)

2. **Security Improvements**
   - API key stored server-side (not exposed to client)
   - Server-side API route for Gemini calls
   - Environment variable configuration

3. **Modern React Patterns**
   - Custom hooks for reusable logic
   - Component composition
   - Proper state management
   - TypeScript-ready structure

4. **UI/UX Improvements**
   - Integrated with app's design system (Tailwind + Shadcn/ui)
   - Consistent theme (emerald/cyan gradients)
   - Loading states and error handling
   - Clear chat functionality
   - Better accessibility (ARIA labels, focus management)

---

## Architecture

### File Structure

```
├── app/
│   ├── api/
│   │   └── chatbot/
│   │       └── route.js              # Server-side API for Gemini AI
│   └── layout.js                     # ChatbotWidget integration
│
├── components/
│   └── chatbot/
│       ├── ChatbotWidget.jsx         # Main widget wrapper (client component)
│       ├── ChatbotButton.jsx         # Floating toggle button
│       ├── ChatbotWindow.jsx         # Chat interface window
│       ├── ChatMessage.jsx           # Individual message component
│       ├── VoiceRecorder.jsx         # Voice input controls
│       ├── ImageUpload.jsx           # Image upload & preview
│       └── TypingIndicator.jsx       # AI thinking animation
│
├── hooks/
│   ├── useChatbot.js                 # Chat state management hook
│   └── useSpeechRecognition.js       # Voice input hook
│
├── .env.local                        # Environment variables (API keys)
│
└── Chatbot Section/                  # Original vanilla JS implementation
    ├── index.html
    ├── script.js
    ├── styles.css
    └── README.md                     # This file
```

### Component Hierarchy

```
ChatbotWidget (Main Container)
└── ChatbotButton (Floating toggle)
└── ChatbotWindow (Chat interface)
    ├── Header (Title, clear, close buttons)
    ├── Messages Area (Scrollable)
    │   ├── ChatMessage (User/Bot messages)
    │   └── TypingIndicator (Loading state)
    └── Input Area
        ├── ImageUpload (Image picker)
        ├── VoiceRecorder (Microphone)
        ├── Input (Text field)
        └── Send Button
```

---

## Technical Details

### Custom Hooks

#### `useChatbot.js`
Manages chat state and interactions:
- Message history management
- SessionStorage persistence
- Message sending logic
- Image upload handling
- Auto-scroll functionality

**Key Functions:**
- `sendMessage(text)` - Send text/image to AI
- `handleImageUpload(file)` - Process image files
- `removeImage()` - Clear selected image
- `clearMessages()` - Reset chat history

#### `useSpeechRecognition.js`
Handles voice input:
- Web Speech API integration
- Browser compatibility detection
- Start/stop recording
- Transcript management

**Key Functions:**
- `startRecording()` - Begin voice capture
- `stopRecording()` - End voice capture
- `resetTranscript()` - Clear transcript

### API Route

**Endpoint:** `POST /api/chatbot`

**Request Body:**
```json
{
  "message": "User's question",
  "imageData": "base64_encoded_image (optional)",
  "imageMimeType": "image/jpeg (optional)"
}
```

**Response:**
```json
{
  "response": "AI's answer"
}
```

**Error Handling:**
- 400: Invalid request
- 500: API key not configured or Gemini API error

### AI Integration

**Model:** Google Gemini 2.0 Flash
**Configuration:**
- Temperature: 0.7 (balanced creativity)
- Max tokens: 1000
- System prompt: Veterinary assistant specialization

**Capabilities:**
- Text-based Q&A
- Image analysis (multimodal)
- Context-aware responses

---

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Next.js project running
- Google Gemini API key

### Step 1: Environment Configuration

Create/update `.env.local`:

```env
# Gemini AI API Key for Chatbot
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### Step 2: Install Dependencies

All dependencies should already be installed. If needed:

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 and look for the floating chat button in the bottom-right corner.

---

## Usage Guide

### For Users

1. **Opening the Chat:**
   - Click the floating chat button (💬) in the bottom-right corner
   - Or press the button on any page

2. **Sending Messages:**
   - Type your question in the input field
   - Press Enter or click the Send button
   - Example: "What are common symptoms of parvo in dogs?"

3. **Using Voice Input:**
   - Click the microphone icon (🎤)
   - Speak your question
   - Click again to stop recording
   - Your speech will be converted to text automatically

4. **Uploading Images:**
   - Click the image icon (🖼️)
   - Select an image file (JPEG, PNG, GIF, WebP)
   - Add a message describing what you want to know
   - Click Send

5. **Clearing Chat:**
   - Click the trash icon in the header
   - Confirm to delete all messages

6. **Closing the Chat:**
   - Click the X button in the header
   - Or press the Escape key

### For Developers

#### Adding Custom System Prompts

Edit `app/api/chatbot/route.js`:

```javascript
const SYSTEM_PROMPT = `Your custom veterinary assistant prompt here...`;
```

#### Customizing UI Theme

The chatbot uses Tailwind classes. Main colors:
- Primary: emerald-500 to cyan-500 gradient
- Background: Uses app's theme (dark mode supported)

#### Modifying AI Parameters

Edit `app/api/chatbot/route.js`:

```javascript
generationConfig: {
  temperature: 0.7,      // 0.0-1.0 (creativity)
  maxOutputTokens: 1000  // Response length
}
```

#### Changing Storage Persistence

To use localStorage instead of sessionStorage, edit `hooks/useChatbot.js`:

```javascript
// Change all instances of:
sessionStorage.getItem('chatbot_messages')
// To:
localStorage.getItem('chatbot_messages')
```

---

## Browser Compatibility

### Fully Supported
- Chrome/Edge 80+ (all features)
- Firefox 90+ (all features)
- Safari 14+ (all features)

### Voice Input Support
- Chrome/Edge: ✅ Full support
- Firefox: ❌ Limited support
- Safari: ⚠️ Partial support (iOS 14.5+)

### Fallback Behavior
- Voice button hidden if Web Speech API not available
- Image upload works in all modern browsers
- Text chat works everywhere

---

## Conversion Details

### What Changed

| Aspect | Original (Vanilla JS) | New (React) |
|--------|---------------------|------------|
| **Architecture** | Single class | Multiple components + hooks |
| **State** | Class properties | React hooks (useState, useEffect) |
| **DOM** | Direct manipulation | Virtual DOM (React) |
| **Styling** | Custom CSS | Tailwind CSS |
| **API Calls** | Client-side | Server-side API route |
| **Routing** | N/A (standalone) | Integrated in Next.js |
| **Deployment** | Separate page | Global widget |

### Migration Benefits

1. **Security**: API key hidden from client
2. **Maintainability**: Component-based structure
3. **Reusability**: Hooks can be used elsewhere
4. **Integration**: Seamless with existing app
5. **Scalability**: Easy to add features
6. **Type Safety**: Ready for TypeScript
7. **Testing**: Components are unit-testable

---

## Known Limitations

1. **Voice Input**: Not supported in all browsers (Chrome/Edge recommended)
2. **Session Persistence**: Clears when browser tab closes (use localStorage for permanent storage)
3. **File Size**: Image uploads limited to 10MB
4. **Rate Limits**: Subject to Gemini API rate limits (15 req/min free tier)

---



---

## Troubleshooting

### Chatbot button not appearing
- Check that ChatbotWidget is imported in `app/layout.js`
- Verify no CSS z-index conflicts
- Check browser console for errors

### "API key not configured" error
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Restart the dev server after adding the key
- Verify the key is valid at https://aistudio.google.com

### Voice input not working
- Check browser compatibility (use Chrome/Edge)
- Grant microphone permissions when prompted
- Verify HTTPS is enabled (required for Web Speech API)

### Messages not persisting
- Check browser's sessionStorage is enabled
- Verify no privacy extensions blocking storage
- Check console for storage errors

### Images not uploading
- Verify file size is under 10MB
- Check file format (JPEG, PNG, GIF, WebP only)
- Look for errors in browser console

---

## Credits

**Original Implementation:**
- Vanilla JavaScript chatbot with Gemini AI integration

**React Conversion:**
- Converted to React functional components
- Integrated into Next.js PawCare application
- Server-side API implementation
- Custom hooks for state management

**Technologies Used:**
- React 19
- Next.js 15.5.6
- Google Gemini 2.0 Flash API
- Tailwind CSS 4
- Shadcn/ui components
- Web Speech API
- Lucide React icons

---

**Last Updated:** 2025-11-11
**Version:** 1.0.0
**Status:** Production Ready ✅
