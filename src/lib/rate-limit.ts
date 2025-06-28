// Simple in-memory rate limiting for development
// For production, consider using Redis or a database

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (entry.count >= limit) {
    return false; // Rate limit exceeded
  }

  // Increment count
  entry.count++;
  return true;
}

export function getRateLimitInfo(identifier: string): { remaining: number; resetTime: number } | null {
  const entry = rateLimitStore.get(identifier);
  if (!entry) return null;

  const now = Date.now();
  if (now > entry.resetTime) {
    rateLimitStore.delete(identifier);
    return null;
  }

  return {
    remaining: Math.max(0, 5 - entry.count), // Assuming limit of 5
    resetTime: entry.resetTime,
  };
} 