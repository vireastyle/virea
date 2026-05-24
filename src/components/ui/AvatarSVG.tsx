"use client";

import { forwardRef } from "react";
import type { CSSProperties } from "react";
import type { BodyShape, HairStyle } from "@/types/avatar";

// ── Public types ─────────────────────────────────────────────────────────────
export type AvatarGender = "female" | "male";

export type ClothingLayer = {
  category: "DRESS" | "TOP" | "OUTERWEAR" | "BAG" | "SHOES";
  colourHex: string;
};

type Props = {
  gender?: AvatarGender;
  bodyShape?: BodyShape;
  skinToneHex?: string;
  hairStyle?: HairStyle;
  hairColourHex?: string;
  clothing?: ClothingLayer[];
  /** CSS width — defaults to "100%" */
  width?: number | string;
  style?: CSSProperties;
  className?: string;
};

// ── Layout constants (400 × 600 viewBox) ─────────────────────────────────────
const VW = 400;
const VH = 600;
const CX = 200; // horizontal centre

const HEAD_CY  = 83;
const HEAD_RX  = 40;
const HEAD_RY  = 48;
const NECK_T   = HEAD_CY + HEAD_RY - 2; // 129
const NECK_B   = 157;
const SHLD_Y   = 166;
const BUST_Y   = 210;
const WAIST_Y  = 252;
const HIP_Y    = 302;
const CROTCH_Y = 336;
const KNEE_Y   = 420;
const ANKLE_Y  = 508;
const FLOOR_Y  = 532;

// Half-widths from CX per body shape
type BP = { sh: number; bu: number; wa: number; hi: number };

const FEM: Record<BodyShape, BP> = {
  hourglass:           { sh: 66, bu: 62, wa: 45, hi: 70 },
  pear:                { sh: 57, bu: 58, wa: 50, hi: 79 },
  apple:               { sh: 64, bu: 70, wa: 66, hi: 64 },
  rectangle:           { sh: 62, bu: 60, wa: 55, hi: 62 },
  "inverted-triangle": { sh: 75, bu: 70, wa: 52, hi: 57 },
};

const MAL: Record<BodyShape, BP> = {
  hourglass:           { sh: 72, bu: 67, wa: 52, hi: 64 },
  pear:                { sh: 62, bu: 63, wa: 56, hi: 73 },
  apple:               { sh: 70, bu: 73, wa: 70, hi: 66 },
  rectangle:           { sh: 68, bu: 66, wa: 60, hi: 66 },
  "inverted-triangle": { sh: 81, bu: 74, wa: 56, hi: 59 },
};

// ── Colour helpers ────────────────────────────────────────────────────────────
function dk(hex: string, n: number) {
  const v = parseInt(hex.replace("#", ""), 16);
  return `rgb(${Math.max(0, (v >> 16) - n)},${Math.max(0, ((v >> 8) & 255) - n)},${Math.max(0, (v & 255) - n)})`;
}
function lt(hex: string, n: number) {
  const v = parseInt(hex.replace("#", ""), 16);
  return `rgb(${Math.min(255, (v >> 16) + n)},${Math.min(255, ((v >> 8) & 255) + n)},${Math.min(255, (v & 255) + n)})`;
}

// ── Body path generators ──────────────────────────────────────────────────────

/** Torso silhouette — shoulder collar to crotch, no arms */
function bodyPath(g: AvatarGender, s: BodyShape): string {
  const p = g === "female" ? FEM[s] : MAL[s];
  const nw = g === "female" ? 13 : 16;
  const ay = SHLD_Y + 18; // armhole Y

  const rN = CX + nw, lN = CX - nw;
  const rS = CX + p.sh, lS = CX - p.sh;
  const rB = CX + p.bu, lB = CX - p.bu;
  const rW = CX + p.wa, lW = CX - p.wa;
  const rH = CX + p.hi, lH = CX - p.hi;

  return clean(`
    M ${rN},${NECK_B}
    C ${rN + 20},${NECK_B + 2} ${rS + 2},${SHLD_Y - 2} ${rS},${SHLD_Y}
    C ${rS + 2},${SHLD_Y + 10} ${rB + 10},${ay - 4} ${rB + 8},${ay}
    C ${rB + 4},${ay + 10} ${rB + 2},${BUST_Y - 10} ${rB},${BUST_Y}
    C ${rB},${BUST_Y + 22} ${rW + 4},${WAIST_Y - 18} ${rW},${WAIST_Y}
    C ${rW - 2},${WAIST_Y + 22} ${rH - 4},${HIP_Y - 22} ${rH},${HIP_Y}
    C ${rH + 2},${HIP_Y + 18} ${CX + 36},${CROTCH_Y - 8} ${CX + 28},${CROTCH_Y}
    L ${CX - 28},${CROTCH_Y}
    C ${CX - 36},${CROTCH_Y - 8} ${lH - 2},${HIP_Y + 18} ${lH},${HIP_Y}
    C ${lH + 4},${HIP_Y - 22} ${lW + 2},${WAIST_Y + 22} ${lW},${WAIST_Y}
    C ${lW - 4},${WAIST_Y - 18} ${lB - 2},${BUST_Y + 22} ${lB},${BUST_Y}
    C ${lB - 2},${BUST_Y - 10} ${lB - 4},${ay + 10} ${lB - 8},${ay}
    C ${lB - 10},${ay - 4} ${lS - 2},${SHLD_Y + 10} ${lS},${SHLD_Y}
    C ${lS - 2},${SHLD_Y - 2} ${lN - 20},${NECK_B + 2} ${lN},${NECK_B}
    Z
  `);
}

