"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// SVG Icons (keeping all existing icons)
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
);

const BotIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="5" y="5" rx="2"/>
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

const PawIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
);

const PillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
);

const FoodIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20"/><path d="M20 12c0-4.4-3.6-8-8-8s-8 3.6-8 8"/><path d="M4 12v7c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-7"/>
    </svg>
);

const SyringeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>
    </svg>
);

// Enhanced Prompt Templates with better design
const PROMPT_TEMPLATES = [
    {
        icon: HeartIcon,
        title: "Symptom Check",
        prompt: "My pet is showing these symptoms: [describe symptoms]. They are a [age] year old [breed/type]. What could be wrong?",
        color: "from-rose-500 to-pink-600",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20",
    },
    {
        icon: PillIcon,
        title: "Medication Help",
        prompt: "What is the recommended dosage of [medication] for a [weight]kg [pet type]? Are there any side effects I should watch for?",
        color: "from-blue-500 to-indigo-600",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
    },
    {
        icon: AlertIcon,
        title: "Emergency Guide",
        prompt: "My pet has [emergency situation]. What immediate steps should I take before reaching the vet?",
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
    },
    {
        icon: FoodIcon,
        title: "Diet & Nutrition",
        prompt: "What is the best diet for a [age] year old [pet type] with [health condition]? Any foods to avoid?",
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
    },
];

// Enhanced Typing Indicator
const TypingIndicator = () => (
    <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
            <motion.span
                className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.span
                className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
                className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
        </div>
        <span className="text-sm text-emerald-400 font-medium">PawCare AI is thinking...</span>
    </div>
);

const INITIAL_MESSAGE = {
    role: "assistant",
    content: `Hello! 🐾 I'm **PawCare AI**, your professional veterinary assistant.

I can help you with:
• 🩺 Health assessment and symptom analysis
• 💊 Medication recommendations with proper dosages
• 🚨 Emergency care guidance
• 🥗 Preventive care and nutrition advice
• 🔬 Disease diagnosis and treatment options

You can also **upload images** 📷 of your pet or use **voice input** 🎤 to describe symptoms!

**To get started**, tell me about your pet (type, age, breed) and what's concerning you.`,
};

