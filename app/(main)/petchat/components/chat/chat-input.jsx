"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SendIcon, MicIcon, StopIcon, ImageIcon, CloseIcon } from "./icons";
import { PROMPT_TEMPLATES } from "./constants";

// Image preview component
function ImagePreview({ imagePreview, onRemove }) {
  return (
    <AnimatePresence>
      {imagePreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, height: 0 }}
          animate={{ opacity: 1, scale: 1, height: "auto" }}
          exit={{ opacity: 0, scale: 0.8, height: 0 }}
          className="mb-4 flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
        >
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-xl border-2 border-emerald-500/50 shadow-lg"
          />
          <div className="flex-1">
            <p className="text-emerald-400 font-semibold text-sm">Image attached</p>
            <p className="text-gray-500 text-xs">Ready for analysis</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <CloseIcon />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick prompt templates
function PromptTemplates({ onSelectTemplate }) {
  return (
    <motion.div 
      className="mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <p className="text-xs text-emerald-400 font-medium mb-3 flex items-center gap-2">
        <span>💡</span>
        Quick prompts to get started
      </p>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10">
        {PROMPT_TEMPLATES.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTemplate(template.prompt)}
              className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${template.bgColor} ${template.borderColor} text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group`}
            >
              <div className={`p-2 rounded-lg bg-linear-to-r ${template.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon />
              </div>
              <span>{template.title}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// Main chat input component
export function ChatInput({
  input,
  isTyping,
  isRecording,
  imagePreview,
  textareaRef,
  fileInputRef,
  onInputChange,
  onKeyDown,
  onSend,
  onToggleVoice,
  onImageUpload,
  onRemoveImage,
  onSelectTemplate,
}) {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="shrink-0 border-t border-white/10 bg-linear-to-t from-white/10 to-transparent backdrop-blur-xl"
    >
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Image Preview */}
        <ImagePreview imagePreview={imagePreview} onRemove={onRemoveImage} />

        {/* Input Container */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-2xl">
          {/* Input Row */}
          <div className="flex gap-3 items-end">
            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: isRecording ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleVoice}
                disabled={isTyping}
                className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all border ${
                  isRecording 
                    ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-lg shadow-red-500/20" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                } disabled:opacity-50`}
              >
                {isRecording ? <StopIcon /> : <MicIcon />}
              </motion.button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isTyping}
                className="h-14 w-14 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 flex items-center justify-center transition-all disabled:opacity-50"
              >
                <ImageIcon />
              </motion.button>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <motion.textarea
                ref={textareaRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                placeholder={isRecording ? "🎤 Listening... Speak now" : "Describe your pet's symptoms, ask about medications, or upload an image..."}
                disabled={isTyping}
                rows={1}
                className="w-full resize-none rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 text-[15px] text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 focus:shadow-2xl focus:shadow-emerald-500/20 disabled:opacity-50 transition-all duration-300 leading-relaxed overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                style={{ 
                  minHeight: "56px", 
                  maxHeight: "160px",
                }}
              />
              {/* Focus Effect */}
              <motion.div 
                className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 pointer-events-none"
                animate={{ opacity: input ? 0.1 : 0 }}
              />
            </div>

            {/* Send Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onSend}
                disabled={(!input.trim() && !imagePreview) || isTyping}
                className="h-14 px-6 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:shadow-none flex items-center gap-3"
              >
                <SendIcon />
                <span>Send</span>
              </Button>
            </motion.div>
          </div>

          {/* Prompt Templates */}
          <PromptTemplates onSelectTemplate={onSelectTemplate} />
        </div>

        {/* Disclaimer */}
        <motion.p 
          className="text-xs text-gray-600 mt-4 text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span>⚠️</span>
          PawCare AI provides general guidance only. Always consult a licensed veterinarian for diagnosis and treatment.
        </motion.p>
      </div>
    </motion.div>
  );
}
