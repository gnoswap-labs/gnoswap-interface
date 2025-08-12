import {
  getDateUtcToLocal,
  getLocalDateString,
  formatTime,
  timeToDateStr,
  calculateRemainTime,
  secondsToTime,
  getTimeDiffInSeconds,
  getTimeDiffInMilliseconds,
  formatDisplayTime,
} from "./date-util";

describe("date-util", () => {
  // Mock timezone offset for consistent testing
  const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;

  beforeEach(() => {
    // Mock timezone offset to UTC+9 (Korea Standard Time)
    Date.prototype.getTimezoneOffset = jest.fn(() => -540);
  });

  afterEach(() => {
    Date.prototype.getTimezoneOffset = originalGetTimezoneOffset;
    jest.clearAllMocks();
  });

  describe("getDateUtcToLocal", () => {
    it("should return empty placeholder for null input", () => {
      const result = getDateUtcToLocal(null);
      expect(result.value).toBe("-");
      expect(result.offsetHours).toBe(9);
      expect(result.isEmpty).toBe(true);
    });

    it("should return empty placeholder for undefined input", () => {
      const result = getDateUtcToLocal(undefined);
      expect(result.value).toBe("-");
      expect(result.offsetHours).toBe(9);
      expect(result.isEmpty).toBe(true);
    });

    it("should handle date string with timezone (Z)", () => {
      const dateStr = "2024-01-01T00:00:00Z";
      const result = getDateUtcToLocal(dateStr);
      expect(result.isEmpty).toBe(false);
      expect(result.offsetHours).toBe(9);
      // dayjs parses Z dates according to system timezone, not mocked timezone
      // In CI (UTC), this will be "2024-01-01 00:00:00"
      // In local (UTC+9), this will be "2024-01-01 09:00:00"
      //
      // Note: To simulate the CI environment, set the TZ environment variable to UTC before running tests (e.g., TZ=UTC yarn test)
      const expectedDate = new Date("2024-01-01T00:00:00Z");
      const expectedHours = expectedDate.getHours().toString().padStart(2, "0");
      const expectedMinutes = expectedDate.getMinutes().toString().padStart(2, "0");
      const expectedSeconds = expectedDate.getSeconds().toString().padStart(2, "0");
      expect(result.value).toBe(`2024-01-01 ${expectedHours}:${expectedMinutes}:${expectedSeconds}`);
    });

    it("should handle date string without timezone", () => {
      const dateStr = "2024-01-01T00:00:00";
      const result = getDateUtcToLocal(dateStr);
      expect(result.isEmpty).toBe(false);
      expect(result.offsetHours).toBe(9);
      // Original implementation treats dates without timezone as local time
      expect(result.value).toBe("2024-01-01 00:00:00");
    });

    it("should handle Date object with timezone", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = getDateUtcToLocal(date);
      expect(result.isEmpty).toBe(false);
      expect(result.offsetHours).toBe(9);
    });
  });

  describe("getLocalDateString", () => {
    it("should format date with positive timezone offset", () => {
      const dateStr = "2024-01-01T00:00:00Z";
      const result = getLocalDateString(dateStr);
      // Extract the timezone part from result
      const expectedDate = new Date("2024-01-01T00:00:00Z");
      const expectedHours = expectedDate.getHours().toString().padStart(2, "0");
      const expectedMinutes = expectedDate.getMinutes().toString().padStart(2, "0");
      const expectedSeconds = expectedDate.getSeconds().toString().padStart(2, "0");
      expect(result).toBe(`2024-01-01 ${expectedHours}:${expectedMinutes}:${expectedSeconds} (UTC+9)`);
    });

    it("should format date with UTC timezone", () => {
      // Mock UTC timezone
      Date.prototype.getTimezoneOffset = jest.fn(() => 0);
      const dateStr = "2024-01-01T00:00:00Z";
      const result = getLocalDateString(dateStr);
      // dayjs parses dates according to actual system timezone
      const expectedDate = new Date("2024-01-01T00:00:00Z");
      const expectedHours = expectedDate.getHours().toString().padStart(2, "0");
      const expectedMinutes = expectedDate.getMinutes().toString().padStart(2, "0");
      const expectedSeconds = expectedDate.getSeconds().toString().padStart(2, "0");
      expect(result).toBe(`2024-01-01 ${expectedHours}:${expectedMinutes}:${expectedSeconds} (UTC)`);
    });

    it("should format date with negative timezone offset", () => {
      // Mock UTC-5 timezone
      Date.prototype.getTimezoneOffset = jest.fn(() => 300);
      const dateStr = "2024-01-01T00:00:00Z";
      const result = getLocalDateString(dateStr);
      // dayjs parses dates according to actual system timezone
      const expectedDate = new Date("2024-01-01T00:00:00Z");
      const expectedHours = expectedDate.getHours().toString().padStart(2, "0");
      const expectedMinutes = expectedDate.getMinutes().toString().padStart(2, "0");
      const expectedSeconds = expectedDate.getSeconds().toString().padStart(2, "0");
      expect(result).toBe(`2024-01-01 ${expectedHours}:${expectedMinutes}:${expectedSeconds} (UTC-5)`);
    });
  });

  describe("formatTime", () => {
    it("should format time with single digits", () => {
      const date = new Date("2024-01-01T05:05:00");
      const result = formatTime(date);
      expect(result).toBe("05:05");
    });

    it("should format time with double digits", () => {
      const date = new Date("2024-01-01T15:45:00");
      const result = formatTime(date);
      expect(result).toBe("15:45");
    });

    it("should format midnight correctly", () => {
      const date = new Date("2024-01-01T00:00:00");
      const result = formatTime(date);
      expect(result).toBe("00:00");
    });
  });

  describe("timeToDateStr", () => {
    it("should convert timestamp to date string", () => {
      const timestamp = 1704067200000; // 2024-01-01T00:00:00.000Z
      const result = timeToDateStr(timestamp);
      expect(result).toMatch(/2024\/01\/01/);
    });

    it("should handle string timestamp", () => {
      const timestamp = "1704067200000";
      const result = timeToDateStr(timestamp);
      expect(result).toMatch(/2024\/01\/01/);
    });

    it("should apply measure multiplier", () => {
      const timestamp = 1704067200; // seconds instead of milliseconds
      const result = timeToDateStr(timestamp, 1000);
      expect(result).toMatch(/2024\/01\/01/);
    });

    it("should use default measure of 1", () => {
      const timestamp = 1704067200000;
      const result = timeToDateStr(timestamp);
      const resultWithDefault = timeToDateStr(timestamp, 1);
      expect(result).toBe(resultWithDefault);
    });
  });

  describe("calculateRemainTime", () => {
    it("should calculate time components for exactly 1 day", () => {
      const oneDay = 24 * 60 * 60 * 1000;
      const result = calculateRemainTime(oneDay);
      expect(result).toEqual({
        day: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it("should calculate time components for complex duration", () => {
      const time =
        2 * 24 * 60 * 60 * 1000 + // 2 days
        3 * 60 * 60 * 1000 + // 3 hours
        45 * 60 * 1000 + // 45 minutes
        30 * 1000; // 30 seconds

      const result = calculateRemainTime(time);
      expect(result).toEqual({
        day: 2,
        hours: 3,
        minutes: 45,
        seconds: 30,
      });
    });

    it("should handle zero time", () => {
      const result = calculateRemainTime(0);
      expect(result).toEqual({
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it("should handle time less than a second", () => {
      const result = calculateRemainTime(500);
      expect(result).toEqual({
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe("secondsToTime", () => {
    it("should format seconds to HH:mm:ss", () => {
      expect(secondsToTime(0)).toBe("00:00:00");
      expect(secondsToTime(59)).toBe("00:00:59");
      expect(secondsToTime(60)).toBe("00:01:00");
      expect(secondsToTime(3599)).toBe("00:59:59");
      expect(secondsToTime(3600)).toBe("01:00:00");
      expect(secondsToTime(3661)).toBe("01:01:01");
      expect(secondsToTime(86399)).toBe("23:59:59");
    });

    it("should handle hours greater than 24", () => {
      const result = secondsToTime(90061); // 25 hours, 1 minute, 1 second
      expect(result).toBe("01:01:01"); // dayjs wraps around
    });
  });

  describe("getTimeDiffInSeconds", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    const future = new Date("2024-01-01T12:00:10Z");
    const past = new Date("2024-01-01T11:59:50Z");

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should calculate difference from current time when startDate is omitted", () => {
      const result = getTimeDiffInSeconds(future);
      expect(result).toBe(10);
    });

    it("should calculate difference between two dates", () => {
      const result = getTimeDiffInSeconds(future, past);
      expect(result).toBe(20);
    });

    it("should handle negative differences", () => {
      const result = getTimeDiffInSeconds(past, future);
      expect(result).toBe(-20);
    });

    it("should handle string dates", () => {
      const result = getTimeDiffInSeconds("2024-01-01T12:00:10Z", "2024-01-01T12:00:00Z");
      expect(result).toBe(10);
    });

    it("should handle number timestamps", () => {
      const result = getTimeDiffInSeconds(now.getTime() + 10000, now.getTime());
      expect(result).toBe(10);
    });
  });

  describe("getTimeDiffInMilliseconds", () => {
    const now = new Date("2024-01-01T12:00:00Z");
    const future = new Date("2024-01-01T12:00:00.500Z");
    const past = new Date("2024-01-01T11:59:59.500Z");

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should calculate difference from current time when startDate is omitted", () => {
      const result = getTimeDiffInMilliseconds(future);
      expect(result).toBe(500);
    });

    it("should calculate difference between two dates", () => {
      const result = getTimeDiffInMilliseconds(future, past);
      expect(result).toBe(1000);
    });

    it("should handle negative differences", () => {
      const result = getTimeDiffInMilliseconds(past, future);
      expect(result).toBe(-1000);
    });
  });

  describe("formatDisplayTime", () => {
    it("should format seconds correctly", () => {
      expect(formatDisplayTime(0)).toBe("0s ago");
      expect(formatDisplayTime(30)).toBe("30s ago");
      expect(formatDisplayTime(59)).toBe("59s ago");
    });

    it("should format minutes correctly", () => {
      expect(formatDisplayTime(60)).toBe("1m ago");
      expect(formatDisplayTime(90)).toBe("1m ago");
      expect(formatDisplayTime(119)).toBe("1m ago");
      expect(formatDisplayTime(120)).toBe("2m ago");
      expect(formatDisplayTime(3599)).toBe("59m ago");
    });

    it("should format hours correctly", () => {
      expect(formatDisplayTime(3600)).toBe("1h ago");
      expect(formatDisplayTime(5400)).toBe("1h ago");
      expect(formatDisplayTime(7199)).toBe("1h ago");
      expect(formatDisplayTime(7200)).toBe("2h ago");
      expect(formatDisplayTime(86399)).toBe("23h ago");
    });

    it("should format days correctly", () => {
      expect(formatDisplayTime(86400)).toBe("1d ago");
      expect(formatDisplayTime(172800)).toBe("2d ago");
      expect(formatDisplayTime(604799)).toBe("6d ago");
    });

    it("should format more than 7 days", () => {
      expect(formatDisplayTime(604800)).toBe(">7d ago");
      expect(formatDisplayTime(1209600)).toBe(">7d ago");
    });

    it("should handle negative values with absolute difference", () => {
      expect(formatDisplayTime(-30)).toBe("30s ago");
      expect(formatDisplayTime(-3600)).toBe("1h ago");
      expect(formatDisplayTime(-86400)).toBe("1d ago");
    });
  });
});
