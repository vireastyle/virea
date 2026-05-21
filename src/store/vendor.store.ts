"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Vendor, VendorProduct, StylingRequest } from "@/types/vendor";
import { mockVendors } from "@/lib/mock/vendors";
import { mockStylingRequests } from "@/lib/mock/styling-requests";

const seedProducts: VendorProduct[] = [
  {
    id: "vp-001",
    vendor_id: "vendor-001",
    name: "Satin Flow Dress",
    category: "DRESS",
    price: 42000,
    description: "Fluid satin silhouette with deep V-neck. Fully lined. Available in 3 colourways.",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
    available_sizes: ["XS", "S", "M", "L", "XL"],
    available_colours: ["Midnight", "Champagne", "Forest"],
    stock: 12,
    is_active: true,
    is_new_arrival: true,
    created_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "vp-002",
    vendor_id: "vendor-001",
    name: "Adire Wrap Midi",
    category: "DRESS",
    price: 38000,
    description: "Traditional hand-dyed adire fabric in a modern midi wrap silhouette.",
    image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
    available_sizes: ["S", "M", "L", "XL"],
    available_colours: ["Indigo", "Rust"],
    stock: 7,
    is_active: true,
    is_new_arrival: false,
    created_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "vp-003",
    vendor_id: "vendor-001",
    name: "Linen Crop Top",
    category: "TOP",
    price: 18000,
    description: "Breathable linen crop, slightly boxy fit, with raw hem detail.",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    available_sizes: ["XS", "S", "M", "L"],
    available_colours: ["Ecru", "Sage"],
    stock: 20,
    is_active: true,
    is_new_arrival: false,
    created_at: "2026-04-01T09:00:00Z",
  },
  {
    id: "vp-004",
    vendor_id: "vendor-001",
    name: "Ankara Statement Blazer",
    category: "OUTERWEAR",
    price: 55000,
    description: "Structured blazer in bold Ankara print. Fully lined, single-button closure.",
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
    available_sizes: ["S", "M", "L", "XL"],
    available_colours: ["Royal"],
    stock: 5,
    is_active: false,
    is_new_arrival: false,
    created_at: "2026-03-20T08:00:00Z",
  },
];

type VendorState = {
  vendor: Vendor | null;
  isAuthenticated: boolean;
  products: VendorProduct[];
  stylingRequests: StylingRequest[];
  signIn: (vendor?: Vendor) => void;
  signOut: () => void;
  updateVendor: (partial: Partial<Vendor>) => void;
  addProduct: (data: Omit<VendorProduct, "id" | "vendor_id" | "created_at">) => string;
  updateProduct: (id: string, partial: Partial<VendorProduct>) => void;
  removeProduct: (id: string) => void;
  respondToStylingRequest: (id: string, response: string) => void;
  declineStylingRequest: (id: string) => void;
};

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      vendor: null,
      isAuthenticated: false,
      products: seedProducts,
      stylingRequests: mockStylingRequests,

      signIn: (vendor = mockVendors[0]) =>
        set({ vendor, isAuthenticated: true }),

      signOut: () =>
        set({ vendor: null, isAuthenticated: false }),

      updateVendor: (partial) =>
        set((s) => ({ vendor: s.vendor ? { ...s.vendor, ...partial } : s.vendor })),

      addProduct: (data) => {
        const id = `vp-${crypto.randomUUID()}`;
        const product: VendorProduct = {
          id,
          vendor_id: get().vendor?.id ?? "vendor-001",
          created_at: new Date().toISOString(),
          ...data,
        };
        set({ products: [product, ...get().products] });
        return id;
      },

      updateProduct: (id, partial) =>
        set({ products: get().products.map((p) => p.id === id ? { ...p, ...partial } : p) }),

      removeProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),

      respondToStylingRequest: (id, response) =>
        set({
          stylingRequests: get().stylingRequests.map((r) =>
            r.id === id ? { ...r, status: "responded", vendor_response: response } : r
          ),
        }),

      declineStylingRequest: (id) =>
        set({
          stylingRequests: get().stylingRequests.map((r) =>
            r.id === id ? { ...r, status: "declined" } : r
          ),
        }),
    }),
    { name: "virea:vendor" }
  )
);

export function buildMockVendor(data: {
  business_name: string;
  owner_name: string;
  email: string;
  category_tags: string[];
  bio: string;
  cover_image_url?: string;
  bank_account_number: string;
  bank_name: string;
  bvn: string;
}): Vendor {
  return {
    id: `vendor-${crypto.randomUUID()}`,
    flutterwave_subaccount_id: `sub_mock_${crypto.randomUUID()}`,
    ...data,
  };
}
