import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

export async function getWishlist(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: { vendor: { select: { id: true, businessName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function addToWishlist(userId: string, productId: string) {
  // upsert — idempotent, won't error if already saved
  return prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
    include: { product: true },
  });
}

export async function removeFromWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (!item) throw new AppError(404, "Item not in wishlist", "NOT_FOUND");
  await prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
}
