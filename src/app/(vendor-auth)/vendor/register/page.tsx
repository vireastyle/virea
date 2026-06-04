"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { OnboardingProgress } from "@/components/auth/OnboardingProgress";
import { VendorAccountStep } from "@/components/vendor-auth/VendorAccountStep";
import { VendorCategoryStep } from "@/components/vendor-auth/VendorCategoryStep";
import { VendorBankStep } from "@/components/vendor-auth/VendorBankStep";
import { useVendorStore } from "@/store/vendor.store";
import { motionTokens } from "@/lib/motionTokens";

const STEPS = ["Account", "Your Brand", "Bank Details"];

type AccountErrors = Partial<Record<"businessName" | "ownerName" | "email" | "password", string>>;
type BankErrors = Partial<Record<"accountNumber" | "bankName" | "bvn", string>>;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function VendorRegisterPage() {
  const router = useRouter();
  const { register } = useVendorStore();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Step 0 — Account
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountErrors, setAccountErrors] = useState<AccountErrors>({});

  // Step 1 — Brand
  const [categoryTags, setCategoryTags] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>();

  // Step 2 — Bank
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bvn, setBvn] = useState("");
  const [bankErrors, setBankErrors] = useState<BankErrors>({});

  const validateAccount = (): boolean => {
    const e: AccountErrors = {};
    if (businessName.trim().length < 2) e.businessName = "Enter your business name";
    if (ownerName.trim().length < 2) e.ownerName = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    setAccountErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateBank = (): boolean => {
    const e: BankErrors = {};
    if (!bankName) e.bankName = "Select your bank";
    if (accountNumber.length !== 10) e.accountNumber = "Account number must be 10 digits";
    if (bvn.length !== 11) e.bvn = "NIN must be 11 digits";
    setBankErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (step === 0 && !validateAccount()) return;
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateBank()) return;
    setApiError("");
    setLoading(true);
    try {
      await register({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        password,
        categoryTags,
        bankName,
        accountNumber,
      });
      router.push("/vendor/dashboard");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (cat: string) => {
    setCategoryTags((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAccountChange = (
    field: "businessName" | "ownerName" | "email" | "password",
    value: string
  ) => {
    const setters = {
      businessName: setBusinessName,
      ownerName: setOwnerName,
      email: setEmail,
      password: setPassword,
    };
    setters[field](value);
  };

  const handleBankChange = (
    field: "accountNumber" | "bankName" | "bvn",
    value: string
  ) => {
    const setters = { accountNumber: setAccountNumber, bankName: setBankName, bvn: setBvn };
    setters[field](value);
  };

  const isLastStep = step === STEPS.length - 1;

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
        <div style={{ marginBottom: "var(--space-6)" }}>
          {step === 0 && (
            <button
              onClick={() => router.back()}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-on-surface-variant)",
                fontFamily: "var(--type-label-large-family)",
                fontSize: "var(--type-label-large-size)",
                fontWeight: "var(--type-label-large-weight)",
                padding: "0 0 var(--space-4) 0",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-1)",
              }}
            >
              ← Back
            </button>
          )}
          <Link
            href="/"
            className="display-small"
            style={{
              color: "var(--color-primary)",
              letterSpacing: "0.06em",
              textDecoration: "none",
              display: "block",
            }}
          >
            virea
          </Link>
          <p
            className="label-large"
            style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}
          >
            VENDOR PORTAL
          </p>
        </div>

        <OnboardingProgress steps={STEPS} currentStep={step} />

        {/* Animated step content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: motionTokens.duration.emphasis,
                ease: motionTokens.easing.standard,
              }}
            >
              {step === 0 && (
                <VendorAccountStep
                  businessName={businessName}
                  ownerName={ownerName}
                  email={email}
                  password={password}
                  errors={accountErrors}
                  onChange={handleAccountChange}
                />
              )}
              {step === 1 && (
                <VendorCategoryStep
                  categoryTags={categoryTags}
                  bio={bio}
                  coverImagePreview={coverImage}
                  onCategoryToggle={handleCategoryToggle}
                  onBioChange={setBio}
                  onCoverImageChange={setCoverImage}
                />
              )}
              {step === 2 && (
                <VendorBankStep
                  accountNumber={accountNumber}
                  bankName={bankName}
                  bvn={bvn}
                  errors={bankErrors}
                  onChange={handleBankChange}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* API error */}
        {apiError && (
          <p
            className="body-small"
            style={{
              color: "var(--color-error, #B00020)",
              padding: "var(--space-3)",
              background: "rgba(176,0,32,0.06)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-3)",
            }}
          >
            {apiError}
          </p>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-10)" }}>
          {step > 0 && (
            <Button variant="outlined" onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          <div style={{ flex: 1 }}>
            <Button
              variant="filled"
              fullWidth
              onClick={isLastStep ? handleSubmit : handleContinue}
              disabled={loading}
            >
              {loading
                ? "Creating account…"
                : isLastStep
                ? "Create vendor account"
                : "Continue"}
            </Button>
          </div>
        </div>

        {step === 0 && (
          <p
            className="body-medium"
            style={{
              textAlign: "center",
              marginTop: "var(--space-6)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            Already have a vendor account?{" "}
            <Link
              href="/vendor/login"
              style={{ color: "var(--color-primary)", textDecoration: "none" }}
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
