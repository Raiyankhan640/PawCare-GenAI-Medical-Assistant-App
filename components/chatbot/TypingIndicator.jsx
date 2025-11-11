export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl w-fit">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  );
}
