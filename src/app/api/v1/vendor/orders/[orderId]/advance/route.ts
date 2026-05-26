import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/orders.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { id } = getAuth(req, "vendor");
    const { orderId } = await params;
    const data = await svc.advanceOrderStatus(id, orderId);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
