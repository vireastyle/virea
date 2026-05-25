import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

export async function getOutfits(userId: string) {
  return prisma.savedOutfit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function saveOutfit(
  userId: string,
  data: { name: string; imageUrl: string; items: string[] }
) {
  return prisma.savedOutfit.create({ data: { userId, ...data } });
}

export async function deleteOutfit(userId: string, outfitId: string) {
  const outfit = await prisma.savedOutfit.findUnique({ where: { id: outfitId } });
  if (!outfit || outfit.userId !== userId)
    throw new AppError(404, "Outfit not found", "NOT_FOUND");
  await prisma.savedOutfit.delete({ where: { id: outfitId } });
}
