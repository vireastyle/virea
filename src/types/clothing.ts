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
  price: number;
  available_colours: Colour[];
  available_sizes: Size[];
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
