import { NextRequest, NextResponse } from "next/server";
import { handleError, AppError } from "@/lib/api-error";
import { refreshCookieOptions } from "@/lib/jwt";
import * as svc from "@/lib/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("refreshToken")?.value;
    if (!token) throw new AppError(401, "No refresh token", "UNAUTHORIZED");

    const { accessToken, refreshToken } = await svc.refreshTokens(token);

    const res = NextResponse.json({ success: true, data: { accessToken } });
    res.cookies.set("refreshToken", refreshToken, refreshCookieOptions());
    return res;
  } catch (err) {
    return handleError(err);
  }
}
