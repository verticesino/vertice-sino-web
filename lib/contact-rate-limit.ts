// Per-isolate best-effort protection. No durable/global rate-limit guarantee.
export function createContactRateLimiter(windowMs = 600_000, limit = 5, capacity = 10_000) {
  const entries = new Map<string, { count: number; expires: number }>();
  return {
    check(ip: string, now = Date.now()) {
      for (const [key, entry] of entries) {
        if (entry.expires <= now) entries.delete(key);
      }
      const entry = entries.get(ip);
      if (entry) {
        if (entry.count >= limit) return Math.ceil((entry.expires - now) / 1000);
        entry.count++;
      } else {
        // Do not evict active clients, which would allow a capacity-based bypass.
        if (entries.size >= capacity) return Math.ceil(windowMs / 1000);
        entries.set(ip, { count: 1, expires: now + windowMs });
      }
      return 0;
    },
    get size() { return entries.size; },
  };
}
