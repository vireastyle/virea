import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/styling-requests.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { id } = getAuth(req, "user");
    const { requestId } = await params;
    const data = await svc.getStylingRequest(id, requestId);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
