/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeParseTime } from "./time.utils";

describe("safeParseTime", () => {
  describe("return success", () => {
    it("should convert UTC time correctly", () => {
      const isoUtc = "2024-01-15T10:30:00Z";
      const result = safeParseTime(isoUtc);
      expect(result).toBe(Date.parse(isoUtc)); // Same as getTime() UTC epoch ms
    });

    it("should convert valid ISO string to timestamp", () => {
      const isoString = "2024-01-15T10:30:00.000Z";
      const result = safeParseTime(isoString);
      expect(result).toBe(new Date(new Date(isoString).toUTCString()).getTime());
      expect(typeof result).toBe("number");
    });

    it("should convert valid Date object to timestamp", () => {
      const date = new Date("2024-01-15T10:30:00.000Z");
      const result = safeParseTime(date);
      expect(result).toBe(new Date(date.toUTCString()).getTime());
      expect(typeof result).toBe("number");
    });

    it("should handle valid number (timestamp)", () => {
      const timestamp = 1705315800000; // 2024-01-15 10:30:00 UTC
      const result = safeParseTime(timestamp);
      expect(result).toBe(new Date(new Date(timestamp).toUTCString()).getTime());
      expect(typeof result).toBe("number");
    });

    it("should handle common date string formats", () => {
      const dateString = "2024-01-15";
      const result = safeParseTime(dateString);
      expect(result).toBe(new Date(new Date(dateString).toUTCString()).getTime());
      expect(typeof result).toBe("number");
    });

    it("should handle various ISO formats", () => {
      const formats = [
        "2024-01-15T10:30:00Z",
        "2024-01-15T10:30:00.000Z",
        "2024-01-15T10:30:00+00:00",
        "2024-01-15T10:30:00-05:00",
      ];

      formats.forEach(format => {
        const result = safeParseTime(format);
        expect(result).not.toBe(null);
        expect(typeof result).toBe("number");
      });
    });

    it("should handle negative timestamp (before 1970)", () => {
      const negativeTimestamp = -86400000; // 1969-12-31
      const result = safeParseTime(negativeTimestamp);
      expect(result).not.toBe(null);
      expect(typeof result).toBe("number");
    });
  });

  describe("return null", () => {
    it("should return null for null and undefined", () => {
      expect(safeParseTime(null)).toBe(null);
      expect(safeParseTime(undefined)).toBe(null);
    });

    it("should return null for empty string", () => {
      expect(safeParseTime("")).toBe(null);
    });

    it("should return null for invalid strings", () => {
      expect(safeParseTime("invalid-date")).toBe(null);
      expect(safeParseTime("not-a-date")).toBe(null);
      expect(safeParseTime("2024-13-40")).toBe(null);
    });

    it("should return null for invalid object types", () => {
      expect(safeParseTime({} as any)).toBe(null);
      expect(safeParseTime([] as any)).toBe(null);
      expect(safeParseTime(true as any)).toBe(null);
    });

    it("should return null for NaN", () => {
      expect(safeParseTime(NaN)).toBe(null);
    });

    it("should return null for Infinity", () => {
      expect(safeParseTime(Infinity)).toBe(null);
      expect(safeParseTime(-Infinity)).toBe(null);
    });
  });
});

describe("safeParseTime — additional cases", () => {
  // Remove timezone/local dependencies
  // always compare with Z or explicit offset
  it("ISO with offset equals equivalent Z instant", () => {
    const withOffset = "2024-01-15T01:00:00+09:00";
    const z = "2024-01-14T16:00:00Z"; // Same instant
    const a = safeParseTime(withOffset);
    const b = safeParseTime(z);
    expect(a).toBe(b);
    expect(a).toBe(Date.parse(z));
  });

  // Note: clarify policy (treat as UTC 00:00? current implementation is engine-dependent)
  it("YYYY-MM-DD date-only is interpreted consistently (UTC midnight)", () => {
    const s = "2024-01-15";
    const got = safeParseTime(s);
    const expected = Date.UTC(2024, 0, 15, 0, 0, 0, 0); // fixed to UTC midnight
    expect(got).toBe(expected);
  });

  it("whitespace-only string returns null", () => {
    expect(safeParseTime("   ")).toBe(null);
    expect(safeParseTime("\n\t")).toBe(null);
  });

  // Note: clarify seconds vs milliseconds
  it("numeric string (seconds) vs (milliseconds) policy", () => {
    const seconds = "1705315800"; // 2024-01-15T10:30:00Z (seconds)
    const millis = "1705315800000"; // Same instant (milliseconds)
    // seconds are *1000, millis as-is
    const a = safeParseTime(seconds);
    const b = safeParseTime(millis);
    expect(a).toBe(1705315800 * 1000);
    expect(b).toBe(1705315800000);
    expect(a).toBe(b);
  });

  it("out-of-range timestamps return null", () => {
    // Date max approximately ±8.64e15 ms
    // outside of JS Date representable range
    expect(safeParseTime(9e15)).toBe(null);
    expect(safeParseTime(-9e15)).toBe(null);
  });

  it("string NaN/Infinity return null", () => {
    expect(safeParseTime("NaN" as any)).toBe(null);
    expect(safeParseTime("Infinity" as any)).toBe(null);
    expect(safeParseTime("-Infinity" as any)).toBe(null);
  });

  it("does not trigger object ToPrimitive side-effects", () => {
    let sideEffect = 0;
    const evil = {
      valueOf() {
        sideEffect += 1;
        return 1705315800000;
      },
      toString() {
        sideEffect += 1;
        return "2024-01-15T10:30:00Z";
      },
    } as unknown as any;

    const result = safeParseTime(evil);
    // Safe implementation should immediately reject objects
    expect(sideEffect).toBe(0);
    expect(result).toBe(null);
  });

  it("returns null for arrays and exotic types", () => {
    expect(safeParseTime(["2024-01-15"] as any)).toBe(null);
    expect(safeParseTime([1705315800000] as any)).toBe(null);
    expect(safeParseTime((() => "2024-01-15") as any)).toBe(null);
    expect(safeParseTime(Symbol("t") as any)).toBe(null);
    expect(safeParseTime(1n as any)).toBe(null);
  });

  it("returns null for boolean values", () => {
    expect(safeParseTime(true as any)).toBe(null);
    expect(safeParseTime(false as any)).toBe(null);
  });

  it("invalid ISO strings return null", () => {
    expect(safeParseTime("2024-01-15T25:00:00Z")).toBe(null);
    expect(safeParseTime("2024-01-15T10:61:00Z")).toBe(null);
    expect(safeParseTime("2024-01-15T10:30:61Z")).toBe(null);
    expect(safeParseTime("2024-01-15T10:30:00+24:00")).toBe(null);
  });

  it("leap day validity", () => {
    expect(safeParseTime("2024-02-29T00:00:00Z")).toBe(Date.parse("2024-02-29T00:00:00Z"));
    expect(safeParseTime("2023-02-29T00:00:00Z")).toBe(null);
  });

  // When explicit offset is provided, should be DST-independent
  it("DST-safe when offset is explicit", () => {
    // Even non-existent local time on US DST start date,
    // absolute value is defined when offset is explicit
    const s = "2024-03-10T02:30:00-05:00"; // US Eastern, spring forward
    const t = safeParseTime(s);
    expect(t).toBe(Date.parse(s));
  });

  it("does not mutate Date instances", () => {
    const d = new Date("2024-01-15T10:30:00Z");
    const before = d.getTime();
    const t = safeParseTime(d);
    expect(t).toBe(before);
    expect(d.getTime()).toBe(before);
  });
});
