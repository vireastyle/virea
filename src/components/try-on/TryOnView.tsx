"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Sparkles, Camera, User, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClothingItem, Colour } from "@/types/clothing";
import type { OutfitItem } from "@/types/outfit";
import { ColourSwitcher }  from "./ColourSwitcher";
import { TryOnActionBar }  from "./TryOnActionBar";
import { AiTryOnPanel }    from "./AiTryOnPanel";
import { useFashnTryOn }   from "@/hooks/useFashnTryOn";
import { useAvatarTryOn }  from "@/hooks/useAvatarTryOn";
import { useAvatarStore }  from "@/store/avatar.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore }    from "@/store/cart.store";
import { useOutfitsStore } from "@/store/outfits.store";
import { useUIStore }      from "@/store/ui.store";
import { motionTokens }    from "@/lib/motionTokens";

type TryOnMode = "avatar" | "real";

type Props = {
  initialItem:   ClothingItem;
  initialColour: Colour;
};

export function TryOnView({ initialItem, initialColour }: Props) {
  const [mode, setMode]                     = useState<TryOnMode>("avatar");
  const [selectedColour, setSelectedColour] = useState<Colour>(initialColour);

  // ── Avatar mode (FLUX-generated photo + IDM-VTON) ─────────────────────────
  const avatar = useAvatarStore((s) => s.avatar);
  const {
    hasAvatarPhoto,
    avatarPhotoUrl,
    status:    avatarStatus,
    resultUrl: avatarResultUrl,
    error:     avatarError,
    generate:  avatarGenerate,
    reset:     avatarReset,
    saveAvatarPhoto,
    isAiSupported: avatarAiSupported,
  } = useAvatarTryOn();

  // Inline avatar photo generation state (when user hasn't generated yet)
  const [generatingPhoto,    setGeneratingPhoto]    = useState(false);
  const [photoGenError,      setPhotoGenError]      = useState<string | null>(null);

  const generateAvatarPhoto = useCallback(async () => {
    if (!avatar) return;
    setGeneratingPhoto(true);
    setPhotoGenError(null);
    try {
      const res = await fetch("/api/generate-avatar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender:      avatar.gender,
          bodyShape:   avatar.body_shape,
          skinToneHex: avatar.skin_tone.hex,
          heightRange: avatar.height_range,
        }),
      });
      const data = await res.json() as { avatarUrl?: string; error?: string };
      if (!res.ok || !data.avatarUrl) throw new Error(data.error ?? "Generation failed.");
      saveAvatarPhoto(data.avatarUrl);
    } catch (err) {
      setPhotoGenError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGeneratingPhoto(false);
    }
  }, [avatar, saveAvatarPhoto]);

  // ── Real Photo mode (selfie + IDM-VTON) ───────────────────────────────────
  const {
    hasSelfie,
    status:    realStatus,
    resultUrl: realResultUrl,
    error:     realError,
    generate:  realGenerate,
    reset:     realReset,
    isAiSupported: realAiSupported,
  } = useFashnTryOn();

  // ── Shared ─────────────────────────────────────────────────────────────────
  const { toggle: toggleWishlist, has: isWished } = useWishlistStore();
  const { add: addToCart }                         = useCartStore();
  const { save: saveOutfit }                       = useOutfitsStore();
  const { addToast }                               = useUIStore();

  const aiSupported =
    mode === "avatar"
      ? avatarAiSupported(initialItem.category)
      : realAiSupported(initialItem.category);

  const garmentUrl =
    initialItem.image_urls[selectedColour.name] ??
    Object.values(initialItem.image_urls)[0] ?? "";

  const handleColourSwap = (colour: Colour) => {
    setSelectedColour(colour);
    avatarReset();
    realReset();
  };

  const handleModeSwitch = (next: TryOnMode) => {
    setMode(next);
    avatarReset();
    realReset();
    setPhotoGenError(null);
  };

  const handleAddToBag = () => {
    addToCart(initialItem, selectedColour, initialItem.available_sizes[0]);
    addToast(`${initialItem.name} added to bag`);
  };

  const handleSaveLook = () => {
    const snapshot =
      mode === "avatar" && avatarResultUrl ? avatarResultUrl
      : mode === "real"  && realResultUrl  ? realResultUrl
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

  // Derived booleans
  const avatarShowResult  = mode === "avatar" && avatarStatus === "success" && !!avatarResultUrl;
  const avatarShowLoading = mode === "avatar" && avatarStatus === "loading";
  const realShowResult    = mode === "real"   && realStatus   === "success" && !!realResultUrl;
  const realShowLoading   = mode === "real"   && realStatus   === "loading";

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
          background:   "var(--color-surface-variant)",
          boxShadow:    "var(--elevation-2)",
          aspectRatio:  "3 / 4",
        }}
      >
        <AnimatePresence mode="wait">

          {/* ── Avatar panel ─────────────────────────────────────────────── */}
          {mode === "avatar" && (
            <motion.div
              key="avatar-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.standard }}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Show avatar photo when available, garment image as fallback */}
              {avatarPhotoUrl && !avatarShowResult ? (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src={avatarPhotoUrl}
                    alt="Your avatar"
                    fill
                    sizes="(max-width: 900px) 100vw, 420px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : !avatarShowResult && !avatarShowLoading ? (
                /* No avatar photo yet — show garment as placeholder */
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
              ) : null}

              {/* Loading overlay */}
              {avatarShowLoading && <AiTryOnPanel status="loading" />}

              {/* Try-on result */}
              {avatarShowResult && avatarResultUrl && (
                <AiTryOnPanel
                  status="success"
                  resultUrl={avatarResultUrl}
                  onReset={avatarReset}
                />
              )}
            </motion.div>
          )}

          {/* ── Real Photo panel ─────────────────────────────────────────── */}
          {mode === "real" && (
            <motion.div
              key="real-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionTokens.duration.standard }}
              style={{ position: "absolute", inset: 0 }}
            >
              {!realShowResult && (
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
              {realShowLoading && <AiTryOnPanel status="loading" />}
              {realShowResult && realResultUrl && (
                <AiTryOnPanel
                  status="success"
                  resultUrl={realResultUrl}
                  onReset={realReset}
                />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── CTA area ─────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* Avatar CTA */}
        {mode === "avatar" && (
          <motion.div
            key="avatar-cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: motionTokens.duration.standard, ease: motionTokens.easing.decelerate }}
            style={{ marginTop: "var(--space-4)" }}
          >
            {/* Case A: no avatar built at all */}
            {!avatar && (
              <Link
                href="/avatar-builder"
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
                <User size={18} strokeWidth={1.8} />
                Set up your avatar first
              </Link>
            )}

            {/* Case B: avatar built, but no photo generated yet */}
            {avatar && !hasAvatarPhoto && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <motion.button
                  onClick={generateAvatarPhoto}
                  disabled={generatingPhoto}
                  whileTap={!generatingPhoto ? { scale: 0.97 } : {}}
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
                    background:     "var(--color-primary)",
                    color:          "var(--color-on-primary)",
                    fontFamily:     "var(--type-label-large-family)",
                    fontSize:       "var(--type-label-large-size)",
                    fontWeight:     "var(--type-label-large-weight)",
                    cursor:         generatingPhoto ? "not-allowed" : "pointer",
                    opacity:        generatingPhoto ? 0.7 : 1,
                    boxShadow:      "var(--elevation-2)",
                  }}
                >
                  <Sparkles size={18} strokeWidth={1.8} />
                  {generatingPhoto ? "Generating your avatar…" : "Generate avatar photo"}
                </motion.button>

                {photoGenError && (
                  <p style={{
                    fontFamily: "var(--type-body-small-family)",
                    fontSize:   "var(--type-body-small-size)",
                    color:      "var(--color-error)",
                    textAlign:  "center",
                  }}>
                    {photoGenError}
                  </p>
                )}

                <p style={{
                  fontFamily: "var(--type-body-small-family)",
                  fontSize:   "var(--type-body-small-size)",
                  color:      "var(--color-on-surface-variant)",
                  textAlign:  "center",
                }}>
                  Creates a realistic photo based on your body profile. Takes ~10 seconds.
                </p>
              </div>
            )}

            {/* Case C: has avatar photo — show try-on CTA */}
            {avatar && hasAvatarPhoto && aiSupported && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <motion.button
                  onClick={() => avatarGenerate(garmentUrl, initialItem.category)}
                  disabled={avatarStatus === "loading"}
                  whileTap={avatarStatus !== "loading" ? { scale: 0.97 } : {}}
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
                    background:     avatarStatus === "success"
                      ? "var(--color-primary-container)"
                      : "var(--color-primary)",
                    color:          avatarStatus === "success"
                      ? "var(--color-on-primary-container)"
                      : "var(--color-on-primary)",
                    fontFamily:     "var(--type-label-large-family)",
                    fontSize:       "var(--type-label-large-size)",
                    fontWeight:     "var(--type-label-large-weight)",
                    cursor:         avatarStatus === "loading" ? "not-allowed" : "pointer",
                    opacity:        avatarStatus === "loading" ? 0.7 : 1,
                    boxShadow:      avatarStatus === "success" ? "none" : "var(--elevation-2)",
                    transition:     `background var(--duration-standard) var(--easing-standard),
                                     color var(--duration-standard) var(--easing-standard)`,
                  }}
                >
                  <Sparkles size={18} strokeWidth={1.8} />
                  {avatarStatus === "idle"    && "See it on your avatar"}
                  {avatarStatus === "loading" && "Generating…"}
                  {avatarStatus === "success" && "Try another look"}
                  {avatarStatus === "error"   && "Try again"}
                </motion.button>

                {/* Regenerate avatar photo option */}
                <button
                  onClick={generateAvatarPhoto}
                  disabled={generatingPhoto}
                  style={{
                    background:     "transparent",
                    border:         "none",
                    cursor:         generatingPhoto ? "not-allowed" : "pointer",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "var(--space-1)",
                    color:          "var(--color-on-surface-variant)",
                    fontFamily:     "var(--type-label-small-family)",
                    fontSize:       "var(--type-label-small-size)",
                    fontWeight:     "var(--type-label-small-weight)",
                    opacity:        generatingPhoto ? 0.5 : 1,
                    padding:        "var(--space-1) 0",
                  }}
                >
                  <RefreshCw size={12} strokeWidth={2} />
                  {generatingPhoto ? "Regenerating…" : "Regenerate avatar photo"}
                </button>

                {(avatarStatus === "error" && avatarError) && (
                  <p style={{
                    fontFamily: "var(--type-body-small-family)",
                    fontSize:   "var(--type-body-small-size)",
                    color:      "var(--color-error)",
                    textAlign:  "center",
                  }}>
                    {avatarError}
                  </p>
                )}
              </div>
            )}

            {/* Unsupported category in avatar mode */}
            {avatar && hasAvatarPhoto && !aiSupported && (
              <p style={{
                fontFamily: "var(--type-body-small-family)",
                fontSize:   "var(--type-body-small-size)",
                color:      "var(--color-on-surface-variant)",
                textAlign:  "center",
                padding:    "var(--space-3) 0",
              }}>
                Avatar try-on is available for tops, dresses, and outerwear.
              </p>
            )}
          </motion.div>
        )}

        {/* Real Photo CTA */}
        {mode === "real" && aiSupported && (
          <motion.div
            key="real-cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: motionTokens.duration.standard, ease: motionTokens.easing.decelerate }}
            style={{ marginTop: "var(--space-4)" }}
          >
            {hasSelfie ? (
              <>
                <motion.button
                  onClick={() => realGenerate(garmentUrl, initialItem.category)}
                  disabled={realStatus === "loading"}
                  whileTap={realStatus !== "loading" ? { scale: 0.97 } : {}}
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
                    background:     realStatus === "success"
                      ? "var(--color-primary-container)"
                      : "var(--color-primary)",
                    color:          realStatus === "success"
                      ? "var(--color-on-primary-container)"
                      : "var(--color-on-primary)",
                    fontFamily:     "var(--type-label-large-family)",
                    fontSize:       "var(--type-label-large-size)",
                    fontWeight:     "var(--type-label-large-weight)",
                    cursor:         realStatus === "loading" ? "not-allowed" : "pointer",
                    opacity:        realStatus === "loading" ? 0.7 : 1,
                    boxShadow:      realStatus === "success" ? "none" : "var(--elevation-2)",
                    transition:     `background var(--duration-standard) var(--easing-standard),
                                     color var(--duration-standard) var(--easing-standard)`,
                  }}
                >
                  <Sparkles size={18} strokeWidth={1.8} />
                  {realStatus === "idle"    && "See it on you"}
                  {realStatus === "loading" && "Generating…"}
                  {realStatus === "success" && "Try another look"}
                  {realStatus === "error"   && "Try again"}
                </motion.button>

                {realStatus === "error" && realError && (
                  <p style={{
                    fontFamily: "var(--type-body-small-family)",
                    fontSize:   "var(--type-body-small-size)",
                    color:      "var(--color-error)",
                    textAlign:  "center",
                    marginTop:  "var(--space-2)",
                  }}>
                    {realError}
                  </p>
                )}
              </>
            ) : (
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
