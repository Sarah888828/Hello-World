export { LoginRateLimiter } from "../../functions/lib/login-rate-limiter.js";

export default {
  async fetch(request, env) {
    if (request.headers.get("Authorization") !== `Bearer ${env.RATE_LIMITER_TOKEN}`) {
      return new Response("Not found", { status: 404 });
    }
    const ip = request.headers.get("CF-Connecting-IP");
    if (!ip) return new Response("Missing client address", { status: 400 });
    const id = env.LOGIN_RATE_LIMITER.idFromName(ip);
    return env.LOGIN_RATE_LIMITER.get(id).fetch("https://login-rate-limiter/check", { method: "POST" });
  }
};