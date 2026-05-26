import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import * as svc from "@/lib/services/catalogue.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const data = await svc.listProducts({
      category: searchParams.get("category")  ?? undefined,
      search:   searchParams.get("search")    ?? undefined,
      minPrice: searchParams.get("minPrice")  ?? undefined,
      maxPrice: searchParams.get("maxPrice")  ?? undefined,
      page:     searchParams.get("page")      ?? undefined,
      limit:    searchParams.get("limit")     ?? undefined,
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return handleError(err);
  }
}
