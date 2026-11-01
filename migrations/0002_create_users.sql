CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL
    CHECK (length(trim(nickname)) BETWEEN 2 AND 24),
  email TEXT NOT NULL COLLATE NOCASE
    CHECK (length(trim(email)) BETWEEN 3 AND 254),
  password_hash TEXT NOT NULL,
  gender TEXT NOT NULL
    CHECK (gender IN ('female', 'male')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT DEFAULT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_active
  ON users(email COLLATE NOCASE)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nickname_active
  ON users(nickname COLLATE NOCASE)
  WHERE deleted_at IS NULL;