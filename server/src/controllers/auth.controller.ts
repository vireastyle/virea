import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { refreshCookieOptions } from "../lib/jwt";

const COOKIE_NAME = "virea_refresh";

// ─── User ─────────────────────────────────────────────────

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await authService.registerUser(
      req.body
    );

    res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions());
    res.status(201).json({ success: true, data: { user, accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(
      req.body
    );

    res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions());
    res.status(200).json({ success: true, data: { user, accessToken } });
  } catch (err) {
    next(err);
  }
}

// ─── Vendor ───────────────────────────────────────────────

export async function registerVendor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { vendor, accessToken, refreshToken } =
      await authService.registerVendor(req.body);

    res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions());
    res.status(201).json({ success: true, data: { vendor, accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function loginVendor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { vendor, accessToken, refreshToken } = await authService.loginVendor(
      req.body
    );

    res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions());
    res.status(200).json({ success: true, data: { vendor, accessToken } });
  } catch (err) {
    next(err);
  }
}

// ─── Shared ───────────────────────────────────────────────

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const incoming = req.cookies[COOKIE_NAME] as string | undefined;
    if (!incoming) {
      res.status(401).json({
        success: false,
        error: { code: "NO_REFRESH_TOKEN", message: "No refresh token" },
      });
      return;
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(
      incoming
    );

    res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions());
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const incoming = req.cookies[COOKIE_NAME] as string | undefined;
    if (incoming) await authService.logout(incoming);

    res.clearCookie(COOKIE_NAME, { path: "/api/v1/auth" });
    res.status(200).json({ success: true, data: { message: "Logged out" } });
  } catch (err) {
    next(err);
  }
}
