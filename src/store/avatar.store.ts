"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Avatar, BodyShape, SkinTone, HairStyle, HairColour, HeightRange, SizeRange } from "@/types/avatar";
import { mockAvatar } from "@/lib/mock/user";

type AvatarState = {
  avatar: Avatar | null;
  isComplete: boolean;
  setAvatar: (avatar: Avatar) => void;
  updateBodyShape: (shape: BodyShape) => void;
  updateSkinTone: (tone: SkinTone) => void;
  updateHairStyle: (style: HairStyle) => void;
  updateHairColour: (colour: HairColour) => void;
  updateHeightRange: (range: HeightRange) => void;
  updateSizeRange: (range: SizeRange) => void;
  resetAvatar: () => void;
};

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => ({
      avatar: null,
      isComplete: false,

      setAvatar: (avatar) => set({ avatar, isComplete: true }),

      updateBodyShape: (body_shape) => {
        const current = get().avatar ?? { ...mockAvatar, id: "avatar-draft", user_id: "" };
        set({ avatar: { ...current, body_shape, updated_at: new Date().toISOString() } });
      },

      updateSkinTone: (skin_tone) => {
        const current = get().avatar ?? { ...mockAvatar, id: "avatar-draft", user_id: "" };
        set({ avatar: { ...current, skin_tone, updated_at: new Date().toISOString() } });
      },

      updateHairStyle: (hair_style) => {
        const current = get().avatar ?? { ...mockAvatar, id: "avatar-draft", user_id: "" };
        set({ avatar: { ...current, hair_style, updated_at: new Date().toISOString() } });
      },

      updateHairColour: (hair_colour) => {
        const current = get().avatar ?? { ...mockAvatar, id: "avatar-draft", user_id: "" };
        set({ avatar: { ...current, hair_colour, updated_at: new Date().toISOString() } });
      },

      updateHeightRange: (height_range) => {
        const current = get().avatar ?? { ...mockAvatar, id: "avatar-draft", user_id: "" };
        set({ avatar: { ...current, height_range, updated_at: new Date().toISOString() } });
      },

      updateSizeRange: (size_range) => {
        const current = get().avatar ?? { ...mockAvatar, id: "avatar-draft", user_id: "" };
        set({ avatar: { ...current, size_range, updated_at: new Date().toISOString() }, isComplete: true });
      },

      resetAvatar: () => set({ avatar: null, isComplete: false }),
    }),
    {
      name: "virea:avatar",
    }
  )
);
