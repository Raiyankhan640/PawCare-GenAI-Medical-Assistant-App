"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, Sparkles, AlertTriangle, Loader2, Trash2, Copy, Check, Mic, Image as ImageIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello! 🐾 I'm PawCare AI, your professional veterinary assistant.\n\nI can help you with:\n• **Health assessment** and symptom analysis\n• **Medication recommendations** with proper dosages\n• **Emergency care** guidance\n• **Preventive care** and nutrition advice\n• **Disease diagnosis** and treatment options\n\nPlease share:\n• Pet type (dog, cat, bird, etc.)\n• Age, weight, and breed\n• Symptoms or health concerns\n\nYou can also **upload images** 📷 or use **voice input** 🎤!\n\nHow can I help you and your pet today?",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [apiConnected, setApiConnected] = useState(true); // Track API connection status
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);

    // Detect client side for timestamps
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    setInput(transcript);
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event);
                    setIsRecording(false);
                    toast.error('Voice input error: ' + event.error);
                };

                recognition.onend = () => {
                    if (isRecording) {
                        try {
                            recognition.start();
                        } catch (e) {
                            setIsRecording(false);
                        }
                    }
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore
                }
            }
        };
    }, [isRecording]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatMessage = (content) => {
        // Convert markdown-style bold to JSX
        const parts = content.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} className="text-emerald-400">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const copyToClipboard = async (text, id) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const clearChat = () => {
        setMessages([
            {
                role: "assistant",
                content:
                    "Hello! 🐾 I'm PawCare AI, your professional veterinary assistant.\n\nI can help you with:\n• **Health assessment** and symptom analysis\n• **Medication recommendations** with proper dosages\n• **Emergency care** guidance\n• **Preventive care** and nutrition advice\n• **Disease diagnosis** and treatment options\n\nPlease share:\n• Pet type (dog, cat, bird, etc.)\n• Age, weight, and breed\n• Symptoms or health concerns\n\nYou can also **upload images** 📷 or use **voice input** 🎤!\n\nHow can I help you and your pet today?",
                timestamp: new Date().toISOString(),
            },
        ]);
        setCurrentImage(null);
        setImagePreview(null);
        toast.success("Chat cleared");
    };

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            toast.error("Voice input is not supported in your browser");
            return;
        }

        if (isRecording) {
            try {
                recognitionRef.current.stop();
                setIsRecording(false);
                toast.success("Voice input stopped");
            } catch (e) {
                console.error('Error stopping recognition:', e);
            }
        } else {
            try {
                setInput('');
                recognitionRef.current.start();
                setIsRecording(true);
                toast.success("Voice input started - speak now");
            } catch (e) {
                console.error('Error starting recognition:', e);
                toast.error("Could not start voice input");
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                toast.error("Image size should be less than 4MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target?.result;
                setCurrentImage(base64Data);
                setImagePreview(base64Data);
                toast.success("Image uploaded successfully");
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCurrentImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success("Image removed");
    };

    const handleSend = async () => {
        const hasImage = currentImage !== null;
        const hasText = input.trim().length > 0;

        if (!hasText && !hasImage) return;

        // Stop voice recording if active
        if (isRecording) {
            try {
                recognitionRef.current?.stop();
                setIsRecording(false);
            } catch (e) {
                console.error('Error stopping recognition:', e);
            }
        }

        const userMessage = {
            role: "user",
            content: input || (hasImage ? "Please analyze this image" : ""),
            timestamp: new Date().toISOString(),
            image: currentImage,
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        const imageData = currentImage;
        setInput("");
        setCurrentImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsTyping(true);

        try {
            // Get conversation history (exclude the initial greeting)
            const history = messages.slice(1).map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: currentInput || (hasImage ? "Please analyze this image and provide veterinary insights" : ""),
                    history,
                    image: imageData, // Send image data if present
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get response");
            }

            const aiMessage = {
                role: "assistant",
                content: data.response,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setApiConnected(true); // Mark API as connected on successful response
        } catch (error) {
            console.error("Chat error:", error);
            setApiConnected(false);
            const errorMessage = {
                role: "assistant",
                content: `I apologize, but I encountered an error: ${error.message || 'Connection failed'}\n\nPlease check:\n• Your internet connection\n• The AI service is available\n• Try refreshing the page\n\nIf the issue persists, contact support. 🙏`,
                timestamp: new Date().toISOString(),
                isError: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
            toast.error("Failed to get AI response");
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!isClient) return "";
        return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-linear-to-br from-emerald-950/40 to-teal-950/40 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden rounded-xl">
                {/* Chat Header */}
                <div className="bg-linear-to-r from-emerald-900/50 to-teal-900/50 border-b border-emerald-500/20 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md animate-pulse" />
                                <div className="relative bg-linear-to-br from-emerald-500 to-teal-500 p-2 rounded-full">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-400">AI Medical Assistant</h3>
                                <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearChat}
                                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                            <Badge 
                                variant="outline" 
                                className={`${apiConnected ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                            >
                                <div className={`h-2 w-2 rounded-full mr-2 ${apiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                                {apiConnected ? 'AI Connected' : 'AI Offline'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4 scroll-smooth">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-linear-to-br from-cyan-500 to-blue-500" : "bg-linear-to-br from-emerald-500 to-teal-500"
                                        }`}
                                >
                                    {msg.role === "user" ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                                </motion.div>
                                {/* Bubble */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className={`flex-1 max-w-[80%] ${msg.role === "user" ? "text-right" : "text-left"}`}
                                >
                                    <div
                                        className={`inline-block rounded-2xl px-4 py-3 ${msg.role === "user"
                                            ? "bg-linear-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30"
                                            : msg.isError
                                                ? "bg-linear-to-br from-red-900/40 to-red-800/40 border border-red-500/30"
                                                : "bg-linear-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30"
                                            }`}
                                    >
                                        {/* Display image if present */}
                                        {msg.image && (
                                            <div className="mb-3">
                                                <img
                                                    src={msg.image}
                                                    alt="Uploaded"
                                                    className="max-w-[200px] max-h-[200px] rounded-lg border border-white/20"
                                                />
                                            </div>
                                        )}
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {formatMessage(msg.content)}
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                                            {isClient && msg.timestamp && (
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTimestamp(msg.timestamp)}
                                                </p>
                                            )}
                                            {msg.role === "assistant" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-xs text-muted-foreground hover:text-emerald-400"
                                                    onClick={() => copyToClipboard(msg.content, idx)}
                                                >
                                                    {copiedId === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                        {/* Typing */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-3"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="bg-linear-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                                        <span className="text-sm text-muted-foreground">AI is analyzing...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-emerald-500/20 bg-linear-to-r from-emerald-900/30 to-teal-900/30 p-4">
                    {/* Image Preview */}
                    {imagePreview && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mb-3 flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl"
                        >
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border border-emerald-500/30"
                            />
                            <div className="flex-1">
                                <p className="text-xs text-emerald-400 font-semibold">Image attached</p>
                                <p className="text-xs text-muted-foreground">Ready to analyze</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={removeImage}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}

                    <div className="flex gap-2">
                        {/* Voice Input Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleVoiceInput}
                            disabled={isTyping}
                            className={`h-12 w-12 rounded-xl border-emerald-500/30 hover:bg-emerald-900/30 transition-all ${isRecording ? 'bg-red-500/20 border-red-500/50 animate-pulse' : ''}`}
                            title="Voice Input"
                        >
                            <Mic className={`h-5 w-5 ${isRecording ? 'text-red-400' : 'text-emerald-400'}`} />
                        </Button>

                        {/* Image Upload Button */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isTyping}
                            className="h-12 w-12 rounded-xl border-emerald-500/30 hover:bg-emerald-900/30"
                            title="Upload Image"
                        >
                            <ImageIcon className="h-5 w-5 text-emerald-400" />
                        </Button>

                        {/* Text Input */}
                        <div className="flex-1 relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={isRecording ? "Listening..." : "Describe symptoms or ask about medication..."}
                                className="bg-background/50 border-emerald-500/30 focus:border-emerald-500/50 pr-14 h-12 rounded-xl"
                                disabled={isTyping}
                            />
                            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400/50" />
                        </div>

                        {/* Send Button */}
                        <Button
                            onClick={handleSend}
                            disabled={(!input.trim() && !currentImage) || isTyping}
                            className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5 mr-2" />Send</>}
                        </Button>
                    </div>
                    {/* Disclaimer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                    >
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-400/90"><strong>Important:</strong> This AI provides general guidance only. Always consult a licensed veterinarian for diagnosis and treatment. In emergency situations, contact your vet immediately.</p>
                    </motion.div>
                </div>
            </div>

            {/* Sample Questions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
            >
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    Try these sample questions:
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                    {[
                        "My 8-month old Labrador puppy, 15kg, has been vomiting. What should I do?", 
                        "What are safe flea prevention medications for a 4kg senior cat?", 
                        "My 3-year-old Golden Retriever has a skin rash. Can you help diagnose?"
                    ].map((q, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            onClick={() => setInput(q)}
                            disabled={isTyping}
                            className="bg-emerald-900/20 border-emerald-500/20 hover:bg-emerald-900/30 hover:border-emerald-500/40 text-sm h-auto py-3 px-4 text-left justify-start whitespace-normal"
                        >
                            <Sparkles className="h-4 w-4 mr-2 shrink-0 text-emerald-400" />
                            <span className="text-muted-foreground">{q}</span>
                        </Button>
                    ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="h-4 w-4 text-emerald-400" />
                    <span>Tip: You can also upload images of your pet for visual analysis</span>
                </div>
            </motion.div>
        </div>
    );
}
