import { NextRequest } from "next/server";
import { verifyAccessToken, TokenPayload, TokenRole } from "./jwt";
import { AppError } from "./api-error";

/**
 * Extracts and verifies the Bearer token from an incoming NextRequest.
 * Throws AppError (401/403) on failure — caught by handleError() in route handlers.
 *
 * @param req  The incoming NextRequest
 * @param role If provided, enforces that the token belongs to that role ("user" | "vendor")
 */
export function getAuth(req: NextRequest, role?: TokenRole): TokenPayload {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "No token provided", "UNAUTHORIZED");
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (role && payload.role !== role) {
      throw new AppError(403, "Insufficient permissions", "FORBIDDEN");
    }

    return payload;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(401, "Token expired or invalid", "TOKEN_INVALID");
  }
}
