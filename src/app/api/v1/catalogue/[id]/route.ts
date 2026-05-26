import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import * as svc from "@/lib/services/catalogue.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await svc.getProduct(id);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
