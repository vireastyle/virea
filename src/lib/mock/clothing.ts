import type { ClothingItem } from "@/types/clothing";

export const mockClothing: ClothingItem[] = [
  // ── DRESSES ──
  {
    id: "item-001",
    name: "Satin Flow Dress",
    brand: "Adire Studio",
    category: "DRESS",
    price: 42000,
    available_colours: [
      { name: "Midnight", hex: "#1A1A2E" },
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "Forest", hex: "#2D4A47" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL"],
    image_urls: {
      Midnight: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
      Champagne: "https://images.unsplash.com/photo-1566479179817-c3c19b6e6ca9?w=400&q=80",
      Forest: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
    },
    try_on_asset_urls: {
      Midnight: "/try-on/satin-flow-midnight.png",
      Champagne: "/try-on/satin-flow-champagne.png",
      Forest: "/try-on/satin-flow-forest.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "item-002",
    name: "Lagos Wrap Dress",
    brand: "House of Aya",
    category: "DRESS",
    price: 35000,
    available_colours: [
      { name: "Terracotta", hex: "#C07652" },
      { name: "Ivory", hex: "#FFFFF0" },
    ],
    available_sizes: ["S", "M", "L", "XL", "XXL"],
    image_urls: {
      Terracotta: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80",
      Ivory: "https://images.unsplash.com/photo-1529898329131-589bbab9ebca?w=400&q=80",
    },
    try_on_asset_urls: {
      Terracotta: "/try-on/lagos-wrap-terracotta.png",
      Ivory: "/try-on/lagos-wrap-ivory.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-03T10:00:00Z",
  },
  {
    id: "item-003",
    name: "Linen Slip Dress",
    brand: "Rubē",
    category: "DRESS",
    price: 28500,
    available_colours: [
      { name: "Sand", hex: "#C2B280" },
      { name: "Blush", hex: "#F4A7A3" },
    ],
    available_sizes: ["XS", "S", "M", "L"],
    image_urls: {
      Sand: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
      Blush: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=400&q=80",
    },
    try_on_asset_urls: {
      Sand: "/try-on/linen-slip-sand.png",
      Blush: "/try-on/linen-slip-blush.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "item-004",
    name: "Ankara Print Midi",
    brand: "Nkem Collective",
    category: "DRESS",
    price: 38000,
    available_colours: [
      { name: "Gold Print", hex: "#D4AF37" },
      { name: "Blue Print", hex: "#2B4F8E" },
    ],
    available_sizes: ["S", "M", "L", "XL"],
    image_urls: {
      "Gold Print": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
      "Blue Print": "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80",
    },
    try_on_asset_urls: {
      "Gold Print": "/try-on/ankara-midi-gold.png",
      "Blue Print": "/try-on/ankara-midi-blue.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "item-005",
    name: "Pleated Maxi Dress",
    brand: "Adire Studio",
    category: "DRESS",
    price: 55000,
    available_colours: [
      { name: "Onyx", hex: "#353935" },
      { name: "Dusty Rose", hex: "#C4A0A0" },
      { name: "Sage", hex: "#8FAF8F" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image_urls: {
      Onyx: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80",
      "Dusty Rose": "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&q=80",
      Sage: "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400&q=80",
    },
    try_on_asset_urls: {
      Onyx: "/try-on/pleated-maxi-onyx.png",
      "Dusty Rose": "/try-on/pleated-maxi-rose.png",
      Sage: "/try-on/pleated-maxi-sage.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-10T10:00:00Z",
  },

  // ── TOPS ──
  {
    id: "item-006",
    name: "Draped Shoulder Top",
    brand: "Rubē",
    category: "TOP",
    price: 18000,
    available_colours: [
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Chocolate", hex: "#4B2C20" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL"],
    image_urls: {
      Cream: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=80",
      Chocolate: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",
    },
    try_on_asset_urls: {
      Cream: "/try-on/draped-shoulder-cream.png",
      Chocolate: "/try-on/draped-shoulder-chocolate.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-05T10:00:00Z",
  },
  {
    id: "item-007",
    name: "Structured Blazer",
    brand: "Tóbi Adekoya",
    category: "TOP",
    price: 62000,
    available_colours: [
      { name: "Caramel", hex: "#C68642" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Cobalt", hex: "#0047AB" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL"],
    image_urls: {
      Caramel: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
      Black: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=400&q=80",
      Cobalt: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400&q=80",
    },
    try_on_asset_urls: {
      Caramel: "/try-on/blazer-caramel.png",
      Black: "/try-on/blazer-black.png",
      Cobalt: "/try-on/blazer-cobalt.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-03-20T10:00:00Z",
  },
  {
    id: "item-008",
    name: "Lace Trim Camisole",
    brand: "House of Aya",
    category: "TOP",
    price: 14500,
    available_colours: [
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Blush", hex: "#F4A7A3" },
      { name: "Sage", hex: "#8FAF8F" },
    ],
    available_sizes: ["XS", "S", "M", "L"],
    image_urls: {
      Ivory: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80",
      Blush: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=400&q=80",
      Sage: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80",
    },
    try_on_asset_urls: {
      Ivory: "/try-on/cami-ivory.png",
      Blush: "/try-on/cami-blush.png",
      Sage: "/try-on/cami-sage.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-04-15T10:00:00Z",
  },
  {
    id: "item-009",
    name: "Knitwear Crop Top",
    brand: "Rubē",
    category: "TOP",
    price: 22000,
    available_colours: [
      { name: "Camel", hex: "#C19A6B" },
      { name: "Ecru", hex: "#F0EAD6" },
    ],
    available_sizes: ["S", "M", "L", "XL"],
    image_urls: {
      Camel: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&q=80",
      Ecru: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",
    },
    try_on_asset_urls: {
      Camel: "/try-on/knit-crop-camel.png",
      Ecru: "/try-on/knit-crop-ecru.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-08T10:00:00Z",
  },

  // ── OUTERWEAR ──
  {
    id: "item-010",
    name: "Trench Coat",
    brand: "Tóbi Adekoya",
    category: "OUTERWEAR",
    price: 95000,
    available_colours: [
      { name: "Classic Tan", hex: "#C8A96E" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL"],
    image_urls: {
      "Classic Tan": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
      Black: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=80",
    },
    try_on_asset_urls: {
      "Classic Tan": "/try-on/trench-tan.png",
      Black: "/try-on/trench-black.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "item-011",
    name: "Longline Cardigan",
    brand: "Nkem Collective",
    category: "OUTERWEAR",
    price: 32000,
    available_colours: [
      { name: "Oatmeal", hex: "#D4C5A9" },
      { name: "Forest", hex: "#2D4A47" },
      { name: "Burgundy", hex: "#800020" },
    ],
    available_sizes: ["S", "M", "L", "XL", "XXL"],
    image_urls: {
      Oatmeal: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80",
      Forest: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
      Burgundy: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80",
    },
    try_on_asset_urls: {
      Oatmeal: "/try-on/cardigan-oatmeal.png",
      Forest: "/try-on/cardigan-forest.png",
      Burgundy: "/try-on/cardigan-burgundy.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-12T10:00:00Z",
  },
  {
    id: "item-012",
    name: "Denim Jacket",
    brand: "Adire Studio",
    category: "OUTERWEAR",
    price: 48000,
    available_colours: [
      { name: "Light Wash", hex: "#A8C4D0" },
      { name: "Dark Wash", hex: "#2B3A4A" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL"],
    image_urls: {
      "Light Wash": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
      "Dark Wash": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
    },
    try_on_asset_urls: {
      "Light Wash": "/try-on/denim-light.png",
      "Dark Wash": "/try-on/denim-dark.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-04-05T10:00:00Z",
  },

  // ── BAGS ──
  {
    id: "item-013",
    name: "Mini Bucket Bag",
    brand: "House of Aya",
    category: "BAG",
    price: 52000,
    available_colours: [
      { name: "Cognac", hex: "#9A4722" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Champagne", hex: "#F7E7CE" },
    ],
    available_sizes: ["S"],
    image_urls: {
      Cognac: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
      Black: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f07?w=400&q=80",
      Champagne: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80",
    },
    try_on_asset_urls: {
      Cognac: "/try-on/bucket-cognac.png",
      Black: "/try-on/bucket-black.png",
      Champagne: "/try-on/bucket-champagne.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-06T10:00:00Z",
  },
  {
    id: "item-014",
    name: "Woven Tote",
    brand: "Nkem Collective",
    category: "BAG",
    price: 29000,
    available_colours: [
      { name: "Natural", hex: "#D4C5A9" },
      { name: "Terracotta", hex: "#C07652" },
    ],
    available_sizes: ["M"],
    image_urls: {
      Natural: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&q=80",
      Terracotta: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80",
    },
    try_on_asset_urls: {
      Natural: "/try-on/tote-natural.png",
      Terracotta: "/try-on/tote-terracotta.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-03-15T10:00:00Z",
  },
  {
    id: "item-015",
    name: "Structured Clutch",
    brand: "Tóbi Adekoya",
    category: "BAG",
    price: 41000,
    available_colours: [
      { name: "Gold", hex: "#D4AF37" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    available_sizes: ["S"],
    image_urls: {
      Gold: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80",
      Black: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    },
    try_on_asset_urls: {
      Gold: "/try-on/clutch-gold.png",
      Black: "/try-on/clutch-black.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-09T10:00:00Z",
  },

  // ── SHOES ──
  {
    id: "item-016",
    name: "Block Heel Mule",
    brand: "Adire Studio",
    category: "SHOES",
    price: 38000,
    available_colours: [
      { name: "Nude", hex: "#E5C9A0" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    available_sizes: ["S", "M", "L"],
    image_urls: {
      Nude: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
      Black: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=400&q=80",
    },
    try_on_asset_urls: {
      Nude: "/try-on/mule-nude.png",
      Black: "/try-on/mule-black.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-11T10:00:00Z",
  },
  {
    id: "item-017",
    name: "Strappy Sandal",
    brand: "House of Aya",
    category: "SHOES",
    price: 25000,
    available_colours: [
      { name: "Gold", hex: "#D4AF37" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Cognac", hex: "#9A4722" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL"],
    image_urls: {
      Gold: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=80",
      Silver: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&q=80",
      Cognac: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80",
    },
    try_on_asset_urls: {
      Gold: "/try-on/sandal-gold.png",
      Silver: "/try-on/sandal-silver.png",
      Cognac: "/try-on/sandal-cognac.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-04-20T10:00:00Z",
  },
  {
    id: "item-018",
    name: "Pointed Kitten Heel",
    brand: "Tóbi Adekoya",
    category: "SHOES",
    price: 44000,
    available_colours: [
      { name: "Blush", hex: "#F4A7A3" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    available_sizes: ["S", "M", "L"],
    image_urls: {
      Blush: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=400&q=80",
      Black: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&q=80",
    },
    try_on_asset_urls: {
      Blush: "/try-on/kitten-blush.png",
      Black: "/try-on/kitten-black.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-14T10:00:00Z",
  },
  {
    id: "item-019",
    name: "Platform Sneaker",
    brand: "Nkem Collective",
    category: "SHOES",
    price: 31000,
    available_colours: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Sage", hex: "#8FAF8F" },
    ],
    available_sizes: ["XS", "S", "M", "L", "XL"],
    image_urls: {
      White: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      Sage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
    },
    try_on_asset_urls: {
      White: "/try-on/sneaker-white.png",
      Sage: "/try-on/sneaker-sage.png",
    },
    is_new_arrival: false,
    is_active: true,
    created_at: "2026-04-25T10:00:00Z",
  },
  {
    id: "item-020",
    name: "Leather Loafer",
    brand: "Rubē",
    category: "SHOES",
    price: 48500,
    available_colours: [
      { name: "Cognac", hex: "#9A4722" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Cream", hex: "#FFFDD0" },
    ],
    available_sizes: ["S", "M", "L", "XL"],
    image_urls: {
      Cognac: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=400&q=80",
      Black: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80",
      Cream: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&q=80",
    },
    try_on_asset_urls: {
      Cognac: "/try-on/loafer-cognac.png",
      Black: "/try-on/loafer-black.png",
      Cream: "/try-on/loafer-cream.png",
    },
    is_new_arrival: true,
    is_active: true,
    created_at: "2026-05-13T10:00:00Z",
  },
];

export const getItemById = (id: string) =>
  mockClothing.find((item) => item.id === id);

export const getItemsByCategory = (category: string) =>
  mockClothing.filter(
    (item) => item.category === category && item.is_active
  );

export const getNewArrivals = () =>
  mockClothing.filter((item) => item.is_new_arrival && item.is_active);

export const getTrending = () => mockClothing.filter((item) => item.is_active).slice(0, 8);
