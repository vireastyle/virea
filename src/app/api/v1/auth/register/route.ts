import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/lib/api-error";
import { refreshCookieOptions } from "@/lib/jwt";
import * as svc from "@/lib/services/auth.service";

const schema = z.object({
  name:     z.string().min(1).max(80),
  email:    z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const { user, accessToken, refreshToken } = await svc.registerUser(body);

    const res = NextResponse.json({ success: true, data: { user, accessToken } }, { status: 201 });
    res.cookies.set("refreshToken", refreshToken, refreshCookieOptions());
    return res;
  } catch (err) {
    return handleError(err);
  }
}