/** Single hanging arm */
function armPath(side: "L" | "R", g: AvatarGender, s: BodyShape): string {
  const p = g === "female" ? FEM[s] : MAL[s];
  const aw = g === "female" ? 12 : 15;
  const d = side === "R" ? 1 : -1;
  const ay = SHLD_Y + 18;
  const shX = CX + d * p.sh;
  const buX = CX + d * p.bu;
  const ouX = shX + d * aw;
  const wY = 322;
  const wW = aw - 3;

  return clean(`
    M ${shX},${SHLD_Y}
    C ${ouX},${SHLD_Y + 10} ${ouX + d * 2},${240} ${ouX + d},${wY}
    C ${ouX + d},${wY + 8} ${ouX - d * 2},${wY + 14} ${shX + d * wW},${wY + 16}
    C ${shX},${wY + 14} ${buX + d * 4},${wY + 8} ${buX + d * 4},${wY}
    C ${buX + d * 4},${240} ${buX + d * 8},${ay + 10} ${buX + d * 8},${ay}
    C ${shX - d * 2},${ay - 4} ${shX - d * 2},${SHLD_Y + 10} ${shX},${SHLD_Y}
    Z
  `);
}

/** Single leg */
function legPath(side: "L" | "R"): string {
  const d = side === "R" ? 1 : -1;
  const lx = CX + d * 24;
  const tw = 26, kw = 22, aw = 13;

  return clean(`
    M ${lx - tw},${CROTCH_Y + 2}
    C ${lx - tw},${CROTCH_Y + 30} ${lx - kw - 2},${KNEE_Y - 20} ${lx - kw},${KNEE_Y}
    C ${lx - kw},${KNEE_Y + 20} ${lx - aw},${ANKLE_Y - 20} ${lx - aw},${ANKLE_Y}
    L ${lx + aw},${ANKLE_Y}
    C ${lx + aw},${ANKLE_Y - 20} ${lx + kw},${KNEE_Y + 20} ${lx + kw},${KNEE_Y}
    C ${lx + kw + 2},${KNEE_Y - 20} ${lx + tw},${CROTCH_Y + 30} ${lx + tw},${CROTCH_Y + 2}
    Z
  `);
}

/** Bare foot */
function footPath(side: "L" | "R"): string {
  const d = side === "R" ? 1 : -1;
  const lx = CX + d * 24;
  const aw = 13, fw = 19;
  const toe = lx + d * fw;
  const heel = lx - d * (aw + 1);

  return clean(`
    M ${lx - aw},${ANKLE_Y}
    L ${lx + aw},${ANKLE_Y}
    C ${lx + aw + 4},${ANKLE_Y + 8} ${toe},${FLOOR_Y - 5} ${toe},${FLOOR_Y}
    C ${toe - d * 2},${FLOOR_Y + 2} ${heel + d * 8},${FLOOR_Y + 2} ${heel},${FLOOR_Y}
    C ${heel - d * 2},${FLOOR_Y - 5} ${lx - aw - 2},${ANKLE_Y + 8} ${lx - aw},${ANKLE_Y}
    Z
  `);
}

// ── Clothing path generators ──────────────────────────────────────────────────

