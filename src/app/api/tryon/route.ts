import { NextRequest, NextResponse } from "next/server";
import { replicateFetch, sleep } from "@/lib/replicate";
import type { Category } from "@/types/clothing";

export const maxDuration = 60;

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN ?? "";
const MODEL_OWNER     = "cuuupid";
const MODEL_NAME      = "idm-vton";

const CATEGORY_MAP: Partial<Record<Category, string>> = {
  DRESS:     "dresses",
  TOP:       "upper_body",
  OUTERWEAR: "upper_body",
};

// ── Cache the model version hash ─────────────────────────────────────────────
let cachedVersion: string | null = null;

async function getLatestVersion(): Promise<string> {
  if (cachedVersion) return cachedVersion;

  const res = await replicateFetch(
    `/v1/models/${MODEL_OWNER}/${MODEL_NAME}/versions`,
    { headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` } },
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Could not fetch model versions (${res.status}): ${txt.slice(0, 200)}`);
  }

  const data  = await res.json<{ results: Array<{ id: string }> }>();
  const version = data.results?.[0]?.id;
  if (!version) throw new Error("No versions found for cuuupid/idm-vton");

  cachedVersion = version;
  console.log("[tryon] Model version:", version);
  return version;
}

// ── GET: smoke-test ───────────────────────────────────────────────────────────
export async function GET() {
  if (!REPLICATE_TOKEN || REPLICATE_TOKEN === "your_replicate_api_token_here") {
    return NextResponse.json({ ok: false, error: "Token not set" });
  }
  try {
    const accountRes = await replicateFetch("/v1/account", {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    if (!accountRes.ok) {
      return NextResponse.json({ ok: false, status: accountRes.status, body: await accountRes.text() });
    }
    const account = await accountRes.json<{ username?: string }>();
    const version = await getLatestVersion();
    return NextResponse.json({ ok: true, username: account.username, modelVersion: version });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) });
  }
}

// ── POST: run virtual try-on ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!REPLICATE_TOKEN || REPLICATE_TOKEN === "your_replicate_api_token_here") {
    return NextResponse.json(
      { error: "AI try-on is not configured. Add REPLICATE_API_TOKEN to .env.local" },
      { status: 503 },
    );
  }

  let body: {
    personImageB64?: string;  // real-photo mode: compressed selfie base64
    personImageUrl?: string;  // avatar mode: URL of FLUX-generated avatar photo
    garmentImageUrl?: string;
    category?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { personImageB64, personImageUrl, garmentImageUrl, category } = body;

  // Accept either form of person image; URL takes precedence
  const humanImg = personImageUrl ?? personImageB64;
  if (!humanImg || !garmentImageUrl || !category) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const idmCategory = CATEGORY_MAP[category as Category];
  if (!idmCategory) {
    return NextResponse.json(
      { error: "This item category is not supported for AI try-on." },
      { status: 400 },
    );
  }

  // ── 1. Resolve model version ─────────────────────────────────────────────
  let modelVersion: string;
  try {
    modelVersion = await getLatestVersion();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[tryon] Version fetch error:", msg);
    return NextResponse.json({ error: `Could not load AI model: ${msg}` }, { status: 502 });
  }

  // ── 2. Start prediction ──────────────────────────────────────────────────
  let predictionId: string;

  try {
    const payload = JSON.stringify({
      version: modelVersion,
      input: {
        human_img:       humanImg,
        garm_img:        garmentImageUrl,
        category:        idmCategory,
        garment_des:     "clothing item",
        is_checked:      true,
        is_checked_crop: false,
        denoise_steps:   30,
        seed:            42,
      },
    });

    const startRes = await replicateFetch("/v1/predictions", {
      method: "POST",
      headers: {
        Authorization:  `Bearer ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
        Prefer:         "wait=30",
      },
      body: payload,
    });

    if (!startRes.ok) {
      const errText = await startRes.text();
      console.error("[tryon] Replicate start error:", startRes.status, errText);
      return NextResponse.json(
        { error: `Replicate error ${startRes.status}: ${errText.slice(0, 300)}` },
        { status: 502 },
      );
    }

    const startData = await startRes.json<{
      id:      string;
      status:  string;
      output?: string | string[] | null;
      error?:  string | null;
    }>();

    if (!startData.id) {
      return NextResponse.json({ error: "Unexpected response from AI service." }, { status: 502 });
    }

    predictionId = startData.id;
    console.log("[tryon] Prediction started:", predictionId, "— status:", startData.status);

    if (startData.status === "succeeded" && startData.output) {
      const url = Array.isArray(startData.output) ? startData.output[0] : startData.output;
      return NextResponse.json({ resultUrl: url });
    }
    if (startData.status === "failed") {
      return NextResponse.json(
        { error: startData.error ?? "AI generation failed." },
        { status: 502 },
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[tryon] request threw:", msg);
    return NextResponse.json({ error: `Could not reach AI service: ${msg}` }, { status: 502 });
  }

  // ── 3. Poll until done ───────────────────────────────────────────────────
  const MAX_POLLS     = 9;
  const POLL_INTERVAL = 3_000;

  for (let i = 0; i < MAX_POLLS; i++) {
    await sleep(POLL_INTERVAL);
    try {
      const pollRes = await replicateFetch(`/v1/predictions/${predictionId}`, {
        headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
      });

      if (!pollRes.ok) continue;

      const pollData = await pollRes.json<{
        status:  string;
        output?: string | string[] | null;
        error?:  string | null;
      }>();

      console.log(`[tryon] poll ${i + 1}/${MAX_POLLS} — ${pollData.status}`);

      if (pollData.status === "succeeded" && pollData.output) {
        const url = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
        return NextResponse.json({ resultUrl: url });
      }
      if (pollData.status === "failed") {
        return NextResponse.json(
          { error: pollData.error ?? "AI generation failed. Please try again." },
          { status: 502 },
        );
      }
    } catch {
      // transient — keep polling
    }
  }

  return NextResponse.json(
    { error: "Generation timed out. The model may be warming up — please try again in a moment." },
    { status: 504 },
  );
}
