import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/orders.service";

export async function GET(req: NextRequest) {
  try {
    const { id } = getAuth(req, "vendor");
    const status = req.nextUrl.searchParams.get("status") as OrderStatus | null;
    const data = await svc.listVendorOrders(id, status ?? undefined);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
