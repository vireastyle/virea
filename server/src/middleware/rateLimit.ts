import rateLimit from "express-rate-limit";

// ─── General API limiter ───────────────────────────────────
// 200 requests per 15 minutes per IP — applied globally
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later.",
    },
  },
});

// ─── Auth limiter ─────────────────────────────────────────
// 10 attempts per 15 minutes — applied to login/register routes
// Mitigates brute-force attacks on credentials
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "AUTH_RATE_LIMIT",
      message: "Too many auth attempts, please try again in 15 minutes.",
    },
  },
});