function topPath(g: AvatarGender, s: BodyShape): string {
  const p = g === "female" ? FEM[s] : MAL[s];
  const nw = g === "female" ? 15 : 18;
  const sw = g === "female" ? 14 : 18; // sleeve extra width
  const sY = WAIST_Y - 18;             // sleeve hem Y
  const hemY = WAIST_Y + 12;

  const rN = CX + nw, lN = CX - nw;
  const rS = CX + p.sh + 3, lS = CX - p.sh - 3;
  const rSO = rS + sw, lSO = lS - sw;  // sleeve outer
  const rHem = CX + p.wa + 10, lHem = CX - p.wa - 10;

  return clean(`
    M ${rN},${NECK_B + 1}
    C ${rN + 20},${NECK_B + 4} ${rS},${SHLD_Y - 1} ${rS},${SHLD_Y}
    C ${rSO},${SHLD_Y + 12} ${rSO + 2},${sY - 28} ${rSO + 1},${sY}
    C ${rSO - 1},${sY + 8} ${rSO - 8},${sY + 12} ${rSO - 16},${sY + 12}
    C ${rSO - 22},${sY + 12} ${rSO - 24},${sY + 6} ${rSO - 24},${sY}
    C ${rSO - 24},${sY - 14} ${rHem - 4},${hemY - 18} ${rHem},${hemY}
    L ${lHem},${hemY}
    C ${lHem + 4},${hemY - 18} ${lSO + 24},${sY - 14} ${lSO + 24},${sY}
    C ${lSO + 24},${sY + 6} ${lSO + 22},${sY + 12} ${lSO + 16},${sY + 12}
    C ${lSO + 8},${sY + 12} ${lSO + 1},${sY + 8} ${lSO - 1},${sY}
    C ${lSO - 2},${sY - 28} ${lSO},${SHLD_Y + 12} ${lS},${SHLD_Y}
    C ${lS},${SHLD_Y - 1} ${lN - 20},${NECK_B + 4} ${lN},${NECK_B + 1}
    Z
  `);
}

function dressPath(g: AvatarGender, s: BodyShape): string {
  const p = g === "female" ? FEM[s] : MAL[s];
  const nw = g === "female" ? 15 : 18;
  const hemY = FLOOR_Y - 6;
  const hemW = p.hi + 42;

  const rN = CX + nw, lN = CX - nw;
  const rS = CX + p.sh + 3, lS = CX - p.sh - 3;
  const rB = CX + p.bu + 4, lB = CX - p.bu - 4;
  const rW = CX + p.wa + 2, lW = CX - p.wa - 2;
  const rH = CX + p.hi + 4, lH = CX - p.hi - 4;
  const rHem = CX + hemW, lHem = CX - hemW;

  return clean(`
    M ${rN},${NECK_B + 1}
    C ${rN + 20},${NECK_B + 4} ${rS},${SHLD_Y - 1} ${rS},${SHLD_Y}
    C ${rS + 2},${SHLD_Y + 12} ${rB + 8},${SHLD_Y + 26} ${rB + 6},${SHLD_Y + 28}
    C ${rB + 2},${BUST_Y + 8} ${rW + 2},${WAIST_Y - 8} ${rW},${WAIST_Y}
    C ${rW - 2},${WAIST_Y + 20} ${rH - 2},${HIP_Y - 20} ${rH + 2},${HIP_Y}
    C ${rH + 6},${HIP_Y + 28} ${rHem - 8},${hemY - 36} ${rHem},${hemY}
    L ${lHem},${hemY}
    C ${lHem + 8},${hemY - 36} ${lH - 6},${HIP_Y + 28} ${lH - 2},${HIP_Y}
    C ${lH + 2},${HIP_Y - 20} ${lW + 2},${WAIST_Y + 20} ${lW},${WAIST_Y}
    C ${lW - 2},${WAIST_Y - 8} ${lB - 2},${BUST_Y + 8} ${lB - 6},${SHLD_Y + 28}
    C ${lB - 8},${SHLD_Y + 26} ${lS - 2},${SHLD_Y + 12} ${lS},${SHLD_Y}
    C ${lS},${SHLD_Y - 1} ${lN - 20},${NECK_B + 4} ${lN},${NECK_B + 1}
    Z
  `);
}

function outerwearPath(g: AvatarGender, s: BodyShape): string {
  const p = g === "female" ? FEM[s] : MAL[s];
  const nw = g === "female" ? 15 : 18;
  const sw = g === "female" ? 18 : 22;
  const sEndY = WAIST_Y + 58;
  const hemY = HIP_Y + 12;

  const rN = CX + nw, lN = CX - nw;
  const rS = CX + p.sh + 6, lS = CX - p.sh - 6;
  const rSO = rS + sw, lSO = lS - sw;
  const rHem = CX + p.hi + 10, lHem = CX - p.hi - 10;

  return clean(`
    M ${rN},${NECK_B + 1}
    C ${rN + 22},${NECK_B + 4} ${rS},${SHLD_Y - 2} ${rS},${SHLD_Y}
    C ${rSO},${SHLD_Y + 14} ${rSO + 4},${sEndY - 32} ${rSO + 3},${sEndY}
    C ${rSO + 1},${sEndY + 8} ${rSO - 8},${sEndY + 14} ${rSO - 18},${sEndY + 14}
    C ${rSO - 26},${sEndY + 14} ${rSO - 28},${sEndY + 6} ${rSO - 28},${sEndY}
    C ${rSO - 28},${sEndY - 20} ${rHem - 2},${hemY - 12} ${rHem},${hemY}
    L ${lHem},${hemY}
    C ${lHem + 2},${hemY - 12} ${lSO + 28},${sEndY - 20} ${lSO + 28},${sEndY}
    C ${lSO + 28},${sEndY + 6} ${lSO + 26},${sEndY + 14} ${lSO + 18},${sEndY + 14}
    C ${lSO + 8},${sEndY + 14} ${lSO - 1},${sEndY + 8} ${lSO - 3},${sEndY}
    C ${lSO - 4},${sEndY - 32} ${lSO},${SHLD_Y + 14} ${lS},${SHLD_Y}
    C ${lS},${SHLD_Y - 2} ${lN - 22},${NECK_B + 4} ${lN},${NECK_B + 1}
    Z
  `);
}

