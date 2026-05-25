import { Category } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

interface CatalogueQuery {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}

export async function listProducts(query: CatalogueQuery) {
  const page = Math.max(1, parseInt(query.page ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "20", 10)));
  const skip = (page - 1) * limit;

  const where = {
    ...(query.category && { category: query.category.toUpperCase() as Category }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { brand: { contains: query.search, mode: "insensitive" as const } },
        { description: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
    ...(query.minPrice || query.maxPrice
      ? {
          price: {
            ...(query.minPrice && { gte: parseFloat(query.minPrice) }),
            ...(query.maxPrice && { lte: parseFloat(query.maxPrice) }),
          },
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        vendor: { select: { id: true, businessName: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      vendor: { select: { id: true, businessName: true, bio: true } },
    },
  });
  if (!product) throw new AppError(404, "Product not found", "NOT_FOUND");
  return product;
}
