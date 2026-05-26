/**
 * Module-level access-token registry.
 *
 * The access token must NOT be persisted to localStorage (XSS risk).
 * It lives only in memory and is replenished on every page load via
 * the silent-refresh flow in api.ts.
 *
 * auth.store  →  calls apiToken.set() after login / register
 * api.ts      →  calls apiToken.get() to attach the Bearer header
 */
let _token: string | null = null;

export const apiToken = {
  get(): string | null {
    return _token;
  },
  set(token: string | null): void {
    _token = token;
  },
};
