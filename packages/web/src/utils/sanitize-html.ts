import DOMPurify from "dompurify";

const ALLOWED_TAGS = ["div", "span", "p", "b", "strong", "em", "br", "i", "u"];
const ALLOWED_ATTR = ["class"];

const PURIFY_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOW_DATA_ATTR: false,
};

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  if (typeof window === "undefined") return "";

  return DOMPurify.sanitize(dirty, PURIFY_CONFIG);
}
