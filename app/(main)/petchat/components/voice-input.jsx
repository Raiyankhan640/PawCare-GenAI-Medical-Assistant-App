"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function VoiceInput({ onTranscript, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        // Auto-restart if still recording
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
          setIsRecording(false);
        }
      }
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [onTranscript, isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
      }
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  // Hide button if not supported
  if (!isSupported) return null;

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleRecording}
        disabled={disabled}
        className={`rounded-full transition-all ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-emerald-900/20 hover:bg-emerald-900/30'
        }`}
        title={isRecording ? "Stop recording" : "Start voice input"}
      >
        {isRecording ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5 text-emerald-400" />
        )}
      </Button>
    </motion.div>
  );
}
