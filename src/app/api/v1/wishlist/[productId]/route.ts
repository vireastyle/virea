import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/wishlist.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { id } = getAuth(req, "user");
    const { productId } = await params;
    await svc.removeFromWishlist(id, productId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
