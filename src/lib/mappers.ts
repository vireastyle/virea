/**
 * Maps DB (Prisma) entities to the frontend types used by stores and components.
 * All monetary values stay in kobo — no conversion here.
 */

import type { ClothingItem, Colour, Size, Category } from "@/types/clothing";
import type { Order, OrderItem, OrderStatus, PreOrder, PreOrderStatus } from "@/types/order";
import type { VendorProduct, VendorProductCategory } from "@/types/vendor";

// ─── Colour name → hex lookup ────────────────────────────────────────────────
// Normalise the vendor-typed colour name to lowercase-no-spaces, then look up.
// Fallback: try matching the first word. Final fallback: neutral #888888.
const COLOUR_HEX: Record<string, string> = {
  // Blacks / dark neutrals
  black: "#1A1A1A", onyx: "#353935", charcoal: "#36454F", graphite: "#474747",
  ebony: "#555D50", midnight: "#191970",
  // Whites / light neutrals
  white: "#FFFFFF", ivory: "#FFFFF0", cream: "#FFFDD0", ecru: "#C2B280",
  offwhite: "#FAF9F6", nude: "#E3BC9A",
  // Greys
  grey: "#888888", gray: "#888888", silver: "#C0C0C0", slate: "#708090",
  // Earth / warm neutrals
  beige: "#F5F5DC", sand: "#C2B280", tan: "#D2B48C", camel: "#C19A6B",
  khaki: "#C3B091", taupe: "#483C32", mushroom: "#A89070",
  // Champagne / gold tones
  champagne: "#F7E7CE", gold: "#D4AF37", amber: "#FFBF00",
  mustard: "#FFDB58", saffron: "#F4C430", caramel: "#C68642",
  // Blues
  blue: "#0000FF", navy: "#000080", cobalt: "#0047AB",
  royal: "#4169E1", sky: "#87CEEB", powder: "#B0E0E6",
  teal: "#008080", indigo: "#4B0082", denim: "#1560BD", azure: "#007FFF",
  // Greens
  green: "#008000", forest: "#2D4A47", sage: "#8FAF8F", olive: "#808000",
  emerald: "#50C878", mint: "#98FF98", pistachio: "#93C572",
  // Reds & pinks
  red: "#CC0000", burgundy: "#800020", wine: "#722F37",
  rust: "#B7410E", terracotta: "#C07652", coral: "#FF7F50",
  pink: "#FFC0CB", blush: "#F4A7A3", rose: "#FF007F",
  dustyrose: "#C4A0A0", fuchsia: "#FF00FF", magenta: "#FF00FF",
  hotpink: "#FF69B4", mauve: "#E0B0FF",
  // Oranges
  orange: "#FFA500", peach: "#FFE5B4", apricot: "#FBCEB1",
  // Purples
  purple: "#800080", plum: "#DDA0DD", lavender: "#E6E6FA",
  lilac: "#C8A2C8", violet: "#EE82EE",
  // Browns
  brown: "#A52A2A", chocolate: "#4B2C20", mocha: "#967117",
  coffee: "#6F4E37",
  // Misc
  lemon: "#FFF44F", yellow: "#FFFF00", aqua: "#00FFFF",
  turquoise: "#40E0D0",
};

function colourNameToHex(name: string): string {
  const key = name.toLowerCase().replace(/[\s\-_]/g, "");
  if (COLOUR_HEX[key]) return COLOUR_HEX[key];
  // Try first word only ("Dusty Rose" → "dusty")
  const firstWord = name.toLowerCase().split(/[\s\-_]/)[0];
  return COLOUR_HEX[firstWord] ?? "#888888";
}

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
  bodyTypes?: string[];
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
  const colours: Colour[] = p.colours.map((name) => ({ name, hex: colourNameToHex(name) }));
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
    body_types: p.bodyTypes ?? [],
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
    images: p.images,
    available_sizes: p.sizes,
    available_colours: p.colours,
    body_types: p.bodyTypes ?? [],
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
