const encoder = new TextEncoder();
// Cloudflare Workers Web Crypto currently supports at most 100,000 PBKDF2 iterations.
const ITERATIONS = 100_000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256);
  return `pbkdf2-sha256$${ITERATIONS}$${bytesToBase64Url(salt)}$${bytesToBase64Url(new Uint8Array(derived))}`;
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 12_000) return json({ error: "요청 내용이 너무 큽니다." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "요청 형식을 확인해 주세요." }, 400);
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "요청 본문은 JSON 객체여야 합니다." }, 400);
  }

  const nickname = clean(body.nickname);
  const email = clean(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const gender = clean(body.gender);
  const termsAccepted = body.terms === true;

  if (nickname.length < 2 || nickname.length > 24) return json({ error: "닉네임은 2~24자로 입력해 주세요." }, 400);
  if (email.length < 3 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "올바른 이메일 주소를 입력해 주세요." }, 400);
  }
  if (password.length < 8 || password.length > 128) return json({ error: "비밀번호는 8~128자로 입력해 주세요." }, 400);
  if (!["female", "male"].includes(gender)) return json({ error: "성별을 선택해 주세요." }, 400);
  if (!termsAccepted) return json({ error: "이용약관 및 개인정보 안내에 동의해 주세요." }, 400);

  try {
    const passwordHash = await hashPassword(password);
    const result = await env.DB.prepare(`
      INSERT INTO users (nickname, email, password_hash, gender)
      VALUES (?, ?, ?, ?)
    `).bind(nickname, email, passwordHash, gender).run();

    const user = await env.DB.prepare(`
      SELECT id, nickname, email, gender, created_at AS createdAt
      FROM users WHERE id = ? AND deleted_at IS NULL
    `).bind(result.meta.last_row_id).first();

    return json({ user }, 201);
  } catch (error) {
    console.error("Signup failed:", error);
    const message = String(error?.message || "");
    if (/unique|constraint/i.test(message)) {
      return json({ error: "이미 사용 중인 이메일 또는 닉네임입니다." }, 409);
    }
    return json({ error: "회원가입을 처리하지 못했습니다." }, 500);
  }
}