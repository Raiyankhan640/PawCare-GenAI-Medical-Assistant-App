class Chatbot {
    constructor() {
        this.API_KEY = "AIzaSyC0yn7XKOm4KrOG61VFVOaoZRdHsaEtI2c";

        // UI elements
        this.chatMessages = document.getElementById("chatMessages");
        this.userInput = document.getElementById("userInput");
        this.sendButton = document.getElementById("sendButton");
        this.voiceButton = document.getElementById("voiceButton");
        this.imageButton = document.getElementById("imageButton");
        this.imageInput = document.getElementById("imageInput");
        this.imagePreviewContainer = document.getElementById("imagePreviewContainer");

        // State
        this.currentImageData = null;
        this.currentImageName = null;
        this.recognition = null;
        this.isRecording = false;

        // Sessions
        this.sessions = JSON.parse(localStorage.getItem("sessions")) || [];
        this.currentSessionId = null;

        this.initializeEventListeners();
        this.initializeSpeechRecognition();

        const newChatBtn = document.getElementById("newChatButton");
        if (newChatBtn) newChatBtn.addEventListener("click", () => this.startNewChat());

        if (this.sessions.length > 0) {
            this.loadSession(this.sessions[0].id);
        } else {
            this.startNewChat();
        }
    }

    /* ---------------- SESSION MANAGEMENT ---------------- */

    saveSessions() { localStorage.setItem("sessions", JSON.stringify(this.sessions)); }

    renderChatList() {
        const chatList = document.getElementById("chatList");
        if (!chatList) return;

        chatList.innerHTML = "";
        this.sessions.forEach(session => {
            const wrap = document.createElement("div");
            wrap.className = "chat-list-item";

            const btn = document.createElement("button");
            btn.className = "chat-btn";
            btn.textContent = session.title || "New Chat";
            if (session.id === this.currentSessionId) btn.classList.add("active");
            btn.onclick = () => this.loadSession(session.id);

            const del = document.createElement("span");
            del.className = "delete-btn";
            del.textContent = "??";
            del.onclick = (e) => {
                e.stopPropagation();
                this.deleteSession(session.id);
            };

            wrap.appendChild(btn);
            wrap.appendChild(del);
            chatList.appendChild(wrap);
        });
    }

    startNewChat() {
        const session = {
            id: Date.now(),
            title: "New Chat",
            messages: [
                { text: "Hello! I’m your VetAI Assistant. Ask me anything about animals.", sender: "bot" }
            ],
        };

        this.sessions.unshift(session);
        this.currentSessionId = session.id;
        this.saveSessions();
        this.renderChatList();
        this.displayMessages(session.messages);
    }

    loadSession(id) {
        this.currentSessionId = id;
        const s = this.sessions.find(x => x.id === id);
        if (!s) return;
        this.displayMessages(s.messages);
        this.renderChatList();
    }

    deleteSession(id) {
        this.sessions = this.sessions.filter(x => x.id !== id);
        if (this.currentSessionId === id) {
            if (this.sessions.length > 0) this.loadSession(this.sessions[0].id);
            else this.startNewChat();
        }
        this.saveSessions();
        this.renderChatList();
    }

    displayMessages(msgs) {
        this.chatMessages.innerHTML = "";
        msgs.forEach(m => {
            this.addMessage(m.text, m.sender, m.imageData, m.imageName, false);
        });
        this.scrollToBottom();
    }

    /* ---------------- EVENT LISTENERS ---------------- */

    initializeEventListeners() {
        this.sendButton.onclick = () => this.sendMessage();
        this.userInput.onkeypress = (e) => { if (e.key === "Enter") this.sendMessage(); };
        this.imageButton.onclick = () => this.imageInput.click();
        this.imageInput.onchange = (e) => this.handleImageUpload(e);
        this.voiceButton.onclick = () => this.toggleVoiceInput();
    }

    /* ---------------- SPEECH RECOGNITION ---------------- */

    initializeSpeechRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            this.voiceButton.style.display = "none";
            return;
        }

        this.recognition = new SR();
        this.recognition.lang = "en-US";

        this.recognition.onresult = (e) => {
            this.userInput.value = e.results[0][0].transcript;
            this.stopRecording();
        };

        this.recognition.onerror = () => this.stopRecording();
        this.recognition.onend = () => this.stopRecording();
    }

    toggleVoiceInput() {
        this.isRecording ? this.stopRecording() : this.startRecording();
    }

    startRecording() {
        this.userInput.value = "";
        this.recognition.start();
        this.isRecording = true;
        this.voiceButton.textContent = "?";
        this.voiceButton.classList.add("recording");
    }

    stopRecording() {
        try { this.recognition.stop(); } catch {}
        this.isRecording = false;
        this.voiceButton.textContent = "??";
        this.voiceButton.classList.remove("recording");
    }

    /* ---------------- IMAGE UPLOAD ---------------- */

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.currentImageData = event.target.result;
            this.currentImageName = file.name;

            this.imagePreviewContainer.innerHTML = "";

            const img = document.createElement("img");
            img.src = this.currentImageData;
            img.className = "image-preview";

            const close = document.createElement("span");
            close.className = "remove-preview";
            close.textContent = "?";
            close.onclick = () => {
                this.currentImageData = null;
                this.currentImageName = null;
                this.imagePreviewContainer.innerHTML = "";
                this.imageInput.value = "";
            };

            this.imagePreviewContainer.appendChild(img);
            this.imagePreviewContainer.appendChild(close);
        };

        reader.readAsDataURL(file);
    }

    /* ---------------- SEND MESSAGE ---------------- */

    async sendMessage() {
        const message = this.userInput.value.trim();
        const hasImage = !!this.currentImageData;

        if (!message && !hasImage) return;

        this.addMessage(message, "user", this.currentImageData, this.currentImageName);

        const imgData = this.currentImageData;

        this.userInput.value = "";
        this.currentImageData = null;
        this.currentImageName = null;
        this.imagePreviewContainer.innerHTML = "";
        this.imageInput.value = "";

        this.setLoadingState(true);

        try {
            let response;

            if (hasImage) {
                response = await this.getImageResponse(message, imgData);
            } else {
                response = await this.getTextResponse(message);
            }

            this.addMessage(response, "bot");

        } catch (e) {
            this.addMessage("Error: " + e.message, "bot");
        }

        this.setLoadingState(false);
    }

    /* ---------------- INTENT DETECTION ---------------- */

    async detectIntent(message) {
        const prompt = `
Classify the user's intent.
Options:
- {"intent": "CLINIC_SEARCH"}
- {"intent": "GENERAL"}

User: ${message}
Reply ONLY with JSON.
`;

        const req = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 50 }
        };

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`,
            { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) }
        );

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";
        const match = text.match(/\{.*\}/s);

        if (!match) return "GENERAL";
        try {
            return JSON.parse(match[0]).intent || "GENERAL";
        } catch {
            return "GENERAL";
        }
    }

    /* ---------------- CLINIC SEARCH (FIXED) ---------------- */

    async findNearbyClinics() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("? Geolocation not supported.");
                return;
            }

            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const service = new google.maps.places.PlacesService(document.createElement("div"));

                    const request = {
                        location: new google.maps.LatLng(
                            pos.coords.latitude,
                            pos.coords.longitude
                        ),
                        radius: 8000,
                        keyword: "veterinary clinic"
                    };

                    service.nearbySearch(request, (results, status) => {
                        if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
                            resolve("? No veterinary clinics found near you.");
                            return;
                        }

                        const formatted = results.slice(0, 5).map(p =>
                            `?? **${p.name}**\n?? ${p.vicinity || "Address unavailable"}\n? ${p.rating || "No rating"}`
                        ).join("\n\n");

                        resolve("Nearby Clinics:\n\n" + formatted);
                    });

                } catch (err) {
                    reject("? Could not fetch clinic info.");
                }
            }, () => reject("? Location access denied."));
        });
    }

    /* ---------------- TEXT RESPONSE ---------------- */

    async getTextResponse(message) {
        const intent = await this.detectIntent(message);

        if (intent === "CLINIC_SEARCH") {
            return await this.findNearbyClinics();
        }

        const sys = "You are a veterinary assistant. Your job is to help with primary diagnosis and suggest primary treatment of pets/cattle";

        const req = {
            contents: [{ parts: [{ text: `${sys}\n\nUser: ${message}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req)
            }
        );

        const json = await res.json();
        const parts = json?.candidates?.[0]?.content?.parts || [];

        return parts.map(p => p.text).join("\n") || "No response.";
    }

    /* ---------------- IMAGE RESPONSE ---------------- */

    async getImageResponse(message, imgData) {
        const base64 = imgData.split(",")[1];

        let mimeType = "image/jpeg";
        if (imgData.startsWith("data:image/png")) mimeType = "image/png";
        if (imgData.startsWith("data:image/gif")) mimeType = "image/gif";
        if (imgData.startsWith("data:image/webp")) mimeType = "image/webp";

        const req = {
            contents: [{
                parts: [
                    { inline_data: { mime_type: mimeType, data: base64 }},
                    { text: message || "Describe this image." }
                ]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`,
            { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) }
        );

        const text = await res.text();
        let json = {};
        try { json = JSON.parse(text); } catch {}

        const parts = json?.candidates?.[0]?.content?.parts;
        if (!parts) throw new Error("Image model returned no output.");

        return parts.map(p => p.text).filter(Boolean).join("\n") || "Couldn't interpret the image.";
    }

    /* ---------------- UI HELPERS ---------------- */

    addMessage(text, sender, imgData = null, imgName = null, save = true) {
        const msg = document.createElement("div");
        msg.className = `message ${sender}-message`;

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = sender === "bot" ? "??" : "";

        if (sender === "user") {
            const u = document.createElement("img");
            u.src = "user-icon.png";
            avatar.appendChild(u);
        }

        const bubble = document.createElement("div");
        bubble.className = "bubble";

        if (imgData) {
            const img = document.createElement("img");
            img.src = imgData;
            img.className = "image-preview";
            bubble.appendChild(img);
        }

        const textNode = document.createElement("div");
        textNode.textContent = text;
        bubble.appendChild(textNode);

        msg.appendChild(avatar);
        msg.appendChild(bubble);
        this.chatMessages.appendChild(msg);

        if (save && this.currentSessionId) {
            const s = this.sessions.find(x => x.id === this.currentSessionId);
            s.messages.push({ text, sender, imageData: imgData, imageName: imgName });

            if (sender === "user" && s.title === "New Chat") {
                s.title = text.slice(0, 20) + "...";
            }

            this.saveSessions();
            this.renderChatList();
        }

        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    setLoadingState(b) {
        this.sendButton.disabled = b;
        this.userInput.disabled = b;
        this.imageButton.disabled = b;
        this.voiceButton.disabled = b;

        if (b) this.showTypingIndicator();
        else this.hideTypingIndicator();
    }

    showTypingIndicator() {
        const div = document.createElement("div");
        div.id = "typingIndicator";
        div.className = "message bot-message";
        div.innerHTML = `
            <div class="avatar">??</div>
            <div class="bubble typing-indicator">
                <span></span><span></span><span></span>
            </div>`;
        this.chatMessages.appendChild(div);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const t = document.getElementById("typingIndicator");
        if (t) t.remove();
    }
}

/* ---------------- INIT ---------------- */

document.addEventListener("DOMContentLoaded", () => {
    new Chatbot();
});
