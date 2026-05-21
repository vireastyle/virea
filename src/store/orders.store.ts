"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, PreOrder, PreOrderStatus } from "@/types/order";
import type { CartItem } from "@/types/clothing";
import type { EventType } from "@/types/vendor";
import { mockOrders } from "@/lib/mock/orders";
import { mockPreOrders } from "@/lib/mock/pre-orders";

type NewPreOrderData = {
  vendor_id?: string;
  vendor_name?: string;
  event_type: EventType;
  description: string;
  reference_photo?: string;
  target_date: string;
};

type OrdersState = {
  orders: Order[];
  preOrders: PreOrder[];
  createOrder: (cartItems: CartItem[]) => string;
  createPreOrder: (data: NewPreOrderData) => string;
  updatePreOrderStatus: (id: string, status: PreOrderStatus) => void;
  updateOrderStatus: (id: string, status: import("@/types/order").OrderStatus) => void;
  addVendorQuote: (id: string, price: number, note: string) => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      preOrders: mockPreOrders,

      createOrder: (cartItems) => {
        const id = `order-${crypto.randomUUID()}`;
        const now = new Date().toISOString();
        const first = cartItems[0];

        const newOrder: Order = {
          id,
          user_id: "user-demo",
          vendor_id: "vendor-001",
          vendor_name: first.item.brand,
          items: cartItems.map((ci) => ({
            item_id: ci.item.id,
            item_name: ci.item.name,
            item_image_url: ci.item.image_urls[ci.selected_colour.name] ?? "",
            selected_colour: ci.selected_colour.name,
            selected_size: ci.selected_size,
            price: ci.item.price,
          })),
          subtotal: cartItems.reduce((sum, ci) => sum + ci.item.price, 0),
          status: "PLACED",
          placed_at: now,
          updated_at: now,
        };

        set({ orders: [newOrder, ...get().orders] });
        return id;
      },

      createPreOrder: (data) => {
        const id = `pre-order-${crypto.randomUUID()}`;
        const newPreOrder: PreOrder = {
          id,
          user_id: "user-demo",
          status: "SUBMITTED",
          created_at: new Date().toISOString(),
          ...data,
        };
        set({ preOrders: [newPreOrder, ...get().preOrders] });
        return id;
      },

      updatePreOrderStatus: (id, status) => {
        set({
          preOrders: get().preOrders.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        });
      },

      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o
          ),
        });
      },

      addVendorQuote: (id, price, note) => {
        set({
          preOrders: get().preOrders.map((p) =>
            p.id === id
              ? { ...p, quoted_price: price, vendor_note: note, status: "QUOTED" }
              : p
          ),
        });
      },
    }),
    { name: "virea:orders" }
  )
);
