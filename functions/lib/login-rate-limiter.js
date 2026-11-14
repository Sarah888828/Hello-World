const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

/**
 * One Durable Object instance is selected per client IP. The read/count/write
 * sequence is serialized by the Durable Object, providing a strict per-key
 * fixed-window limiter instead of a best-effort regional binding.
 */
export class LoginRateLimiter {
  constructor(ctx) {
    this.ctx = ctx;
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS login_rate_limit (
        window_start INTEGER PRIMARY KEY,
        request_count INTEGER NOT NULL
      )
    `);
  }

  async fetch() {
    const now = Date.now();
    const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;

    const previousWindow = windowStart - WINDOW_MS;
    this.sql.exec("DELETE FROM login_rate_limit WHERE window_start < ?", previousWindow);

    const row = this.sql.exec(
      "SELECT request_count FROM login_rate_limit WHERE window_start = ?",
      windowStart
    ).one();
    const count = row?.request_count ?? 0;

    if (count >= MAX_REQUESTS) {
      const retryAfter = Math.max(1, Math.ceil((windowStart + WINDOW_MS - now) / 1000));
      return Response.json({ allowed: false, retryAfter }, { status: 429 });
    }

    this.sql.exec(`
      INSERT INTO login_rate_limit (window_start, request_count)
      VALUES (?, 1)
      ON CONFLICT(window_start) DO UPDATE SET request_count = request_count + 1
    `, windowStart);

    return Response.json({ allowed: true, remaining: MAX_REQUESTS - count - 1 });
  }
}