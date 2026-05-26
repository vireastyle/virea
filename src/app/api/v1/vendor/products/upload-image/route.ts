import { NextRequest, NextResponse } from "next/server";
import { handleError, AppError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import * as svc from "@/lib/services/vendor-products.service";

export async function POST(req: NextRequest) {
  try {
    const { id } = getAuth(req, "vendor");

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) throw new AppError(400, "No image file provided", "NO_FILE");
    if (!file.type.startsWith("image/"))
      throw new AppError(400, "Only image files are accepted", "INVALID_FILE_TYPE");
    if (file.size > 5 * 1024 * 1024)
      throw new AppError(400, "Image must be under 5 MB", "FILE_TOO_LARGE");

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await svc.uploadProductImage(buffer, id);

    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    return handleError(err);
  }
}
