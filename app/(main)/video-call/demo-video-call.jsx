"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
  MonitorUp,
  MessageSquare,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

export default function DemoVideoCall() {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();

  // Start camera on mount
  useEffect(() => {
    startCamera();
    
    // Simulate connection delay
    const timer = setTimeout(() => {
      setIsConnecting(false);
      toast.success("Connected to video call!");
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isConnecting) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    stopCamera();
    toast.success("Call ended");
    router.push("/appointments");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-white font-medium">
              {isConnecting ? "Connecting..." : `In Call • ${formatDuration(callDuration)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>PawCare Video Consultation</span>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="h-screen flex items-center justify-center p-4 pt-16 pb-24">
        <div className="relative w-full max-w-6xl h-full flex gap-4">
          
          {/* Main Video (Remote/Doctor) - Placeholder */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/30 to-gray-900 border border-emerald-500/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-emerald-900/50 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-emerald-400" />
                </div>
                <p className="text-white font-medium text-xl">Dr. Waiting to Join</p>
                <p className="text-emerald-400 text-sm mt-2">
                  {isConnecting ? "Connecting..." : "Ready for consultation"}
                </p>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              Veterinarian
            </div>
          </div>

          {/* Self Video (Your Camera) */}
          <div className="w-80 relative rounded-2xl overflow-hidden bg-gray-800 border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/10">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-2">
                    <VideoOff className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">Camera Off</p>
                </div>
              </div>
            )}
            
            {/* Your name tag */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
              You (Pet Owner)
            </div>
            
            {/* Audio indicator */}
            {!isAudioEnabled && (
              <div className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="container mx-auto">
          <div className="flex justify-center items-center gap-4">
            {/* Audio Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleAudio}
              className={`w-14 h-14 rounded-full ${
                isAudioEnabled 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            {/* Video Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full ${
                isVideoEnabled 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            {/* Screen Share (disabled for demo) */}
            <Button
              variant="ghost"
              size="lg"
              className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white opacity-50 cursor-not-allowed"
              disabled
            >
              <MonitorUp className="w-6 h-6" />
            </Button>

            {/* Chat (disabled for demo) */}
            <Button
              variant="ghost"
              size="lg"
              className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white opacity-50 cursor-not-allowed"
              disabled
            >
              <MessageSquare className="w-6 h-6" />
            </Button>

            {/* End Call */}
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="w-16 h-14 rounded-full bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            {/* Settings (disabled for demo) */}
            <Button
              variant="ghost"
              size="lg"
              className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white opacity-50 cursor-not-allowed"
              disabled
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
          
          <p className="text-center text-gray-400 text-sm mt-4">
            Video consultation powered by PawCare
          </p>
        </div>
      </div>
    </div>
  );
}
