import { PreOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-error";

// ─── Types ────────────────────────────────────────────────

export interface CreatePreOrderInput {
  vendorId:    string;
  description: string;
  eventType:   string;
  eventDate?:  string; // ISO date string — will be converted to Date
  budget?:     number;
}

export interface SendQuoteInput {
  quotedPrice:   number;
  quotedMessage: string;
  estimatedDays: number;
}

// Vendor can advance ONLY along this path (after quote is accepted)
const VENDOR_ADVANCE_FLOW: PreOrderStatus[] = [
  "QUOTE_ACCEPTED",
  "IN_PRODUCTION",
  "READY",
  "DELIVERED",
];

// ─── Helpers ─────────────────────────────────────────────

const preOrderInclude = {
  vendor: { select: { id: true, businessName: true } },
  user:   { select: { id: true, name: true, email: true } },
} as const;

// ─── User-facing ──────────────────────────────────────────

export async function createPreOrder(userId: string, input: CreatePreOrderInput) {
  const { vendorId, description, eventType, eventDate, budget } = input;

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) throw new AppError(404, "Vendor not found", "NOT_FOUND");

  return prisma.preOrder.create({
    data: {
      userId,
      vendorId,
      description,
      eventType,
      eventDate: eventDate ? new Date(eventDate) : null,
      budget:    budget ?? null,
    },
    include: preOrderInclude,
  });
}

export async function listPreOrders(userId: string) {
  return prisma.preOrder.findMany({
    where:   { userId },
    include: preOrderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getPreOrder(userId: string, preOrderId: string) {
  const po = await prisma.preOrder.findUnique({
    where:   { id: preOrderId },
    include: preOrderInclude,
  });
  if (!po) throw new AppError(404, "Pre-order not found", "NOT_FOUND");
  if (po.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  return po;
}

export async function acceptQuote(userId: string, preOrderId: string) {
  const po = await prisma.preOrder.findUnique({ where: { id: preOrderId } });
  if (!po) throw new AppError(404, "Pre-order not found", "NOT_FOUND");
  if (po.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  if (po.status !== "QUOTE_SENT") {
    throw new AppError(
      400,
      "A quote must be in QUOTE_SENT status to be accepted",
      "INVALID_STATUS_TRANSITION"
    );
  }
  return prisma.preOrder.update({
    where:   { id: preOrderId },
    data:    { status: "QUOTE_ACCEPTED" },
    include: preOrderInclude,
  });
}

export async function declineQuote(userId: string, preOrderId: string) {
  const po = await prisma.preOrder.findUnique({ where: { id: preOrderId } });
  if (!po) throw new AppError(404, "Pre-order not found", "NOT_FOUND");
  if (po.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  if (po.status !== "QUOTE_SENT") {
    throw new AppError(
      400,
      "A quote must be in QUOTE_SENT status to be declined",
      "INVALID_STATUS_TRANSITION"
    );
  }
  return prisma.preOrder.update({
    where:   { id: preOrderId },
    data:    { status: "QUOTE_DECLINED" },
    include: preOrderInclude,
  });
}

export async function cancelPreOrder(userId: string, preOrderId: string) {
  const po = await prisma.preOrder.findUnique({ where: { id: preOrderId } });
  if (!po) throw new AppError(404, "Pre-order not found", "NOT_FOUND");
  if (po.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");

  const cancellable: PreOrderStatus[] = ["PENDING", "QUOTE_SENT", "QUOTE_DECLINED"];
  if (!cancellable.includes(po.status)) {
    throw new AppError(
      400,
      "Pre-order cannot be cancelled at this stage",
      "INVALID_STATUS_TRANSITION"
    );
  }
  return prisma.preOrder.update({
    where:   { id: preOrderId },
    data:    { status: "CANCELLED" },
    include: preOrderInclude,
  });
}

// ─── Vendor-facing ────────────────────────────────────────

export async function listVendorPreOrders(vendorId: string, status?: PreOrderStatus) {
  return prisma.preOrder.findMany({
    where: {
      vendorId,
      ...(status ? { status } : {}),
    },
    include: preOrderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getVendorPreOrder(vendorId: string, preOrderId: string) {
  const po = await prisma.preOrder.findUnique({
    where:   { id: preOrderId },
    include: preOrderInclude,
  });
  if (!po) throw new AppError(404, "Pre-order not found", "NOT_FOUND");
  if (po.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  return po;
}

export async function sendQuote(
  vendorId: string,
  preOrderId: string,
  input: SendQuoteInput
) {
  const po = await prisma.preOrder.findUnique({ where: { id: preOrderId } });
  if (!po) throw new AppError(404, "Pre-order not found", "NOT_FOUND");
  if (po.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  if (po.status !== "PENDING") {
    throw new AppError(
      400,
      "A quote can only be sent for pre-orders in PENDING status",
      "INVALID_STATUS_TRANSITION"
    );
  }
  return prisma.preOrder.update({
    where: { id: preOrderId },
    data:  {
      status:        "QUOTE_SENT",
      quotedPrice:   input.quotedPrice,
      quotedMessage: input.quotedMessage,
      estimatedDays: input.estimatedDays,
    },
    include: preOrderInclude,
  });
}

export async function advancePreOrderStatus(vendorId: string, preOrderId: string) {
  const po = await prisma.preOrder.findUnique({ where: { id: preOrderId } });
  if (!po) throw new AppError(404, "Pre-order not found", "NOT_FOUND");
  if (po.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");

  const currentIdx = VENDOR_ADVANCE_FLOW.indexOf(po.status);
  if (currentIdx === -1) {
    throw new AppError(
      400,
      `Cannot advance pre-order from status: ${po.status}. It must be QUOTE_ACCEPTED or later.`,
      "INVALID_STATUS_TRANSITION"
    );
  }
  if (currentIdx === VENDOR_ADVANCE_FLOW.length - 1) {
    throw new AppError(
      400,
      "Pre-order is already at terminal status: DELIVERED",
      "INVALID_STATUS_TRANSITION"
    );
  }

  const nextStatus = VENDOR_ADVANCE_FLOW[currentIdx + 1];
  return prisma.preOrder.update({
    where:   { id: preOrderId },
    data:    { status: nextStatus },
    include: preOrderInclude,
  });
}
