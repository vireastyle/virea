import jwt from "jsonwebtoken";

export type TokenRole = "user" | "vendor";

export interface TokenPayload {
  id:   string;
  role: TokenRole;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, requireEnv("JWT_SECRET"), {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]) ?? "15m",
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, requireEnv("JWT_SECRET")) as TokenPayload;
}

export function signRefreshToken(payload: TokenPayload): string {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS ?? "7", 10);
  return jwt.sign(payload, requireEnv("JWT_REFRESH_SECRET"), {
    expiresIn: `${days}d`,
  });
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, requireEnv("JWT_REFRESH_SECRET")) as TokenPayload;
}

export function refreshCookieOptions() {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS ?? "7", 10);
  return {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === "production",
    sameSite:  "strict" as const,
    maxAge:    days * 24 * 60 * 60, // seconds (Next.js cookies API)
    path:      "/api/v1/auth",
  };
}
