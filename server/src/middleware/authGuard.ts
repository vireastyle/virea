import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenRole } from "../lib/jwt";
import { AppError } from "./errorHandler";

// Verifies the Bearer token in the Authorization header.
// Attaches `req.user = { id, role }` on success.
// Pass an allowed role to restrict a route to users OR vendors only.
export function authGuard(allowedRole?: TokenRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError(401, "No token provided", "UNAUTHORIZED"));
    }

    const token = authHeader.slice(7);

    try {
      const payload = verifyAccessToken(token);

      if (allowedRole && payload.role !== allowedRole) {
        return next(
          new AppError(403, "Insufficient permissions", "FORBIDDEN")
        );
      }

      req.user = payload;
      next();
    } catch {
      next(new AppError(401, "Token expired or invalid", "TOKEN_INVALID"));
    }
  };
}

// Shorthand guards
export const userGuard   = authGuard("user");
export const vendorGuard = authGuard("vendor");
export const anyAuthGuard = authGuard();           // accepts both roles
