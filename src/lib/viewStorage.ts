'use server';

// Switch storage from local JSON file to Vercel KV which is persistent across serverless invocations.
import { kv } from '@vercel/kv';

// ---------------------------------------------------------------------------
// Graceful fallback for local development when KV credentials are not present
// ---------------------------------------------------------------------------
// In dev the KV env-vars might not be configured.  Instead of crashing the
// whole app we fall back to an in-memory store (non-persistent, fine for dev).

const kvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Very small in-memory implementation mimicking the subset of KV we use
const memoryStore = new Map<string, number>();

const kvLike = {
  incr: async (key: string): Promise<number> => {
    const next = (memoryStore.get(key) ?? 0) + 1;
    memoryStore.set(key, next);
    return next;
  },
  get: async <T = any>(key: string): Promise<T | null> => {
    return (memoryStore.get(key) as unknown as T) ?? null;
  },
  keys: async (pattern: string): Promise<string[]> => {
    // Only supports prefix patterns like 'post:*:views'
    const prefix = pattern.replace('*', '');
    return [...memoryStore.keys()].filter((k) => k.startsWith(prefix));
  },
};

// Use the real KV client when configured, otherwise the memory fallback
const store = kvConfigured ? kv : kvLike;

// Keys helpers -------------------------------------------------------------
const postViewsKey = (postId: number) => `post:${postId}:views`;
const TOTAL_VIEWS_KEY = 'total:views';

// Increment view count for a post and update the global counter
export async function incrementViewCount(postId: number): Promise<number> {
  const newCount = (await store.incr(postViewsKey(postId))) as number;
  // Also keep a running total of all views
  await store.incr(TOTAL_VIEWS_KEY);
  return newCount;
}

// Get individual post view count
export async function getViewCount(postId: number): Promise<number> {
  const count = (await store.get<number>(postViewsKey(postId))) ?? 0;
  return count;
}

// Get view counts for every post
export async function getAllViewCounts(): Promise<Record<number, number>> {
  const result: Record<number, number> = {};
  const keys = await store.keys('post:*:views');
  if (!keys) return result;

  // Fetch counts for each key (could be done with mget when SDK supports typed arrays)
  await Promise.all(
    keys.map(async (k: string) => {
      const count = (await store.get<number>(k)) ?? 0;
      const id = Number(k.split(':')[1]);
      if (!Number.isNaN(id)) result[id] = count;
    })
  );
  return result;
}

// Get total views across all posts
export async function getTotalViews(): Promise<number> {
  return (await store.get<number>(TOTAL_VIEWS_KEY)) ?? 0;
} 