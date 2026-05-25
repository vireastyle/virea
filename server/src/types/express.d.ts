import { TokenPayload } from "../lib/jwt";

// Extend Express Request to carry the authenticated principal.
// Set by authGuard middleware after token verification.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
