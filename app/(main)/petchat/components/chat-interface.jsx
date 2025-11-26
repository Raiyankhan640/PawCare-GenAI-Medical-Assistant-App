"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello! I'm your PetCare AI Assistant. I can help you with medication suggestions and health advice for your pets. Please describe your pet's condition, including type, age, weight, and symptoms.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const messagesEndRef = useRef(null);

    // Detect client side for timestamps
    useEffect(() => {
        setIsClient(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = {
            role: "user",
            content: input,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);
        // Simulate AI response (replace with real API later)
        setTimeout(() => {
            const aiMessage = {
                role: "assistant",
                content: `I'm here to help! This is a placeholder response. You asked: ${input}`,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-emerald-950/40 to-teal-950/40 backdrop-blur-xl border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-b border-emerald-500/20 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md animate-pulse" />
                                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-full">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-400">AI Medical Assistant</h3>
                                <p className="text-xs text-muted-foreground">Specialized in pet medication</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                            <Sparkles className="h-3 w-3 mr-1" /> AI Powered
                        </Badge>
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
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-gradient-to-br from-cyan-500 to-blue-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"
                                        }`}
                                >
                                    {msg.role === "user" ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                                </motion.div>
                                {/* Bubble */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className={`flex-1 max-w-[75%] ${msg.role === "user" ? "text-right" : "text-left"}`}
                                >
                                    <div
                                        className={`inline-block rounded-2xl px-4 py-3 ${msg.role === "user"
                                            ? "bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30"
                                            : "bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        {isClient && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        )}
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
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-emerald-500/20 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Describe your pet's symptoms or ask about medication..."
                                className="bg-background/50 border-emerald-500/30 focus:border-emerald-500/50 pr-14 h-12 rounded-xl"
                                disabled={isTyping}
                            />
                            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400/50" />
                        </div>
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
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
                        <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-400/90"><strong>Important:</strong> This AI provides general guidance only. Always consult a licensed veterinarian for diagnosis and treatment. In emergency situations, contact your vet immediately.</p>
                    </motion.div>
                </div>
            </Card>

            {/* Sample Questions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid md:grid-cols-3 gap-3"
            >
                {["What medication for dog with upset stomach?", "Safe pain relief for senior cats?", "Antibiotics for skin infection in puppies?"].map((q, i) => (
                    <Button
                        key={i}
                        variant="outline"
                        onClick={() => setInput(q)}
                        className="bg-emerald-900/20 border-emerald-500/20 hover:bg-emerald-900/30 hover:border-emerald-500/40 text-sm h-auto py-3 px-4 text-left justify-start whitespace-normal"
                    >
                        <Sparkles className="h-4 w-4 mr-2 flex-shrink-0 text-emerald-400" />
                        <span className="text-muted-foreground">{q}</span>
                    </Button>
                ))}
            </motion.div>
        </div>
    );
}
