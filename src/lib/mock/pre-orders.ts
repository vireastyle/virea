import type { PreOrder } from "@/types/order";

export const mockPreOrders: PreOrder[] = [
  {
    id: "pre-order-001",
    user_id: "user-demo",
    vendor_id: "vendor-002",
    vendor_name: "House of Aya",
    event_type: "Wedding",
    description: "A floor-length Ankara gown in deep burgundy and gold tones, fully fitted, with a modest train. For a Yoruba traditional wedding — bride's sister.",
    target_date: "2026-07-12",
    quoted_price: 120000,
    vendor_note: "I can do this in deep wine and antique gold Ankara. Will need 3 fittings. Ready 2 weeks before the date.",
    status: "QUOTED",
    created_at: "2026-05-05T10:00:00Z",
  },
  {
    id: "pre-order-002",
    user_id: "user-demo",
    vendor_id: undefined,
    vendor_name: undefined,
    event_type: "Corporate",
    description: "A tailored power suit — blazer and trousers — in charcoal grey. Clean, minimal, no embellishments. Needs to fit well through the shoulders.",
    target_date: "2026-06-20",
    quoted_price: undefined,
    vendor_note: undefined,
    status: "SUBMITTED",
    created_at: "2026-05-18T14:30:00Z",
  },
];

export function getPreOrderById(id: string): PreOrder | undefined {
  return mockPreOrders.find((p) => p.id === id);
}
