import { onRequestPost as onSignup } from "./functions/api/auth/signup.js";
import { onRequestPost as onLogin } from "./functions/api/auth/login.js";
import { onRequestGet as onInquiriesGet, onRequestPost as onInquiriesPost } from "./functions/api/inquiries.js";

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

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

    return env.ASSETS.fetch(request);
  }
};