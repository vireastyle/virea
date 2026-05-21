import type { Outfit } from "@/types/outfit";

export const mockOutfits: Outfit[] = [
  {
    id: "outfit-001",
    user_id: "user-001",
    name: "Lagos Rooftop",
    items: [
      {
        id: "oi-001",
        item_id: "item-001",
        selected_colour: { name: "Midnight", hex: "#1A1A2E" },
        selected_size: "M",
      },
      {
        id: "oi-002",
        item_id: "item-013",
        selected_colour: { name: "Gold", hex: "#D4AF37" },
        selected_size: "S",
      },
    ],
    preview_image_url: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80",
    created_at: "2026-05-01T18:00:00Z",
  },
  {
    id: "outfit-002",
    user_id: "user-001",
    name: "Sunday Brunch",
    items: [
      {
        id: "oi-003",
        item_id: "item-003",
        selected_colour: { name: "Sand", hex: "#C2B280" },
        selected_size: "M",
      },
      {
        id: "oi-004",
        item_id: "item-017",
        selected_colour: { name: "Gold", hex: "#D4AF37" },
        selected_size: "M",
      },
    ],
    preview_image_url: "https://images.unsplash.com/photo-1566479179817-c3c19b6e6ca9?w=400&q=80",
    created_at: "2026-05-05T11:00:00Z",
  },
  {
    id: "outfit-003",
    user_id: "user-001",
    name: "Power Meeting",
    items: [
      {
        id: "oi-005",
        item_id: "item-007",
        selected_colour: { name: "Caramel", hex: "#C68642" },
        selected_size: "M",
      },
      {
        id: "oi-006",
        item_id: "item-020",
        selected_colour: { name: "Cognac", hex: "#9A4722" },
        selected_size: "M",
      },
    ],
    preview_image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
    created_at: "2026-05-10T09:00:00Z",
  },
];
