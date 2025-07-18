declare module '@vercel/kv' {
  export const kv: {
    incr: (key: string) => Promise<number>;
    get: <T = any>(key: string) => Promise<T | null>;
    keys: (pattern: string) => Promise<string[]>;
  };
} 