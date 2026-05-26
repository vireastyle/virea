import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import * as svc from "@/lib/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("refreshToken")?.value;
    if (token) await svc.logout(token);

    const res = NextResponse.json({ success: true, data: null });
    res.cookies.delete("refreshToken");
    return res;
  } catch (err) {
    return handleError(err);
  }
}
