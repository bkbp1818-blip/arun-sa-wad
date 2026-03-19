"use client";

import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No Image
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
        <img
          src={images[0]}
          alt={alt}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
        <img
          src={images[selectedIndex]}
          alt={`${alt} - รูปที่ ${selectedIndex + 1}`}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((src, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
              index === selectedIndex
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground/30"
            }`}
          >
            <img
              src={src}
              alt={`${alt} - thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
