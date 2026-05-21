import type { StylingRequest } from "@/types/vendor";

export const mockStylingRequests: StylingRequest[] = [
  {
    id: "sr-001",
    user_id: "user-demo",
    vendor_id: "vendor-001",
    vendor_name: "Adire Studio",
    event_type: "Owambe",
    notes: "Looking for something festive — gold tones, midi length, with lace detailing. I want to stand out but not overshadow the couple.",
    outfit_item_ids: ["item-001"],
    status: "pending",
    created_at: "2026-05-19T08:00:00Z",
  },
  {
    id: "sr-002",
    user_id: "user-demo",
    vendor_id: "vendor-001",
    vendor_name: "Adire Studio",
    event_type: "Wedding",
    notes: "Matching couple's outfits — Agbada and gown in royal blue and silver.",
    outfit_item_ids: [],
    status: "responded",
    vendor_response: "We can do royal blue Aso-Oke Agbada with silver trimmings and a matching gown. DM us to schedule fittings.",
    created_at: "2026-05-10T13:00:00Z",
  },
  {
    id: "sr-003",
    user_id: "user-demo",
    vendor_id: "vendor-001",
    vendor_name: "Adire Studio",
    event_type: "Graduation",
    notes: "Something elegant but fun — not too formal. Maybe a slit dress or a two-piece?",
    outfit_item_ids: [],
    status: "pending",
    created_at: "2026-05-21T09:30:00Z",
  },
];
