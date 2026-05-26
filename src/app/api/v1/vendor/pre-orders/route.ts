import { NextRequest, NextResponse } from "next/server";
import { PreOrderStatus } from "@prisma/client";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/pre-orders.service";

export async function GET(req: NextRequest) {
  try {
    const { id } = getAuth(req, "vendor");
    const status = req.nextUrl.searchParams.get("status") as PreOrderStatus | null;
    const data = await svc.listVendorPreOrders(id, status ?? undefined);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
