"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BotIcon, UserIcon, CopyIcon, CheckIcon } from "./icons";

// Typing indicator component
export function TypingIndicator() {
  return (
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
}

// Format message content with bold text support
function formatMessage(content) {
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
}

// Single message bubble component
function MessageBubble({ message, isClient, copiedId, onCopy }) {
  return (
    <motion.div
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
      {/* Avatar */}
      <motion.div 
        className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center shadow-2xl ${
          message.role === "assistant" 
            ? "bg-linear-to-br from-emerald-400 to-teal-500 shadow-emerald-500/40" 
            : "bg-linear-to-br from-blue-400 to-indigo-500 shadow-blue-500/40"
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {message.role === "assistant" ? 
          <BotIcon size={22} /> : 
          <UserIcon />
        }
      </motion.div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "flex flex-col items-end" : ""}`}>
        <motion.div 
          className={`rounded-3xl p-6 backdrop-blur-sm border ${
            message.role === "assistant" 
              ? message.isError 
                ? "bg-red-500/10 border-red-500/30 text-red-200" 
                : "bg-white/5 border-white/10 text-gray-100 shadow-2xl shadow-emerald-500/10"
              : "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/30"
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
                className="max-w-60 max-h-60 rounded-2xl border-2 border-white/20 shadow-lg"
              />
            </motion.div>
          )}
          <div className="text-[15.5px] leading-relaxed whitespace-pre-wrap">
            {formatMessage(message.content)}
          </div>
        </motion.div>
        
        {/* Copy Action */}
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
              onClick={() => onCopy(message.content, message.id)}
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
  );
}

// Messages list component
export function MessagesList({ messages, isTyping, isClient, copiedId, onCopy, messagesEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isClient={isClient}
              copiedId={copiedId}
              onCopy={onCopy}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4 items-start"
            >
              <div className="shrink-0 h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
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
  );
}
