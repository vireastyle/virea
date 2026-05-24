"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Sparkles, Camera, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClothingItem, Colour } from "@/types/clothing";
import type { OutfitItem } from "@/types/outfit";
import { ColourSwitcher } from "./ColourSwitcher";
import { TryOnActionBar } from "./TryOnActionBar";
import { AiTryOnPanel } from "./AiTryOnPanel";
import { AvatarSVG } from "@/components/ui/AvatarSVG";
import { useFashnTryOn } from "@/hooks/useFashnTryOn";
import { useTryOn } from "@/hooks/useTryOn";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useOutfitsStore } from "@/store/outfits.store";
import { useUIStore } from "@/store/ui.store";
import { motionTokens } from "@/lib/motionTokens";

type TryOnMode = "avatar" | "real";

type Props = {
  initialItem: ClothingItem;
  initialColour: Colour;
};

export function TryOnView({ initialItem, initialColour }: Props) {
  const [mode, setMode]                   = useState<TryOnMode>("avatar");
  const [selectedColour, setSelectedColour] = useState<Colour>(initialColour);

  // ── Avatar mode ────────────────────────────────────────────────────────────
  const { svgRef, avatar, clothingLayers, addLayer, exportSnapshot } = useTryOn();

  // Keep the current item in sync with the avatar layer whenever colour changes
  useEffect(() => {
    addLayer(initialItem, selectedColour);
  }, [initialItem, selectedColour, addLayer]);

  // ── AI / Real Photo mode ───────────────────────────────────────────────────
  const {
    hasSelfie,
    status:    aiStatus,
    resultUrl: aiResultUrl,
    error:     aiError,
    generate,
    reset:     resetAi,
    isAiSupported,
  } = useFashnTryOn();

  const { toggle: toggleWishlist, has: isWished } = useWishlistStore();
  const { add: addToCart }                         = useCartStore();
  const { save: saveOutfit }                       = useOutfitsStore();
  const { addToast }                               = useUIStore();

  const aiSupported = isAiSupported(initialItem.category);

  const garmentUrl =
    initialItem.image_urls[selectedColour.name] ??
    Object.values(initialItem.image_urls)[0] ?? "";

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleColourSwap = (colour: Colour) => {
    setSelectedColour(colour);
    if (aiStatus !== "idle") resetAi();
  };

  const handleModeSwitch = (next: TryOnMode) => {
    setMode(next);
    if (next === "avatar") resetAi(); // clear AI result when switching back
  };

  const handleGenerate = () => {
    generate(garmentUrl, initialItem.category);
  };

  const handleAddToBag = () => {
    addToCart(initialItem, selectedColour, initialItem.available_sizes[0]);
    addToast(`${initialItem.name} added to bag`);
  };

  const handleSaveLook = () => {
    const snapshot =
      mode === "real" && aiResultUrl
        ? aiResultUrl
        : mode === "avatar"
        ? exportSnapshot()
        : garmentUrl;

    const outfitItems: OutfitItem[] = [{
      id:              `oi-${initialItem.id}-${Date.now()}`,
      item_id:         initialItem.id,
      selected_colour: selectedColour,
      selected_size:   initialItem.available_sizes[0],
    }];
    saveOutfit(initialItem.name, outfitItems, snapshot);
    addToast("Look saved!");
  };

  const showAiResult  = mode === "real" && aiStatus === "success" && !!aiResultUrl;
  const showAiLoading = mode === "real" && aiStatus === "loading";

  // Avatar properties — fall back to defaults so the avatar always renders
  const gender      = avatar?.gender           ?? "female";
  const bodyShape   = avatar?.body_shape        ?? "hourglass";
  const skinToneHex = avatar?.skin_tone.hex     ?? "#8D5524";
  const hairStyle   = avatar?.hair_style        ?? "natural-coils";
  const hairHex     = avatar?.hair_colour.hex   ?? "#0D0D0D";

  return (
    <div>
      {/* ── Mode toggle ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display:      "flex",
          background:   "var(--color-surface-variant)",
          borderRadius: "var(--shape-full)",
          padding:      "4px",
          marginBottom: "var(--space-4)",
          gap:          "4px",
        }}
      >
        {(["avatar", "real"] as TryOnMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            style={{
              flex:           1,
              height:         "40px",
              border:         "none",
              borderRadius:   "var(--shape-full)",
              background:     mode === m ? "var(--color-primary)" : "transparent",
              color:          mode === m ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
              fontFamily:     "var(--type-label-large-family)",
              fontSize:       "var(--type-label-large-size)",
              fontWeight:     "var(--type-label-large-weight)",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "var(--space-2)",
              transition:     `background var(--duration-standard) var(--easing-standard),
                               color var(--duration-standard) var(--easing-standard)`,
            }}
          >
            {m === "avatar"
              ? <User   size={15} strokeWidth={1.8} />
              : <Camera size={15} strokeWidth={1.8} />}
            {m === "avatar" ? "Avatar" : "Real Photo"}
          </button>
        ))}
      </div>

      {/* ── Main viewport ────────────────────────────────────────────────────── */}
      <div
        style={{
          width:        "100%",
          maxWidth:     "420px",
          margin:       "0 auto",
          borderRadius: "var(--shape-lg)",
          overflow:     "hidden",
          position:     "relative",
          background:   mode === "avatar"
            ? "var(--color-surface)"
            : "var(--color-surface-variant)",
          boxShadow:    "var(--elevation-2)",
          aspectRatio:  "3 / 4",
          transition:   `background var(--duration-standard) var(--easing-standard)`,
        }}
      >
        <AnimatePresence mode="wait">
          {/* ── Avatar panel ─────────────────────────────────────────────── */}
          {mode === "avatar" && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.standard }}
              style={{
                position:       "absolute",
                inset:          0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              <AvatarSVG
                ref={svgRef}
                gender={gender}
                bodyShape={bodyShape}
                skinToneHex={skinToneHex}
                hairStyle={hairStyle}
                hairColourHex={hairHex}
                clothing={clothingLayers}
                width="100%"
                style={{ maxHeight: "100%" }}
              />

              {/* Personalise nudge — only if user hasn't built their avatar */}
              {!avatar && (
                <div
                  style={{
                    position:       "absolute",
                    bottom:         "var(--space-4)",
                    left:           "50%",
                    transform:      "translateX(-50%)",
                    background:     "rgba(246,241,235,0.92)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius:   "var(--shape-full)",
                    padding:        "6px var(--space-4)",
                    whiteSpace:     "nowrap",
                  }}
                >
                  <Link
                    href="/avatar-builder"
                    style={{
                      color:          "var(--color-primary)",
                      textDecoration: "none",
                      fontFamily:     "var(--type-label-medium-family)",
                      fontSize:       "var(--type-label-medium-size)",
                      fontWeight:     "var(--type-label-medium-weight)",
                    }}
                  >
                    Personalise your avatar →
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Real Photo panel ─────────────────────────────────────────── */}
          {mode === "real" && (
            <motion.div
              key="real"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.standard }}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Product image — shown until AI result arrives */}
              {!showAiResult && (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src={garmentUrl}
                    alt={initialItem.name}
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 420px"
                    style={{ objectFit: "contain", padding: "12px" }}
                  />
                </div>
              )}

              {/* Loading overlay */}
              {showAiLoading && <AiTryOnPanel status="loading" />}

              {/* AI result */}
              {showAiResult && aiResultUrl && (
                <AiTryOnPanel status="success" resultUrl={aiResultUrl} onReset={resetAi} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Real Photo CTA ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mode === "real" && aiSupported && (
          <motion.div
            key="ai-cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: motionTokens.duration.standard, ease: motionTokens.easing.decelerate }}
            style={{ marginTop: "var(--space-4)" }}
          >
            {hasSelfie ? (
              <>
                <motion.button
                  onClick={handleGenerate}
                  disabled={aiStatus === "loading"}
                  whileTap={aiStatus !== "loading" ? { scale: 0.97 } : {}}
                  transition={{ duration: motionTokens.duration.fast }}
                  style={{
                    width:          "100%",
                    height:         "52px",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "var(--space-2)",
                    borderRadius:   "var(--shape-full)",
                    border:         "none",
                    background:     aiStatus === "success"
                      ? "var(--color-primary-container)"
                      : "var(--color-primary)",
                    color:          aiStatus === "success"
                      ? "var(--color-on-primary-container)"
                      : "var(--color-on-primary)",
                    fontFamily:     "var(--type-label-large-family)",
                    fontSize:       "var(--type-label-large-size)",
                    fontWeight:     "var(--type-label-large-weight)",
                    cursor:         aiStatus === "loading" ? "not-allowed" : "pointer",
                    opacity:        aiStatus === "loading" ? 0.7 : 1,
                    boxShadow:      aiStatus === "success" ? "none" : "var(--elevation-2)",
                    transition:     `background var(--duration-standard) var(--easing-standard),
                                     color var(--duration-standard) var(--easing-standard)`,
                  }}
                >
                  <Sparkles size={18} strokeWidth={1.8} />
                  {aiStatus === "idle"    && "See it on you"}
                  {aiStatus === "loading" && "Generating…"}
                  {aiStatus === "success" && "Try another look"}
                  {aiStatus === "error"   && "Try again"}
                </motion.button>

                {aiStatus === "error" && aiError && (
                  <p style={{
                    fontFamily: "var(--type-body-small-family)",
                    fontSize:   "var(--type-body-small-size)",
                    color:      "var(--color-error)",
                    textAlign:  "center",
                    marginTop:  "var(--space-2)",
                  }}>
                    {aiError}
                  </p>
                )}
              </>
            ) : (
              /* No selfie — invite them to upload */
              <Link
                href="/profile"
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            "var(--space-2)",
                  width:          "100%",
                  height:         "52px",
                  borderRadius:   "var(--shape-full)",
                  border:         "1.5px dashed var(--color-outline-variant)",
                  background:     "var(--color-surface-variant)",
                  color:          "var(--color-on-surface-variant)",
                  textDecoration: "none",
                  fontFamily:     "var(--type-label-large-family)",
                  fontSize:       "var(--type-label-large-size)",
                  fontWeight:     "var(--type-label-large-weight)",
                }}
              >
                <Camera size={18} strokeWidth={1.8} />
                Upload your photo to try this on
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Colour + Actions ─────────────────────────────────────────────────── */}
      <div style={{ paddingTop: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <ColourSwitcher
          colours={initialItem.available_colours}
          selected={selectedColour}
          onSelect={handleColourSwap}
        />
        <TryOnActionBar
          onAddToBag={handleAddToBag}
          onSaveLook={handleSaveLook}
          onWishlist={() => {
            const wished = isWished(initialItem.id);
            toggleWishlist(initialItem.id);
            addToast(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          isWished={isWished(initialItem.id)}
          hasLayers={true}
        />
      </div>
    </div>
  );
}
