import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-error";

export async function getAvatar(userId: string) {
  const avatar = await prisma.avatar.findUnique({ where: { userId } });
  if (!avatar) throw new AppError(404, "Avatar not found", "NOT_FOUND");
  return avatar;
}

export async function upsertAvatar(
  userId: string,
  data: {
    gender: string; bodyShape: string; skinTone: string;
    hairStyle: string; hairColour: string; height: string;
    size: string; photoUrl?: string;
  }
) {
  return prisma.avatar.upsert({
    where:  { userId },
    update: data,
    create: { userId, ...data },
  });
}
