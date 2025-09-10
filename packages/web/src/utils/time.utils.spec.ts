/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeParseTime } from "./time.utils";

describe("safeParseTime (success cases)", () => {
  describe("return success", () => {
    it("should convert UTC ISO string correctly", () => {
      const isoUtc = "2024-01-15T10:30:00Z";
      const result = safeParseTime(isoUtc);
      expect(result).toBe(Date.parse(isoUtc));
    });

    it("should convert Date object to timestamp", () => {
      const date = new Date("2024-01-15T10:30:00.000Z");
      const result = safeParseTime(date);
      expect(result).toBe(new Date(date.toUTCString()).getTime());
      expect(typeof result).toBe("number");
    });

    it("should handle valid timestamp", () => {
      const timestamp = 1705315800000;
      const result = safeParseTime(timestamp);
      expect(result).toBe(new Date(new Date(timestamp).toUTCString()).getTime());
    });

    it("should handle various ISO formats", () => {
      const formats = ["2024-01-15T10:30:00.000Z", "2024-01-15T10:30:00+00:00", "2024-01-15T10:30:00-05:00"];

      formats.forEach(format => {
        const result = safeParseTime(format);
        expect(result).not.toBe(null);
        expect(typeof result).toBe("number");
      });
    });

    it("should handle date-only string as UTC midnight", () => {
      const dateString = "2024-01-15";
      const result = safeParseTime(dateString);
      expect(result).toBe(Date.UTC(2024, 0, 15, 0, 0, 0, 0));
    });

    it("should handle negative timestamp (before 1970)", () => {
      const negativeTimestamp = -86400000;
      const result = safeParseTime(negativeTimestamp);
      expect(result).not.toBe(null);
      expect(typeof result).toBe("number");
    });

    it("should handle numeric strings (seconds vs milliseconds)", () => {
      const seconds = "1705315800";
      const millis = "1705315800000";
      expect(safeParseTime(seconds)).toBe(1705315800 * 1000);
      expect(safeParseTime(millis)).toBe(1705315800000);
    });

    it("should handle timezone offsets correctly", () => {
      const withOffset = "2024-01-15T01:00:00+09:00";
      const utc = "2024-01-14T16:00:00Z";
      expect(safeParseTime(withOffset)).toBe(safeParseTime(utc));
    });

    it("should handle leap day correctly", () => {
      expect(safeParseTime("2024-02-29T00:00:00Z")).toBe(Date.parse("2024-02-29T00:00:00Z"));
    });
  });

  describe("return null (rejected inputs)", () => {
    it("should return null for null and undefined", () => {
      expect(safeParseTime(null)).toBe(null);
      expect(safeParseTime(undefined)).toBe(null);
    });

    it("should return null for empty or whitespace strings", () => {
      expect(safeParseTime("")).toBe(null);
      expect(safeParseTime("   ")).toBe(null);
      expect(safeParseTime("\n\t")).toBe(null);
    });

    it("should return null for invalid strings", () => {
      expect(safeParseTime("invalid-date")).toBe(null);
      expect(safeParseTime("2024-13-40")).toBe(null);
      expect(safeParseTime("2023-02-29T00:00:00Z")).toBe(null); // Invalid leap day
    });

    it("should return null for invalid ISO formats", () => {
      expect(safeParseTime("2024-01-15T25:00:00Z")).toBe(null);
      expect(safeParseTime("2024-01-15T10:61:00Z")).toBe(null);
      expect(safeParseTime("2024-01-15T10:30:61Z")).toBe(null);
    });

    it("should return null for invalid types", () => {
      expect(safeParseTime({} as any)).toBe(null);
      expect(safeParseTime([] as any)).toBe(null);
      expect(safeParseTime(["2024-01-15"] as any)).toBe(null);
      expect(safeParseTime(true as any)).toBe(null);
      expect(safeParseTime((() => "2024-01-15") as any)).toBe(null);
    });

    it("should return null for special numeric values", () => {
      expect(safeParseTime(NaN)).toBe(null);
      expect(safeParseTime(Infinity)).toBe(null);
      expect(safeParseTime(-Infinity)).toBe(null);
      expect(safeParseTime("NaN" as any)).toBe(null);
      expect(safeParseTime("Infinity" as any)).toBe(null);
    });

    it("should return null for out-of-range timestamps", () => {
      expect(safeParseTime(9e15)).toBe(null);
      expect(safeParseTime(-9e15)).toBe(null);
    });

    it("should not trigger object side-effects", () => {
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
      expect(sideEffect).toBe(0);
      expect(result).toBe(null);
    });

    it("should not mutate Date instances", () => {
      const d = new Date("2024-01-15T10:30:00Z");
      const before = d.getTime();
      const t = safeParseTime(d);
      expect(t).toBe(before);
      expect(d.getTime()).toBe(before);
    });
  });
});
