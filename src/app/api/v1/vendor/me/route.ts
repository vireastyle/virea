import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { id } = getAuth(req, "vendor");
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      select: { id: true, email: true, businessName: true, accountName: true, bio: true, categories: true, bankName: true, accountNumber: true },
    });
    return NextResponse.json({ success: true, data: vendor });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = getAuth(req, "vendor");
    const { businessName, bio, categories } = await req.json();
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        ...(businessName && { businessName: businessName.trim() }),
        ...(bio !== undefined && { bio: bio.trim() }),
        ...(categories && { categories }),
      },
      select: { id: true, email: true, businessName: true, accountName: true, bio: true, categories: true, bankName: true, accountNumber: true },
    });
    return NextResponse.json({ success: true, data: vendor });
  } catch (err) {
    return handleError(err);
  }
}