function shoePath(side: "L" | "R"): string {
  const d = side === "R" ? 1 : -1;
  const lx = CX + d * 24;
  const aw = 14, fw = 21;
  const toe = lx + d * fw;
  const heel = lx - d * (aw + 1);

  return clean(`
    M ${lx - aw},${ANKLE_Y + 2}
    L ${lx + aw},${ANKLE_Y + 2}
    C ${lx + aw + 5},${ANKLE_Y + 10} ${toe},${FLOOR_Y - 3} ${toe},${FLOOR_Y}
    L ${heel},${FLOOR_Y}
    C ${heel},${FLOOR_Y - 3} ${lx - aw - 3},${ANKLE_Y + 10} ${lx - aw},${ANKLE_Y + 2}
    Z
  `);
}

function bagPath(g: AvatarGender, s: BodyShape): { bag: string; strap: string } {
  const p = g === "female" ? FEM[s] : MAL[s];
  const bx = CX + p.hi + 18;
  const by = HIP_Y - 8;
  return {
    bag:   `M ${bx},${by} C ${bx + 2},${by - 2} ${bx + 40},${by - 2} ${bx + 42},${by} C ${bx + 44},${by + 2} ${bx + 44},${by + 52} ${bx + 42},${by + 54} C ${bx + 40},${by + 56} ${bx + 2},${by + 56} ${bx},${by + 54} C ${bx - 2},${by + 52} ${bx - 2},${by + 2} ${bx},${by} Z`,
    strap: `M ${bx + 10},${by} C ${bx - 8},${by - 28} ${bx + 18},${by - 60} ${bx + 12},${by - 56}`,
  };
}

/** Default trousers (dark neutral, shown when no DRESS) */
function trouserPath(side: "L" | "R"): string {
  const d = side === "R" ? 1 : -1;
  const lx = CX + d * 24;
  const tw = 28, kw = 24, aw = 15;

  return clean(`
    M ${lx - tw},${CROTCH_Y - 2}
    C ${lx - tw - 2},${CROTCH_Y + 28} ${lx - kw - 4},${KNEE_Y - 18} ${lx - kw - 2},${KNEE_Y}
    C ${lx - kw - 2},${KNEE_Y + 22} ${lx - aw},${ANKLE_Y - 18} ${lx - aw},${ANKLE_Y}
    L ${lx + aw},${ANKLE_Y}
    C ${lx + aw},${ANKLE_Y - 18} ${lx + kw + 2},${KNEE_Y + 22} ${lx + kw + 2},${KNEE_Y}
    C ${lx + kw + 4},${KNEE_Y - 18} ${lx + tw + 2},${CROTCH_Y + 28} ${lx + tw},${CROTCH_Y - 2}
    Z
  `);
}

// ── Hair path generators ──────────────────────────────────────────────────────

function afroPath(): string {
  const cy = HEAD_CY - 6;
  return clean(`
    M ${CX - 56},${cy + 10}
    C ${CX - 74},${cy - 16} ${CX - 64},${cy - 60} ${CX - 36},${cy - 74}
    C ${CX - 20},${cy - 84} ${CX - 6},${cy - 88} ${CX},${cy - 87}
    C ${CX + 6},${cy - 88} ${CX + 20},${cy - 84} ${CX + 36},${cy - 74}
    C ${CX + 64},${cy - 60} ${CX + 74},${cy - 16} ${CX + 56},${cy + 10}
    C ${CX + 68},${cy + 24} ${CX + 60},${cy + 48} ${CX + 44},${cy + 60}
    C ${CX + 28},${cy + 70} ${CX + 12},${cy + 74} ${CX},${cy + 74}
    C ${CX - 12},${cy + 74} ${CX - 28},${cy + 70} ${CX - 44},${cy + 60}
    C ${CX - 60},${cy + 48} ${CX - 68},${cy + 24} ${CX - 56},${cy + 10}
    Z
  `);
}

