import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/lib/api-error";
import { refreshCookieOptions } from "@/lib/jwt";
import * as svc from "@/lib/services/auth.service";

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const { vendor, accessToken, refreshToken } = await svc.loginVendor(body);

    const res = NextResponse.json({ success: true, data: { vendor, accessToken } });
    res.cookies.set("refreshToken", refreshToken, refreshCookieOptions());
    return res;
  } catch (err) {
    return handleError(err);
  }
}
