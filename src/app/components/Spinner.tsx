'use client';

export default function Spinner({ size = 8 }: { size?: number }) {
  const dimension = `${size}rem`;
  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
      aria-label="Loading"
    />
  );
} 