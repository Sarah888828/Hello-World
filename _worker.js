import { onRequestPost as onSignup } from "./functions/api/auth/signup.js";
import { onRequestPost as onLogin } from "./functions/api/auth/login.js";
import { onRequestGet as onInquiriesGet, onRequestPost as onInquiriesPost } from "./functions/api/inquiries.js";
export { LoginRateLimiter } from "./functions/lib/login-rate-limiter.js";

export default {
  async fetch(request, env, context) {
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
      if (!clientIp || !env.LOGIN_RATE_LIMITER) {
        return new Response(JSON.stringify({ error: "로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }), {
          status: 503,
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
        });
      }

      if (!env.LOGIN_RATE_LIMITER_TOKEN) {
        return new Response(JSON.stringify({ error: "로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }), {
          status: 503,
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
        });
      }

      const limitResponse = await fetch("https://cheonan-login-rate-limiter.horizontal486.workers.dev/check", {
        method: "POST",
        headers: {
          "CF-Connecting-IP": clientIp,
          Authorization: `Bearer ${env.LOGIN_RATE_LIMITER_TOKEN}`
        }
      });
      if (!limitResponse.ok) {
        return new Response(JSON.stringify({ error: "로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }), {
          status: 503,
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
        });
      }
      const limit = await limitResponse.json();
      if (!limit.allowed) {
        return new Response(JSON.stringify({ error: "로그인 요청이 많습니다. 잠시 후 다시 시도해 주세요." }), {
          status: 429,
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Retry-After": String(limit.retryAfter), "X-Content-Type-Options": "nosniff" }
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
};