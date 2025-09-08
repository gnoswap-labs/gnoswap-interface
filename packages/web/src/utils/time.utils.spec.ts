/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeParseTime } from "./time.utils";

describe("safeParseTime", () => {
  describe("return success", () => {
    it("should convert UTC time correctly", () => {
      const localTime = "2024-01-15T10:30:00";
      const result = safeParseTime(localTime);

      // Check if it matches the value after UTC conversion
      const expectedUtc = new Date(new Date(localTime).toUTCString()).getTime();
      expect(result).toBe(expectedUtc);
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
