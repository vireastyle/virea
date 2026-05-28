import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockClothing } from "@/lib/mock/clothing";
import bcrypt from "bcryptjs";

const VENDOR_ID    = "vendor-virea-test";
const VENDOR_EMAIL = "testvendor@virea.dev";

/**
 * GET /api/dev/seed
 * Seeds all 20 mock clothing items as real DB products under a fixed test
 * vendor (id: "vendor-virea-test"). Safe to run multiple times.
 * Remove or gate behind env check before going to real production.
 */
export async function GET() {
  // ── Ensure test vendor exists with the known fixed ID ──────────────────
  // Delete any stale test vendor (different ID, same email) and its products.
  const stale = await prisma.vendor.findFirst({ where: { email: VENDOR_EMAIL, NOT: { id: VENDOR_ID } } });
  if (stale) {
    await prisma.product.deleteMany({ where: { vendorId: stale.id } });
    await prisma.vendor.delete({ where: { id: stale.id } });
  }

  const hashed = await bcrypt.hash("testvendor123", 12);
  const vendor = await prisma.vendor.upsert({
    where:  { id: VENDOR_ID },
    update: {},
    create: {
      id:            VENDOR_ID,
      email:         VENDOR_EMAIL,
      password:      hashed,
      businessName:  "Test Studio",
      bankName:      "Test Bank",
      accountNumber: "0000000000",
      accountName:   "Test Studio",
      categories:    ["DRESS", "TOP", "OUTERWEAR", "BAG", "SHOES"],
    },
  });

  // ── Upsert all 20 mock products ─────────────────────────────────────────
  let seeded = 0;
  for (const item of mockClothing) {
    const firstImage = Object.values(item.image_urls).find(Boolean) ?? "";
    await prisma.product.upsert({
      where:  { id: item.id },
      update: { vendorId: VENDOR_ID },
      create: {
        id:          item.id,
        vendorId:    VENDOR_ID,
        name:        item.name,
        brand:       item.brand,
        description: `${item.name} by ${item.brand}.`,
        price:       item.price,
        category:    item.category,
        images:      firstImage ? [firstImage] : [],
        colours:     item.available_colours.map((c) => c.name),
        sizes:       item.available_sizes,
        stock:       10,
      },
    });
    seeded++;
  }

  return NextResponse.json({
    success:   true,
    message:   `Seeded vendor "${vendor.businessName}" (id: ${vendor.id}) + ${seeded} products. All mock shop items are now checkout-ready.`,
    vendorId:  vendor.id,
    productCount: seeded,
  });
}
