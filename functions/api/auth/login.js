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

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function verifyPassword(password, storedHash) {
  const [algorithm, iterationValue, saltValue, expectedValue] = storedHash.split("$");
  const iterations = Number(iterationValue);
  if (algorithm !== "pbkdf2-sha256" || !Number.isInteger(iterations) || iterations < 10_000 || iterations > ITERATIONS) return false;

  const salt = decodeBase64Url(saltValue);
  const expected = decodeBase64Url(expectedValue);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, expected.length * 8));
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
  return difference === 0;
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 8_000) return json({ error: "요청 내용이 너무 큽니다." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "요청 형식을 확인해 주세요." }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || email.length > 254 || !password || password.length > 128) {
    return json({ error: "이메일과 비밀번호를 확인해 주세요." }, 400);
  }

  try {
    const user = await env.DB.prepare(`
      SELECT id, nickname, email, gender, password_hash
      FROM users WHERE email = ? COLLATE NOCASE AND deleted_at IS NULL
    `).bind(email).first();

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, 401);
    }

    return json({ user: { id: user.id, nickname: user.nickname, email: user.email, gender: user.gender } });
  } catch (error) {
    console.error("Login failed:", error);
    return json({ error: "로그인을 처리하지 못했습니다." }, 500);
  }
}