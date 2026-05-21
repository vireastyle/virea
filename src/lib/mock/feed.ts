import type { ClothingItem } from "@/types/clothing";
import { mockClothing, getNewArrivals } from "./clothing";

export type HeroBanner = {
  id: string;
  headline: string;
  subheadline: string;
  cta_label: string;
  cta_href: string;
  image_url: string;
};

export const heroBanners: HeroBanner[] = [
  {
    id: "banner-001",
    headline: "Timeless elegance.",
    subheadline: "Discover the new season collection — curated for your style.",
    cta_label: "Explore Now",
    cta_href: "/shop/DRESS",
    image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
  },
  {
    id: "banner-002",
    headline: "Bold and proud.",
    subheadline: "Ankara prints. Contemporary silhouettes. Unapologetically you.",
    cta_label: "Shop Ankara",
    cta_href: "/shop/DRESS",
    image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
  },
];

export type FeedSection = {
  id: string;
  title: string;
  items: ClothingItem[];
  layout: "grid" | "scroll";
};

export const getHomeFeed = (): FeedSection[] => [
  {
    id: "new-in",
    title: "New In",
    items: getNewArrivals(),
    layout: "grid",
  },
  {
    id: "trending",
    title: "Trending Now",
    items: mockClothing.filter((i) => i.is_active).slice(0, 8),
    layout: "scroll",
  },
  {
    id: "bags",
    title: "Bags We Love",
    items: mockClothing.filter((i) => i.category === "BAG" && i.is_active),
    layout: "scroll",
  },
];

export const categories = [
  { id: "DRESS", label: "Dresses", emoji: "👗" },
  { id: "TOP", label: "Tops", emoji: "👚" },
  { id: "OUTERWEAR", label: "Outerwear", emoji: "🧥" },
  { id: "BAG", label: "Bags", emoji: "👜" },
  { id: "SHOES", label: "Shoes", emoji: "👠" },
] as const;
