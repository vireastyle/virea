import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidWebhookSignature, verifyTransaction } from "@/lib/services/flutterwave.service";

// POST /api/v1/webhooks/flutterwave
//
// Flutterwave sends this when a payment completes (or fails).
// Rules from the SKILL.md:
//   1. Verify verif-hash header immediately — reject with 401 if wrong.
//   2. Always call the verify API — never trust the webhook body alone.
//   3. Run 4 checks: status, currency, amount, tx_ref.
//   4. Use DB unique constraint on PayoutRecord.reference for idempotency
//      (FLW can retry; catch P2002 and return 200 silently).
//   5. Respond 200 quickly — no heavy work in this path.

export async function POST(req: NextRequest) {
  // ── 1. Signature check ────────────────────────────────────────────────────
  const headerHash = req.headers.get("verif-hash");
  if (!isValidWebhookSignature(headerHash)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // We only care about successful charge events
  if (payload.event !== "charge.completed") {
    return NextResponse.json({ received: true });
  }

  const data = payload.data as Record<string, unknown>;
  const transactionId = data?.id as number | undefined;

  if (!transactionId) {
    return NextResponse.json({ received: true });
  }

  // ── 2. Verify transaction via FLW API ─────────────────────────────────────
  let verified;
  try {
    verified = await verifyTransaction(transactionId);
  } catch {
    // Log but still return 200 so FLW stops retrying a bad payload
    console.error("[flw-webhook] verifyTransaction failed for id", transactionId);
    return NextResponse.json({ received: true });
  }

  // ── 3. Four checks ────────────────────────────────────────────────────────
  if (verified.status !== "successful") {
    console.warn("[flw-webhook] transaction not successful", verified.txRef, verified.status);
    return NextResponse.json({ received: true });
  }
  if (verified.currency !== "NGN") {
    console.warn("[flw-webhook] unexpected currency", verified.currency);
    return NextResponse.json({ received: true });
  }

  // Find the order by txRef
  const order = await prisma.order.findUnique({ where: { txRef: verified.txRef } });
  if (!order) {
    console.warn("[flw-webhook] no order for txRef", verified.txRef);
    return NextResponse.json({ received: true });
  }

  // Amount check: FLW returns naira; our DB stores kobo
  const expectedNaira = order.total / 100;
  if (verified.amount !== expectedNaira) {
    console.warn("[flw-webhook] amount mismatch", { expected: expectedNaira, received: verified.amount });
    return NextResponse.json({ received: true });
  }

  if (verified.txRef !== order.txRef) {
    console.warn("[flw-webhook] txRef mismatch");
    return NextResponse.json({ received: true });
  }

  // ── 4. Confirm order + write PayoutRecord (idempotent via unique reference) ─
  try {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          paidAt: new Date(),
        },
      }),
      prisma.payoutRecord.create({
        data: {
          vendorId:  order.vendorId,
          // Vendor receives 90% — stored in kobo
          amount:    Math.round(order.total * 0.9),
          status:    "pending",
          reference: String(verified.flwRef), // unique FLW reference, blocks duplicate processing
        },
      }),
    ]);
  } catch (err: unknown) {
    // P2002 = unique constraint violation → duplicate webhook, already processed
    if (isP2002(err)) {
      return NextResponse.json({ received: true });
    }
    console.error("[flw-webhook] DB error", err);
    // Return 200 anyway — do not let FLW retry indefinitely on a DB hiccup
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}

function isP2002(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  );
}
