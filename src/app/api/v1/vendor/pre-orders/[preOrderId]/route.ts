import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/pre-orders.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ preOrderId: string }> }
) {
  try {
    const { id } = getAuth(req, "vendor");
    const { preOrderId } = await params;
    const data = await svc.getVendorPreOrder(id, preOrderId);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
