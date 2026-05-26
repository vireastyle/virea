import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-error";

// ─── Types ────────────────────────────────────────────────

export interface CreateOrderInput {
  vendorId: string;
  address:  string;
  items: {
    productId: string;
    quantity:  number;
    size:      string;
    colour:    string;
  }[];
}

// Status transitions the vendor is allowed to make, in order
const VENDOR_STATUS_FLOW: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

// ─── User-facing ──────────────────────────────────────────

export async function createOrder(userId: string, input: CreateOrderInput) {
  const { vendorId, address, items } = input;

  // Verify vendor exists
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError(404, "Vendor not found", "NOT_FOUND");

  // Fetch products and verify they belong to the vendor
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, vendorId },
  });

  if (products.length !== productIds.length) {
    throw new AppError(
      400,
      "One or more products not found or do not belong to this vendor",
      "INVALID_PRODUCTS"
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Calculate total
  const total = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  // Create order + items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        vendorId,
        address,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity:  item.quantity,
            size:      item.size,
            colour:    item.colour,
            price:     productMap.get(item.productId)!.price,
          })),
        },
      },
      include: {
        items:  { include: { product: true } },
        vendor: { select: { id: true, businessName: true } },
      },
    });
    return created;
  });

  return order;
}

export async function listOrders(userId: string) {
  return prisma.order.findMany({
    where:   { userId },
    include: {
      items:  { include: { product: { select: { id: true, name: true, images: true } } } },
      vendor: { select: { id: true, businessName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrder(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where:   { id: orderId },
    include: {
      items:  { include: { product: true } },
      vendor: { select: { id: true, businessName: true } },
    },
  });
  if (!order) throw new AppError(404, "Order not found", "NOT_FOUND");
  if (order.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  return order;
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError(404, "Order not found", "NOT_FOUND");
  if (order.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  if (order.status !== "PLACED") {
    throw new AppError(
      400,
      "Only orders in PLACED status can be cancelled",
      "INVALID_STATUS_TRANSITION"
    );
  }
  return prisma.order.update({
    where: { id: orderId },
    data:  { status: "CANCELLED" },
    include: {
      items:  { include: { product: true } },
      vendor: { select: { id: true, businessName: true } },
    },
  });
}

// ─── Vendor-facing ────────────────────────────────────────

export async function listVendorOrders(vendorId: string, status?: OrderStatus) {
  return prisma.order.findMany({
    where: {
      vendorId,
      ...(status ? { status } : {}),
    },
    include: {
      items: { include: { product: { select: { id: true, name: true, images: true } } } },
      user:  { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVendorOrder(vendorId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      user:  { select: { id: true, name: true, email: true } },
    },
  });
  if (!order) throw new AppError(404, "Order not found", "NOT_FOUND");
  if (order.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  return order;
}

export async function advanceOrderStatus(vendorId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError(404, "Order not found", "NOT_FOUND");
  if (order.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");

  const currentIdx = VENDOR_STATUS_FLOW.indexOf(order.status);
  if (currentIdx === -1 || currentIdx === VENDOR_STATUS_FLOW.length - 1) {
    throw new AppError(
      400,
      `Order is already at terminal status: ${order.status}`,
      "INVALID_STATUS_TRANSITION"
    );
  }

  const nextStatus = VENDOR_STATUS_FLOW[currentIdx + 1];
  return prisma.order.update({
    where: { id: orderId },
    data:  { status: nextStatus },
    include: {
      items: { include: { product: true } },
      user:  { select: { id: true, name: true, email: true } },
    },
  });
}
