import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/styling-requests.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { id } = getAuth(req, "vendor");
    const { requestId } = await params;
    const { response } = await req.json();
    const data = await svc.respondToStylingRequest(id, requestId, response);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
