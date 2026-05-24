/**
 * Shared Replicate API utilities.
 *
 * Uses a direct IPv4 connection to avoid DNS failures in some environments
 * (e.g. Windows local dev). On Vercel/Linux the REPLICATE_HOST_IP env var
 * should be left unset — standard DNS works fine there.
 */

import https from "node:https";
import dns   from "node:dns/promises";

const REPLICATE_HOST = "api.replicate.com";
let cachedIP: string | null = null;

export async function getReplicateIP(): Promise<string> {
  if (cachedIP) return cachedIP;
  const envIP = process.env.REPLICATE_HOST_IP;
  if (envIP) {
    console.log("[replicate] Using REPLICATE_HOST_IP:", envIP);
    cachedIP = envIP;
    return envIP;
  }
  const { address } = await dns.lookup(REPLICATE_HOST, { verbatim: false });
  cachedIP = address;
  console.log("[replicate] Resolved", REPLICATE_HOST, "→", address);
  return address;
}

export type FetchOptions = {
  method?:  string;
  headers?: Record<string, string>;
  body?:    string;
};

export type FetchResponse = {
  ok:     boolean;
  status: number;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
};

/** Connect via pre-resolved IP; pass Host + SNI so TLS validates correctly. */
export async function replicateFetch(
  path: string,
  options: FetchOptions = {},
): Promise<FetchResponse> {
  const ip = await getReplicateIP();

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host:       ip,
        path,
        method:     options.method ?? "GET",
        headers:    { ...(options.headers ?? {}), Host: REPLICATE_HOST },
        servername: REPLICATE_HOST,
        timeout:    55_000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data",  (c: Buffer) => chunks.push(c));
        res.on("end",   () => {
          const text   = Buffer.concat(chunks).toString("utf-8");
          const status = res.statusCode ?? 0;
          resolve({
            ok:   status >= 200 && status < 300,
            status,
            text: async ()    => text,
            json: async <T>() => JSON.parse(text) as T,
          });
        });
        res.on("error", reject);
      },
    );

    req.on("error",   reject);
    req.on("timeout", () => req.destroy(new Error("Socket timeout")));
    if (options.body) req.write(options.body);
    req.end();
  });
}

export function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}
