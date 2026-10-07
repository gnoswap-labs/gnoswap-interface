import { getSafeExternalUrl, openExternalUrl } from "./url-utils";

// URL.canParse is not available in jsdom (Node 18), polyfill for tests
if (typeof URL.canParse !== "function") {
  URL.canParse = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
}

describe("getSafeExternalUrl", () => {
  test("allows http URLs", () => {
    const result = getSafeExternalUrl("http://example.com");
    expect(result).not.toBeNull();
    expect(result).toContain("http://example.com");
  });

  test("allows https URLs", () => {
    const result = getSafeExternalUrl("https://example.com/path?q=1");
    expect(result).not.toBeNull();
    expect(result).toContain("https://example.com/path?q=1");
  });

  test("blocks javascript: scheme", () => {
    expect(getSafeExternalUrl("javascript:alert(1)")).toBeNull();
  });

  test("blocks case-obfuscated javascript: scheme", () => {
    expect(getSafeExternalUrl("jAvAsCrIpT:alert(1)")).toBeNull();
  });

  test("blocks javascript: with leading whitespace", () => {
    expect(getSafeExternalUrl("  javascript:alert(1)")).toBeNull();
  });

  test("blocks data: scheme", () => {
    expect(getSafeExternalUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
  });

  test("blocks vbscript: scheme", () => {
    expect(getSafeExternalUrl("vbscript:MsgBox('xss')")).toBeNull();
  });

  test("blocks ftp: scheme", () => {
    expect(getSafeExternalUrl("ftp://example.com")).toBeNull();
  });

  test("blocks file: scheme", () => {
    expect(getSafeExternalUrl("file:///etc/passwd")).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(getSafeExternalUrl("")).toBeNull();
  });

  test("returns null for malformed URL", () => {
    expect(getSafeExternalUrl("not-a-url")).toBeNull();
  });

  test("blocks HTML entity encoded javascript:", () => {
    expect(getSafeExternalUrl("&#106;avascript:alert(1)")).toBeNull();
  });
});

describe("openExternalUrl", () => {
  const mockOpen = jest.fn();

  beforeEach(() => {
    mockOpen.mockReset();
    window.open = mockOpen;
  });

  test("opens safe URL with noopener,noreferrer", () => {
    openExternalUrl("https://example.com");

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockOpen.mock.calls[0][0]).toContain("https://example.com");
    expect(mockOpen.mock.calls[0][1]).toBe("_blank");
    expect(mockOpen.mock.calls[0][2]).toBe("noopener,noreferrer");
  });

  test("does not open dangerous URL", () => {
    openExternalUrl("javascript:alert(1)");

    expect(mockOpen).not.toHaveBeenCalled();
  });

  test("does not open empty string", () => {
    openExternalUrl("");

    expect(mockOpen).not.toHaveBeenCalled();
  });
});
