"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingProgress } from "@/components/auth/OnboardingProgress";
import { BodyProfileStep } from "@/components/auth/BodyProfileStep";
import { StylePrefsStep } from "@/components/auth/StylePrefsStep";
import { SelfieUploadStep } from "@/components/auth/SelfieUploadStep";
import { useAuthStore } from "@/store/auth.store";
import { useAvatarStore } from "@/store/avatar.store";
import { mockUser } from "@/lib/mock/user";
import { skinTones } from "@/lib/mock/avatars";
import type { BodySize, BodyType, StyleType } from "@/types/user";

const STEPS = ["Account", "Body", "Style", "Photo"];

type FormErrors = { name?: string; email?: string; password?: string };

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const { updateSkinTone } = useAvatarStore();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  // Step 1 — Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 — Body profile
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [colorComplexion, setColorComplexion] = useState("");
  const [bodyType, setBodyType] = useState<BodyType | "">("");
  const [bodySize, setBodySize] = useState<BodySize | "">("");
  const [chestCm, setChestCm] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [hipsCm, setHipsCm] = useState("");

  // Step 3 — Style preferences
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [styleTypes, setStyleTypes] = useState<StyleType[]>([]);

  const handleTextField = (
    field: "heightCm" | "weightKg" | "chestCm" | "waistCm" | "hipsCm",
    value: string
  ) => {
    const setters = { heightCm: setHeightCm, weightKg: setWeightKg, chestCm: setChestCm, waistCm: setWaistCm, hipsCm: setHipsCm };
    setters[field](value);
  };

  const validateStep1 = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!password || password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (step === 0 && !validateStep1()) return;
    setStep((s) => s + 1);
  };

  const handleSelfieComplete = (storedLocally: boolean, extractedToneHex?: string) => {
    // If a skin tone was extracted, find the closest skin tone in our palette and pre-select it
    if (extractedToneHex) {
      const closest = skinTones.reduce((prev, curr) => {
        const prevDiff = Math.abs(parseInt(prev.hex.slice(1), 16) - parseInt(extractedToneHex.slice(1), 16));
        const currDiff = Math.abs(parseInt(curr.hex.slice(1), 16) - parseInt(extractedToneHex.slice(1), 16));
        return currDiff < prevDiff ? curr : prev;
      });
      updateSkinTone(closest);
    }
    completeRegistration(storedLocally);
  };

  const completeRegistration = (selfieStoredLocally = false) => {
    signIn({
      ...mockUser,
      display_name: name.trim() || mockUser.display_name,
      email: email.trim() || mockUser.email,
      height_cm: heightCm ? parseInt(heightCm, 10) : mockUser.height_cm,
      weight_kg: weightKg ? parseInt(weightKg, 10) : mockUser.weight_kg,
      color_complexion: colorComplexion || mockUser.color_complexion,
      body_type: (bodyType || mockUser.body_type) as BodyType,
      body_size: (bodySize || mockUser.body_size) as BodySize,
      chest_cm: chestCm ? parseInt(chestCm, 10) : mockUser.chest_cm,
      waist_cm: waistCm ? parseInt(waistCm, 10) : mockUser.waist_cm,
      hips_cm: hipsCm ? parseInt(hipsCm, 10) : mockUser.hips_cm,
      favorite_colors: favoriteColors.length > 0 ? favoriteColors : mockUser.favorite_colors,
      style_types: styleTypes.length > 0 ? styleTypes : mockUser.style_types,
      selfie_stored_locally: selfieStoredLocally,
    });
    router.push("/avatar-builder");
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-background)",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: "480px",
          width: "100%",
          margin: "0 auto",
          padding: "var(--space-8) var(--space-6) var(--space-10)",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="display-small"
          style={{
            color: "var(--color-primary)",
            marginBottom: "var(--space-6)",
            letterSpacing: "0.06em",
            textDecoration: "none",
            display: "block",
          }}
        >
          virea
        </Link>

        {/* Progress */}
        <OnboardingProgress steps={STEPS} currentStep={step} />

        {/* Step content */}
        <div style={{ flex: 1 }}>

          {/* Step 0 — Account */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div>
                <h2 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>Create your account</h2>
                <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                  Then build your avatar and start trying on looks.
                </p>
              </div>
              <div>
                <label htmlFor="rg-name" className="field-label">Display name</label>
                <input id="rg-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara" className="field" />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="rg-email" className="field-label">Email</label>
                <input id="rg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field" />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="rg-password" className="field-label">Password</label>
                <input id="rg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="field" />
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>
            </div>
          )}

          {/* Step 1 — Body Profile */}
          {step === 1 && (
            <BodyProfileStep
              heightCm={heightCm}
              weightKg={weightKg}
              colorComplexion={colorComplexion}
              bodyType={bodyType}
              bodySize={bodySize}
              chestCm={chestCm}
              waistCm={waistCm}
              hipsCm={hipsCm}
              onChangeText={handleTextField}
              onBodyTypeSelect={(t) => setBodyType(t)}
              onBodySizeSelect={(s) => setBodySize(s)}
              onComplexionSelect={(c) => setColorComplexion(c)}
            />
          )}

          {/* Step 2 — Style Prefs */}
          {step === 2 && (
            <StylePrefsStep
              favoriteColors={favoriteColors}
              styleTypes={styleTypes}
              onColorsChange={setFavoriteColors}
              onStyleTypesChange={setStyleTypes}
            />
          )}

          {/* Step 3 — Selfie */}
          {step === 3 && (
            <SelfieUploadStep
              onComplete={handleSelfieComplete}
              onSkip={() => completeRegistration(false)}
            />
          )}
        </div>

        {/* Navigation — hidden on step 3 (selfie handles its own actions) */}
        {step < 3 && (
          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-10)" }}>
            {step > 0 && (
              <Button variant="outlined" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <div style={{ flex: 1 }}>
              <Button variant="filled" fullWidth onClick={handleContinue}>
                {step === 2 ? "Continue to Photo" : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {/* Sign in link */}
        {step === 0 && (
          <p className="body-medium" style={{ textAlign: "center", marginTop: "var(--space-6)", color: "var(--color-on-surface-variant)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