export default function ChatInterface() {
    const [messages, setMessages] = useState([{ ...INITIAL_MESSAGE, id: "initial" }]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isClient, setIsClient] = useState(false);
    
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Fix hydration - only render timestamps on client
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
                    console.error('Speech recognition error:', event.error);
                    setIsRecording(false);
                    toast.error('Voice input error: ' + event.error);
                };

                recognition.onend = () => {
                    setIsRecording(false);
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {}
            }
        };
    }, []);

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
                toast.success("Listening... Speak now");
            } catch (e) {
                console.error('Error starting recognition:', e);
                toast.error("Could not start voice input");
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
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
    };

    const handleSend = async (customMessage = null) => {
        const text = customMessage || input.trim();
        const hasImage = currentImage !== null;
        
        if (!text && !hasImage) return;
        if (isTyping) return;

        if (isRecording) {
            try {
                recognitionRef.current?.stop();
                setIsRecording(false);
            } catch (e) {
                console.error('Error stopping recognition:', e);
            }
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: text || (hasImage ? "Please analyze this image" : ""),
            image: currentImage,
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = text;
        const imageData = currentImage;
        setInput("");
        setCurrentImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsTyping(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        try {
            const history = messages.slice(1).map(msg => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: currentInput || (hasImage ? "Please analyze this image and provide veterinary insights" : ""),
                    history,
                    image: imageData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get response");
            }

            setMessages(prev => [...prev, {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: data.response,
            }]);
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Failed to get response");
            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "I apologize, but I encountered an error. Please check your connection and try again.",
                isError: true,
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTextareaChange = (e) => {
        setInput(e.target.value);
        const textarea = e.target;
        textarea.style.height = "auto";
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 56), 160);
        textarea.style.height = newHeight + "px";
    };

    const copyToClipboard = async (text, id) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const clearChat = () => {
        setMessages([{ ...INITIAL_MESSAGE, id: "initial" }]);
        setCurrentImage(null);
        setImagePreview(null);
        toast.success("Chat cleared");
    };

    const usePromptTemplate = (prompt) => {
        setInput(prompt);
        textareaRef.current?.focus();
    };

    const formatMessage = (content) => {
        return content.split('\n').map((line, i) => (
            <span key={i}>
                {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="font-semibold text-emerald-300">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
                {i < content.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    return (
        <div className="h-full flex bg-[#0a0f1a] relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse delay-500" />
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
                            initial={{ 
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Enhanced Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Enhanced Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="shrink-0 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl px-6 py-4"
                >
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div 
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg animate-pulse" />
                                <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
                                    <PawIcon size={26} />
                                </div>
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                    PawCare AI
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <motion.span 
                                        className="h-2 w-2 rounded-full bg-emerald-400"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <span className="text-sm text-emerald-300 font-medium">Online • Ready to help</span>
                                </div>
                            </div>
                        </div>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearChat}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2"
                        >
                            <CloseIcon />
                            <span className="font-medium">Clear Chat</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Enhanced Messages Area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ 
                                        duration: 0.4,
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    {/* Enhanced Avatar */}
                                    <motion.div 
                                        className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center shadow-2xl ${
                                            message.role === "assistant" 
                                                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/40" 
                                                : "bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/40"
                                        }`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        {message.role === "assistant" ? 
                                            <BotIcon size={22} /> : 
                                            <UserIcon />
                                        }
                                    </motion.div>

                                    {/* Enhanced Message Content */}
                                    <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "flex flex-col items-end" : ""}`}>
                                        <motion.div 
                                            className={`rounded-3xl p-6 backdrop-blur-sm border ${
                                                message.role === "assistant" 
                                                    ? message.isError 
                                                        ? "bg-red-500/10 border-red-500/30 text-red-200" 
                                                        : "bg-white/5 border-white/10 text-gray-100 shadow-2xl shadow-emerald-500/10"
                                                    : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/30"
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            {message.image && (
                                                <motion.div 
                                                    className="mb-4"
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <img
                                                        src={message.image}
                                                        alt="Uploaded"
                                                        className="max-w-[240px] max-h-[240px] rounded-2xl border-2 border-white/20 shadow-lg"
                                                    />
                                                </motion.div>
                                            )}
                                            <div className="text-[15.5px] leading-relaxed whitespace-pre-wrap">
                                                {formatMessage(message.content)}
                                            </div>
                                        </motion.div>
                                        
                                        {/* Enhanced Actions */}
                                        {message.role === "assistant" && !message.isError && isClient && (
                                            <motion.div 
                                                className="flex items-center gap-3 mt-3 px-2"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => copyToClipboard(message.content, message.id)}
                                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-emerald-400 transition-all duration-200 flex items-center gap-2"
                                                >
                                                    {copiedId === message.id ? <CheckIcon /> : <CopyIcon />}
                                                    <span className="text-sm font-medium">
                                                        {copiedId === message.id ? "Copied!" : "Copy"}
                                                    </span>
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Enhanced Typing Indicator */}
                        <AnimatePresence>
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
                                        <BotIcon size={22} />
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl px-6 py-4 shadow-2xl">
                                        <TypingIndicator />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Enhanced Input Area */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="shrink-0 border-t border-white/10 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-xl"
                >
                    <div className="max-w-4xl mx-auto px-6 py-6">
                        {/* Enhanced Image Preview */}
                        <AnimatePresence>
                            {imagePreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, height: 0 }}
                                    animate={{ opacity: 1, scale: 1, height: "auto" }}
                                    exit={{ opacity: 0, scale: 0.8, height: 0 }}
                                    className="mb-4 flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
                                >
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-xl border-2 border-emerald-500/50 shadow-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="text-emerald-400 font-semibold text-sm">Image attached</p>
                                        <p className="text-gray-500 text-xs">Ready for analysis</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.2)" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={removeImage}
                                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                                    >
                                        <CloseIcon />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Enhanced Input Container */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-2xl">
                            {/* Enhanced Input Row */}
                            <div className="flex gap-3 items-end">
                                {/* Enhanced Action Buttons */}
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: isRecording ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleVoiceInput}
                                        disabled={isTyping}
                                        className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all border ${
                                            isRecording 
                                                ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-lg shadow-red-500/20" 
                                                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                                        } disabled:opacity-50`}
                                    >
                                        {isRecording ? <StopIcon /> : <MicIcon />}
                                    </motion.button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isTyping}
                                        className="h-14 w-14 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 flex items-center justify-center transition-all disabled:opacity-50"
                                    >
                                        <ImageIcon />
                                    </motion.button>
                                </div>

                                {/* Enhanced Text Input */}
                                <div className="flex-1 relative">
                                    <motion.textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={handleTextareaChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder={isRecording ? "🎤 Listening... Speak now" : "Describe your pet's symptoms, ask about medications, or upload an image..."}
                                        disabled={isTyping}
                                        rows={1}
                                        className="w-full resize-none rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 text-[15px] text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 focus:shadow-2xl focus:shadow-emerald-500/20 disabled:opacity-50 transition-all duration-300 leading-relaxed overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                                        style={{ 
                                            minHeight: "56px", 
                                            maxHeight: "160px",
                                        }}
                                    />
                                    {/* Enhanced Focus Effect */}
                                    <motion.div 
                                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 pointer-events-none"
                                        animate={{ opacity: input ? 0.1 : 0 }}
                                    />
                                </div>

                                {/* Enhanced Send Button */}
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => handleSend()}
                                        disabled={(!input.trim() && !currentImage) || isTyping}
                                        className="h-14 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:shadow-none flex items-center gap-3"
                                    >
                                        <SendIcon />
                                        <span>Send</span>
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Enhanced Prompt Templates */}
                            <motion.div 
                                className="mt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <p className="text-xs text-emerald-400 font-medium mb-3 flex items-center gap-2">
                                    <span>💡</span>
                                    Quick prompts to get started
                                </p>
                                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10">
                                    {PROMPT_TEMPLATES.map((template, index) => {
                                        const Icon = template.icon;
                                        return (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => usePromptTemplate(template.prompt)}
                                                className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${template.bgColor} ${template.borderColor} text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group`}
                                            >
                                                <div className={`p-2 rounded-lg bg-gradient-to-r ${template.color} shadow-lg group-hover:scale-110 transition-transform`}>
                                                    <Icon />
                                                </div>
                                                <span>{template.title}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Enhanced Disclaimer */}
                        <motion.p 
                            className="text-xs text-gray-600 mt-4 text-center flex items-center justify-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span>⚠️</span>
                            PawCare AI provides general guidance only. Always consult a licensed veterinarian for diagnosis and treatment.
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}