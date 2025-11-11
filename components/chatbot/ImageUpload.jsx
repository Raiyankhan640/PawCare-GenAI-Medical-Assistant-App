import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageUpload({ currentImage, onImageUpload, onImageRemove, disabled }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      await onImageUpload(file);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled}
      />

      {/* Image preview or upload button */}
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage.preview}
            alt="Upload preview"
            className="w-12 h-12 object-cover rounded-lg border-2 border-emerald-500"
          />
          <button
            onClick={onImageRemove}
            disabled={disabled}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            <X className="w-3 h-3" />
          </button>
          <span className="absolute -bottom-6 left-0 text-xs text-muted-foreground truncate max-w-[100px]">
            {currentImage.name}
          </span>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="hover:bg-emerald-500/10"
        >
          <ImagePlus className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
