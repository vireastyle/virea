import { NextRequest, NextResponse } from "next/server";
import { replicateFetch, sleep } from "@/lib/replicate";

export const maxDuration = 60;

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN ?? "";

// ── Skin tone hex → English description ─────────────────────────────────────
function hexToSkinDesc(hex: string): string {
  const r   = parseInt(hex.slice(1, 3), 16);
  const g   = parseInt(hex.slice(3, 5), 16);
  const b   = parseInt(hex.slice(5, 7), 16);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum > 210) return "very fair";
  if (lum > 175) return "light";
  if (lum > 140) return "medium tan";
  if (lum > 100) return "medium brown";
  if (lum > 65)  return "dark brown";
  return "deep dark";
}

const BODY_SHAPE_DESC: Record<string, string> = {
  hourglass:           "hourglass figure with a balanced bust, defined waist and full hips",
  pear:                "pear-shaped figure with narrow shoulders and wider hips",
  apple:               "apple-shaped figure with a fuller midsection and narrower hips",
  rectangle:           "athletic figure with balanced, straight proportions",
  "inverted-triangle": "inverted-triangle figure with broad shoulders and narrow hips",
};

const HEIGHT_DESC: Record<string, string> = {
  petite:  "petite",
  average: "average-height",
  tall:    "tall",
};

function buildPrompt(p: {
  gender:      string;
  bodyShape:   string;
  skinToneHex: string;
  heightRange: string;
}): string {
  const gender = p.gender === "male" ? "man" : "woman";
  const skin   = hexToSkinDesc(p.skinToneHex);
  const body   = BODY_SHAPE_DESC[p.bodyShape] ?? "balanced figure";
  const height = HEIGHT_DESC[p.heightRange]   ?? "average-height";

  // Prompt tuned for IDM-VTON compatibility:
  // — full length / head to toe phrasing repeated to force complete figure
  // — "feet flat on floor" anchors the bottom so the model doesn't crop
  // — arms slightly away from body (needed for garment overlay)
  // — white/light bodysuit so the try-on model can cleanly replace the clothing region
  // — white studio background for clean segmentation
  return (
    `Full length portrait, entire body visible from head to feet, ` +
    `studio photograph of a ${height} ${skin}-skinned African ${gender}, ` +
    `${body}, standing upright facing the camera in a relaxed T-pose, ` +
    `feet flat on the floor, legs and feet fully visible, ` +
    `arms slightly away from the sides, ` +
    `wearing a plain white seamless bodysuit, ` +
    `white studio background, soft even lighting, ` +
    `professional fashion photography, sharp focus, photorealistic, ` +
    `full body shot, no cropping`
  );
}

// ── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!REPLICATE_TOKEN) {
    return NextResponse.json(
      { error: "Replicate not configured." },
      { status: 503 },
    );
  }

  const body = await req.json() as {
    gender?:      string;
    bodyShape?:   string;
    skinToneHex?: string;
    heightRange?: string;
  };

  const prompt = buildPrompt({
    gender:      body.gender      ?? "female",
    bodyShape:   body.bodyShape   ?? "hourglass",
    skinToneHex: body.skinToneHex ?? "#8D5524",
    heightRange: body.heightRange ?? "average",
  });

  console.log("[generate-avatar] prompt:", prompt);

  // FLUX.1-schnell — fast generation (~3–8 s), photorealistic
  let res;
  try {
    res = await replicateFetch(
      "/v1/models/black-forest-labs/flux-schnell/predictions",
      {
        method: "POST",
        headers: {
          Authorization:  `Bearer ${REPLICATE_TOKEN}`,
          "Content-Type": "application/json",
          Prefer:         "wait=60",
        },
        body: JSON.stringify({
          input: {
            prompt,
            num_outputs:    1,
            aspect_ratio:   "2:3",
            output_format:  "webp",
            output_quality: 85,
            go_fast:        true,
          },
        }),
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generate-avatar] fetch threw:", msg);
    return NextResponse.json({ error: `Could not reach AI service: ${msg}` }, { status: 502 });
  }

  if (!res.ok) {
    const txt = await res.text();
    console.error("[generate-avatar] FLUX error:", res.status, txt);
    return NextResponse.json(
      { error: `Generation error ${res.status}: ${txt.slice(0, 200)}` },
      { status: 502 },
    );
  }

  const data = await res.json<{
    id:      string;
    status:  string;
    output?: string[] | null;
    error?:  string | null;
  }>();

  // Synchronous result (Prefer: wait=60 usually returns immediately)
  if (data.status === "succeeded" && data.output?.[0]) {
    console.log("[generate-avatar] done (sync):", data.output[0]);
    return NextResponse.json({ avatarUrl: data.output[0] });
  }
  if (data.status === "failed") {
    return NextResponse.json(
      { error: data.error ?? "Generation failed." },
      { status: 502 },
    );
  }

  // Poll if still queued / processing
  const MAX_POLLS = 10;
  for (let i = 0; i < MAX_POLLS; i++) {
    await sleep(3_000);
    try {
      const poll = await replicateFetch(`/v1/predictions/${data.id}`, {
        headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
      });
      if (!poll.ok) continue;

      const p = await poll.json<{
        status:  string;
        output?: string[] | null;
        error?:  string | null;
      }>();

      console.log(`[generate-avatar] poll ${i + 1}/${MAX_POLLS} — ${p.status}`);

      if (p.status === "succeeded" && p.output?.[0]) {
        return NextResponse.json({ avatarUrl: p.output[0] });
      }
      if (p.status === "failed") {
        return NextResponse.json(
          { error: p.error ?? "Generation failed." },
          { status: 502 },
        );
      }
    } catch {
      // transient — keep polling
    }
  }

  return NextResponse.json(
    { error: "Generation timed out. Please try again." },
    { status: 504 },
  );
}
