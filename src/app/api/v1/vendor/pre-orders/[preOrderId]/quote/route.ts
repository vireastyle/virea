import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/pre-orders.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ preOrderId: string }> }
) {
  try {
    const { id } = getAuth(req, "vendor");
    const { preOrderId } = await params;
    const body = await req.json();
    const data = await svc.sendQuote(id, preOrderId, body);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
