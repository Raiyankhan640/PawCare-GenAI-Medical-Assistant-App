class Chatbot {
    constructor() {
        this.API_KEY = 'Your api key'; // Replace with your actual Gemini API key
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.voiceButton = document.getElementById('voiceButton');
        this.imageButton = document.getElementById('imageButton');
        this.imageInput = document.getElementById('imageInput');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.imagePreview = document.getElementById('imagePreview');
        this.removeImageButton = document.getElementById('removeImage');

        this.recognition = null;
        this.isRecording = false;
        this.currentImageData = null;
        this.currentImageName = null;

        this.initializeEventListeners();
        this.initializeSpeechRecognition();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        this.voiceButton.addEventListener('click', () => this.toggleVoiceInput());
        this.imageButton.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.removeImageButton.addEventListener('click', () => this.removeImage());
    }

    initializeSpeechRecognition() {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                console.log('Speech recognition not supported in this browser');
                this.voiceButton.style.display = 'none';
                return;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;     // keeps listening until stopped
            this.recognition.interimResults = true; // live transcription
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                this.userInput.value = transcript; // show live transcript
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event);
                this.stopRecording();
                this.addMessage('Mic error: ' + event.error, 'bot');
            };

            this.recognition.onend = () => {
                if (this.isRecording) {
                    console.log("Auto-restarting recognition...");
                    this.recognition.start(); // restart if user hasn’t stopped manually
                }
            };

            this.recognition.onstart = () => {
                console.log("Speech recognition started");
            };

        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            this.voiceButton.style.display = 'none';
        }
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.addMessage('Voice input is not supported in your browser.', 'bot');
            return;
        }

        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        try {
            this.userInput.value = ''; // Clear old input
            this.recognition.start();
            this.isRecording = true;
            this.voiceButton.classList.add('recording');
            this.voiceButton.textContent = '⏹️'; // stop icon
            console.log('Started recording...');
        } catch (error) {
            console.error('Error starting recording:', error);
            this.stopRecording();
        }
    }

    stopRecording() {
        try {
            if (this.recognition) this.recognition.stop();
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
        this.isRecording = false;
        this.voiceButton.classList.remove('recording');
        this.voiceButton.textContent = '🎤'; // mic icon
        console.log('Stopped recording');
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImageData = e.target.result;
                this.currentImageName = file.name;
                this.showImagePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    showImagePreview() {
        this.imagePreview.src = this.currentImageData;
        this.imagePreviewContainer.style.display = 'block';
    }

    removeImage() {
        this.currentImageData = null;
        this.currentImageName = null;
        this.imagePreviewContainer.style.display = 'none';
        this.imageInput.value = '';
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        const hasImage = this.currentImageData !== null;

        if (!message && !hasImage) return;

        this.addMessage(message, 'user', this.currentImageData, this.currentImageName);

        const tempImageData = this.currentImageData;
        const tempImageName = this.currentImageName;

        this.userInput.value = '';
        this.removeImage();
        this.setLoadingState(true);

        try {
            let response;
            if (hasImage) {
                response = await this.getImageResponse(message, tempImageData);
            } else {
                response = await this.getTextResponse(message);
            }
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error details:', error);
            this.addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
        } finally {
            this.setLoadingState(false);
        }
    }

    async getTextResponse(userMessage) {
        const systemPrompt = `You are a helpful assistant specializing in veterinary advice. 
        You should provide accurate, helpful information about:
        1. Cattle, pets, and farm animals - care, feeding, diseases, behavior, diagnosis.
        2. General veterinary questions - prevention, treatment, common conditions.
        
        Keep responses concise but informative. If asked about topics outside animals, 
        politely redirect to veterinary topics.`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser question: ${userMessage}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response candidates received from API');
        }

        if (data.candidates[0].content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected API response format');
        }
    }

    async getImageResponse(userMessage, imageData) {
        if (!imageData) throw new Error('No image data available');

        const base64Data = imageData.split(',')[1];
        let mimeType = 'image/jpeg';
        if (imageData.startsWith('data:image/png')) mimeType = 'image/png';
        else if (imageData.startsWith('data:image/gif')) mimeType = 'image/gif';
        else if (imageData.startsWith('data:image/webp')) mimeType = 'image/webp';

        const parts = [{
            inline_data: { mime_type: mimeType, data: base64Data }
        }];

        if (userMessage) {
            parts.push({ text: userMessage });
        } else {
            parts.push({ text: "What is this? Please describe what you see in this image related to animals." });
        }

        const requestBody = {
            contents: [{ parts }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response candidates received from API');
        }

        if (data.candidates[0].content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected API response format');
        }
    }

    addMessage(text, sender, imageData = null, imageName = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (imageData && sender === 'user') {
            const img = document.createElement('img');
            img.src = imageData;
            img.className = 'image-preview';
            img.style.cssText = 'max-width: 200px; max-height: 200px; border-radius: 8px; margin-bottom: 10px; display: block;';
            contentDiv.appendChild(img);

            if (imageName) {
                const nameDiv = document.createElement('small');
                nameDiv.textContent = `Image: ${imageName}`;
                nameDiv.style.display = 'block';
                nameDiv.style.marginBottom = '10px';
                nameDiv.style.opacity = '0.7';
                contentDiv.appendChild(nameDiv);
            }
        }

        if (text) {
            const textNode = document.createElement('div');
            textNode.textContent = text;
            contentDiv.appendChild(textNode);
        }

        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'timestamp';
        timestampDiv.textContent = this.getCurrentTime();

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timestampDiv);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) typingIndicator.remove();
    }

    setLoadingState(loading) {
        if (loading) {
            this.sendButton.disabled = true;
            this.userInput.disabled = true;
            this.voiceButton.disabled = true;
            this.imageButton.disabled = true;
            this.showTypingIndicator();
        } else {
            this.sendButton.disabled = false;
            this.userInput.disabled = false;
            this.voiceButton.disabled = false;
            this.imageButton.disabled = false;
            this.hideTypingIndicator();
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
