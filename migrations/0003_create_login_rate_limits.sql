CREATE TABLE IF NOT EXISTS login_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count >= 0)
);