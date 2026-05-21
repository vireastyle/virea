export type Vendor = {
  id: string;
  business_name: string;
  owner_name: string;
  email?: string;
  category_tags: string[];
  bio: string;
  avatar_url?: string;
  cover_image_url?: string;
  bank_account_number?: string;
  bank_name?: string;
  bvn?: string;
  flutterwave_subaccount_id?: string;
};

export const EVENT_TYPES = [
  "Wedding",
  "Owambe",
  "Party",
  "Corporate",
  "Casual",
  "Naming Ceremony",
  "Graduation",
  "Date Night",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type StylingRequestStatus = "pending" | "accepted" | "responded" | "declined";

export type StylingRequest = {
  id: string;
  user_id: string;
  vendor_id: string;
  vendor_name: string;
  outfit_snapshot?: string;
  outfit_item_ids: string[];
  event_type: EventType;
  notes?: string;
  status: StylingRequestStatus;
  vendor_response?: string;
  created_at: string;
};

export const VENDOR_PRODUCT_CATEGORIES = ["DRESS", "TOP", "OUTERWEAR", "BAG", "SHOES"] as const;
export type VendorProductCategory = (typeof VENDOR_PRODUCT_CATEGORIES)[number];

export type VendorProduct = {
  id: string;
  vendor_id: string;
  name: string;
  category: VendorProductCategory;
  price: number;
  description: string;
  image_url: string;
  available_sizes: string[];
  available_colours: string[];
  stock: number;
  is_active: boolean;
  is_new_arrival: boolean;
  created_at: string;
};
