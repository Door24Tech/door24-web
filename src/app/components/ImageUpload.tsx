'use client';

import { useState, useRef, useEffect } from "react";
import { uploadImage, cancelUpload } from "@/lib/storage";
import { storage } from "@/lib/firebase";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onUploadComplete, currentImage, label = "Featured Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAbortControllerRef = useRef<AbortController | null>(null);

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

    // Create abort controller for cancellation
    uploadAbortControllerRef.current = new AbortController();
    const abortSignal = uploadAbortControllerRef.current.signal;

    try {
      // Create preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!abortSignal.aborted) {
          setPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage with timeout
      const timestamp = Date.now();
      // Sanitize filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${timestamp}-${sanitizedName}`;
      
      console.log("Starting upload:", filename, "File size:", file.size, "bytes");
      
      // Reset progress
      setUploadProgress(0);
      console.log("ImageUpload: Starting upload, progress reset to 0%");
      
      // Add timeout to prevent hanging (reduced to 30s for faster error detection)
      const uploadPromise = uploadImage(file, filename, (progress) => {
        console.log("ImageUpload: Progress callback received:", progress);
        if (!abortSignal.aborted) {
          console.log("ImageUpload: Setting uploadProgress state to:", progress);
          setUploadProgress(progress);
        } else {
          console.log("ImageUpload: Upload was aborted, ignoring progress update");
        }
      });
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Upload timeout: The upload took too long. This usually means Firebase Storage is not enabled.\n\nPlease:\n1. Go to Firebase Console → Storage\n2. Click 'Get Started' to enable Storage\n3. Deploy storage rules: firebase deploy --only storage:rules"));
        }, 30000);
        
        // Clear timeout if aborted
        abortSignal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new Error("Upload cancelled"));
        });
      });
      
      const url = await Promise.race([uploadPromise, timeoutPromise]) as string;
      
      if (abortSignal.aborted) {
        return; // Don't update state if cancelled
      }
      
      console.log("Upload complete:", url);
      
      onUploadComplete(url);
      setError(null);
    } catch (error: any) {
      if (abortSignal.aborted || error.message?.includes('cancelled') || error.message?.includes('canceled')) {
        // Upload was cancelled, don't show error
        console.log("Upload cancelled by user");
        setPreview(currentImage || null);
        setUploading(false);
        setUploadProgress(0);
        uploadAbortControllerRef.current = null;
        return;
      }
      
      console.error("Upload error:", error);
      const errorMsg = error.message || 'Failed to upload image. Please try again.';
      setError(errorMsg);
      
      // Show error in UI and alert
      alert(`Error uploading image: ${errorMsg}\n\nPlease check:\n1. You are logged in\n2. Firebase Storage rules allow uploads\n3. Your internet connection is stable`);
      
      // Reset preview on error
      setPreview(currentImage || null);
      setUploadProgress(0);
    } finally {
      if (!abortSignal.aborted) {
        setUploading(false);
        // Don't reset progress if upload completed successfully
        if (uploadProgress < 100) {
          setUploadProgress(0);
        }
      }
      uploadAbortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    // Cancel Firebase upload
    cancelUpload();
    
    // Cancel timeout if exists
    if (uploadAbortControllerRef.current) {
      uploadAbortControllerRef.current.abort();
      uploadAbortControllerRef.current = null;
    }
    
    setUploading(false);
    setUploadProgress(0);
    setError(null);
    setPreview(currentImage || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      {label && <label className="block text-sm font-medium">{label}</label>}
      {error && (
        <div className="rounded-lg border border-[var(--door24-error)]/50 bg-[var(--door24-error)]/10 p-3 text-sm text-[var(--door24-error)]">
          {error}
        </div>
      )}
      {preview ? (
        <div className="relative">
          <div className="relative w-full max-w-xs aspect-square overflow-hidden rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)]">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl gap-4">
                {/* Circular Progress Ring */}
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="var(--door24-primary-end)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="282.74"
                      strokeDashoffset={282.74 * (1 - uploadProgress / 100)}
                      className="transition-all duration-100 ease-out"
                    />
                  </svg>
                  {/* Percentage text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>
                <div className="text-white text-sm font-medium">Uploading...</div>
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="rounded-lg bg-[var(--door24-error)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--door24-error)]/90 transition"
                >
                  Cancel Upload
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={uploading ? handleCancelUpload : handleRemove}
              className="absolute top-2 right-2 rounded-full bg-[var(--door24-error)]/90 text-white p-2 hover:bg-[var(--door24-error)] transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
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
            <div className="space-y-4">
              {/* Circular Progress Ring */}
              <div className="relative mx-auto w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.2)"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--door24-primary-end)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="282.74"
                    strokeDashoffset={282.74 * (1 - uploadProgress / 100)}
                    className="transition-all duration-100 ease-out"
                  />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--door24-primary-end)] text-lg font-semibold">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
              </div>
              <p className="text-[var(--door24-muted)]">Uploading...</p>
              <button
                type="button"
                onClick={handleCancelUpload}
                className="mx-auto rounded-lg bg-[var(--door24-error)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--door24-error)]/90 transition"
              >
                Cancel
              </button>
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

