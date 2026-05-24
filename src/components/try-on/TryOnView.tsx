"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Sparkles, Camera } from "lucide-react";
import { motion } from "framer-motion";
import type { ClothingItem, Colour } from "@/types/clothing";
import type { OutfitItem } from "@/types/outfit";
import { ColourSwitcher } from "./ColourSwitcher";
import { TryOnActionBar } from "./TryOnActionBar";
import { AiTryOnPanel } from "./AiTryOnPanel";
import { useFashnTryOn } from "@/hooks/useFashnTryOn";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useOutfitsStore } from "@/store/outfits.store";
import { useUIStore } from "@/store/ui.store";
import { motionTokens } from "@/lib/motionTokens";

type Props = {
  initialItem: ClothingItem;
  initialColour: Colour;
};

export function TryOnView({ initialItem, initialColour }: Props) {
  const [selectedColour, setSelectedColour] = useState<Colour>(initialColour);

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

  // Active garment image — updates when colour changes
  const garmentUrl =
    initialItem.image_urls[selectedColour.name] ??
    Object.values(initialItem.image_urls)[0] ?? "";

  const handleColourSwap = (colour: Colour) => {
    setSelectedColour(colour);
    if (aiStatus !== "idle") resetAi(); // reset AI result on colour change
  };

  const handleGenerate = () => {
    generate(garmentUrl, initialItem.category);
  };

  const handleAddToBag = () => {
    addToCart(initialItem, selectedColour, initialItem.available_sizes[0]);
    addToast(`${initialItem.name} added to bag`);
  };

  const handleSaveLook = () => {
    const snapshot = aiResultUrl ?? garmentUrl;
    const outfitItems: OutfitItem[] = [{
      id:              `oi-${initialItem.id}-${Date.now()}`,
      item_id:         initialItem.id,
      selected_colour: selectedColour,
      selected_size:   initialItem.available_sizes[0],
    }];
    saveOutfit(initialItem.name, outfitItems, snapshot);
    addToast("Look saved!");
  };

  const showAiResult  = aiStatus === "success" && !!aiResultUrl;
  const showAiLoading = aiStatus === "loading";

  return (
    <div>
      {/* ── Main viewport ─────────────────────────────────────────────────── */}
      <div
        style={{
          width:        "100%",
          maxWidth:     "420px",
          margin:       "0 auto",
          borderRadius: "var(--shape-lg)",
          overflow:     "hidden",
          position:     "relative",
          background:   "var(--color-surface-variant)",
          boxShadow:    "var(--elevation-2)",
          aspectRatio:  "3 / 4",
        }}
      >
        {/* Product image — placeholder until AI result */}
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

        {/* AI loading overlay */}
        {showAiLoading && <AiTryOnPanel status="loading" />}

        {/* AI result */}
        {showAiResult && aiResultUrl && (
          <AiTryOnPanel status="success" resultUrl={aiResultUrl} onReset={resetAi} />
        )}
      </div>

      {/* ── AI Try-On CTA ──────────────────────────────────────────────────── */}
      {aiSupported && (
        <div style={{ marginTop: "var(--space-4)" }}>
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
        </div>
      )}

      {/* ── Colour + Actions ───────────────────────────────────────────────── */}
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
