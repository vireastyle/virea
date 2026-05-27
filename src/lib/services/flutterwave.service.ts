/**
 * Flutterwave service — all Flutterwave API calls go through here.
 *
 * Env vars required:
 *   FLUTTERWAVE_SECRET_KEY   — server-only, signs all API calls
 *   FLUTTERWAVE_SECRET_HASH  — server-only, verifies incoming webhooks
 *                              (you set this yourself in the FLW dashboard under Webhooks)
 */

import { AppError } from "@/lib/api-error";

const FLW_BASE = "https://api.flutterwave.com/v3";

function secretKey(): string {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) throw new AppError(500, "FLUTTERWAVE_SECRET_KEY is not set", "CONFIG_ERROR");
  return key;
}

function authHeader() {
  return { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateSubaccountInput {
  accountBank: string;   // bank code (e.g. "044" for Access Bank)
  accountNumber: string;
  businessName: string;
  businessEmail: string;
  country: string;       // "NG"
  splitValue: number;    // e.g. 0.9 → vendor keeps 90%
}

export interface CreatePaymentLinkInput {
  txRef: string;         // unique per payment attempt — save to Order before calling
  amountKobo: number;   // price in kobo — we convert to naira for FLW
  customerEmail: string;
  customerName: string;
  vendorSubaccountId: string;
  vendorSplitRatio: number;    // e.g. 90 → vendor gets 90%
  redirectUrl: string;
  title: string;
  description: string;
  orderId: string;
}

export interface VerifyTransactionResult {
  status: string;        // "successful" | "failed" | "pending"
  currency: string;
  amount: number;        // in naira (Flutterwave always returns major unit)
  txRef: string;
  flwRef: string;
  id: number;
}

// ─── Create subaccount ────────────────────────────────────────────────────────

/**
 * Register a vendor as a Flutterwave subaccount.
 * Returns the subaccount ID to store on the Vendor row.
 */
export async function createSubaccount(input: CreateSubaccountInput): Promise<string> {
  const res = await fetch(`${FLW_BASE}/subaccounts`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      account_bank:     input.accountBank,
      account_number:   input.accountNumber,
      business_name:    input.businessName,
      business_email:   input.businessEmail,
      country:          input.country,
      split_type:       "percentage",
      split_value:      input.splitValue,
    }),
  });

  const json = await res.json();
  if (json.status !== "success") {
    throw new AppError(502, json.message ?? "Failed to create Flutterwave subaccount", "FLW_ERROR");
  }
  return String(json.data.id);
}

// ─── Create payment link ──────────────────────────────────────────────────────

/**
 * Create a Flutterwave hosted checkout link with vendor split.
 * Amount is in kobo in our DB; FLW expects naira (major unit).
 */
export async function createPaymentLink(input: CreatePaymentLinkInput): Promise<string> {
  const amountNaira = input.amountKobo / 100;

  const res = await fetch(`${FLW_BASE}/payments`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      tx_ref:       input.txRef,
      amount:       amountNaira,
      currency:     "NGN",
      redirect_url: input.redirectUrl,
      customer: {
        email: input.customerEmail,
        name:  input.customerName,
      },
      customizations: {
        title:       input.title,
        description: input.description,
        logo:        "https://virea-seven.vercel.app/icons/icon-192.png",
      },
      subaccounts: [
        {
          id:                       input.vendorSubaccountId,
          transaction_split_ratio:  input.vendorSplitRatio,
        },
      ],
      meta: {
        order_id: input.orderId,
      },
    }),
  });

  const json = await res.json();
  if (json.status !== "success") {
    throw new AppError(502, json.message ?? "Failed to create payment link", "FLW_ERROR");
  }
  return json.data.link as string;
}

// ─── Verify transaction ───────────────────────────────────────────────────────

/**
 * Call Flutterwave's verify endpoint to confirm a transaction is real.
 * Always call this after receiving a webhook — never trust the webhook body alone.
 */
export async function verifyTransaction(transactionId: number): Promise<VerifyTransactionResult> {
  const res = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: authHeader(),
  });

  const json = await res.json();
  if (json.status !== "success") {
    throw new AppError(502, json.message ?? "Failed to verify transaction", "FLW_ERROR");
  }

  const d = json.data;
  return {
    status:   d.status,
    currency: d.currency,
    amount:   d.amount,   // naira (major unit)
    txRef:    d.tx_ref,
    flwRef:   d.flw_ref,
    id:       d.id,
  };
}

// ─── Webhook signature check ──────────────────────────────────────────────────

/**
 * Returns true if the incoming webhook's verif-hash header matches
 * our FLUTTERWAVE_SECRET_HASH env var.
 * Reject the request with 401 if this returns false.
 */
export function isValidWebhookSignature(headerHash: string | null): boolean {
  const expected = process.env.FLUTTERWAVE_SECRET_HASH;
  if (!expected || !headerHash) return false;
  return headerHash === expected;
}
