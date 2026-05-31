export type Category = "DRESS" | "TOP" | "OUTERWEAR" | "BAG" | "SHOES";

export type Colour = {
  name: string;
  hex: string;
};

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ClothingItem = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;          // stored in kobo (integer)
  vendor_id?: string;     // set when item comes from real DB; undefined on mock items
  available_colours: Colour[];
  available_sizes: Size[];
  body_types?: string[];  // empty = fits all; populated = specific body types only
  image_urls: Record<string, string>;
  try_on_asset_urls: Record<string, string>;
  is_new_arrival: boolean;
  is_active: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  item: ClothingItem;
  selected_colour: Colour;
  selected_size: Size;
  added_at: string;
};
