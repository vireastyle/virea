import type { BodyShape, HeightRange } from "@/types/avatar";
import type { Category } from "@/types/clothing";

export type AvatarDrawConfig = {
  skinToneHex: string;
  hairColourHex: string;
  bodyShape: BodyShape;
  heightRange: HeightRange;
};

export type ClothingLayerDraw = {
  colourHex: string;
  category: Category;
};

// Body proportions: half-widths at shoulder / waist / hip
const BODY_PROPS: Record<BodyShape, { sw: number; ww: number; hw: number }> = {
  hourglass:           { sw: 78, ww: 50, hw: 80 },
  pear:                { sw: 62, ww: 58, hw: 88 },
  apple:               { sw: 72, ww: 82, hw: 72 },
  rectangle:           { sw: 68, ww: 65, hw: 68 },
  "inverted-triangle": { sw: 88, ww: 58, hw: 60 },
};

const CX = 200;
// Fixed Y anchors for a 400 × 600 canvas
const SHOULDER_Y = 168;
const WAIST_Y    = 265;
const HIP_Y      = 315;
const FOOT_Y     = 540;
const SKIRT_HEM  = 520;

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

function rRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawTorso(
  ctx: CanvasRenderingContext2D,
  props: { sw: number; ww: number; hw: number },
  colour: string
): void {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(CX - props.sw, SHOULDER_Y);
  ctx.quadraticCurveTo(CX - props.ww, WAIST_Y, CX - props.hw, HIP_Y);
  ctx.lineTo(CX + props.hw, HIP_Y);
  ctx.quadraticCurveTo(CX + props.ww, WAIST_Y, CX + props.sw, SHOULDER_Y);
  ctx.closePath();
  ctx.fill();
}

