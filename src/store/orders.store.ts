"use client";

import { create } from "zustand";
import type { Order, PreOrder, PreOrderStatus, OrderStatus } from "@/types/order";
import { apiFetch } from "@/lib/api";
import { mapDbOrder, mapDbPreOrder, type DbOrder, type DbPreOrder } from "@/lib/mappers";
import { mockOrders } from "@/lib/mock/orders";
import { mockPreOrders } from "@/lib/mock/pre-orders";

type OrdersState = {
  orders: Order[];
  preOrders: PreOrder[];

  fetchOrders: () => Promise<void>;
  fetchPreOrders: () => Promise<void>;

  // Optimistic local helpers (used after API mutations)
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePreOrderStatus: (id: string, status: PreOrderStatus) => void;
  addVendorQuote: (id: string, price: number, note: string) => void;
};

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  // Mock data as starting state so the UI always has something to show
  orders: mockOrders,
  preOrders: mockPreOrders,

  fetchOrders: async () => {
    try {
      const data = await apiFetch<DbOrder[]>("/orders");
      // If DB returns real orders, replace mock; otherwise keep mock for testing
      if (data.length > 0) set({ orders: data.map(mapDbOrder) });
    } catch {
      // Not authenticated or network error — keep existing data
    }
  },

  fetchPreOrders: async () => {
    try {
      const data = await apiFetch<DbPreOrder[]>("/pre-orders");
      if (data.length > 0) set({ preOrders: data.map(mapDbPreOrder) });
    } catch {
      // Keep existing data
    }
  },

  updateOrderStatus: (id, status) =>
    set({ orders: get().orders.map((o) => o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o) }),

  updatePreOrderStatus: (id, status) =>
    set({ preOrders: get().preOrders.map((p) => p.id === id ? { ...p, status } : p) }),

  addVendorQuote: (id, price, note) =>
    set({
      preOrders: get().preOrders.map((p) =>
        p.id === id ? { ...p, quoted_price: price, vendor_note: note, status: "QUOTED" as PreOrderStatus } : p
      ),
    }),
}));
