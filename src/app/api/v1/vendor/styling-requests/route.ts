import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/styling-requests.service";

export async function GET(req: NextRequest) {
  try {
    const { id } = getAuth(req, "vendor");
    const data = await svc.listVendorStylingRequests(id);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
