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
          fill={fill}
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

