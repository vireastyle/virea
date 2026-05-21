import type { EventType } from "./vendor";

export const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  item_id: string;
  item_name: string;
  item_image_url: string;
  selected_colour: string;
  selected_size: string;
  price: number;
};

export type Order = {
  id: string;
  user_id: string;
  vendor_id: string;
  vendor_name: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  placed_at: string;
  updated_at: string;
};

export const PRE_ORDER_STATUSES = [
  "SUBMITTED",
  "QUOTED",
  "QUOTE_ACCEPTED",
  "QUOTE_DECLINED",
  "IN_PROGRESS",
  "DELIVERED",
  "CANCELLED",
] as const;

export type PreOrderStatus = (typeof PRE_ORDER_STATUSES)[number];

export type PreOrder = {
  id: string;
  user_id: string;
  vendor_id?: string;
  vendor_name?: string;
  event_type: EventType;
  description: string;
  reference_photo?: string;
  target_date: string;
  quoted_price?: number;
  vendor_note?: string;
  status: PreOrderStatus;
  created_at: string;
};
