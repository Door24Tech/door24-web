'use client';

import { useState, useRef, useEffect } from "react";
import { uploadImage } from "@/lib/storage";
import { storage } from "@/lib/firebase";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onUploadComplete, currentImage, label = "Featured Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImage changes
  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file (PNG, JPG, GIF, etc.)';
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'Image must be less than 5MB';
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    // Check if storage is initialized
    if (!storage) {
      const errorMsg = 'Firebase Storage is not configured. Please check your environment variables.';
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      const timestamp = Date.now();
      // Sanitize filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${timestamp}-${sanitizedName}`;
      
      console.log("Starting upload:", filename);
      const url = await uploadImage(file, filename);
      console.log("Upload complete:", url);
      
      onUploadComplete(url);
      setError(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMsg = error.message || 'Failed to upload image. Please try again.';
      setError(errorMsg);
      alert(`Error uploading image: ${errorMsg}`);
      // Reset preview on error
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {error && (
        <div className="rounded-lg border border-[var(--door24-error)]/50 bg-[var(--door24-error)]/10 p-3 text-sm text-[var(--door24-error)]">
          {error}
        </div>
      )}
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-[var(--door24-border)]"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="text-white text-sm font-medium">Uploading...</div>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 rounded-full bg-[var(--door24-error)]/90 text-white p-2 hover:bg-[var(--door24-error)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            uploading 
              ? 'border-[var(--door24-border)] cursor-wait opacity-50' 
              : 'border-[var(--door24-border-hover)] cursor-pointer hover:border-[var(--door24-primary-end)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="mx-auto h-12 w-12 border-4 border-[var(--door24-primary-end)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[var(--door24-muted)]">Uploading...</p>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-[var(--door24-muted)]"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-[var(--door24-muted)]">
                Click to upload an image
              </p>
              <p className="text-xs text-[var(--door24-muted)] mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

