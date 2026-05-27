"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Avatar, AvatarGender, BodyShape, SkinTone, HairStyle, HairColour, HeightRange, SizeRange } from "@/types/avatar";
import { mockAvatar } from "@/lib/mock/user";
import { apiFetch } from "@/lib/api";
import { skinTones, hairColours } from "@/lib/mock/avatars";

type DbAvatar = {
  id: string;
  userId: string;
  gender: string;
  bodyShape: string;
  skinTone: string;
  hairStyle: string;
  hairColour: string;
  height: string;
  size: string;
  photoUrl?: string | null;
};

function mapDbAvatar(db: DbAvatar): Avatar {
  return {
    id: db.id,
    user_id: db.userId,
    gender: db.gender as AvatarGender,
    body_shape: db.bodyShape as BodyShape,
    skin_tone: skinTones.find((s) => s.id === db.skinTone) ?? skinTones[4],
    hair_style: db.hairStyle as HairStyle,
    hair_colour: hairColours.find((h) => h.id === db.hairColour) ?? hairColours[0],
    height_range: db.height as HeightRange,
    size_range: db.size as SizeRange,
    updated_at: new Date().toISOString(),
  };
}

type AvatarState = {
  avatar: Avatar | null;
  isComplete: boolean;
  setAvatar: (avatar: Avatar) => void;
  loadFromDb: () => Promise<void>;
  updateGender: (gender: AvatarGender) => void;
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

      loadFromDb: async () => {
        try {
          const db = await apiFetch<DbAvatar>("/avatars");
          const avatar = mapDbAvatar(db);
          set({ avatar, isComplete: true });
          // Restore avatar photo to localStorage so try-on can use it
          if (db.photoUrl && typeof window !== "undefined") {
            localStorage.setItem("virea_avatar_photo", db.photoUrl);
          }
        } catch {
          // No avatar in DB yet — keep existing local data
        }
      },

      updateGender: (gender) => {
        const current = get().avatar ?? { ...mockAvatar, id: "avatar-draft", user_id: "" };
        set({ avatar: { ...current, gender, updated_at: new Date().toISOString() } });
      },

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
