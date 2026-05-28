import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * GET /api/dev/seed
 * Creates a test vendor + one test product for payment flow testing.
 * Safe to call multiple times — uses upsert so it won't duplicate.
 * Remove or gate behind env check before going to real production.
 */
export async function GET() {
  const vendorEmail = "testvendor@virea.dev";
  const hashed = await bcrypt.hash("testvendor123", 12);

  const vendor = await prisma.vendor.upsert({
    where:  { email: vendorEmail },
    update: {},
    create: {
      email:         vendorEmail,
      password:      hashed,
      businessName:  "Test Studio",
      bankName:      "Test Bank",
      accountNumber: "0000000000",
      accountName:   "Test Studio",
      categories:    ["DRESS"],
    },
  });

  const product = await prisma.product.upsert({
    where:  { id: "test-product-001" },
    update: {},
    create: {
      id:          "test-product-001",
      vendorId:    vendor.id,
      name:        "Test Dress (Payment Testing)",
      description: "A product created for payment flow testing.",
      price:       2000000, // ₦20,000 in kobo
      category:    "DRESS",
      images:      ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"],
      colors:      ["Black"],
      sizes:       ["S", "M", "L"],
      inStock:     true,
      isNew:       false,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Test vendor and product seeded. Navigate to /product/test-product-001 to test checkout.",
    vendorId:  vendor.id,
    productId: product.id,
    productUrl: "/product/test-product-001",
  });
}
