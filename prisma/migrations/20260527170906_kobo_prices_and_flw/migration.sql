-- Migration: kobo_prices_and_flw
-- Converts all monetary Float columns to Int (kobo = naira × 100)
-- Adds: Vendor.flwSubaccountId, Order.txRef, Order.paidAt

-- ─── Product.price: Float → Int (kobo) ───────────────────
ALTER TABLE "Product" ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;

-- ─── Order.total: Float → Int (kobo) ─────────────────────
ALTER TABLE "Order" ALTER COLUMN "total" TYPE INTEGER USING ROUND("total" * 100)::INTEGER;

-- ─── Order: add txRef + paidAt ────────────────────────────
ALTER TABLE "Order" ADD COLUMN "txRef" TEXT;
ALTER TABLE "Order" ADD COLUMN "paidAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "Order_txRef_key" ON "Order"("txRef");

-- ─── OrderItem.price: Float → Int (kobo) ─────────────────
ALTER TABLE "OrderItem" ALTER COLUMN "price" TYPE INTEGER USING ROUND("price" * 100)::INTEGER;

-- ─── PreOrder.budget: Float → Int (kobo) ─────────────────
ALTER TABLE "PreOrder" ALTER COLUMN "budget" TYPE INTEGER USING ROUND("budget" * 100)::INTEGER;

-- ─── PreOrder.quotedPrice: Float → Int (kobo) ────────────
ALTER TABLE "PreOrder" ALTER COLUMN "quotedPrice" TYPE INTEGER USING ROUND("quotedPrice" * 100)::INTEGER;

-- ─── PayoutRecord.amount: Float → Int (kobo) ─────────────
ALTER TABLE "PayoutRecord" ALTER COLUMN "amount" TYPE INTEGER USING ROUND("amount" * 100)::INTEGER;

-- ─── Vendor: add flwSubaccountId ─────────────────────────
ALTER TABLE "Vendor" ADD COLUMN "flwSubaccountId" TEXT;
