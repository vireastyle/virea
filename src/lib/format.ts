/**
 * Format an integer kobo value as a Nigerian Naira string.
 * All prices in the DB are stored as Int (kobo). Divide by 100 before display.
 *
 * @example formatNaira(4200000) → "₦42,000"
 */
export function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}

/**
 * Convert a naira string/number entered by a user in a form to kobo integer.
 * Rounds to nearest kobo to avoid float issues.
 *
 * @example nairaToKobo("42000") → 4200000
 */
export function nairaToKobo(naira: string | number): number {
  return Math.round(Number(naira) * 100);
}

/**
 * Convert a kobo integer back to a naira number for prefilling form inputs.
 *
 * @example koboToNaira(4200000) → 42000
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}
