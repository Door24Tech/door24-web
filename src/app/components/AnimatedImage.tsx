'use client';

import { useState } from "react";
import Image from "next/image";

interface AnimatedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function AnimatedImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  priority = false,
  sizes,
}: AnimatedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // When using fill, the parent container should handle positioning
  // The wrapper div should not interfere with the layout
  if (fill) {
    return (
      <>
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-[var(--door24-surface)] animate-pulse z-0" />
        )}
        
        {/* Image */}
        {!hasError && (
          <Image
            src={src}
            alt={alt}
            fill
            className={`transition-opacity duration-500 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${className}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            priority={priority}
            sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            unoptimized
          />
        )}
        
        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--door24-surface)] z-10">
            <span className="text-xs text-[var(--door24-muted)]">Image unavailable</span>
          </div>
        )}
      </>
    );
  }

  // For non-fill images, use a wrapper div
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--door24-surface)] animate-pulse" />
      )}
      
      {/* Image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          priority={priority}
          sizes={sizes}
          unoptimized
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--door24-surface)]">
          <span className="text-xs text-[var(--door24-muted)]">Image unavailable</span>
        </div>
      )}
    </div>
  );
}

