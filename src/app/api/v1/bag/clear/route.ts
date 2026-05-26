import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/bag.service";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = getAuth(req, "user");
    await svc.clearBag(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
