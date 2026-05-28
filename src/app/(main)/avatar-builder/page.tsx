"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Sparkles, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { PageShell }    from "@/components/layout/PageShell";
import { Button }       from "@/components/ui/Button";
import { ColourSwatch } from "@/components/ui/ColourSwatch";
import { useAvatarStore } from "@/store/avatar.store";
import { useUIStore }     from "@/store/ui.store";
import { apiFetch }       from "@/lib/api";
import {
  bodyShapes, skinTones, hairStyles, hairColours,
  sizeRanges, defaultAvatar,
} from "@/lib/mock/avatars";
import { motionTokens } from "@/lib/motionTokens";
import type { AvatarGender } from "@/types/avatar";
import type { BodyShape, SkinTone, HairStyle, HairColour, SizeRange } from "@/types/avatar";

const STEPS = ["Gender", "Body", "Skin", "Hair", "Size"];

const variants = {
  enter:  (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
};

type GenState = "idle" | "loading" | "done" | "error";

export default function AvatarBuilderPage() {
  const router    = useRouter();
  const { setAvatar, avatar: existingAvatar, isComplete } = useAvatarStore();
  const { addToast }  = useUIStore();

  const [step, setStep] = useState(0);
  const [dir,  setDir]  = useState(1);

  // Draft state — pre-fill from existing avatar if returning user
  const [gender,     setGender]     = useState<AvatarGender>(existingAvatar?.gender      ?? "female");
  const [bodyShape,  setBodyShape]  = useState<BodyShape>(existingAvatar?.body_shape      ?? defaultAvatar.body_shape);
  const [skinTone,   setSkinTone]   = useState<SkinTone>(existingAvatar?.skin_tone        ?? defaultAvatar.skin_tone);
  const [hairStyle,  setHairStyle]  = useState<HairStyle>(existingAvatar?.hair_style      ?? defaultAvatar.hair_style);
  const [hairColour, setHairColour] = useState<HairColour>(existingAvatar?.hair_colour    ?? defaultAvatar.hair_colour);
  const [sizeRange,  setSizeRange]  = useState<SizeRange>(existingAvatar?.size_range      ?? defaultAvatar.size_range);

  // Generation phase
  const [genState,      setGenState]      = useState<GenState>("idle");
  const [genError,      setGenError]      = useState<string | null>(null);
  const [generatedUrl,  setGeneratedUrl]  = useState<string | null>(null);

  const goNext = () => { setDir(1);  setStep(s => s + 1); };
  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  const avatarApiPayload = (photoUrl?: string) => ({
    gender,
    bodyShape,
    skinTone:   skinTone.id,
    hairStyle,
    hairColour: hairColour.id,
    height:     "average",
    size:       sizeRange,
    ...(photoUrl ? { photoUrl } : {}),
  });

  const handleSave = async () => {
    // 1. Persist avatar params to store immediately
    setAvatar({
      id:           crypto.randomUUID(),
      user_id:      "",
      gender,
      body_shape:   bodyShape,
      skin_tone:    skinTone,
      hair_style:   hairStyle,
      hair_colour:  hairColour,
      height_range: "average",
      size_range:   sizeRange,
      updated_at:   new Date().toISOString(),
    });

    // 2. Persist params to DB (fire-and-forget — no photoUrl yet)
    apiFetch("/avatars", { method: "POST", body: JSON.stringify(avatarApiPayload()) }).catch(() => {});

    // 3. Generate avatar photo
    await runGeneration({ gender, bodyShape, skinTone });
  };

  const runGeneration = async (params: {
    gender:    AvatarGender;
    bodyShape: BodyShape;
    skinTone:  SkinTone;
  }) => {
    setGenState("loading");
    setGenError(null);
    setGeneratedUrl(null);

    try {
      const res = await fetch("/api/generate-avatar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender:      params.gender,
          bodyShape:   params.bodyShape,
          skinToneHex: params.skinTone.hex,
          heightRange: "average",
        }),
      });
      const data = await res.json() as { avatarUrl?: string; error?: string };
      if (!res.ok || !data.avatarUrl) throw new Error(data.error ?? "Generation failed.");

      // Store in localStorage so try-on page can access it
      localStorage.setItem("virea_avatar_photo", data.avatarUrl);
      setGeneratedUrl(data.avatarUrl);
      setGenState("done");

      // Persist photoUrl to DB (fire-and-forget)
      apiFetch("/avatars", { method: "POST", body: JSON.stringify(avatarApiPayload(data.avatarUrl)) }).catch(() => {});
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Something went wrong.");
      setGenState("error");
    }
  };

  const handleRetry = () => runGeneration({ gender, bodyShape, skinTone });

  const handleDone = () => {
    addToast("Avatar saved!");
    router.push("/");
  };

  // ── Generation screen ──────────────────────────────────────────────────────
  if (genState !== "idle") {
    return (
      <PageShell>
        <div style={{
          paddingTop:     "var(--space-8)",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            "var(--space-6)",
          textAlign:      "center",
        }}>

          {/* Loading */}
          {genState === "loading" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.duration.emphasis }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-5)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 56, height: 56,
                  borderRadius: "50%",
                  border: "3px solid var(--color-outline-variant)",
                  borderTopColor: "var(--color-primary)",
                }}
              />
              <div>
                <p className="title-large" style={{ marginBottom: "var(--space-1)" }}>
                  Creating your avatar…
                </p>
                <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                  Generating a photorealistic photo based on your profile.
                  <br />This takes about 10 seconds.
                </p>
              </div>

              {/* Pulsing dots */}
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                    style={{
                      width: 8, height: 8,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Done */}
          {genState === "done" && generatedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.duration.emphasis }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-5)", width: "100%" }}
            >
              {/* Avatar photo */}
              <div style={{
                width:        "100%",
                maxWidth:     "280px",
                aspectRatio:  "3 / 4",
                borderRadius: "var(--shape-lg)",
                overflow:     "hidden",
                boxShadow:    "var(--elevation-3)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedUrl}
                  alt="Your avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <CheckCircle size={20} color="var(--color-primary)" strokeWidth={1.8} />
                <p className="title-medium" style={{ color: "var(--color-primary)" }}>
                  Looking great!
                </p>
              </div>

              <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", maxWidth: "280px" }}>
                This is your avatar. It will be used when you try clothes on in avatar mode.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%", maxWidth: "280px" }}>
                <Button variant="filled" fullWidth onClick={handleDone}>
                  Start shopping →
                </Button>

                <button
                  onClick={handleRetry}
                  style={{
                    background:     "transparent",
                    border:         "none",
                    cursor:         "pointer",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "var(--space-1)",
                    color:          "var(--color-on-surface-variant)",
                    fontFamily:     "var(--type-label-medium-family)",
                    fontSize:       "var(--type-label-medium-size)",
                    fontWeight:     "var(--type-label-medium-weight)",
                    padding:        "var(--space-2) 0",
                  }}
                >
                  <RefreshCw size={14} strokeWidth={2} />
                  Generate again
                </button>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {genState === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.duration.emphasis }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-5)", width: "100%" }}
            >
              <AlertCircle size={48} color="var(--color-error)" strokeWidth={1.5} />
              <div>
                <p className="title-medium" style={{ marginBottom: "var(--space-1)" }}>
                  Generation failed
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  {genError}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%", maxWidth: "280px" }}>
                <Button variant="filled" fullWidth onClick={handleRetry}>
                  <Sparkles size={16} strokeWidth={1.8} />
                  Try again
                </Button>
                <Button variant="outlined" fullWidth onClick={handleDone}>
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}

        </div>
      </PageShell>
    );
  }

  // ── Build steps ────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div style={{ paddingTop: "var(--space-4)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
          <h1 className="headline-medium">Build your avatar</h1>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-on-surface-variant)",
              fontFamily: "var(--type-label-large-family)",
              fontSize: "var(--type-label-large-size)",
              fontWeight: "var(--type-label-large-weight)",
              padding: "var(--space-1) 0",
              flexShrink: 0,
            }}
          >
            Skip
          </button>
        </div>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}>
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        {/* Progress bar */}
        <div style={{
          height: "4px", background: "var(--color-outline-variant)",
          borderRadius: "var(--shape-full)", marginBottom: "var(--space-8)",
        }}>
          <motion.div
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.standard }}
            style={{ height: "100%", background: "var(--color-primary)", borderRadius: "var(--shape-full)" }}
          />
        </div>

        {/* Step form — full width, no sidebar preview */}
        <div style={{ overflow: "hidden", minHeight: "320px" }}>
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.standard }}
            >

              {/* Step 0 — Gender */}
              {step === 0 && (
                <div>
                  <p className="title-medium" style={{ marginBottom: "var(--space-4)" }}>
                    Choose a base
                  </p>
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    {(["female", "male"] as AvatarGender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        style={{
                          flex: 1, padding: "var(--space-5)",
                          borderRadius: "var(--shape-md)",
                          border: gender === g
                            ? "2px solid var(--color-primary)"
                            : "1.5px solid var(--color-outline-variant)",
                          background: gender === g ? "var(--color-primary-container)" : "var(--color-surface)",
                          cursor: "pointer", display: "flex", flexDirection: "column",
                          alignItems: "center", gap: "var(--space-3)",
                        }}
                      >
                        {g === "female"
                          ? <User  size={32} color={gender === g ? "var(--color-primary)" : "var(--color-on-surface-variant)"} />
                          : <Users size={32} color={gender === g ? "var(--color-primary)" : "var(--color-on-surface-variant)"} />
                        }
                        <span className="title-small" style={{
                          color: gender === g ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                          textTransform: "capitalize",
                        }}>
                          {g}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 — Body Shape */}
              {step === 1 && (
                <div>
                  <p className="title-medium" style={{ marginBottom: "var(--space-1)" }}>Body shape</p>
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-4)" }}>
                    Helps us fit clothing to your proportions.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    {bodyShapes.map((s) => (
                      <button key={s.id} onClick={() => setBodyShape(s.id)} style={{
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--shape-md)",
                        border: bodyShape === s.id
                          ? "2px solid var(--color-primary)"
                          : "1.5px solid var(--color-outline-variant)",
                        background: bodyShape === s.id ? "var(--color-primary-container)" : "var(--color-surface)",
                        textAlign: "left", cursor: "pointer",
                      }}>
                        <p className="title-small" style={{
                          color: bodyShape === s.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                        }}>{s.label}</p>
                        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "2px" }}>
                          {s.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Skin Tone */}
              {step === 2 && (
                <div>
                  <p className="title-medium" style={{ marginBottom: "var(--space-1)" }}>Skin tone</p>
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}>
                    Choose the shade closest to yours.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
                    {skinTones.map((t) => (
                      <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-1)" }}>
                        <ColourSwatch
                          colour={{ name: t.label, hex: t.hex }}
                          selected={skinTone.id === t.id}
                          onClick={() => setSkinTone(t)}
                          size={52}
                        />
                        <span className="label-small" style={{ color: "var(--color-on-surface-variant)", fontSize: "10px" }}>
                          {t.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 — Hair */}
              {step === 3 && (
                <div>
                  <p className="title-medium" style={{ marginBottom: "var(--space-4)" }}>Hair style</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
                    {hairStyles.map((hs) => (
                      <button key={hs.id} onClick={() => setHairStyle(hs.id)} style={{
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--shape-sm)",
                        border: hairStyle === hs.id
                          ? "2px solid var(--color-primary)"
                          : "1.5px solid var(--color-outline-variant)",
                        background: hairStyle === hs.id ? "var(--color-primary-container)" : "transparent",
                        textAlign: "left", cursor: "pointer",
                        fontFamily: "var(--type-title-small-family)",
                        fontSize:   "var(--type-title-small-size)",
                        fontWeight: "var(--type-title-small-weight)",
                        color: hairStyle === hs.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                      }}>
                        {hs.label}
                      </button>
                    ))}
                  </div>
                  <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
                    Colour
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                    {hairColours.map((hc) => (
                      <div key={hc.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-1)" }}>
                        <ColourSwatch
                          colour={{ name: hc.label, hex: hc.hex }}
                          selected={hairColour.id === hc.id}
                          onClick={() => setHairColour(hc)}
                          size={40}
                        />
                        <span className="label-small" style={{ color: "var(--color-on-surface-variant)", fontSize: "9px" }}>
                          {hc.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 — Size */}
              {step === 4 && (
                <div>
                  <p className="title-medium" style={{ marginBottom: "var(--space-1)" }}>Size range</p>
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}>
                    Used to personalise your feed and filter recommendations.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {sizeRanges.map((sr) => (
                      <button key={sr.id} onClick={() => setSizeRange(sr.id)} style={{
                        padding: "var(--space-4)",
                        borderRadius: "var(--shape-md)",
                        border: sizeRange === sr.id
                          ? "2px solid var(--color-primary)"
                          : "1.5px solid var(--color-outline-variant)",
                        background: sizeRange === sr.id ? "var(--color-primary-container)" : "var(--color-surface)",
                        textAlign: "left", cursor: "pointer",
                      }}>
                        <p className="title-large" style={{
                          color: sizeRange === sr.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                        }}>{sr.label}</p>
                      </button>
                    ))}
                  </div>

                  {/* Preview of what happens next */}
                  <div style={{
                    marginTop:    "var(--space-6)",
                    padding:      "var(--space-4)",
                    borderRadius: "var(--shape-md)",
                    background:   "var(--color-primary-container)",
                    display:      "flex",
                    gap:          "var(--space-3)",
                    alignItems:   "flex-start",
                  }}>
                    <Sparkles size={20} color="var(--color-primary)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="label-large" style={{ color: "var(--color-on-primary-container)", marginBottom: "2px" }}>
                        Next: generate your avatar photo
                      </p>
                      <p className="body-small" style={{ color: "var(--color-on-primary-container)", opacity: 0.8 }}>
                        We'll create a photorealistic image based on your profile so you can try clothes on realistically.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-8)" }}>
          {step > 0 && (
            <Button variant="outlined" onClick={goBack}>Back</Button>
          )}
          <div style={{ flex: 1 }}>
            {step < STEPS.length - 1 ? (
              <Button variant="filled" fullWidth onClick={goNext}>Continue</Button>
            ) : (
              <Button variant="filled" fullWidth onClick={handleSave}>
                {isComplete ? "Update & Regenerate" : "Save & Generate Avatar"}
              </Button>
            )}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
