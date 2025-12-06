"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  ChatHeader,
  MessagesList,
  ChatInput,
  ChatBackground,
  useSpeechRecognition,
  useImageUpload,
  useTextareaAutoResize,
  INITIAL_MESSAGE,
} from "./chat";

export default function ChatInterface() {
  // State
  const [messages, setMessages] = useState([{ ...INITIAL_MESSAGE, id: "initial" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  
  // Custom hooks
  const { startRecording, stopRecording, recognitionRef } = useSpeechRecognition(setInput);
  const { fileInputRef, handleImageUpload: processImageUpload, removeImage: processRemoveImage } = useImageUpload();
  const { textareaRef, handleTextareaChange: processTextareaChange, resetTextarea } = useTextareaAutoResize();

  // Fix hydration - only render timestamps on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle voice recording toggle
  const toggleVoiceInput = () => {
    if (isRecording) {
      if (stopRecording()) {
        setIsRecording(false);
      }
    } else {
      setInput('');
      if (startRecording()) {
        setIsRecording(true);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    processImageUpload(e, setCurrentImage, setImagePreview);
  };

  // Handle image removal
  const removeImage = () => {
    processRemoveImage(setCurrentImage, setImagePreview);
  };

  // Handle textarea change
  const handleTextareaChange = (e) => {
    processTextareaChange(e, setInput);
  };

  // Handle message send
  const handleSend = async (customMessage = null) => {
    const text = customMessage || input.trim();
    const hasImage = currentImage !== null;
    
    if (!text && !hasImage) return;
    if (isTyping) return;

    // Stop recording if active
    if (isRecording) {
      try {
        recognitionRef.current?.stop();
        setIsRecording(false);
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }

    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text || (hasImage ? "Please analyze this image" : ""),
      image: currentImage,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = text;
    const imageData = currentImage;
    
    // Reset input
    setInput("");
    setCurrentImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsTyping(true);
    resetTextarea();

    try {
      // Prepare chat history
      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to API
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

      // Add assistant response
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

  // Handle enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Copy message to clipboard
  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([{ ...INITIAL_MESSAGE, id: "initial" }]);
    setCurrentImage(null);
    setImagePreview(null);
    toast.success("Chat cleared");
  };

  // Use prompt template
  const usePromptTemplate = (prompt) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="h-full flex bg-[#0a0f1a] relative overflow-hidden">
      {/* Animated Background */}
      <ChatBackground />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header */}
        <ChatHeader onClearChat={clearChat} />

        {/* Messages */}
        <MessagesList
          messages={messages}
          isTyping={isTyping}
          isClient={isClient}
          copiedId={copiedId}
          onCopy={copyToClipboard}
          messagesEndRef={messagesEndRef}
        />

        {/* Input */}
        <ChatInput
          input={input}
          isTyping={isTyping}
          isRecording={isRecording}
          imagePreview={imagePreview}
          textareaRef={textareaRef}
          fileInputRef={fileInputRef}
          onInputChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onSend={() => handleSend()}
          onToggleVoice={toggleVoiceInput}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
          onSelectTemplate={usePromptTemplate}
        />
      </div>
    </div>
  );
}
