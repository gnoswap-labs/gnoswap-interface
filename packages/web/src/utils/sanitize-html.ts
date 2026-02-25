import DOMPurify from "dompurify";

const ALLOWED_TAGS = ["div", "span", "p", "b", "strong", "em", "br", "i", "u"];
const ALLOWED_ATTR = ["class"];

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
