"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StylingRequest, EventType } from "@/types/vendor";
import { mockStylingRequests } from "@/lib/mock/styling-requests";

type StylingRequestsState = {
  requests: StylingRequest[];
  submit: (
    vendorId: string,
    vendorName: string,
    outfitItemIds: string[],
    eventType: EventType,
    notes?: string,
    outfitSnapshot?: string
  ) => void;
  remove: (id: string) => void;
};

export const useStylingRequestsStore = create<StylingRequestsState>()(
  persist(
    (set) => ({
      requests: mockStylingRequests,

      submit: (vendorId, vendorName, outfitItemIds, eventType, notes, outfitSnapshot) => {
        const req: StylingRequest = {
          id: `sr-${Date.now()}`,
          user_id: "user-001",
          vendor_id: vendorId,
          vendor_name: vendorName,
          outfit_snapshot: outfitSnapshot,
          outfit_item_ids: outfitItemIds,
          event_type: eventType,
          notes,
          status: "pending",
          created_at: new Date().toISOString(),
        };
        set((s) => ({ requests: [req, ...s.requests] }));
      },

      remove: (id) =>
        set((s) => ({ requests: s.requests.filter((r) => r.id !== id) })),
    }),
    { name: "virea:styling-requests" }
  )
);
