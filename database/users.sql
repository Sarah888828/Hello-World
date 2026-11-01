-- 회원가입 화면용 SQLite 스키마 초안입니다 (회원가입 페이지는 현재 백엔드와 연결되지 않음).
-- 서버/DB에 자동 적용되지 않습니다. 적용 전 개인정보 처리·보안 정책을 검토하세요.
-- 비밀번호 원문은 저장하지 말고, 서버에서 Argon2id 또는 bcrypt로 해시한 값을 넣으세요.

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

-- 탈퇴(soft delete)한 계정의 이메일은 이후 재가입에 사용할 수 있습니다.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_active
  ON users(email COLLATE NOCASE)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nickname_active
  ON users(nickname COLLATE NOCASE)
  WHERE deleted_at IS NULL;