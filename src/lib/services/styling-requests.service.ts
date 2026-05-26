import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-error";

// ─── Types ────────────────────────────────────────────────

export interface CreateStylingRequestInput {
  vendorId: string;
  message:  string;
  outfitId?: string;
}

// ─── Helpers ─────────────────────────────────────────────

const requestInclude = {
  vendor: { select: { id: true, businessName: true } },
  user:   { select: { id: true, name: true } },
} as const;

// ─── User-facing ──────────────────────────────────────────

export async function createStylingRequest(
  userId: string,
  input: CreateStylingRequestInput
) {
  const vendor = await prisma.vendor.findUnique({ where: { id: input.vendorId } });
  if (!vendor) throw new AppError(404, "Vendor not found", "NOT_FOUND");

  return prisma.stylingRequest.create({
    data: {
      userId,
      vendorId: input.vendorId,
      message:  input.message,
      outfitId: input.outfitId ?? null,
    },
    include: requestInclude,
  });
}

export async function listStylingRequests(userId: string) {
  return prisma.stylingRequest.findMany({
    where:   { userId },
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getStylingRequest(userId: string, requestId: string) {
  const sr = await prisma.stylingRequest.findUnique({
    where:   { id: requestId },
    include: requestInclude,
  });
  if (!sr) throw new AppError(404, "Styling request not found", "NOT_FOUND");
  if (sr.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  return sr;
}

// ─── Vendor-facing ────────────────────────────────────────

export async function listVendorStylingRequests(vendorId: string) {
  return prisma.stylingRequest.findMany({
    where:   { vendorId },
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getVendorStylingRequest(vendorId: string, requestId: string) {
  const sr = await prisma.stylingRequest.findUnique({
    where:   { id: requestId },
    include: requestInclude,
  });
  if (!sr) throw new AppError(404, "Styling request not found", "NOT_FOUND");
  if (sr.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  return sr;
}

export async function respondToStylingRequest(
  vendorId: string,
  requestId: string,
  response: string
) {
  const sr = await prisma.stylingRequest.findUnique({ where: { id: requestId } });
  if (!sr) throw new AppError(404, "Styling request not found", "NOT_FOUND");
  if (sr.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  if (sr.status !== "OPEN") {
    throw new AppError(
      400,
      "Styling request has already been responded to or declined",
      "INVALID_STATUS_TRANSITION"
    );
  }
  return prisma.stylingRequest.update({
    where:   { id: requestId },
    data:    { status: "RESPONDED", response },
    include: requestInclude,
  });
}

export async function declineStylingRequest(vendorId: string, requestId: string) {
  const sr = await prisma.stylingRequest.findUnique({ where: { id: requestId } });
  if (!sr) throw new AppError(404, "Styling request not found", "NOT_FOUND");
  if (sr.vendorId !== vendorId) throw new AppError(403, "Forbidden", "FORBIDDEN");
  if (sr.status !== "OPEN") {
    throw new AppError(
      400,
      "Styling request has already been responded to or declined",
      "INVALID_STATUS_TRANSITION"
    );
  }
  return prisma.stylingRequest.update({
    where:   { id: requestId },
    data:    { status: "DECLINED" },
    include: requestInclude,
  });
}
