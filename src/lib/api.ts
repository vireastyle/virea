/**
 * Authenticated fetch client for all /api/v1/* calls.
 *
 * Features:
 *  - Attaches Bearer token from apiToken registry
 *  - On 401, silently refreshes via the httpOnly refresh-token cookie
 *  - Retries the original request once with the new token
 *  - On second 401 (refresh failed), signs both stores out
 */
import { apiToken } from "@/lib/api-token";

// ─── Error type ───────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Internal helpers ─────────────────────────────────────────

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; error: { code: string; message: string } };
type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

async function tryRefresh(): Promise<string | null> {
  try {
    const res = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const body: ApiResponse<{ accessToken: string }> = await res.json();
    if (!body.success) return null;
    apiToken.set(body.data.accessToken);
    return body.data.accessToken;
  } catch {
    return null;
  }
}

async function signOutAll() {
  // Dynamic imports to avoid circular deps (stores will import api.ts)
  try {
    const [{ useAuthStore }, { useVendorStore }] = await Promise.all([
      import("@/store/auth.store"),
      import("@/store/vendor.store"),
    ]);
    useAuthStore.getState().signOut();
    useVendorStore.getState().signOut();
  } catch {
    // Ignore — stores may not be loaded yet
  }
}

// ─── Main fetch wrapper ───────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _retry = true
): Promise<T> {
  const token = apiToken.get();

  const res = await fetch(`/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  // Silent token refresh on 401
  if (res.status === 401 && _retry) {
    const newToken = await tryRefresh();
    if (newToken) return apiFetch(path, options, false);
    // Refresh failed — session is dead
    apiToken.set(null);
    signOutAll();
    throw new ApiError(
      "SESSION_EXPIRED",
      "Your session has expired. Please sign in again.",
      401
    );
  }

  const body: ApiResponse<T> = await res.json();
  if (!body.success) {
    throw new ApiError(body.error.code, body.error.message, res.status);
  }
  return body.data;
}
