import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/pre-orders.service";

export async function GET(req: NextRequest) {
  try {
    const { id } = getAuth(req, "user");
    const data = await svc.listPreOrders(id);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id } = getAuth(req, "user");
    const body = await req.json();
    const data = await svc.createPreOrder(id, body);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
