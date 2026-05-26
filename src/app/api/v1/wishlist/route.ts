import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/wishlist.service";

export async function GET(req: NextRequest) {
  try {
    const { id } = getAuth(req, "user");
    const data = await svc.getWishlist(id);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id } = getAuth(req, "user");
    const { productId } = await req.json();
    const data = await svc.addToWishlist(id, productId);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
