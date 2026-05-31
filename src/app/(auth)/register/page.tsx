"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingProgress } from "@/components/auth/OnboardingProgress";
import { BodyProfileStep } from "@/components/auth/BodyProfileStep";
import { StylePrefsStep } from "@/components/auth/StylePrefsStep";
import { SelfieUploadStep } from "@/components/auth/SelfieUploadStep";
import { useAuthStore } from "@/store/auth.store";
import { useAvatarStore } from "@/store/avatar.store";
import { skinTones } from "@/lib/mock/avatars";
import type { BodySize, BodyType, Gender, StyleType } from "@/types/user";

const STEPS = ["Account", "Body", "Style", "Photo"];

type FormErrors = { name?: string; email?: string; password?: string; api?: string };

export default function RegisterPage() {
  const router = useRouter();
  const { register, updateProfile } = useAuthStore();
  const { updateSkinTone, updateGender: setAvatarGender } = useAvatarStore();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Step 0 — Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Step 1 — Body profile
  const [gender, setGender] = useState<Gender | "">("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [colorComplexion, setColorComplexion] = useState("");
  const [bodyType, setBodyType] = useState<BodyType | "">("");
  const [bodySize, setBodySize] = useState<BodySize | "">("");
  const [chestCm, setChestCm] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [hipsCm, setHipsCm] = useState("");

  // Step 2 — Style preferences
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [styleTypes, setStyleTypes] = useState<StyleType[]>([]);

  const MALE_TYPES: BodyType[] = ["rectangle", "inverted-triangle", "oval", "athletic"];
  const FEMALE_TYPES: BodyType[] = ["hourglass", "pear", "apple", "rectangle", "inverted-triangle"];

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    const validTypes = g === "male" ? MALE_TYPES : FEMALE_TYPES;
    if (bodyType && !validTypes.includes(bodyType as BodyType)) setBodyType("");
  };

  const handleTextField = (
    field: "heightCm" | "weightKg" | "chestCm" | "waistCm" | "hipsCm",
    value: string
  ) => {
    const setters = {
      heightCm: setHeightCm,
      weightKg: setWeightKg,
      chestCm: setChestCm,
      waistCm: setWaistCm,
      hipsCm: setHipsCm,
    };
    setters[field](value);
  };

  const validateStep0 = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!password || password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async () => {
    if (step === 0) {
      if (!validateStep0()) return;
      setLoading(true);
      try {
        // Create the real account — user is stored in auth.store on success
        await register(name.trim(), email.trim(), password);
        setErrors({});
        setStep(1);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        const friendly =
          msg === "Email already in use"
            ? "This email is already registered. Try signing in instead."
            : "We couldn't create your account right now. Please try again.";
        setErrors({ api: friendly });
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSelfieComplete = (storedLocally: boolean, extractedToneHex?: string) => {
    if (extractedToneHex) {
      const closest = skinTones.reduce((prev, curr) => {
        const prevDiff = Math.abs(
          parseInt(prev.hex.slice(1), 16) - parseInt(extractedToneHex.slice(1), 16)
        );
        const currDiff = Math.abs(
          parseInt(curr.hex.slice(1), 16) - parseInt(extractedToneHex.slice(1), 16)
        );
        return currDiff < prevDiff ? curr : prev;
      });
      updateSkinTone(closest);
    }
    completeRegistration(storedLocally);
  };

  const completeRegistration = (selfieStoredLocally = false) => {
    updateProfile({
      gender: (gender || undefined) as Gender | undefined,
      height_cm: heightCm ? parseInt(heightCm, 10) : undefined,
      weight_kg: weightKg ? parseInt(weightKg, 10) : undefined,
      color_complexion: colorComplexion || undefined,
      body_type: (bodyType || undefined) as BodyType | undefined,
      body_size: (bodySize || undefined) as BodySize | undefined,
      chest_cm: chestCm ? parseInt(chestCm, 10) : undefined,
      waist_cm: waistCm ? parseInt(waistCm, 10) : undefined,
      hips_cm: hipsCm ? parseInt(hipsCm, 10) : undefined,
      favorite_colors: favoriteColors.length > 0 ? favoriteColors : undefined,
      style_types: styleTypes.length > 0 ? styleTypes : undefined,
      selfie_stored_locally: selfieStoredLocally,
    });
    if (gender) setAvatarGender(gender);
    router.push("/");
  };

  const handleSkipSetup = () => completeRegistration(false);

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
                <h2 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>
                  Create your account
                </h2>
                <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                  Then build your avatar and start trying on looks.
                </p>
              </div>
              <div>
                <label htmlFor="rg-name" className="field-label">Display name</label>
                <input
                  id="rg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amara"
                  className="field"
                  disabled={loading}
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="rg-email" className="field-label">Email</label>
                <input
                  id="rg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="field"
                  disabled={loading}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="rg-password" className="field-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="rg-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="field"
                    disabled={loading}
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute", right: "var(--space-3)", top: "50%",
                      transform: "translateY(-50%)", background: "none", border: "none",
                      cursor: "pointer", padding: "var(--space-1)", opacity: 0.5,
                      color: "var(--color-on-surface-variant)", display: "flex", alignItems: "center",
                    }}
                  >
                    {showPw ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>

              {/* API error (email taken, etc.) */}
              {errors.api && (
                <p
                  className="body-small"
                  style={{
                    color: "var(--color-error, #B00020)",
                    padding: "var(--space-3)",
                    background: "rgba(176,0,32,0.06)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {errors.api}
                </p>
              )}
            </div>
          )}

          {/* Step 1 — Body Profile */}
          {step === 1 && (
            <BodyProfileStep
              gender={gender}
              heightCm={heightCm}
              weightKg={weightKg}
              colorComplexion={colorComplexion}
              bodyType={bodyType}
              bodySize={bodySize}
              chestCm={chestCm}
              waistCm={waistCm}
              hipsCm={hipsCm}
              onGenderSelect={handleGenderSelect}
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
          <div style={{ marginTop: "var(--space-10)" }}>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              {step > 0 && (
                <Button variant="outlined" onClick={() => setStep((s) => s - 1)} disabled={loading}>
                  Back
                </Button>
              )}
              <div style={{ flex: 1 }}>
                <Button variant="filled" fullWidth onClick={handleContinue} disabled={loading}>
                  {loading ? "Creating account…" : step === 2 ? "Continue to Photo" : "Continue"}
                </Button>
              </div>
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={handleSkipSetup}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "var(--space-3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--color-on-surface-variant)",
                  textAlign: "center",
                  padding: "var(--space-2) 0",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)"; }}
              >
                Skip for now — I&apos;ll set this up later
              </button>
            )}
          </div>
        )}

        {/* Sign in + vendor links */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-6)" }}>
            <p
              className="body-medium"
              style={{ textAlign: "center", color: "var(--color-on-surface-variant)" }}
            >
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
            <p
              className="body-medium"
              style={{ textAlign: "center", color: "var(--color-on-surface-variant)" }}
            >
              Are you a vendor?{" "}
              <Link href="/vendor/register" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                Create a vendor account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
