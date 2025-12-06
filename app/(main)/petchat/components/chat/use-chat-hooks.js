"use client";

import { useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Custom hook for speech recognition
export function useSpeechRecognition(setInput) {
  const recognitionRef = useRef(null);

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
          toast.error('Voice input error: ' + event.error);
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
  }, [setInput]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Voice input is not supported in your browser");
      return false;
    }
    try {
      recognitionRef.current.start();
      toast.success("Listening... Speak now");
      return true;
    } catch (e) {
      console.error('Error starting recognition:', e);
      toast.error("Could not start voice input");
      return false;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        toast.success("Voice input stopped");
        return true;
      } catch (e) {
        console.error('Error stopping recognition:', e);
        return false;
      }
    }
    return false;
  }, []);

  return { startRecording, stopRecording, recognitionRef };
}

// Custom hook for image upload handling
export function useImageUpload() {
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((e, setCurrentImage, setImagePreview) => {
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
  }, []);

  const removeImage = useCallback((setCurrentImage, setImagePreview) => {
    setCurrentImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return { fileInputRef, handleImageUpload, removeImage };
}

// Custom hook for textarea auto-resize
export function useTextareaAutoResize() {
  const textareaRef = useRef(null);

  const handleTextareaChange = useCallback((e, setInput) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 56), 160);
    textarea.style.height = newHeight + "px";
  }, []);

  const resetTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, []);

  return { textareaRef, handleTextareaChange, resetTextarea };
}
