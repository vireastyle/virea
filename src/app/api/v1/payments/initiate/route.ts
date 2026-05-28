import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { handleError, AppError } from "@/lib/api-error"; // AppError still used for order checks below
import { getAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { createPaymentLink } from "@/lib/services/flutterwave.service";

const BodySchema = z.object({
  orderId: z.string().min(1),
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://virea-seven.vercel.app";

// POST /api/v1/payments/initiate
// Creates a Flutterwave hosted checkout link for a pending order.
// Returns { paymentUrl } — the frontend redirects the user there.
export async function POST(req: NextRequest) {
  try {
    const { id: userId } = getAuth(req, "user");

    const { orderId } = BodySchema.parse(await req.json());

    const order = await prisma.order.findUnique({
      where:   { id: orderId },
      include: { vendor: true, user: true },
    });

    if (!order) throw new AppError(404, "Order not found", "NOT_FOUND");
    if (order.userId !== userId) throw new AppError(403, "Forbidden", "FORBIDDEN");
    if (order.status !== "PLACED") throw new AppError(400, "Order is not in PLACED state", "INVALID_STATE");

    // Generate a unique tx_ref and persist it BEFORE calling FLW
    // so we can reconcile on the webhook even if the API call is retried.
    const txRef = `virea_${orderId}_${nanoid(8)}`;
    await prisma.order.update({ where: { id: orderId }, data: { txRef } });

    const paymentUrl = await createPaymentLink({
      txRef,
      amountKobo:          order.total,
      customerEmail:       order.user.email,
      customerName:        order.user.name,
      vendorSubaccountId:  order.vendor.flwSubaccountId,  // null = no split, full amount to main account
      vendorSplitRatio:    90, // vendor gets 90%, Virea keeps 10%
      redirectUrl:         `${APP_URL}/orders?ref=${txRef}`,
      title:               order.vendor.businessName,
      description:         `Virea order ${orderId}`,
      orderId,
    });

    return NextResponse.json({ success: true, data: { paymentUrl } });
  } catch (err) {
    return handleError(err);
  }
}