function braidCapPath(): string {
  return clean(`
    M ${CX - HEAD_RX - 6},${HEAD_CY - 10}
    C ${CX - HEAD_RX - 8},${HEAD_CY - HEAD_RY - 12} ${CX - 22},${HEAD_CY - HEAD_RY - 18}
      ${CX},${HEAD_CY - HEAD_RY - 16}
    C ${CX + 22},${HEAD_CY - HEAD_RY - 18} ${CX + HEAD_RX + 8},${HEAD_CY - HEAD_RY - 12}
      ${CX + HEAD_RX + 6},${HEAD_CY - 10}
    Z
  `);
}

function braidStrandPaths(): string[] {
  const startY = HEAD_CY - HEAD_RY + 6;
  const endY   = startY + 215;
  const xs     = [-44, -32, -20, -8, 4, 16, 28, 40, 52].map(dx => CX - 4 + dx);
  return xs.map((x, i) => {
    const lean = (i - 4) * 1.5;
    return clean(`
      M ${x - 5},${startY}
      C ${x - 5 + lean * 0.3},${startY + 60} ${x - 5 + lean * 0.6},${endY - 60} ${x - 4 + lean},${endY}
      C ${x - 4 + lean + 2},${endY + 7} ${x + 4 + lean - 2},${endY + 7} ${x + 4 + lean},${endY}
      C ${x + 5 + lean * 0.6},${endY - 60} ${x + 5 + lean * 0.3},${startY + 60} ${x + 5},${startY}
      Z
    `);
  });
}

function straightSidePath(side: "L" | "R"): string {
  const d = side === "R" ? 1 : -1;
  const bx = CX + d * (HEAD_RX - 4);
  const ox = CX + d * (HEAD_RX + 10);
  return clean(`
    M ${CX + d * (HEAD_RX - 14)},${HEAD_CY - HEAD_RY + 4}
    C ${bx},${HEAD_CY - 18} ${ox},${HEAD_CY + 80} ${ox - d * 3},${HEAD_CY + 165}
    C ${ox - d * 3},${HEAD_CY + 175} ${ox - d * 9},${HEAD_CY + 179} ${ox - d * 16},${HEAD_CY + 175}
    C ${ox - d * 20},${HEAD_CY + 165} ${bx - d * 14},${HEAD_CY + 80} ${bx - d * 16},${HEAD_CY - 18}
    Z
  `);
}

function wavySidePath(side: "L" | "R"): string {
  const d = side === "R" ? 1 : -1;
  const bx = CX + d * HEAD_RX;
  return clean(`
    M ${CX + d * (HEAD_RX - 10)},${HEAD_CY - HEAD_RY + 4}
    C ${bx + d * 5},${HEAD_CY - 8} ${bx + d * 9},${HEAD_CY + 32} ${bx + d * 5},${HEAD_CY + 56}
    C ${bx + d * 1},${HEAD_CY + 72} ${bx + d * 7},${HEAD_CY + 90} ${bx + d * 3},${HEAD_CY + 102}
    C ${bx - d * 3},${HEAD_CY + 98} ${bx - d * 9},${HEAD_CY + 82} ${bx - d * 12},${HEAD_CY + 56}
    C ${bx - d * 16},${HEAD_CY + 32} ${bx - d * 12},${HEAD_CY - 8} ${bx - d * 16},${HEAD_CY - HEAD_RY + 4}
    Z
  `);
}

function locStrandPaths(): string[] {
  const startY = HEAD_CY - HEAD_RY + 10;
  const endY   = startY + 185;
  const xs     = [-40, -26, -12, 2, 14, 28, 42].map(dx => CX + dx);
  return xs.map((x, i) => {
    const w = i % 2 === 0 ? 6 : 5;
    const lean = (i - 3) * 1.2;
    return clean(`
      M ${x - w},${startY}
      C ${x - w + 2},${startY + 55} ${x - w - 2},${endY - 55} ${x - w + lean},${endY}
      C ${x - w + lean + 2},${endY + 8} ${x + w + lean - 2},${endY + 8} ${x + w + lean},${endY}
      C ${x + w - 2},${endY - 55} ${x + w + 2},${startY + 55} ${x + w},${startY}
      Z
    `);
  });
}

