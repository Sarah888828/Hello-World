import authSignup from "./functions/api/auth/signup.js";
import inquiries from "./functions/api/inquiries.js";

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
      return authSignup.onRequestPost({ request, env, params: {}, data: {} });
    }

    if (url.pathname === "/api/inquiries") {
      if (request.method === "GET") return inquiries.onRequestGet({ request, env, params: {}, data: {} });
      if (request.method === "POST") return inquiries.onRequestPost({ request, env, params: {}, data: {} });
      return new Response(JSON.stringify({ error: "지원하지 않는 요청 방식입니다." }), {
        status: 405,
        headers: { "Content-Type": "application/json; charset=utf-8", Allow: "GET, POST", "Cache-Control": "no-store" }
      });
    }

    return env.ASSETS.fetch(request);
  }
};