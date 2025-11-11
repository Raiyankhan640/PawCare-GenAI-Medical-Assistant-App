import { useState, useCallback, useRef, useEffect } from 'react';

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const messagesEndRef = useRef(null);

  // Load messages from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chatbot_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    }
  }, []);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatbot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = useCallback((text, sender) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, 'user');
    setIsLoading(true);

    try {
      // Prepare request body
      const requestBody = {
        message: text
      };

      // Include image data if present
      if (currentImage) {
        requestBody.imageData = currentImage.data;
        requestBody.imageMimeType = currentImage.mimeType;
      }

      // Call our API route
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add bot response
      addMessage(data.response, 'bot');

      // Clear image after sending
      setCurrentImage(null);

    } catch (error) {
      console.error('Error sending message:', error);
      addMessage(
        'Sorry, I encountered an error. Please try again.',
        'bot'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, addMessage]);

  const handleImageUpload = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result.split(',')[1];
        setCurrentImage({
          data: base64String,
          mimeType: file.type,
          name: file.name,
          preview: e.target.result
        });
        resolve();
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = useCallback(() => {
    setCurrentImage(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    sessionStorage.removeItem('chatbot_messages');
  }, []);

  return {
    messages,
    isLoading,
    currentImage,
    messagesEndRef,
    sendMessage,
    handleImageUpload,
    removeImage,
    clearMessages
  };
}
