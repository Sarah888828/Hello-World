import { onRequestPost as onSignup } from "./functions/api/auth/signup.js";
import { onRequestPost as onLogin } from "./functions/api/auth/login.js";
import { onRequestGet as onInquiriesGet, onRequestPost as onInquiriesPost } from "./functions/api/inquiries.js";

const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://dapi.kakao.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://dapi.kakao.com https://dapi.kakao.com/v2/local https://map.kakao.com https://fonts.googleapis.com https://fonts.gstatic.com; frame-src 'self'; upgrade-insecure-requests",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(self), camera=(), microphone=()"
};

function secure(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export { LoginRateLimiter } from "./functions/lib/login-rate-limiter.js";

export default {
  async fetch(request, env, context) {
    return secure(await route(request, env, context));
  }
};

async function route(request, env, context) {
    const url = new URL(request.url);

    if (url.pathname === "/passes" || url.pathname.startsWith("/passes/")) {
      return new Response("페이지를 찾을 수 없습니다.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
      });
    }

    if (url.pathname === "/private-parking" || url.pathname.startsWith("/private-parking/")) {
      return new Response("페이지를 찾을 수 없습니다.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
      });
    }

    if (url.pathname === "/api/auth/signup") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "지원하지 않는 요청 방식입니다." }), {
          status: 405,
          headers: { "Content-Type": "application/json; charset=utf-8", Allow: "POST", "Cache-Control": "no-store" }
        });
      }
      return onSignup({ request, env, params: {}, data: {} });
    }

    if (url.pathname === "/api/auth/login") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "지원하지 않는 요청 방식입니다." }), {
          status: 405,
          headers: { "Content-Type": "application/json; charset=utf-8", Allow: "POST", "Cache-Control": "no-store" }
        });
      }
      const clientIp = request.headers.get("CF-Connecting-IP");
      if (!clientIp) {
        return new Response(JSON.stringify({ error: "로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }), {
          status: 503,
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
        });
      }

      const windowSeconds = 60;
      const limit = 30;
      const now = Math.floor(Date.now() / 1000);
      const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
      try {
        const ipDigest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clientIp));
        const ipHash = Array.from(new Uint8Array(ipDigest), (byte) => byte.toString(16).padStart(2, "0")).join("");
        const rate = await env.DB.prepare(`
          INSERT INTO login_rate_limits (ip_hash, window_start, request_count)
          VALUES (?, ?, 1)
          ON CONFLICT(ip_hash) DO UPDATE SET
            request_count = CASE
              WHEN login_rate_limits.window_start = excluded.window_start THEN login_rate_limits.request_count + 1
              ELSE 1
            END,
            window_start = excluded.window_start
          RETURNING request_count, window_start
        `).bind(ipHash, windowStart).first();

        if (rate.request_count > limit) {
          const retryAfter = Math.max(1, rate.window_start + windowSeconds - now);
          return new Response(JSON.stringify({ error: "로그인 요청이 많습니다. 잠시 후 다시 시도해 주세요." }), {
            status: 429,
            headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Retry-After": String(retryAfter), "X-Content-Type-Options": "nosniff" }
          });
        }

        // Opportunistically prune expired IP buckets without adding a second write on every request.
        if (rate.request_count === 1 && now % 60 < 2) {
          await env.DB.prepare("DELETE FROM login_rate_limits WHERE window_start < ?").bind(windowStart - windowSeconds).run();
        }
      } catch (error) {
        console.error("Login rate limit check failed:", error?.name || "Error", error?.message || "unknown");
        return new Response(JSON.stringify({ error: "로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }), {
          status: 503,
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
        });
      }

      return onLogin({ request, env, params: {}, data: {} });
    }

    if (url.pathname === "/api/inquiries") {
      if (request.method === "GET") return onInquiriesGet({ request, env, params: {}, data: {} });
      if (request.method === "POST") return onInquiriesPost({ request, env, params: {}, data: {} });
      return new Response(JSON.stringify({ error: "지원하지 않는 요청 방식입니다." }), {
        status: 405,
        headers: { "Content-Type": "application/json; charset=utf-8", Allow: "GET, POST", "Cache-Control": "no-store" }
      });
    }

    if (url.pathname === "/api/config" && request.method === "GET") {
      return new Response(JSON.stringify({ kakaoJavascriptKey: env.KAKAO_JAVASCRIPT_KEY || "" }), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      });
    }

    if (url.pathname === "/distance/distance.js") {
      return env.ASSETS.fetch(new Request(new URL("/distance/distance.js", url), request));
    }

    if (url.pathname === "/nav.js") {
      return env.ASSETS.fetch(new Request(new URL("/nav.js", url), request));
    }

    return env.ASSETS.fetch(request);
}