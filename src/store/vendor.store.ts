"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Vendor, VendorProduct, StylingRequest } from "@/types/vendor";
import { mockStylingRequests } from "@/lib/mock/styling-requests";
import { apiToken } from "@/lib/api-token";
import { apiFetch } from "@/lib/api";
import { mapDbProductToVendorProduct, type DbProduct } from "@/lib/mappers";

// Shape the API returns for a vendor record (no password)
type ApiVendor = {
  id: string;
  email: string;
  businessName: string;
  bio: string | null;
  categories: string[];
  bankName: string;
  accountNumber: string;
  accountName: string;
  tier: "FREE" | "PRO";
  createdAt: string;
};

function mapApiVendor(v: ApiVendor): Vendor {
  return {
    id: v.id,
    email: v.email,
    business_name: v.businessName,
    owner_name: v.accountName,
    category_tags: v.categories,
    bio: v.bio ?? "",
    bank_account_number: v.accountNumber,
    bank_name: v.bankName,
    // Fields not in DB yet — kept for type compatibility
    bvn: "",
    flutterwave_subaccount_id: "",
  };
}

const seedProducts: VendorProduct[] = [
  {
    id: "vp-001",
    vendor_id: "vendor-001",
    name: "Satin Flow Dress",
    category: "DRESS",
    price: 4200000,
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
    price: 3800000,
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
    price: 1800000,
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
    price: 5500000,
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

type VendorRegisterData = {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  categoryTags: string[];
  bankName: string;
  accountNumber: string;
};

type VendorState = {
  vendor: Vendor | null;
  isAuthenticated: boolean;
  products: VendorProduct[];
  stylingRequests: StylingRequest[];

  // ── Real API actions ──────────────────────────────────────
  login: (email: string, password: string) => Promise<void>;
  register: (data: VendorRegisterData) => Promise<void>;
  fetchProducts: () => Promise<void>;

  // ── Legacy / local helpers ────────────────────────────────
  signIn: (vendor: Vendor) => void;
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

      // ── Login ───────────────────────────────────────────────
      login: async (email, password) => {
        const res = await fetch("/api/v1/auth/vendor/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const body = await res.json();
        if (!body.success) throw new Error(body.error?.message ?? "Login failed");
        const { vendor, accessToken } = body.data as { vendor: ApiVendor; accessToken: string };
        apiToken.set(accessToken);
        set({ vendor: mapApiVendor(vendor), isAuthenticated: true });
      },

      // ── Register ────────────────────────────────────────────
      register: async ({ businessName, ownerName, email, password, categoryTags, bankName, accountNumber }) => {
        const res = await fetch("/api/v1/auth/vendor/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            businessName,
            bankName,
            accountNumber,
            accountName: ownerName,   // owner name doubles as bank account name
            categories: categoryTags.length > 0 ? categoryTags : ["DRESS"],
          }),
          credentials: "include",
        });
        const body = await res.json();
        if (!body.success) throw new Error(body.error?.message ?? "Registration failed");
        const { vendor, accessToken } = body.data as { vendor: ApiVendor; accessToken: string };
        apiToken.set(accessToken);
        set({ vendor: mapApiVendor(vendor), isAuthenticated: true });
      },

      // ── Fetch products from DB (fallback: keep seed data) ──
      fetchProducts: async () => {
        try {
          const data = await apiFetch<DbProduct[]>("/vendor/products");
          if (data.length > 0) set({ products: data.map(mapDbProductToVendorProduct) });
        } catch {
          // Not authenticated or network error — keep existing data
        }
      },

      // ── Legacy helpers ──────────────────────────────────────
      signIn: (vendor) => set({ vendor, isAuthenticated: true }),

      signOut: () => {
        fetch("/api/v1/auth/logout", {
          method: "POST",
          credentials: "include",
        }).catch(() => null);
        apiToken.set(null);
        set({ vendor: null, isAuthenticated: false });
      },

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
        set({ products: get().products.map((p) => (p.id === id ? { ...p, ...partial } : p)) }),

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
