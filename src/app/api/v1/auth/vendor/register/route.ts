import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/lib/api-error";
import { refreshCookieOptions } from "@/lib/jwt";
import * as svc from "@/lib/services/auth.service";

const schema = z.object({
  email:         z.string().email(),
  password:      z.string().min(8),
  businessName:  z.string().min(1).max(120),
  bankName:      z.string().min(1),
  accountNumber: z.string().min(10).max(10),
  accountName:   z.string().min(1),
  categories:    z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const { vendor, accessToken, refreshToken } = await svc.registerVendor(body);

    const res = NextResponse.json({ success: true, data: { vendor, accessToken } }, { status: 201 });
    res.cookies.set("refreshToken", refreshToken, refreshCookieOptions());
    return res;
  } catch (err) {
    return handleError(err);
  }
}
