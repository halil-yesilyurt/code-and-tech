"use client";
import { useState } from "react";

export default function ProjectImage({ src, alt }: { src?: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  if (!src || imgError) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-slate-100">
        <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setImgError(true)}
    />
  );
} 