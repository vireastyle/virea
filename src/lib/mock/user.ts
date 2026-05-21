import type { User } from "@/types/user";
import type { Avatar } from "@/types/avatar";

export const mockUser: User = {
  id: "user-001",
  display_name: "Amara Osei",
  email: "amara@example.com",
  profile_photo_url: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=200&q=80",
  // Body profile
  height_cm: 168,
  weight_kg: 62,
  color_complexion: "Mocha",
  body_size: "M",
  body_type: "hourglass",
  chest_cm: 90,
  waist_cm: 70,
  hips_cm: 96,
  // Style preferences
  favorite_colors: ["#3B6F68", "#C7A760", "#1A1A1A", "#8B3A3A"],
  style_types: ["afrocentric", "editorial", "casual"],
  selfie_stored_locally: false,
  account_tier: "FREE",
  created_at: "2026-04-01T10:00:00Z",
};

export const mockAvatar: Avatar = {
  id: "avatar-001",
  user_id: "user-001",
  body_shape: "hourglass",
  skin_tone: { id: "st-5", label: "Mocha", hex: "#8D5524" },
  hair_style: "natural-coils",
  hair_colour: { id: "hc-1", label: "Jet Black", hex: "#0D0D0D" },
  height_range: "average",
  size_range: "M-L",
  updated_at: "2026-04-01T10:00:00Z",
};
