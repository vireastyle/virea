export type BodyShape = "hourglass" | "pear" | "apple" | "rectangle" | "inverted-triangle";

export type SkinTone = {
  id: string;
  label: string;
  hex: string;
};

export type HairStyle = "natural-coils" | "braids" | "locs" | "straight" | "waves" | "low-cut";

export type HairColour = {
  id: string;
  label: string;
  hex: string;
};

export type HeightRange = "petite" | "average" | "tall";

export type SizeRange = "XS-S" | "M-L" | "XL-XXL";

export type AvatarGender = "female" | "male";

export type Avatar = {
  id: string;
  user_id: string;
  gender: AvatarGender;
  body_shape: BodyShape;
  skin_tone: SkinTone;
  hair_style: HairStyle;
  hair_colour: HairColour;
  height_range: HeightRange;
  size_range: SizeRange;
  updated_at: string;
};
