/**
 * Maps DB (Prisma) entities to the frontend types used by stores and components.
 * All monetary values stay in kobo — no conversion here.
 */

import type { ClothingItem, Colour, Size, Category } from "@/types/clothing";
import type { Order, OrderItem, OrderStatus, PreOrder, PreOrderStatus } from "@/types/order";
import type { VendorProduct, VendorProductCategory } from "@/types/vendor";

// ─── DB shapes (as returned by Prisma includes) ──────────────────────────────

export type DbProduct = {
  id: string;
  vendorId: string;
  vendor?: { id: string; businessName: string; bio?: string | null };
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colours: string[];
  stock: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type DbOrderItem = {
  id: string;
  productId: string;
  product?: { id: string; name: string; images: string[] };
  quantity: number;
  size: string;
  colour: string;
  price: number;
};

export type DbOrder = {
  id: string;
  userId: string;
  vendorId: string;
  vendor?: { id: string; businessName: string };
  user?: { id: string; name: string; email: string };
  items: DbOrderItem[];
  total: number;
  status: string;
  address: string;
  txRef?: string | null;
  paidAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type DbPreOrder = {
  id: string;
  userId: string;
  vendorId: string;
  vendor?: { id: string; businessName: string };
  user?: { id: string; name: string; email: string };
  description: string;
  eventType: string;
  eventDate?: Date | string | null;
  budget?: number | null;
  status: string;
  quotedPrice?: number | null;
  quotedMessage?: string | null;
  estimatedDays?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

// ─── Pre-order status mapping ─────────────────────────────────────────────────

const DB_PRE_ORDER_STATUS: Record<string, PreOrderStatus> = {
  PENDING: "SUBMITTED",
  QUOTE_SENT: "QUOTED",
  QUOTE_ACCEPTED: "QUOTE_ACCEPTED",
  QUOTE_DECLINED: "QUOTE_DECLINED",
  IN_PRODUCTION: "IN_PROGRESS",
  READY: "IN_PROGRESS",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapDbProduct(p: DbProduct): ClothingItem {
  const colours: Colour[] = p.colours.map((name) => ({ name, hex: "#888888" }));
  const imageUrls: Record<string, string> = {};
  if (p.colours.length === 0 && p.images.length > 0) {
    imageUrls["Default"] = p.images[0];
  } else {
    p.colours.forEach((colourName, i) => {
      imageUrls[colourName] = p.images[i] ?? p.images[0] ?? "";
    });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const createdDate = new Date(p.createdAt as string);

  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category as Category,
    price: p.price,
    vendor_id: p.vendorId,
    available_colours: colours,
    available_sizes: p.sizes as Size[],
    image_urls: imageUrls,
    try_on_asset_urls: {},
    is_new_arrival: createdDate > thirtyDaysAgo,
    is_active: true,
    created_at: createdDate.toISOString(),
  };
}

export function mapDbProductToVendorProduct(p: DbProduct): VendorProduct {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const createdDate = new Date(p.createdAt as string);

  return {
    id: p.id,
    vendor_id: p.vendorId,
    name: p.name,
    category: p.category as VendorProductCategory,
    price: p.price,
    description: p.description,
    image_url: p.images[0] ?? "",
    available_sizes: p.sizes,
    available_colours: p.colours,
    stock: p.stock,
    is_active: p.stock > 0,
    is_new_arrival: createdDate > thirtyDaysAgo,
    created_at: createdDate.toISOString(),
  };
}

export function mapDbOrder(o: DbOrder): Order {
  const items: OrderItem[] = o.items.map((item) => ({
    item_id: item.productId,
    item_name: item.product?.name ?? "Product",
    item_image_url: item.product?.images[0] ?? "",
    selected_colour: item.colour,
    selected_size: item.size,
    price: item.price,
  }));

  return {
    id: o.id,
    user_id: o.userId,
    vendor_id: o.vendorId,
    vendor_name: o.vendor?.businessName ?? "",
    items,
    subtotal: o.total,
    status: o.status as OrderStatus,
    placed_at: new Date(o.createdAt as string).toISOString(),
    updated_at: new Date(o.updatedAt as string).toISOString(),
  };
}

export function mapDbPreOrder(po: DbPreOrder): PreOrder {
  return {
    id: po.id,
    user_id: po.userId,
    vendor_id: po.vendorId,
    vendor_name: po.vendor?.businessName,
    event_type: po.eventType as import("@/types/vendor").EventType,
    description: po.description,
    target_date: po.eventDate ? new Date(po.eventDate as string).toISOString() : "",
    quoted_price: po.quotedPrice ?? undefined,
    vendor_note: po.quotedMessage ?? undefined,
    status: DB_PRE_ORDER_STATUS[po.status] ?? "SUBMITTED",
    created_at: new Date(po.createdAt as string).toISOString(),
  };
}
