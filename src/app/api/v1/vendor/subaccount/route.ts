import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-error";
import { getAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { createSubaccount } from "@/lib/services/flutterwave.service";

// POST /api/v1/vendor/subaccount
// Creates a Flutterwave subaccount for the authenticated vendor and stores the ID.
// Call this once during vendor onboarding (or on first payout setup).
export async function POST(req: NextRequest) {
  try {
    const { id: vendorId } = getAuth(req, "vendor");

    const vendor = await prisma.vendor.findUniqueOrThrow({ where: { id: vendorId } });

    // Idempotent — return existing subaccount ID if already registered
    if (vendor.flwSubaccountId) {
      return NextResponse.json({ success: true, data: { flwSubaccountId: vendor.flwSubaccountId } });
    }

    const body = await req.json();
    // accountBank is the FLW bank code (e.g. "044" for Access Bank Nigeria).
    // The frontend should let vendors pick from a list of FLW-supported bank codes.
    const { accountBank } = body as { accountBank: string };

    const flwSubaccountId = await createSubaccount({
      accountBank,
      accountNumber: vendor.accountNumber,
      businessName:  vendor.businessName,
      businessEmail: vendor.email,
      country:       "NG",
      splitValue:    0.9, // vendor keeps 90%; Virea takes 10% commission
    });

    await prisma.vendor.update({
      where: { id: vendorId },
      data:  { flwSubaccountId },
    });

    return NextResponse.json({ success: true, data: { flwSubaccountId } }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
