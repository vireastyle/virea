"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { ColourSwatch } from "@/components/ui/ColourSwatch";
import { useAvatarStore } from "@/store/avatar.store";
import { useUIStore } from "@/store/ui.store";
import { bodyShapes, skinTones, hairStyles, hairColours, heightRanges, sizeRanges, defaultAvatar } from "@/lib/mock/avatars";
import { motionTokens } from "@/lib/motionTokens";
import type { BodyShape, SkinTone, HairStyle, HairColour, HeightRange, SizeRange } from "@/types/avatar";

const STEPS = ["Body Shape", "Skin Tone", "Hair", "Size"];

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function AvatarBuilderPage() {
  const router = useRouter();
  const { setAvatar } = useAvatarStore();
  const { addToast } = useUIStore();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [bodyShape, setBodyShape] = useState<BodyShape>(defaultAvatar.body_shape);
  const [skinTone, setSkinTone] = useState<SkinTone>(defaultAvatar.skin_tone);
  const [hairStyle, setHairStyle] = useState<HairStyle>(defaultAvatar.hair_style);
  const [hairColour, setHairColour] = useState<HairColour>(defaultAvatar.hair_colour);
  const [sizeRange, setSizeRange] = useState<SizeRange>(defaultAvatar.size_range);

  const goNext = () => { setDirection(1); setStep((s) => s + 1); };
  const goBack = () => { setDirection(-1); setStep((s) => s - 1); };

  const handleComplete = () => {
    setAvatar({
      id: "avatar-001",
      user_id: "user-001",
      body_shape: bodyShape,
      skin_tone: skinTone,
      hair_style: hairStyle,
      hair_colour: hairColour,
      height_range: "average" as HeightRange,
      size_range: sizeRange,
      updated_at: new Date().toISOString(),
    });
    addToast("Avatar saved!");
    router.push("/");
  };

  return (
    <PageShell>
      <div style={{ paddingTop: "var(--space-6)" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
            {STEPS.map((s, i) => (
              <span
                key={s}
                className="label-small"
                style={{ color: i <= step ? "var(--color-primary)" : "var(--color-on-surface-variant)" }}
              >
                {s}
              </span>
            ))}
          </div>
          <div style={{ height: "4px", background: "var(--color-outline-variant)", borderRadius: "var(--shape-full)" }}>
            <motion.div
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.standard }}
              style={{
                height: "100%",
                background: "var(--color-primary)",
                borderRadius: "var(--shape-full)",
              }}
            />
          </div>
        </div>

        {/* Animated step content */}
        <div style={{ overflow: "hidden" }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.standard }}
            >

              {/* Step 0: Body Shape */}
              {step === 0 && (
                <div>
                  <h1 className="headline-large" style={{ marginBottom: "var(--space-2)" }}>Your body shape</h1>
                  <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-6)" }}>
                    This helps us fit clothing to your proportions.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {bodyShapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => setBodyShape(shape.id)}
                        style={{
                          padding: "var(--space-4)",
                          borderRadius: "var(--shape-md)",
                          border: bodyShape === shape.id ? "2px solid var(--color-primary)" : "1.5px solid var(--color-outline-variant)",
                          background: bodyShape === shape.id ? "var(--color-primary-container)" : "var(--color-surface)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: `all var(--duration-standard) var(--easing-standard)`,
                        }}
                      >
                        <p className="title-medium" style={{ color: bodyShape === shape.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)" }}>
                          {shape.label}
                        </p>
                        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
                          {shape.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Skin Tone */}
              {step === 1 && (
                <div>
                  <h1 className="headline-large" style={{ marginBottom: "var(--space-2)" }}>Your skin tone</h1>
                  <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-6)" }}>
                    Choose the tone closest to yours.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
                    {skinTones.map((tone) => (
                      <div key={tone.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
                        <ColourSwatch
                          colour={{ name: tone.label, hex: tone.hex }}
                          selected={skinTone.id === tone.id}
                          onClick={() => setSkinTone(tone)}
                          size={48}
                        />
                        <span className="label-small" style={{ color: "var(--color-on-surface-variant)" }}>{tone.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Hair */}
              {step === 2 && (
                <div>
                  <h1 className="headline-large" style={{ marginBottom: "var(--space-2)" }}>Your hair</h1>
                  <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}>Style</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
                    {hairStyles.map((hs) => (
                      <button
                        key={hs.id}
                        onClick={() => setHairStyle(hs.id)}
                        style={{
                          padding: "var(--space-3) var(--space-4)",
                          borderRadius: "var(--shape-sm)",
                          border: hairStyle === hs.id ? "2px solid var(--color-primary)" : "1.5px solid var(--color-outline-variant)",
                          background: hairStyle === hs.id ? "var(--color-primary-container)" : "transparent",
                          textAlign: "left",
                          cursor: "pointer",
                          fontFamily: "var(--type-title-medium-family)",
                          fontSize: "var(--type-title-medium-size)",
                          fontWeight: "var(--type-title-medium-weight)",
                          color: hairStyle === hs.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                        }}
                      >
                        {hs.label}
                      </button>
                    ))}
                  </div>
                  <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-3)" }}>Colour</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                    {hairColours.map((hc) => (
                      <div key={hc.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-1)" }}>
                        <ColourSwatch
                          colour={{ name: hc.label, hex: hc.hex }}
                          selected={hairColour.id === hc.id}
                          onClick={() => setHairColour(hc)}
                          size={40}
                        />
                        <span className="label-small" style={{ color: "var(--color-on-surface-variant)", fontSize: "10px" }}>{hc.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Size */}
              {step === 3 && (
                <div>
                  <h1 className="headline-large" style={{ marginBottom: "var(--space-2)" }}>Your size range</h1>
                  <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-6)" }}>
                    We use this to personalise your feed and filter recommendations.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {sizeRanges.map((sr) => (
                      <button
                        key={sr.id}
                        onClick={() => setSizeRange(sr.id)}
                        style={{
                          padding: "var(--space-4)",
                          borderRadius: "var(--shape-md)",
                          border: sizeRange === sr.id ? "2px solid var(--color-primary)" : "1.5px solid var(--color-outline-variant)",
                          background: sizeRange === sr.id ? "var(--color-primary-container)" : "var(--color-surface)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: `all var(--duration-standard) var(--easing-standard)`,
                        }}
                      >
                        <p className="title-large" style={{ color: sizeRange === sr.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)" }}>
                          {sr.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-10)" }}>
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
