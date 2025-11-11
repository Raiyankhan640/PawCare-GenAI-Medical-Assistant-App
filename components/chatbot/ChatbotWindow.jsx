import { useState } from 'react';
import { Send, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { VoiceRecorder } from './VoiceRecorder';
import { ImageUpload } from './ImageUpload';
import { useChatbot } from '@/hooks/useChatbot';

export function ChatbotWindow({ onClose }) {
  const [inputValue, setInputValue] = useState('');
  const {
    messages,
    isLoading,
    currentImage,
    messagesEndRef,
    sendMessage,
    handleImageUpload,
    removeImage,
    clearMessages
  } = useChatbot();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleVoiceTranscript = (transcript) => {
    setInputValue(transcript);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear all messages?')) {
      clearMessages();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-xl">🐾</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">PawCare AI Assistant</h3>
            <p className="text-xs text-white/80">Veterinary support chatbot</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearChat}
              className="text-white hover:bg-white/20"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🐾</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Welcome to PawCare AI!</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                I'm here to help with veterinary questions about cattle, pets, and farm animals.
                Ask me anything or upload an image for analysis!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-muted/30">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
          {/* Image Upload */}
          <ImageUpload
            currentImage={currentImage}
            onImageUpload={handleImageUpload}
            onImageRemove={removeImage}
            disabled={isLoading}
          />

          {/* Voice Recorder */}
          <VoiceRecorder
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
          />

          {/* Text Input */}
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="resize-none bg-background"
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>

        {currentImage && (
          <p className="text-xs text-muted-foreground mt-2 pl-24">
            Image attached: {currentImage.name}
          </p>
        )}
      </div>
    </div>
  );
}