export function drawTryOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  avatar: AvatarDrawConfig,
  layers: ClothingLayerDraw[]
): void {
  const props = BODY_PROPS[avatar.bodyShape];

  const dressLayer     = layers.find((l) => l.category === "DRESS");
  const topLayer       = layers.find((l) => l.category === "TOP");
  const outerwearLayer = layers.find((l) => l.category === "OUTERWEAR");
  const bagLayer       = layers.find((l) => l.category === "BAG");
  const shoesLayer     = layers.find((l) => l.category === "SHOES");

  ctx.clearRect(0, 0, width, height);

  // ── Background ──────────────────────────────────────────────
  ctx.fillStyle = "#EDE8E1";
  ctx.fillRect(0, 0, width, height);

  // Subtle vignette
  const vignette = ctx.createRadialGradient(CX, height / 2, height * 0.2, CX, height / 2, height * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.06)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // ── Lower body / skirt ──────────────────────────────────────
  if (dressLayer) {
    ctx.fillStyle = dressLayer.colourHex;
    ctx.beginPath();
    ctx.moveTo(CX - props.hw, HIP_Y);
    ctx.quadraticCurveTo(CX - props.hw - 18, (HIP_Y + SKIRT_HEM) / 2, CX - (props.hw + 28), SKIRT_HEM);
    ctx.lineTo(CX + props.hw + 28, SKIRT_HEM);
    ctx.quadraticCurveTo(CX + props.hw + 18, (HIP_Y + SKIRT_HEM) / 2, CX + props.hw, HIP_Y);
    ctx.closePath();
    ctx.fill();
    // subtle hem stroke
    ctx.strokeStyle = darken(dressLayer.colourHex, 18);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  } else {
    // Default neutral trousers
    const legColour = "#2A2218";
    const legW = 30;
    const gap  = 20;
    ctx.fillStyle = legColour;
    rRect(ctx, CX - gap - legW, HIP_Y, legW, FOOT_Y - HIP_Y, 10); ctx.fill();
    rRect(ctx, CX + gap,        HIP_Y, legW, FOOT_Y - HIP_Y, 10); ctx.fill();
  }

  // ── Shoes ────────────────────────────────────────────────────
  if (shoesLayer) {
    ctx.fillStyle = shoesLayer.colourHex;
    const gap = 20; const legW = 30;
    const shoeW = legW + 8; const shoeH = 16;
    rRect(ctx, CX - gap - legW - 4, FOOT_Y - shoeH + 8, shoeW, shoeH, 5); ctx.fill();
    rRect(ctx, CX + gap - 4,        FOOT_Y - shoeH + 8, shoeW, shoeH, 5); ctx.fill();
  }

  // ── Torso ────────────────────────────────────────────────────
  const torsoColour = dressLayer?.colourHex ?? topLayer?.colourHex ?? "#E0D8CE";
  drawTorso(ctx, props, torsoColour);
  if (!dressLayer) {
    ctx.strokeStyle = darken(torsoColour, 14);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ── Outerwear overlay ────────────────────────────────────────
  if (outerwearLayer) {
    ctx.fillStyle = withAlpha(outerwearLayer.colourHex, 0.88);
    ctx.beginPath();
    ctx.moveTo(CX - props.sw - 12, SHOULDER_Y);
    ctx.quadraticCurveTo(CX - props.ww - 8, WAIST_Y, CX - props.hw - 4, HIP_Y + 24);
    ctx.lineTo(CX + props.hw + 4, HIP_Y + 24);
    ctx.quadraticCurveTo(CX + props.ww + 8, WAIST_Y, CX + props.sw + 12, SHOULDER_Y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = darken(outerwearLayer.colourHex, 20);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // ── Bag ──────────────────────────────────────────────────────
  if (bagLayer) {
    const bx = CX + props.hw + 14;
    const by = HIP_Y - 12;
    ctx.fillStyle = bagLayer.colourHex;
    rRect(ctx, bx, by, 40, 48, 7); ctx.fill();
    ctx.strokeStyle = darken(bagLayer.colourHex, 22);
    ctx.lineWidth = 1;
    ctx.stroke();
    // strap
    ctx.strokeStyle = darken(bagLayer.colourHex, 28);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + 6, by);
    ctx.quadraticCurveTo(bx - 14, by - 28, bx + 6, by - 54);
    ctx.stroke();
  }

  // ── Neck ─────────────────────────────────────────────────────
  ctx.fillStyle = avatar.skinToneHex;
  rRect(ctx, CX - 11, SHOULDER_Y - 22, 22, 26, 4);
  ctx.fill();

  // ── Head ─────────────────────────────────────────────────────
  ctx.fillStyle = avatar.skinToneHex;
  ctx.beginPath();
  ctx.ellipse(CX, 100, 47, 54, 0, 0, Math.PI * 2);
  ctx.fill();

  // Face details
  ctx.fillStyle = darken(avatar.skinToneHex, 55);
  ctx.beginPath(); ctx.ellipse(CX - 15, 95, 4.5, 6, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(CX + 15, 95, 4.5, 6, 0.2, 0, Math.PI * 2);  ctx.fill();
  ctx.strokeStyle = darken(avatar.skinToneHex, 32);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(CX, 116, 9, 0.08 * Math.PI, 0.92 * Math.PI);
  ctx.stroke();

  // ── Hair ─────────────────────────────────────────────────────
  ctx.fillStyle = avatar.hairColourHex;
  ctx.beginPath();
  ctx.ellipse(CX, 65, 52, 44, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  // Side hair
  ctx.beginPath();
  ctx.ellipse(CX - 40, 100, 14, 30, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(CX + 40, 100, 14, 30, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── Floor shadow ─────────────────────────────────────────────
  const shadowGrad = ctx.createRadialGradient(CX, FOOT_Y + 6, 8, CX, FOOT_Y + 6, 60);
  shadowGrad.addColorStop(0, "rgba(0,0,0,0.14)");
  shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(CX, FOOT_Y + 6, 58, 14, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function exportCanvas(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}
