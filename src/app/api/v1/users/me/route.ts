import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/users.service";

export async function GET(req: NextRequest) {
  try {
    const { id, role } = getAuth(req);
    const data = await svc.getMe(id, role);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, role } = getAuth(req);
    const body = await req.json();
    const data = await svc.updateMe(id, role, body);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
