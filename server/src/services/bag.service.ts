import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

export async function getBag(userId: string) {
  return prisma.bagItem.findMany({
    where: { userId },
    include: {
      product: {
        include: { vendor: { select: { id: true, businessName: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function addToBag(
  userId: string,
  data: { productId: string; quantity: number; size: string; colour: string }
) {
  return prisma.bagItem.create({
    data: { userId, ...data },
    include: { product: true },
  });
}

export async function updateBagItem(
  userId: string,
  itemId: string,
  quantity: number
) {
  const item = await prisma.bagItem.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId)
    throw new AppError(404, "Bag item not found", "NOT_FOUND");

  if (quantity <= 0) {
    await prisma.bagItem.delete({ where: { id: itemId } });
    return null;
  }

  return prisma.bagItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  });
}

export async function removeFromBag(userId: string, itemId: string) {
  const item = await prisma.bagItem.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId)
    throw new AppError(404, "Bag item not found", "NOT_FOUND");
  await prisma.bagItem.delete({ where: { id: itemId } });
}

export async function clearBag(userId: string) {
  await prisma.bagItem.deleteMany({ where: { userId } });
}
