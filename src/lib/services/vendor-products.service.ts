import { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { uploadImage as cloudinaryUpload } from "@/lib/cloudinary";
import { AppError } from "@/lib/api-error";

// ─── Types ────────────────────────────────────────────────

export interface CreateProductInput {
  name: string;
  brand: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  sizes: string[];
  colours: string[];
  bodyTypes: string[];
  stock: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

// ─── Helpers ─────────────────────────────────────────────

async function assertOwnership(vendorId: string, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError(404, "Product not found", "NOT_FOUND");
  if (product.vendorId !== vendorId)
    throw new AppError(403, "You do not own this product", "FORBIDDEN");
  return product;
}

// ─── Service functions ───────────────────────────────────

export async function listVendorProducts(vendorId: string) {
  return prisma.product.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVendorProduct(vendorId: string, productId: string) {
  return assertOwnership(vendorId, productId);
}

export async function createProduct(vendorId: string, data: CreateProductInput) {
  return prisma.product.create({
    data: { vendorId, ...data },
  });
}

export async function updateProduct(
  vendorId: string,
  productId: string,
  data: UpdateProductInput
) {
  await assertOwnership(vendorId, productId);
  return prisma.product.update({
    where: { id: productId },
    data,
  });
}

export async function deleteProduct(vendorId: string, productId: string) {
  await assertOwnership(vendorId, productId);
  await prisma.product.delete({ where: { id: productId } });
}

export async function uploadProductImage(
  buffer: Buffer,
  vendorId: string
): Promise<string> {
  return cloudinaryUpload(buffer, { folder: `virea/vendors/${vendorId}/products` });
}
