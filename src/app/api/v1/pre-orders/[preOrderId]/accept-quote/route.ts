import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/pre-orders.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ preOrderId: string }> }
) {
  try {
    const { id } = getAuth(req, "user");
    const { preOrderId } = await params;
    const data = await svc.acceptQuote(id, preOrderId);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
