import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/outfits.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = getAuth(req, "user");
    const { id } = await params;
    await svc.deleteOutfit(userId, id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
