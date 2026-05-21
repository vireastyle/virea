import type { SkinTone, HairColour, BodyShape, HairStyle, HeightRange, SizeRange } from "@/types/avatar";

export const skinTones: SkinTone[] = [
  { id: "st-1", label: "Porcelain", hex: "#FDEBD0" },
  { id: "st-2", label: "Beige", hex: "#F5CBA7" },
  { id: "st-3", label: "Honey", hex: "#D4A574" },
  { id: "st-4", label: "Caramel", hex: "#C68642" },
  { id: "st-5", label: "Mocha", hex: "#8D5524" },
  { id: "st-6", label: "Espresso", hex: "#5C3317" },
  { id: "st-7", label: "Ebony", hex: "#3C1810" },
  { id: "st-8", label: "Onyx", hex: "#1F0E07" },
];

export const hairColours: HairColour[] = [
  { id: "hc-1", label: "Jet Black", hex: "#0D0D0D" },
  { id: "hc-2", label: "Dark Brown", hex: "#3B1E08" },
  { id: "hc-3", label: "Auburn", hex: "#922724" },
  { id: "hc-4", label: "Golden", hex: "#D4AF37" },
  { id: "hc-5", label: "Ash Blonde", hex: "#B8A99A" },
  { id: "hc-6", label: "Platinum", hex: "#E8DFD0" },
];

export const bodyShapes: { id: BodyShape; label: string; description: string }[] = [
  { id: "hourglass", label: "Hourglass", description: "Balanced shoulders and hips, defined waist" },
  { id: "pear", label: "Pear", description: "Hips wider than shoulders" },
  { id: "apple", label: "Apple", description: "Fullness around the midsection" },
  { id: "rectangle", label: "Rectangle", description: "Similar shoulder, waist, and hip width" },
  { id: "inverted-triangle", label: "Inverted Triangle", description: "Shoulders wider than hips" },
];

export const hairStyles: { id: HairStyle; label: string }[] = [
  { id: "natural-coils", label: "Natural Coils" },
  { id: "braids", label: "Braids" },
  { id: "locs", label: "Locs" },
  { id: "straight", label: "Straight" },
  { id: "waves", label: "Waves" },
  { id: "low-cut", label: "Low Cut" },
];

export const heightRanges: { id: HeightRange; label: string; range: string }[] = [
  { id: "petite", label: "Petite", range: "Under 5'4\" / 163cm" },
  { id: "average", label: "Average", range: "5'4\" – 5'7\" / 163–170cm" },
  { id: "tall", label: "Tall", range: "5'7\"+ / 170cm+" },
];

export const sizeRanges: { id: SizeRange; label: string }[] = [
  { id: "XS-S", label: "XS – S" },
  { id: "M-L", label: "M – L" },
  { id: "XL-XXL", label: "XL – XXL" },
];

export const defaultAvatar = {
  body_shape: "hourglass" as BodyShape,
  skin_tone: skinTones[4],
  hair_style: "natural-coils" as HairStyle,
  hair_colour: hairColours[0],
  height_range: "average" as HeightRange,
  size_range: "M-L" as SizeRange,
};
