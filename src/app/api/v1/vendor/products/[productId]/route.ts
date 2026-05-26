import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/vendor-products.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { id } = getAuth(req, "vendor");
    const { productId } = await params;
    const data = await svc.getVendorProduct(id, productId);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { id } = getAuth(req, "vendor");
    const { productId } = await params;
    const body = await req.json();
    const data = await svc.updateProduct(id, productId, body);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { id } = getAuth(req, "vendor");
    const { productId } = await params;
    await svc.deleteProduct(id, productId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
