class Chatbot {
    constructor() {
        this.API_KEY = 'AIzaSyC0yn7XKOm4KrOG61VFVOaoZRdHsaEtI2c'; // Replace with your Gemini API key
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.voiceButton = document.getElementById('voiceButton');
        this.imageButton = document.getElementById('imageButton');
        this.imageInput = document.getElementById('imageInput');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');

        this.currentImageData = null;
        this.currentImageName = null;
        this.recognition = null;
        this.isRecording = false;

        this.sessions = JSON.parse(localStorage.getItem('sessions')) || [];
        this.currentSessionId = null;

        this.initializeEventListeners();
        this.initializeSpeechRecognition();

        const newChatBtn = document.getElementById('newChatButton');
        if (newChatBtn) newChatBtn.addEventListener('click', () => this.startNewChat());

        if (this.sessions.length > 0) {
            this.loadSession(this.sessions[0].id);
        } else {
            this.startNewChat();
        }
    }

    // ====== SESSION MANAGEMENT ======
    saveSessions() {
        localStorage.setItem('sessions', JSON.stringify(this.sessions));
    }

    renderChatList() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;
        chatList.innerHTML = '';

        this.sessions.forEach(session => {
            const wrapper = document.createElement('div');
            wrapper.className = 'chat-list-item';

            const btn = document.createElement('button');
            btn.className = 'chat-btn';
            btn.textContent = session.title || 'New Chat';
            btn.onclick = () => this.loadSession(session.id);
            if (session.id === this.currentSessionId) {
                btn.classList.add('active');
            }

            const delBtn = document.createElement('span');
            delBtn.className = 'delete-btn';
            delBtn.textContent = '🗑️';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteSession(session.id);
            };

            wrapper.appendChild(btn);
            wrapper.appendChild(delBtn);
            chatList.appendChild(wrapper);
        });
    }

    startNewChat() {
        const newSession = {
            id: Date.now(),
            title: "New Chat",
            messages: [
                { text: "Hello! I’m your VetAI Assistant. Ask me anything about pets, cattle, or farm animals.", sender: "bot" }
            ]
        };
        this.sessions.unshift(newSession);
        this.currentSessionId = newSession.id;
        this.saveSessions();
        this.renderChatList();
        this.displayMessages(newSession.messages);
    }

    loadSession(sessionId) {
        this.currentSessionId = sessionId;
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return;
        this.displayMessages(session.messages);
        this.renderChatList();
    }

    displayMessages(messages) {
        this.chatMessages.innerHTML = '';
        messages.forEach(msg => {
            this.addMessage(msg.text, msg.sender, msg.imageData, msg.imageName, false);
        });
        this.scrollToBottom();
    }

    deleteSession(sessionId) {
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        if (this.currentSessionId === sessionId) {
            if (this.sessions.length > 0) {
                this.loadSession(this.sessions[0].id);
            } else {
                this.startNewChat();
            }
        }
        this.saveSessions();
        this.renderChatList();
    }

    // ====== EVENT HANDLING ======
    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.voiceButton.addEventListener('click', () => this.toggleVoiceInput());
        this.imageButton.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    initializeSpeechRecognition() {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                this.voiceButton.style.display = 'none';
                return;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                if (event.results?.[0]?.[0]) {
                    this.userInput.value = event.results[0][0].transcript;
                    this.stopRecording();
                }
            };

            this.recognition.onerror = () => {
                this.stopRecording();
                this.addMessage('Sorry, I couldn\'t understand that. Please try again.', 'bot');
            };

            this.recognition.onend = () => this.stopRecording();
        } catch (error) {
            console.error('Speech recognition init failed:', error);
            this.voiceButton.style.display = 'none';
        }
    }

    // ====== CHAT FLOW ======
    async sendMessage() {
        const message = this.userInput.value.trim();
        const hasImage = this.currentImageData !== null;
        if (!message && !hasImage) return;

        this.addMessage(message, 'user', this.currentImageData, this.currentImageName);

        const tempImageData = this.currentImageData;
        const tempImageName = this.currentImageName;

        this.userInput.value = '';
        this.currentImageData = null;
        this.currentImageName = null;
        this.imageInput.value = '';
        this.imagePreviewContainer.innerHTML = '';

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
            this.addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
        } finally {
            this.setLoadingState(false);
        }
    }

    // ====== INTENT DETECTION ======
    async detectIntent(userMessage) {
        const classificationPrompt = `
You are an intent classifier. 
Task: Decide if the user wants to find nearby veterinary clinics.

Respond STRICTLY in JSON with this format:
{"intent": "CLINIC_SEARCH"} 
or 
{"intent": "GENERAL"}

Do not add explanations or any other text.

User: ${userMessage}
`;

        const requestBody = {
            contents: [{ parts: [{ text: classificationPrompt }] }],
            generationConfig: { temperature: 0.0, maxOutputTokens: 20 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        try {
            const parsed = JSON.parse(raw);
            return parsed.intent === "CLINIC_SEARCH" ? "CLINIC_SEARCH" : "GENERAL";
        } catch {
            console.warn("Classification parsing failed, fallback to GENERAL. Raw:", raw);
            return "GENERAL";
        }
    }

    // ====== FIND NEARBY CLINICS ======
    async findNearbyClinics() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                try {
                    const { Place } = await google.maps.importLibrary("places");
                    const request = {
                        textQuery: "veterinary clinic",
                        language: "en",
                        locationBias: { center: { lat, lng }, radius: 5000 },
                        fields: ["id","displayName","formattedAddress","rating","userRatingCount","nationalPhoneNumber","websiteURI"]
                    };

                    const { places } = await Place.searchByText(request);
                    if (!places || places.length === 0) {
                        resolve("❌ No clinics found nearby.");
                        return;
                    }

                    const clinics = await Promise.all(
                        places.map(async (p) => {
                            await p.fetchFields({ fields: ["displayName","formattedAddress","rating","userRatingCount","websiteURI","nationalPhoneNumber"] });
                            return p;
                        })
                    );

                    resolve(
                        clinics.map(c =>
                            `🏥 ${c.displayName}\n📍 ${c.formattedAddress}\n${c.rating ? `⭐ ${c.rating} (${c.userRatingCount} reviews)\n` : ""}${c.nationalPhoneNumber ? `📞 ${c.nationalPhoneNumber}\n` : ""}${c.websiteURI ? `🔗 ${c.websiteURI}` : ""}\n`
                        ).join("\n\n")
                    );
                } catch (err) {
                    reject("Error fetching clinics: " + err.message);
                }
            }, reject);
        });
    }

    // ====== TEXT RESPONSE ======
    async getTextResponse(userMessage) {
        const intent = await this.detectIntent(userMessage);

        if (intent === "CLINIC_SEARCH") {
            return await this.findNearbyClinics();
        }

        const systemPrompt = `You are a helpful veterinary assistant.
Provide concise, accurate info about:
- Cattle, pets, and farm animals (care, feeding, diseases, diagnosis).
- General veterinary questions.
- Vet clinics and their contact numbers.
Politely redirect if asked about non-veterinary topics.`;

        const requestBody = {
            contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const partsOut = data.candidates?.[0]?.content?.parts || [];
        return partsOut.filter(p => p.text).map(p => p.text).join("\n") || 'No response.';
    }

    // ====== IMAGE RESPONSE ======
    async getImageResponse(userMessage, imageData) {
        const base64Data = imageData.split(',')[1];
        let mimeType = 'image/jpeg';
        if (imageData.startsWith('data:image/png')) mimeType = 'image/png';
        else if (imageData.startsWith('data:image/gif')) mimeType = 'image/gif';
        else if (imageData.startsWith('data:image/webp')) mimeType = 'image/webp';

        const parts = [
            { inline_data: { mime_type: mimeType, data: base64Data } },
            { text: userMessage || "Describe this image related to animals." }
        ];

        const requestBody = {
            contents: [{ role: "user", parts }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const partsOut = data.candidates?.[0]?.content?.parts || [];
        return partsOut.filter(p => p.text).map(p => p.text).join("\n") || 'No description.';
    }

    // ====== UI MESSAGES ======
    addMessage(text, sender, imageData = null, imageName = null, save = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        if (sender === 'user') {
            const img = document.createElement('img');
            img.src = 'user-icon.png';
            img.alt = 'User';
            avatarDiv.appendChild(img);
        } else {
            avatarDiv.textContent = '🐾';
        }

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';

        if (imageData && sender === 'user') {
            const img = document.createElement('img');
            img.src = imageData;
            img.className = 'image-preview';
            img.style.cssText = 'max-width: 200px; max-height: 200px; border-radius: 8px; margin-bottom: 10px; display: block;';
            bubbleDiv.appendChild(img);

            if (imageName) {
                const nameDiv = document.createElement('small');
                nameDiv.textContent = `Image: ${imageName}`;
                nameDiv.style.display = 'block';
                nameDiv.style.marginBottom = '10px';
                nameDiv.style.opacity = '0.7';
                bubbleDiv.appendChild(nameDiv);
            }
        }

        if (text) {
            const textNode = document.createElement('div');
            textNode.textContent = text;
            bubbleDiv.appendChild(textNode);
        }

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(bubbleDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        if (save && this.currentSessionId) {
            const session = this.sessions.find(s => s.id === this.currentSessionId);
            if (session) {
                session.messages.push({ text, sender, imageData, imageName });
                if (sender === "user" && session.title === "New Chat") {
                    session.title = text.slice(0, 20) + "...";
                }
                this.saveSessions();
                this.renderChatList();
            }
        }
    }

    // ====== UTIL ======
    setLoadingState(loading) {
        this.sendButton.disabled = loading;
        this.userInput.disabled = loading;
        this.voiceButton.disabled = loading;
        this.imageButton.disabled = loading;
        if (loading) this.showTypingIndicator();
        else this.hideTypingIndicator();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `<div class="avatar">🐾</div>
          <div class="bubble typing-indicator"><span></span><span></span><span></span></div>`;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) typingIndicator.remove();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.addMessage('Voice input is not supported in your browser.', 'bot');
            return;
        }
        this.isRecording ? this.stopRecording() : this.startRecording();
    }

    startRecording() {
        try {
            this.userInput.value = '';
            this.recognition.start();
            this.isRecording = true;
            this.voiceButton.classList.add('recording');
            this.voiceButton.textContent = '⏹️';
        } catch {
            this.stopRecording();
        }
    }

    stopRecording() {
        try {
            if (this.recognition) this.recognition.stop();
        } catch {}
        this.isRecording = false;
        this.voiceButton.classList.remove('recording');
        this.voiceButton.textContent = '🎤';
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImageData = e.target.result;
                this.currentImageName = file.name;

                this.imagePreviewContainer.innerHTML = '';
                const img = document.createElement('img');
                img.src = this.currentImageData;
                img.alt = this.currentImageName;

                const removeBtn = document.createElement('span');
                removeBtn.textContent = '✖';
                removeBtn.className = 'remove-preview';
                removeBtn.onclick = () => {
                    this.currentImageData = null;
                    this.currentImageName = null;
                    this.imagePreviewContainer.innerHTML = '';
                    this.imageInput.value = '';
                };

                this.imagePreviewContainer.appendChild(img);
                this.imagePreviewContainer.appendChild(removeBtn);
            };
            reader.readAsDataURL(file);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
