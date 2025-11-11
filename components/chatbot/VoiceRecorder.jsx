import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useEffect } from 'react';

export function VoiceRecorder({ onTranscript, disabled }) {
  const {
    isRecording,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
    resetTranscript
  } = useSpeechRecognition();

  // Send transcript to parent when recording stops
  useEffect(() => {
    if (!isRecording && transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [isRecording, transcript, onTranscript, resetTranscript]);

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={disabled}
        className={`relative ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'hover:bg-emerald-500/10'
        }`}
      >
        {isRecording ? (
          <>
            <MicOff className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>

      {/* Live transcript display */}
      {isRecording && transcript && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">Listening...</p>
          <p className="text-sm text-foreground">{transcript}</p>
        </div>
      )}
    </div>
  );
}
