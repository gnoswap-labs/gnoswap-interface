import { sanitizeUrl } from "@braintree/sanitize-url";

const ALLOWED_PROTOCOLS = ["http:", "https:"];

/**
 * Validates and sanitizes an external URL.
 * Returns the sanitized URL if safe, or null if the URL is dangerous
 * (e.g. javascript:, data:, vbscript: schemes).
 *
 * Defense-in-depth: @braintree/sanitize-url handles obfuscated schemes,
 * then protocol whitelist provides a second layer of protection.
 */
export function getSafeExternalUrl(url: string): string | null {
  const sanitized = sanitizeUrl(url);
  if (sanitized === "about:blank") return null;

  try {
    const parsed = new URL(sanitized);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return null;
    return sanitized;
  } catch {
    return null;
  }
}

/**
 * Safely opens an external URL in a new tab with noopener/noreferrer.
 * Does nothing if the URL is invalid or uses a dangerous scheme.
 */
export function openExternalUrl(url: string): void {
  const safeUrl = getSafeExternalUrl(url);
  if (safeUrl) {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }
}
