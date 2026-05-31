"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useAvatarStore } from "@/store/avatar.store";
import { motionTokens } from "@/lib/motionTokens";

type ModalType = "account" | "avatar" | null;

const SESSION_KEY_ACCOUNT = "virea:modal_account_shown";
const SESSION_KEY_AVATAR  = "virea:modal_avatar_shown";
const DELAY_MS = 1800;

export function HomeModals() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const avatar          = useAvatarStore((s) => s.avatar);
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!isAuthenticated) {
        if (!sessionStorage.getItem(SESSION_KEY_ACCOUNT)) {
          setModal("account");
        }
      } else if (!avatar) {
        if (!sessionStorage.getItem(SESSION_KEY_AVATAR)) {
          setModal("avatar");
        }
      }
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, [isAuthenticated, avatar]);

  const close = () => {
    if (modal === "account") sessionStorage.setItem(SESSION_KEY_ACCOUNT, "1");
    if (modal === "avatar")  sessionStorage.setItem(SESSION_KEY_AVATAR,  "1");
    setModal(null);
  };

  return (
    <AnimatePresence>
      {modal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.standard }}
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 1000,
            }}
          />

          {/* Card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.decelerate }}
            style={{
              position: "fixed",
              bottom: "var(--space-6)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - var(--space-8))",
              maxWidth: "400px",
              background: "var(--color-surface)",
              borderRadius: "var(--shape-xl)",
              boxShadow: "var(--elevation-4, 0 8px 32px rgba(0,0,0,0.18))",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            {modal === "account" && <AccountModal onClose={close} />}
            {modal === "avatar"  && <AvatarModal  onClose={close} />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Create Account modal ─────────────────────────────────────────────────────

function AccountModal({ onClose }: { onClose: () => void }) {
  return (
    <div>
      {/* Coloured header strip */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, #2d5a54 100%)",
        padding: "var(--space-8) var(--space-6) var(--space-6)",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "var(--space-4)", right: "var(--space-4)",
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "var(--shape-full)",
            width: "32px", height: "32px", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: "#fff",
          }}
        >
          <X size={16} strokeWidth={2} />
        </button>
        <div style={{
          width: "48px", height: "48px", borderRadius: "var(--shape-full)",
          background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: "var(--space-4)",
        }}>
          <UserPlus size={24} strokeWidth={1.5} color="#fff" />
        </div>
        <p style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(22px, 5vw, 28px)",
          fontWeight: 400, color: "#fff", letterSpacing: "0.02em", lineHeight: 1.2,
          marginBottom: "var(--space-2)",
        }}>
          Discover your style.
        </p>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "14px",
          color: "rgba(255,255,255,0.8)", lineHeight: 1.5,
        }}>
          Create a free account to build your avatar, save outfits, and try on clothes before you buy.
        </p>
      </div>

      {/* Actions */}
      <div style={{ padding: "var(--space-5) var(--space-6) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Link href="/register" onClick={onClose} style={{ textDecoration: "none" }}>
          <button style={{
            width: "100%", height: "48px", borderRadius: "var(--shape-full)",
            background: "var(--color-primary)", color: "var(--color-on-primary)",
            border: "none", cursor: "pointer", fontFamily: "var(--font-sans)",
            fontSize: "15px", fontWeight: 600, letterSpacing: "0.02em",
          }}>
            Create free account
          </button>
        </Link>
        <Link href="/login" onClick={onClose} style={{ textDecoration: "none" }}>
          <button style={{
            width: "100%", height: "44px", borderRadius: "var(--shape-full)",
            background: "transparent", color: "var(--color-primary)",
            border: "1.5px solid var(--color-primary)", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 500,
          }}>
            Sign in
          </button>
        </Link>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: "13px",
            color: "var(--color-on-surface-variant)", padding: "var(--space-1) 0",
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── Build Avatar modal ───────────────────────────────────────────────────────

function AvatarModal({ onClose }: { onClose: () => void }) {
  return (
    <div>
      {/* Coloured header strip */}
      <div style={{
        background: "linear-gradient(135deg, #C7A760 0%, #b8934a 100%)",
        padding: "var(--space-8) var(--space-6) var(--space-6)",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "var(--space-4)", right: "var(--space-4)",
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "var(--shape-full)",
            width: "32px", height: "32px", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: "#fff",
          }}
        >
          <X size={16} strokeWidth={2} />
        </button>
        <div style={{
          width: "48px", height: "48px", borderRadius: "var(--shape-full)",
          background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: "var(--space-4)",
        }}>
          <Sparkles size={24} strokeWidth={1.5} color="#fff" />
        </div>
        <p style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(22px, 5vw, 28px)",
          fontWeight: 400, color: "#fff", letterSpacing: "0.02em", lineHeight: 1.2,
          marginBottom: "var(--space-2)",
        }}>
          Try before you buy.
        </p>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "14px",
          color: "rgba(255,255,255,0.85)", lineHeight: 1.5,
        }}>
          Build your photorealistic avatar and see exactly how clothes look on your body before ordering.
        </p>
      </div>

      {/* Actions */}
      <div style={{ padding: "var(--space-5) var(--space-6) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Link href="/avatar-builder" onClick={onClose} style={{ textDecoration: "none" }}>
          <button style={{
            width: "100%", height: "48px", borderRadius: "var(--shape-full)",
            background: "#C7A760", color: "#fff",
            border: "none", cursor: "pointer", fontFamily: "var(--font-sans)",
            fontSize: "15px", fontWeight: 600, letterSpacing: "0.02em",
          }}>
            Build my avatar
          </button>
        </Link>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: "13px",
            color: "var(--color-on-surface-variant)", padding: "var(--space-1) 0",
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
