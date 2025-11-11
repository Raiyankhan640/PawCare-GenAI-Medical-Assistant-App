'use client';

import { useState, useEffect } from 'react';
import { ChatbotButton } from './ChatbotButton';
import { ChatbotWindow } from './ChatbotWindow';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Handle escape key to close chatbot
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when chatbot is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton onClick={() => setIsOpen(true)} isOpen={isOpen} />
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] md:w-[400px] h-[600px] max-h-[calc(100vh-3rem)] animate-in slide-in-from-bottom-4 duration-300">
            <ChatbotWindow onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
