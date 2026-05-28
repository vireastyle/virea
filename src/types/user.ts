export type Tier = "FREE" | "PRO";

export type Gender = "female" | "male";

export type BodySize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type BodyType =
  | "hourglass"
  | "pear"
  | "apple"
  | "rectangle"
  | "inverted-triangle"
  | "oval"
  | "athletic";

export type StyleType =
  | "casual"
  | "formal"
  | "streetwear"
  | "traditional"
  | "party"
  | "outdoor"
  | "afrocentric"
  | "minimalist"
  | "bold"
  | "editorial";

export type StyleTag = StyleType;

export type User = {
  id: string;
  display_name: string;
  email: string;
  profile_photo_url?: string;
  // Body profile
  gender?: Gender;
  height_cm?: number;
  weight_kg?: number;
  color_complexion?: string;
  body_size?: BodySize;
  body_type?: BodyType;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  // Style preferences
  favorite_colors?: string[];
  style_types?: StyleType[];
  selfie_stored_locally?: boolean;
  account_tier: Tier;
  created_at: string;
};
