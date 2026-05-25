/**
 * Universal API proxy — forwards all /api/* requests to the Express backend.
 *
 * This file catches everything under /api/ that isn't handled by a more
 * specific Next.js route (e.g. /api/tryon, /api/generate-avatar which run
 * directly in Next.js and call Replicate).
 *
 * No business logic here. Thin pass-through only.
 */

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function proxy(req: NextRequest): Promise<NextResponse> {
  // Strip the /api prefix — Express routes start at /api/v1
  const path = req.nextUrl.pathname.replace(/^\/api/, "");
  const search = req.nextUrl.search;
  const target = `${API_URL}/api/v1${path}${search}`;

  // Forward relevant headers; carry the cookie through for refresh token
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const authorization = req.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);

  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: body ? Buffer.from(body) : undefined,
    // Don't follow redirects — let the client handle them
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  // Forward Set-Cookie so the refresh token cookie reaches the browser
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) responseHeaders.set("set-cookie", setCookie);
  responseHeaders.set("content-type", upstream.headers.get("content-type") ?? "application/json");

  const responseBody = await upstream.arrayBuffer();

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET     = proxy;
export const POST    = proxy;
export const PUT     = proxy;
export const PATCH   = proxy;
export const DELETE  = proxy;
export const OPTIONS = proxy;
