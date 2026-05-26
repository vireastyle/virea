import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/bag.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { id } = getAuth(req, "user");
    const { itemId } = await params;
    const { quantity } = await req.json();
    const data = await svc.updateBagItem(id, itemId, quantity);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { id } = getAuth(req, "user");
    const { itemId } = await params;
    await svc.removeFromBag(id, itemId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
