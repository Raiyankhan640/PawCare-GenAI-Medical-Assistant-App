"use client";

import { motion } from "framer-motion";
import { PawIcon, CloseIcon } from "./icons";

export function ChatHeader({ onClearChat }) {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="shrink-0 border-b border-white/10 bg-linear-to-r from-white/5 to-white/10 backdrop-blur-xl px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg animate-pulse" />
            <div className="relative h-12 w-12 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
              <PawIcon size={26} />
            </div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              PawCare AI
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <motion.span 
                className="h-2 w-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-emerald-300 font-medium">Online • Ready to help</span>
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearChat}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2"
        >
          <CloseIcon />
          <span className="font-medium">Clear Chat</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
