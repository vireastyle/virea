import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api-error";

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      select: {
        id: true,
        businessName: true,
        bio: true,
        categories: true,
      },
      orderBy: { businessName: "asc" },
    });
    return NextResponse.json({ success: true, data: vendors });
  } catch (err) {
    return handleError(err);
  }
}
