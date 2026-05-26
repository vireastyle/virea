import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-error";

export async function getMe(id: string, role: "user" | "vendor") {
  if (role === "vendor") {
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) throw new AppError(404, "Vendor not found", "NOT_FOUND");
    const { password: _, ...rest } = vendor;
    return rest;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, "User not found", "NOT_FOUND");
  const { password: _, ...rest } = user;
  return rest;
}

export async function updateMe(
  id: string,
  role: "user" | "vendor",
  data: { name?: string; email?: string; bio?: string; businessName?: string }
) {
  if (role === "vendor") {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        ...(data.businessName && { businessName: data.businessName }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.email && { email: data.email }),
      },
    });
    const { password: _, ...rest } = vendor;
    return rest;
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
    },
  });
  const { password: _, ...rest } = user;
  return rest;
}
