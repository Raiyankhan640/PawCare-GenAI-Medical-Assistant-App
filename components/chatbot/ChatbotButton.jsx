import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatbotButton({ onClick, isOpen }) {
  return (
    <Button
      onClick={onClick}
      className={`w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 transition-all duration-300 ${
        isOpen ? 'scale-0' : 'scale-100'
      }`}
      aria-label="Open chatbot"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}
