"use client";

import { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function ImageUpload({ onImageSelect, onImageRemove, disabled }) {
  const { user: clerkUser } = useUser();
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create preview and get base64 data
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setPreview(base64Data);
      setFileName(file.name);

      // Upload to server
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Pass clerkUserId as query param for auth fallback
        const uploadUrl = clerkUser?.id 
          ? `/api/petchat/upload?clerkUserId=${clerkUser.id}`
          : '/api/petchat/upload';
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          // Pass both server URL and base64 data
          onImageSelect(data.url, base64Data);
          toast.success('Image uploaded successfully');
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        toast.error('Failed to upload image');
        console.error('Upload error:', error);
        handleRemove();
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
    onImageRemove();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {!preview ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          className="rounded-full bg-emerald-900/20 hover:bg-emerald-900/30"
          title="Upload image"
        >
          <ImagePlus className="h-5 w-5 text-emerald-400" />
        </Button>
      ) : (
        <div className="relative inline-block">
          <div className="relative">
            <Image
              src={preview}
              alt={fileName || "Preview"}
              width={80}
              height={80}
              className="rounded-lg object-cover border-2 border-emerald-500/30"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            disabled={isUploading}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            title="Remove image"
          >
            <X className="h-3 w-3" />
          </Button>
          {fileName && (
            <p className="text-xs text-muted-foreground mt-1 max-w-[80px] truncate">
              {fileName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
