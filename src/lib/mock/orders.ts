import type { Order } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "order-001",
    user_id: "user-demo",
    vendor_id: "vendor-001",
    vendor_name: "Adire Studio",
    items: [
      {
        item_id: "item-001",
        item_name: "Satin Flow Dress",
        item_image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
        selected_colour: "Midnight",
        selected_size: "M",
        price: 4200000,
      },
    ],
    subtotal: 4200000,
    status: "DELIVERED",
    placed_at: "2026-04-10T09:15:00Z",
    updated_at: "2026-04-18T14:30:00Z",
  },
  {
    id: "order-002",
    user_id: "user-demo",
    vendor_id: "vendor-002",
    vendor_name: "House of Aya",
    items: [
      {
        item_id: "item-002",
        item_name: "Lagos Wrap Dress",
        item_image_url: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80",
        selected_colour: "Terracotta",
        selected_size: "S",
        price: 3500000,
      },
    ],
    subtotal: 3500000,
    status: "SHIPPED",
    placed_at: "2026-05-12T11:00:00Z",
    updated_at: "2026-05-17T08:45:00Z",
  },
  {
    id: "order-003",
    user_id: "user-demo",
    vendor_id: "vendor-003",
    vendor_name: "Rubē Atelier",
    items: [
      {
        item_id: "item-006",
        item_name: "Structured Blazer",
        item_image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
        selected_colour: "Camel",
        selected_size: "L",
        price: 6800000,
      },
    ],
    subtotal: 6800000,
    status: "CONFIRMED",
    placed_at: "2026-05-20T16:30:00Z",
    updated_at: "2026-05-20T17:00:00Z",
  },
];

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id);
}
