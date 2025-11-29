class Chatbot {
    constructor() {
        this.API_KEY = 'AIzaSyC0yn7XKOm4KrOG61VFVOaoZRdHsaEtI2c';
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
        
        // NEW: Bookmarked clinics storage
        this.bookmarkedClinics = JSON.parse(localStorage.getItem('bookmarkedClinics')) || [];

        this.initializeEventListeners();
        this.initializeSpeechRecognition();

        const newChatBtn = document.getElementById('newChatButton');
        if (newChatBtn) newChatBtn.addEventListener('click', () => this.startNewChat());

        // NEW: Bookmarks button
        const bookmarksBtn = document.getElementById('bookmarksButton');
        if (bookmarksBtn) bookmarksBtn.addEventListener('click', () => this.showBookmarks());

        if (this.sessions.length > 0) {
            this.loadSession(this.sessions[0].id);
        } else {
            this.startNewChat();
        }
    }

    // ====== BOOKMARK MANAGEMENT ======
    saveBookmarks() {
        localStorage.setItem('bookmarkedClinics', JSON.stringify(this.bookmarkedClinics));
    }

    addBookmark(clinic) {
        // Check if already bookmarked
        const exists = this.bookmarkedClinics.some(c => 
            c.name === clinic.name && c.address === clinic.address
        );
        
        if (!exists) {
            this.bookmarkedClinics.push(clinic);
            this.saveBookmarks();
            return true;
        }
        return false;
    }

    removeBookmark(clinicName, clinicAddress) {
        this.bookmarkedClinics = this.bookmarkedClinics.filter(c => 
            !(c.name === clinicName && c.address === clinicAddress)
        );
        this.saveBookmarks();
    }

    isBookmarked(clinicName, clinicAddress) {
        return this.bookmarkedClinics.some(c => 
            c.name === clinicName && c.address === clinicAddress
        );
    }

    showBookmarks() {
        if (this.bookmarkedClinics.length === 0) {
            this.addMessage("You haven't bookmarked any clinics yet. Search for clinics and bookmark your favorites!", 'bot');
            return;
        }

        let bookmarksHTML = `<div class="bookmarks-container">
            <h3 style="color: #667eea; margin-bottom: 15px;">📌 Your Bookmarked Clinics</h3>`;

        this.bookmarkedClinics.forEach((clinic, index) => {
            bookmarksHTML += `
                <div class="bookmark-card" data-index="${index}">
                    <div class="bookmark-header">
                        <h4>🏥 ${clinic.name}</h4>
                        <button class="remove-bookmark-btn" onclick="chatbot.removeBookmarkUI(${index})">❌</button>
                    </div>
                    <p>📍 ${clinic.address}</p>
                    ${clinic.distance ? `<p>📏 ${clinic.distance} km away</p>` : ''}
                    ${clinic.rating ? `<p>⭐ ${clinic.rating} (${clinic.reviews || 0} reviews)</p>` : '<p>No rating yet</p>'}
                    ${clinic.phone ? `<p>📞 ${clinic.phone}</p>` : ''}
                    ${clinic.website ? `<p>🔗 <a href="${clinic.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>` : ''}
                    ${clinic.hours ? `<div class="hours-section"><strong>🕐 Opening Hours:</strong><br>${clinic.hours}</div>` : ''}
                </div>
            `;
        });

        bookmarksHTML += `</div>`;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="avatar">🐾</div>
            <div class="bubble bookmarks-bubble">${bookmarksHTML}</div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    removeBookmarkUI(index) {
        if (index >= 0 && index < this.bookmarkedClinics.length) {
            const clinic = this.bookmarkedClinics[index];
            this.removeBookmark(clinic.name, clinic.address);
            this.addMessage(`Removed "${clinic.name}" from bookmarks.`, 'bot');
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
                { text: "Hello! I'm your PawCare AI Assistant. Ask me anything about pets, cattle, or farm animals.", sender: "bot" }
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
Classify the user's intent.
Options:
- {"intent": "CLINIC_SEARCH"}
- {"intent": "GENERAL"}

User: ${userMessage}
Respond with ONLY one of the JSON objects above.
`;

        const requestBody = {
            contents: [{ parts: [{ text: classificationPrompt }] }],
            generationConfig: { temperature: 0.0, maxOutputTokens: 100 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts;

        let raw = null;
        if (parts && parts.length > 0) {
            raw = parts.map(p => p.text || "").join("").trim();
        }

        if (!raw) {
            return "GENERAL";
        }

        const jsonMatch = raw.match(/\{.*\}/s);
        const jsonToParse = jsonMatch ? jsonMatch[0] : raw;

        try {
            const parsed = JSON.parse(jsonToParse);
            return parsed.intent === "CLINIC_SEARCH" ? "CLINIC_SEARCH" : "GENERAL";
        } catch (err) {
            return "GENERAL";
        }
    }

    async findNearbyClinics() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation is not supported by your browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                try {
                    const { Place } = await google.maps.importLibrary("places");
                    
                    const request = {
                        fields: [
                            "displayName", 
                            "formattedAddress", 
                            "rating", 
                            "userRatingCount", 
                            "nationalPhoneNumber", 
                            "websiteURI",
                            "regularOpeningHours",
                            "location"
                        ],
                        locationRestriction: {
                            center: { lat, lng },
                            radius: 5000,
                        },
                        includedPrimaryTypes: ["veterinary_care"],
                        maxResultCount: 20,
                        rankPreference: "DISTANCE",
                        language: "en",
                    };

                    const { places } = await Place.searchNearby(request);
                    
                    if (!places || places.length === 0) {
                        resolve("❌ No veterinary clinics found within 5km of your location. Try expanding your search area.");
                        return;
                    }

                    const clinicsWithDistance = places.map(p => {
                        const placeLat = typeof p.location.lat === 'function' ? p.location.lat() : p.location.lat;
                        const placeLng = typeof p.location.lng === 'function' ? p.location.lng() : p.location.lng;
                        
                        const distance = this.calculateDistance(lat, lng, placeLat, placeLng);
                        
                        return { place: p, distance };
                    });
                    
                    const nearbyClinics = clinicsWithDistance
                        .sort((a, b) => a.distance - b.distance)
                        .slice(0, 5);
                    
                    if (nearbyClinics.length === 0) {
                        resolve("❌ No veterinary clinics found nearby.");
                        return;
                    }

                    // Create HTML for clinics with bookmark buttons
                    let clinicsHTML = `<div class="clinics-container">
                        <h3 style="color: #667eea; margin-bottom: 15px;">Found ${nearbyClinics.length} nearby veterinary clinic(s):</h3>`;

                    nearbyClinics.forEach(({ place: c, distance }) => {
                        const clinicData = {
                            name: c.displayName,
                            address: c.formattedAddress,
                            distance: distance.toFixed(2),
                            rating: c.rating || null,
                            reviews: c.userRatingCount || 0,
                            phone: c.nationalPhoneNumber || null,
                            website: c.websiteURI || null,
                            hours: c.regularOpeningHours?.weekdayDescriptions?.join('<br>') || null
                        };

                        const isBookmarked = this.isBookmarked(clinicData.name, clinicData.address);
                        const bookmarkIcon = isBookmarked ? '⭐' : '☆';
                        const bookmarkClass = isBookmarked ? 'bookmarked' : '';

                        clinicsHTML += `
                            <div class="clinic-card">
                                <div class="clinic-header">
                                    <h4>🏥 ${clinicData.name}</h4>
                                    <button class="bookmark-btn ${bookmarkClass}" 
                                            onclick="chatbot.toggleBookmark(${JSON.stringify(clinicData).replace(/"/g, '&quot;')})">
                                        ${bookmarkIcon}
                                    </button>
                                </div>
                                <p>📍 ${clinicData.address}</p>
                                <p>📏 ${clinicData.distance} km away</p>
                                ${clinicData.rating ? `<p>⭐ ${clinicData.rating} (${clinicData.reviews} reviews)</p>` : '<p>No rating yet</p>'}
                                ${clinicData.phone ? `<p>📞 ${clinicData.phone}</p>` : ''}
                                ${clinicData.website ? `<p>🔗 <a href="${clinicData.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>` : ''}
                                ${clinicData.hours ? `<div class="hours-section"><strong>🕐 Opening Hours:</strong><br>${clinicData.hours}</div>` : '<p>🕐 Opening hours not available</p>'}
                            </div>
                        `;
                    });

                    clinicsHTML += `</div>`;

                    // Return HTML instead of plain text
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message bot-message';
                    messageDiv.innerHTML = `
                        <div class="avatar">🐾</div>
                        <div class="bubble clinics-bubble">${clinicsHTML}</div>
                    `;
                    
                    this.chatMessages.appendChild(messageDiv);
                    this.scrollToBottom();
                    
                    resolve(null); // Return null to prevent duplicate message
                } catch (err) {
                    console.error('Places API error:', err);
                    reject("Couldn't fetch clinics—check your internet or try again later.");
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                reject("Location error. Please enable location access and try again.");
            });
        });
    }

    toggleBookmark(clinicData) {
        const isCurrentlyBookmarked = this.isBookmarked(clinicData.name, clinicData.address);
        
        if (isCurrentlyBookmarked) {
            this.removeBookmark(clinicData.name, clinicData.address);
            this.addMessage(`Removed "${clinicData.name}" from bookmarks.`, 'bot');
        } else {
            this.addBookmark(clinicData);
            this.addMessage(`Added "${clinicData.name}" to bookmarks! 📌`, 'bot');
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // ====== TEXT RESPONSE (MULTI-TURN) ======
    async getTextResponse(userMessage) {
        const intent = await this.detectIntent(userMessage);

        if (intent === "CLINIC_SEARCH") {
            const result = await this.findNearbyClinics();
            return result; // Will be null if clinics were displayed with HTML
        }

        const systemPrompt = `You are a helpful veterinary assistant.
Provide concise, accurate info about animals (pets, cattle, farm animals).
Politely redirect if asked about non-veterinary topics.`;

        // Build conversation history for multi-turn chat
        const session = this.sessions.find(s => s.id === this.currentSessionId);
        const contents = [];

        if (session && session.messages) {
            // Add system prompt as first user message
            contents.push({
                role: "user",
                parts: [{ text: systemPrompt }]
            });
            contents.push({
                role: "model",
                parts: [{ text: "Understood. I'm ready to help with veterinary questions about pets, cattle, and farm animals." }]
            });

            // Add conversation history (exclude images and the initial greeting)
            const relevantMessages = session.messages.slice(1); // Skip initial bot greeting
            for (let i = 0; i < relevantMessages.length; i++) {
                const msg = relevantMessages[i];
                
                // Skip messages with images for simplicity in text-only context
if (msg.imageData) {
    let imgMime = "image/jpeg";
    if (msg.imageData.startsWith("data:image/png")) imgMime = "image/png";

    contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [
            {
                inline_data: {
                    mime_type: imgMime,
                    data: msg.imageData.split(",")[1]
                }
            },
            { text: msg.text || "" }
        ]
    });
} else {
    contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
    });
}


                const role = msg.sender === 'user' ? 'user' : 'model';
                
                // Only add if there's text content
                if (msg.text && msg.text.trim()) {
                    contents.push({
                        role: role,
                        parts: [{ text: msg.text }]
                    });
                }
            }
        }

        // Add current user message
        contents.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        const requestBody = {
            contents: contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const partsOut = data.candidates?.[0]?.content?.parts || [];

        if (partsOut.length === 0) {
            throw new Error("API returned no response. Check your API key and quotas.");
        }

        return partsOut.filter(p => p.text).map(p => p.text).join("\n") || 'No response.';
    }

    // ====== IMAGE RESPONSE (MULTI-TURN) ======
    async getImageResponse(userMessage, imageData) {
        const base64Data = imageData.split(',')[1];
        let mimeType = 'image/jpeg';
        if (imageData.startsWith('data:image/png')) mimeType = 'image/png';
        else if (imageData.startsWith('data:image/gif')) mimeType = 'image/gif';
        else if (imageData.startsWith('data:image/webp')) mimeType = 'image/webp';

        // Build conversation history for context
        const session = this.sessions.find(s => s.id === this.currentSessionId);
        const contents = [];

        if (session && session.messages) {
            // Add relevant conversation history (last 6 messages for context, excluding images)
            const recentMessages = session.messages.slice(-6);
            for (let i = 0; i < recentMessages.length; i++) {
                const msg = recentMessages[i];
                
                // Skip image messages and the initial greeting
                if (msg.imageData || (msg.sender === 'bot' && i === 0)) continue;

                const role = msg.sender === 'user' ? 'user' : 'model';
                
                if (msg.text && msg.text.trim()) {
                    contents.push({
                        role: role,
                        parts: [{ text: msg.text }]
                    });
                }
            }
        }

        // Add current message with image
        const parts = [
            { inline_data: { mime_type: mimeType, data: base64Data } },
            { text: userMessage || "Describe this image related to animals and provide any veterinary insights." }
        ];

        contents.push({
            role: "user",
            parts: parts
        });

        const requestBody = {
            contents: contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const partsOut = data.candidates?.[0]?.content?.parts || [];
        if (partsOut.length === 0) {
            throw new Error("API returned no response for image.");
        }
        return partsOut.filter(p => p.text).map(p => p.text).join("\n") || 'No description.';
    }

    // ====== UI MESSAGES ======
    addMessage(text, sender, imageData = null, imageName = null, save = true) {
        if (!text) return; // Don't add empty messages
        
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
            bubbleDiv.appendChild(img);

            if (imageName) {
                const nameDiv = document.createElement('small');
                nameDiv.textContent = `Image: ${imageName}`;
                bubbleDiv.appendChild(nameDiv);
            }
        }

        if (text) {
            const textNode = document.createElement('div');
            let formatted = text;
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/\n/g, '<br>');
            textNode.innerHTML = formatted;
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

// Global reference for onclick handlers
let chatbot;

document.addEventListener('DOMContentLoaded', () => {
    chatbot = new Chatbot();
});