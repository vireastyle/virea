import type { Colour, Size } from "./clothing";

export type OutfitItem = {
  id: string;
  item_id: string;
  selected_colour: Colour;
  selected_size: Size;
};

export type Outfit = {
  id: string;
  user_id: string;
  name: string;
  items: OutfitItem[];
  preview_image_url?: string;
  created_at: string;
};