function lowCutPath(): string {
  return clean(`
    M ${CX - HEAD_RX - 4},${HEAD_CY}
    C ${CX - HEAD_RX - 6},${HEAD_CY - HEAD_RY - 6} ${CX - 20},${HEAD_CY - HEAD_RY - 10}
      ${CX},${HEAD_CY - HEAD_RY - 10}
    C ${CX + 20},${HEAD_CY - HEAD_RY - 10} ${CX + HEAD_RX + 6},${HEAD_CY - HEAD_RY - 6}
      ${CX + HEAD_RX + 4},${HEAD_CY}
    Z
  `);
}

// ── Utility ───────────────────────────────────────────────────────────────────
function clean(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

// ── Main component ────────────────────────────────────────────────────────────
export const AvatarSVG = forwardRef<SVGSVGElement, Props>(function AvatarSVG({
  gender        = "female",
  bodyShape     = "hourglass",
  skinToneHex   = "#8D5524",
  hairStyle     = "natural-coils",
  hairColourHex = "#0D0D0D",
  clothing      = [],
  width         = "100%",
  style,
  className,
}, ref) {
  const shade  = dk(skinToneHex, 22);
  const hShade = dk(hairColourHex, 18);

  const dressItem     = clothing.find(c => c.category === "DRESS");
  const topItem       = clothing.find(c => c.category === "TOP");
  const outerItem     = clothing.find(c => c.category === "OUTERWEAR");
  const bagItem       = clothing.find(c => c.category === "BAG");
  const shoesItem     = clothing.find(c => c.category === "SHOES");
  const hasDress      = !!dressItem;
  const neutralPants  = "#2A2218";

  const uid = `av${Math.random().toString(36).slice(2, 7)}`;

  // ── Hair renderer ──────────────────────────────────────────────────────
  const Hair = () => {
    switch (hairStyle) {
      case "natural-coils":
        return (
          <g>
            <path d={afroPath()} fill={hairColourHex} />
            {/* Coil texture dots */}
            {([-30,-18,-6,6,18,30,-24,0,24] as const).map((dx, i) => (
              <circle key={i} cx={CX + dx} cy={HEAD_CY - HEAD_RY - 16 + (i % 3) * 9}
                r={4.5} fill={hShade} opacity={0.35} />
            ))}
          </g>
        );
      case "braids":
        return (
          <g>
            {braidStrandPaths().map((d, i) => (
              <path key={i} d={d} fill={i % 2 === 0 ? hairColourHex : hShade} />
            ))}
            <path d={braidCapPath()} fill={hairColourHex} />
          </g>
        );
      case "locs":
        return (
          <g>
            {locStrandPaths().map((d, i) => (
              <path key={i} d={d} fill={i % 2 === 0 ? hairColourHex : hShade} />
            ))}
            <path d={lowCutPath()} fill={hairColourHex} />
          </g>
        );
      case "straight":
        return (
          <g>
            <path d={straightSidePath("L")} fill={hairColourHex} />
            <path d={straightSidePath("R")} fill={hairColourHex} />
            <ellipse cx={CX} cy={HEAD_CY - HEAD_RY + 4} rx={HEAD_RX + 5} ry={16} fill={hairColourHex} />
          </g>
        );
      case "waves":
        return (
          <g>
            <path d={wavySidePath("L")} fill={hairColourHex} />
            <path d={wavySidePath("R")} fill={hairColourHex} />
            <ellipse cx={CX} cy={HEAD_CY - HEAD_RY + 4} rx={HEAD_RX + 3} ry={14} fill={hairColourHex} />
          </g>
        );
      case "low-cut":
      default:
        return <path d={lowCutPath()} fill={hairColourHex} />;
    }
  };

  const bag = bagItem ? bagPath(gender, bodyShape) : null;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VW} ${VH}`}
      width={width}
      style={{ display: "block", ...style }}
      className={className}
      role="img"
      aria-label="Your avatar"
    >
      <defs>
        <linearGradient id={`${uid}-sg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={shade} />
          <stop offset="38%"  stopColor={skinToneHex} />
          <stop offset="100%" stopColor={shade} />
        </linearGradient>
        <radialGradient id={`${uid}-fl`} cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.16)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Floor shadow */}
      <ellipse cx={CX} cy={FLOOR_Y + 9} rx={68} ry={11}
        fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth={18} />

      {/* ── Legs (skin, behind clothing) ─────────────────── */}
      <path d={legPath("L")} fill={skinToneHex} />
      <path d={legPath("R")} fill={skinToneHex} />

      {/* Feet */}
      {!shoesItem && (
        <>
          <path d={footPath("L")} fill={skinToneHex} />
          <path d={footPath("R")} fill={skinToneHex} />
        </>
      )}

      {/* ── Lower-body clothing ──────────────────────────── */}
      {hasDress ? (
        <path d={dressPath(gender, bodyShape)}
          fill={dressItem!.colourHex}
          stroke={dk(dressItem!.colourHex, 22)} strokeWidth="0.8" />
      ) : (
        /* Default dark trousers */
        <>
          {/* Crotch gusset */}
          <path
            d={clean(`M ${CX-28},${CROTCH_Y-2} C ${CX-18},${CROTCH_Y+10} ${CX+18},${CROTCH_Y+10} ${CX+28},${CROTCH_Y-2} Z`)}
            fill={neutralPants} />
          <path d={trouserPath("L")} fill={neutralPants} />
          <path d={trouserPath("R")} fill={neutralPants} />
          {/* Crease */}
          <line x1={CX-24} y1={CROTCH_Y+10} x2={CX-18} y2={ANKLE_Y-8}
            stroke={dk(neutralPants,18)} strokeWidth="1" opacity="0.45" />
          <line x1={CX+24} y1={CROTCH_Y+10} x2={CX+18} y2={ANKLE_Y-8}
            stroke={dk(neutralPants,18)} strokeWidth="1" opacity="0.45" />
        </>
      )}

      {/* ── Torso (skin, covered by clothing) ───────────── */}
      <path d={bodyPath(gender, bodyShape)} fill={`url(#${uid}-sg)`} />

      {/* Bust hint for female hourglass (subtle) */}
      {gender === "female" && !topItem && !dressItem && !outerItem && (
        <ellipse cx={CX - 20} cy={BUST_Y + 4} rx={16} ry={12}
          fill={shade} opacity={0.12} />
      )}

      {/* ── Upper-body clothing ──────────────────────────── */}
      {topItem && (
        <path d={topPath(gender, bodyShape)}
          fill={topItem.colourHex}
          stroke={dk(topItem.colourHex, 20)} strokeWidth="0.8" />
      )}
      {outerItem && (
        <path d={outerwearPath(gender, bodyShape)}
          fill={outerItem.colourHex}
          stroke={dk(outerItem.colourHex, 22)} strokeWidth="0.9"
          opacity={0.96} />
      )}

      {/* ── Arms (skin, in front of torso/clothing) ──────── */}
      <path d={armPath("L", gender, bodyShape)} fill={`url(#${uid}-sg)`} />
      <path d={armPath("R", gender, bodyShape)} fill={`url(#${uid}-sg)`} />

      {/* ── Bag ──────────────────────────────────────────── */}
      {bag && bagItem && (
        <g>
          <path d={bag.strap} fill="none"
            stroke={dk(bagItem.colourHex, 26)} strokeWidth="2.8" strokeLinecap="round" />
          <path d={bag.bag}
            fill={bagItem.colourHex} stroke={dk(bagItem.colourHex, 26)} strokeWidth="1" />
          {/* Hardware */}
          <rect x={CX + (FEM[bodyShape] ?? MAL[bodyShape]).hi + 28}
            y={HIP_Y + 14} width={20} height={4} rx={2}
            fill={lt(bagItem.colourHex, 30)} opacity={0.6} />
        </g>
      )}

      {/* ── Shoes ────────────────────────────────────────── */}
      {shoesItem && (
        <>
          <path d={shoePath("L")} fill={shoesItem.colourHex}
            stroke={dk(shoesItem.colourHex, 22)} strokeWidth="1" />
          <path d={shoePath("R")} fill={shoesItem.colourHex}
            stroke={dk(shoesItem.colourHex, 22)} strokeWidth="1" />
        </>
      )}

      {/* ── Neck ─────────────────────────────────────────── */}
      <path
        d={clean(`M ${CX-13},${NECK_T} C ${CX-12},${NECK_B-8} ${CX-11},${NECK_B}
          ${CX-11},${NECK_B} L ${CX+11},${NECK_B}
          C ${CX+11},${NECK_B} ${CX+12},${NECK_B-8} ${CX+13},${NECK_T} Z`)}
        fill={skinToneHex} />

      {/* ── Hair (behind head) ───────────────────────────── */}
      <Hair />

      {/* ── Head ─────────────────────────────────────────── */}
      <ellipse cx={CX} cy={HEAD_CY} rx={HEAD_RX} ry={HEAD_RY}
        fill={skinToneHex} />
      {/* Subtle side shading */}
      <ellipse cx={CX + 16} cy={HEAD_CY - 6} rx={HEAD_RX - 3} ry={HEAD_RY - 3}
        fill="none" stroke={shade} strokeWidth={10} opacity={0.10} />

      {/* ── Face ─────────────────────────────────────────── */}
      {/* Eyebrows */}
      <path d={`M ${CX-24},${HEAD_CY-5} Q ${CX-15},${HEAD_CY-13} ${CX-6},${HEAD_CY-9}`}
        fill="none" stroke={dk(skinToneHex, 58)} strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M ${CX+6},${HEAD_CY-9} Q ${CX+15},${HEAD_CY-13} ${CX+24},${HEAD_CY-5}`}
        fill="none" stroke={dk(skinToneHex, 58)} strokeWidth="2.4" strokeLinecap="round" />

      {/* Eye whites */}
      <path d={`M ${CX-22},${HEAD_CY+3} Q ${CX-14},${HEAD_CY-5} ${CX-6},${HEAD_CY+3} Q ${CX-14},${HEAD_CY+9} ${CX-22},${HEAD_CY+3} Z`}
        fill="#F0EBE3" />
      <path d={`M ${CX+6},${HEAD_CY+3} Q ${CX+14},${HEAD_CY-5} ${CX+22},${HEAD_CY+3} Q ${CX+14},${HEAD_CY+9} ${CX+6},${HEAD_CY+3} Z`}
        fill="#F0EBE3" />
      {/* Iris */}
      <ellipse cx={CX-14} cy={HEAD_CY+3} rx={4.2} ry={4.8} fill="#2C1508" />
      <ellipse cx={CX+14} cy={HEAD_CY+3} rx={4.2} ry={4.8} fill="#2C1508" />
      {/* Pupil */}
      <ellipse cx={CX-14} cy={HEAD_CY+3} rx={2.2} ry={2.6} fill="#0A0602" />
      <ellipse cx={CX+14} cy={HEAD_CY+3} rx={2.2} ry={2.6} fill="#0A0602" />
      {/* Highlight */}
      <ellipse cx={CX-12.4} cy={HEAD_CY+1.2} rx={1.3} ry={1.5} fill="rgba(255,255,255,0.88)" />
      <ellipse cx={CX+15.6} cy={HEAD_CY+1.2} rx={1.3} ry={1.5} fill="rgba(255,255,255,0.88)" />
      {/* Lower lash line */}
      <path d={`M ${CX-22},${HEAD_CY+3} Q ${CX-14},${HEAD_CY+10} ${CX-6},${HEAD_CY+3}`}
        fill="none" stroke={dk(skinToneHex, 40)} strokeWidth="1" opacity="0.5" />
      <path d={`M ${CX+6},${HEAD_CY+3} Q ${CX+14},${HEAD_CY+10} ${CX+22},${HEAD_CY+3}`}
        fill="none" stroke={dk(skinToneHex, 40)} strokeWidth="1" opacity="0.5" />

      {/* Nose */}
      <path d={`M ${CX-4},${HEAD_CY+17} Q ${CX},${HEAD_CY+23} ${CX+4},${HEAD_CY+17}`}
        fill="none" stroke={dk(skinToneHex, 32)} strokeWidth="1.5" strokeLinecap="round" />
      {/* Nostrils */}
      <ellipse cx={CX-6} cy={HEAD_CY+19} rx={2.5} ry={1.8} fill={shade} opacity={0.35} />
      <ellipse cx={CX+6} cy={HEAD_CY+19} rx={2.5} ry={1.8} fill={shade} opacity={0.35} />

      {/* Lips */}
      {/* Upper */}
      <path d={`M ${CX-12},${HEAD_CY+27}
        C ${CX-8},${HEAD_CY+24} ${CX-3},${HEAD_CY+22} ${CX},${HEAD_CY+24}
        C ${CX+3},${HEAD_CY+22} ${CX+8},${HEAD_CY+24} ${CX+12},${HEAD_CY+27} Z`}
        fill={dk(skinToneHex, 24)} />
      {/* Lower */}
      <path d={`M ${CX-12},${HEAD_CY+27}
        C ${CX-8},${HEAD_CY+33} ${CX+8},${HEAD_CY+33} ${CX+12},${HEAD_CY+27} Z`}
        fill={lt(dk(skinToneHex, 24), 8)} />
      {/* Cupid's bow indent */}
      <path d={`M ${CX-4},${HEAD_CY+22} L ${CX},${HEAD_CY+25} L ${CX+4},${HEAD_CY+22}`}
        fill="none" stroke={dk(skinToneHex, 30)} strokeWidth="0.8" strokeLinecap="round" />
      {/* Lip line */}
      <line x1={CX-12} y1={HEAD_CY+27} x2={CX+12} y2={HEAD_CY+27}
        stroke={dk(skinToneHex, 32)} strokeWidth="0.9" strokeLinecap="round" />

      {/* ── Rim light / depth overlay ─────────────────────── */}
      <ellipse cx={CX} cy={HEAD_CY} rx={HEAD_RX} ry={HEAD_RY}
        fill={`url(#${uid}-fl)`} opacity={0.18} />
    </svg>
  );
});
