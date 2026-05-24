"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { ColourSwatch } from "@/components/ui/ColourSwatch";
import { AvatarSVG } from "@/components/ui/AvatarSVG";
import { useAvatarStore } from "@/store/avatar.store";
import { useUIStore } from "@/store/ui.store";
import {
  bodyShapes, skinTones, hairStyles, hairColours,
  sizeRanges, defaultAvatar,
} from "@/lib/mock/avatars";
import { motionTokens } from "@/lib/motionTokens";
import type { AvatarGender } from "@/types/avatar";
import type { BodyShape, SkinTone, HairStyle, HairColour, SizeRange } from "@/types/avatar";

const STEPS = ["Gender", "Body", "Skin", "Hair", "Size"];

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
};

export default function AvatarBuilderPage() {
  const router = useRouter();
  const { setAvatar } = useAvatarStore();
  const { addToast } = useUIStore();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  // Draft state
  const [gender,    setGender]    = useState<AvatarGender>("female");
  const [bodyShape, setBodyShape] = useState<BodyShape>(defaultAvatar.body_shape);
  const [skinTone,  setSkinTone]  = useState<SkinTone>(defaultAvatar.skin_tone);
  const [hairStyle, setHairStyle] = useState<HairStyle>(defaultAvatar.hair_style);
  const [hairColour,setHairColour]= useState<HairColour>(defaultAvatar.hair_colour);
  const [sizeRange, setSizeRange] = useState<SizeRange>(defaultAvatar.size_range);

  const goNext = () => { setDir(1);  setStep(s => s + 1); };
  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  const handleComplete = () => {
    setAvatar({
      id: crypto.randomUUID(),
      user_id: "user-001",
      gender,
      body_shape: bodyShape,
      skin_tone: skinTone,
      hair_style: hairStyle,
      hair_colour: hairColour,
      height_range: "average",
      size_range: sizeRange,
      updated_at: new Date().toISOString(),
    });
    addToast("Avatar saved!");
    router.push("/");
  };

  return (
    <PageShell>
      <div style={{ paddingTop: "var(--space-4)" }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <h1 className="headline-medium" style={{ marginBottom: "var(--space-1)" }}>
          Build your avatar
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}>
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        {/* ── Progress bar ────────────────────────────────────── */}
        <div style={{
          height: "4px", background: "var(--color-outline-variant)",
          borderRadius: "var(--shape-full)", marginBottom: "var(--space-6)",
        }}>
          <motion.div
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.standard }}
            style={{ height: "100%", background: "var(--color-primary)", borderRadius: "var(--shape-full)" }}
          />
        </div>

        {/* ── Two-column layout: live preview + step form ─────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-6)",
        }}>

          {/* Live preview */}
          <div style={{
            background: "var(--color-surface-variant)",
            borderRadius: "var(--shape-lg)",
            overflow: "hidden",
            maxWidth: "220px",
            margin: "0 auto",
            width: "100%",
            boxShadow: "var(--elevation-1)",
          }}>
            <AvatarSVG
              gender={gender}
              bodyShape={bodyShape}
              skinToneHex={skinTone.hex}
              hairStyle={hairStyle}
              hairColourHex={hairColour.hex}
              width="100%"
            />
          </div>

          {/* Step form */}
          <div style={{ overflow: "hidden", minHeight: "280px" }}>
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
                            flex: 1, padding: "var(--space-4)",
                            borderRadius: "var(--shape-md)",
                            border: gender === g
                              ? "2px solid var(--color-primary)"
                              : "1.5px solid var(--color-outline-variant)",
                            background: gender === g ? "var(--color-primary-container)" : "var(--color-surface)",
                            cursor: "pointer", display: "flex", flexDirection: "column",
                            alignItems: "center", gap: "var(--space-2)",
                          }}
                        >
                          {g === "female"
                            ? <User size={28} color={gender === g ? "var(--color-primary)" : "var(--color-on-surface-variant)"} />
                            : <Users size={28} color={gender === g ? "var(--color-primary)" : "var(--color-on-surface-variant)"} />
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
                          border: bodyShape === s.id ? "2px solid var(--color-primary)" : "1.5px solid var(--color-outline-variant)",
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
                            size={48}
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
                          border: hairStyle === hs.id ? "2px solid var(--color-primary)" : "1.5px solid var(--color-outline-variant)",
                          background: hairStyle === hs.id ? "var(--color-primary-container)" : "transparent",
                          textAlign: "left", cursor: "pointer",
                          fontFamily: "var(--type-title-small-family)",
                          fontSize: "var(--type-title-small-size)",
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
                          border: sizeRange === sr.id ? "2px solid var(--color-primary)" : "1.5px solid var(--color-outline-variant)",
                          background: sizeRange === sr.id ? "var(--color-primary-container)" : "var(--color-surface)",
                          textAlign: "left", cursor: "pointer",
                        }}>
                          <p className="title-large" style={{
                            color: sizeRange === sr.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                          }}>{sr.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Navigation ──────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-8)" }}>
          {step > 0 && (
            <Button variant="outlined" onClick={goBack}>Back</Button>
          )}
          <div style={{ flex: 1 }}>
            {step < STEPS.length - 1 ? (
              <Button variant="filled" fullWidth onClick={goNext}>Continue</Button>
            ) : (
              <Button variant="filled" fullWidth onClick={handleComplete}>Save My Avatar</Button>
            )}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
