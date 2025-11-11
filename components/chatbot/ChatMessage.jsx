import { Bot, User } from 'lucide-react';

export function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot
          ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
          : 'bg-gradient-to-br from-purple-500 to-pink-500'
      }`}>
        {isBot ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isBot
            ? 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-tl-none'
            : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-tr-none'
        }`}>
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        <span className="text-xs text-muted-foreground px-2">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
