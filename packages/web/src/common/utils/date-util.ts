/**
 * @fileoverview Date and time utility functions for formatting, conversion, and calculations.
 * @module date-util
 * @todo Consider migrating to Temporal API when it becomes stable
 * @todo Consider using dayjs plugins (utc, timezone) for better timezone handling
 */

import dayjs from "dayjs";

/**
 * Time unit constants in milliseconds for date/time calculations
 * @constant
 * @readonly
 */
const TIME_UNITS = {
  DAY: 24 * 60 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  MINUTE: 60 * 1000,
  SECOND: 1000,
} as const;

/**
 * Standard date-time format string used throughout the application
 * @constant
 * @readonly
 */
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss" as const;

/**
 * Placeholder string for empty or invalid dates
 * @constant
 * @readonly
 */
const EMPTY_DATE_PLACEHOLDER = "-" as const;

/**
 * Branded type for timezone offset in hours to ensure type safety
 * @typedef {number & { __brand: "TimezoneOffsetHours" }} TimezoneOffsetHours
 * @todo Change to TimezoneOffsetMinutes for accurate representation of half-hour timezones
 */
type TimezoneOffsetHours = number & { __brand: "TimezoneOffsetHours" };

/**
 * @todo Implement proper timezone detection with ISO 8601 offset support
 * Current implementation only checks for "Z" suffix, missing offsets like +09:00, -03:30, +05:45
 *
 * @example
 * const TZ_OFFSET_RE = /([+-])(\d{2}):?(\d{2})$/; // +09:00, -0330, +0900 etc.
 *
 * function hasExplicitTimezone(s: string): boolean {
 *   return s.endsWith("Z") || TZ_OFFSET_RE.test(s);
 * }
 */

/**
 * Result type for date conversion operations using discriminated union
 * @typedef {Object} DateUtcToLocalResult
 * @property {string} value - Formatted date string or placeholder
 * @property {TimezoneOffsetHours} offsetHours - Timezone offset in hours
 * @property {boolean} isEmpty - Indicates if the date is empty/invalid
 */
type DateUtcToLocalResult =
  | { value: typeof EMPTY_DATE_PLACEHOLDER; offsetHours: TimezoneOffsetHours; isEmpty: true }
  | { value: string; offsetHours: TimezoneOffsetHours; isEmpty: false };

/**
 * Converts a date to local timezone format with offset information
 *
 * @param {string | Date | null | undefined} date - Input date to convert
 * @returns {DateUtcToLocalResult} Object containing formatted date, offset, and empty flag
 *
 * @example
 * // Convert UTC date to local time (UTC+9)
 * getDateUtcToLocal("2024-01-01T12:00:00Z")
 * // Returns: { value: "2024-01-01 21:00:00", offsetHours: 9, isEmpty: false }
 *
 * @example
 * // Handle null/undefined input
 * getDateUtcToLocal(null)
 * // Returns: { value: "-", offsetHours: 9, isEmpty: true }
 *
 * @todo Clarify parsing policy for dates without timezone
 * @todo Support minute-based offsets for accurate timezone representation
 */
export const getDateUtcToLocal = (date: string | Date | null | undefined): DateUtcToLocalResult => {
  const timezoneOffset = new Date().getTimezoneOffset();
  const offsetHours = (-timezoneOffset / 60) as TimezoneOffsetHours;

  if (!date) {
    return {
      value: EMPTY_DATE_PLACEHOLDER,
      offsetHours,
      isEmpty: true,
    };
  }

  /**
   * @note Current implementation treats dates without timezone as local time
   * This behavior is preserved for backward compatibility but may cause inconsistencies
   * @todo Implement explicit UTC/local parsing policy
   */
  const currentDate = dayjs(date);

  return {
    value: currentDate.format(DATE_TIME_FORMAT),
    offsetHours,
    isEmpty: false,
  };
};

/**
 * Sign type for timezone offset display
 * @typedef {"+" | "-"} Sign
 */
type Sign = "+" | "-";

/**
 * Formats a date with local timezone information in a human-readable format
 *
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string with timezone offset (e.g., "2024-01-01 12:00:00 (UTC+9)")
 *
 * @example
 * getLocalDateString("2024-01-01T12:00:00Z")
 * // Returns: "2024-01-01 21:00:00 (UTC+9)"
 *
 * @todo Fix decimal hour display (e.g., UTC+9.5) by using minute-based offset formatter
 */
export const getLocalDateString = (date: string | Date): string => {
  const result = getDateUtcToLocal(date);
  const sign: Sign = result.offsetHours > 0 ? "+" : "-";
  const offsetHoursString = result.offsetHours === 0 ? "UTC" : `UTC${sign}${Math.abs(result.offsetHours)}`;

  return `${result.value} (${offsetHoursString})`;
};

/**
 * Formats a Date object to HH:mm format for time display
 *
 * @param {Date} date - Date object to format
 * @returns {string} Time string in HH:mm format (24-hour)
 *
 * @example
 * formatTime(new Date("2024-01-01T09:05:30"))
 * // Returns: "09:05"
 *
 * @todo Consider using Intl.DateTimeFormat for better locale support
 */
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Converts a timestamp to a formatted date string
 *
 * @param {number | string} time - Timestamp value
 * @param {number} [measure=1] - Multiplication factor for the timestamp (e.g., 1000 for seconds to milliseconds)
 * @returns {string} Formatted date string in YYYY/MM/DD HH:mm:ss format
 *
 * @example
 * // Convert millisecond timestamp
 * timeToDateStr(1704067200000)
 * // Returns: "2024/01/01 00:00:00"
 *
 * @example
 * // Convert second timestamp with measure
 * timeToDateStr("1704067200", 1000)
 * // Returns: "2024/01/01 00:00:00"
 *
 * @todo Add NaN handling for invalid string inputs
 * @todo Use consistent date format constant
 */
export const timeToDateStr = (time: number | string, measure: number = 1): string => {
  const datetime = Number(time) * measure;
  const date = dayjs(datetime);
  return date.format("YYYY/MM/DD HH:mm:ss");
};

/**
 * Time components breakdown for display purposes
 * @interface TimeComponents
 */
interface TimeComponents {
  /** Number of complete days */
  readonly day: number;
  /** Number of hours (0-23) */
  readonly hours: number;
  /** Number of minutes (0-59) */
  readonly minutes: number;
  /** Number of seconds (0-59) */
  readonly seconds: number;
}

/**
 * Breaks down milliseconds into day, hour, minute, and second components
 *
 * @param {number} time - Time duration in milliseconds
 * @returns {TimeComponents} Object with time broken down into components
 *
 * @example
 * calculateRemainTime(90061000)
 * // Returns: { day: 1, hours: 1, minutes: 1, seconds: 1 }
 *
 * @example
 * calculateRemainTime(3661000)
 * // Returns: { day: 0, hours: 1, minutes: 1, seconds: 1 }
 *
 * @todo Add handling for negative/Infinity inputs
 */
export const calculateRemainTime = (time: number): TimeComponents => {
  let remainTime = time;
  const day = Math.floor(remainTime / TIME_UNITS.DAY);
  remainTime = remainTime % TIME_UNITS.DAY;
  const hours = Math.floor(remainTime / TIME_UNITS.HOUR);
  remainTime = remainTime % TIME_UNITS.HOUR;
  const minutes = Math.floor(remainTime / TIME_UNITS.MINUTE);
  remainTime = remainTime % TIME_UNITS.MINUTE;
  const seconds = Math.floor(remainTime / TIME_UNITS.SECOND);

  return {
    day,
    hours,
    minutes,
    seconds,
  };
};

/**
 * Converts seconds to HH:mm:ss time format string
 *
 * @param {number} seconds - Number of seconds to convert
 * @returns {string} Time string in HH:mm:ss format
 *
 * @example
 * secondsToTime(3661)
 * // Returns: "01:01:01"
 *
 * @example
 * secondsToTime(59)
 * // Returns: "00:00:59"
 *
 * @note Wraps at 24 hours due to dayjs behavior
 * @todo For cumulative time >= 24h, consider DD:HH:mm:ss format
 */
export const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return dayjs()
    .startOf("day")
    .add(hours, "hour")
    .add(minutes, "minute")
    .add(remainingSeconds, "second")
    .format("HH:mm:ss");
};

/**
 * Calculates time difference in seconds between two dates
 *
 * @overload
 * @param {string | number | Date} endDate - End date for comparison
 * @returns {number} Time difference from current time in seconds
 *
 * @overload
 * @param {string | number | Date} endDate - End date for comparison
 * @param {string | number | Date} startDate - Start date for comparison
 * @returns {number} Time difference in seconds (can be negative)
 *
 * @example
 * // Compare with current time
 * getTimeDiffInSeconds("2024-01-02T00:00:00")
 *
 * @example
 * // Compare two specific dates
 * getTimeDiffInSeconds("2024-01-02T00:00:00", "2024-01-01T00:00:00")
 * // Returns: 86400
 *
 * @note Returns floating-point seconds
 * @todo Consider providing integer variants (floor/round/ceil)
 */
export function getTimeDiffInSeconds(endDate: string | number | Date): number;
export function getTimeDiffInSeconds(endDate: string | number | Date, startDate: string | number | Date): number;
export function getTimeDiffInSeconds(endDate: string | number | Date, startDate?: string | number | Date): number {
  const end = new Date(endDate).getTime();
  const start = new Date(startDate ?? Date.now()).getTime();
  return (end - start) / 1000;
}

/**
 * Calculates time difference in milliseconds between two dates
 *
 * @overload
 * @param {string | number | Date} endDate - End date for comparison
 * @returns {number} Time difference from current time in milliseconds
 *
 * @overload
 * @param {string | number | Date} endDate - End date for comparison
 * @param {string | number | Date} startDate - Start date for comparison
 * @returns {number} Time difference in milliseconds (can be negative)
 *
 * @example
 * // Compare with current time
 * getTimeDiffInMilliseconds("2024-01-02T00:00:00")
 *
 * @example
 * // Compare two specific dates
 * getTimeDiffInMilliseconds("2024-01-02T00:00:00", "2024-01-01T00:00:00")
 * // Returns: 86400000
 */
export function getTimeDiffInMilliseconds(endDate: string | number | Date): number;
export function getTimeDiffInMilliseconds(endDate: string | number | Date, startDate: string | number | Date): number;
export function getTimeDiffInMilliseconds(endDate: string | number | Date, startDate?: string | number | Date): number {
  const end = new Date(endDate).getTime();
  const start = new Date(startDate ?? Date.now()).getTime();
  return end - start;
}

/**
 * Time thresholds in seconds for relative time display formatting
 * @constant
 * @readonly
 * @todo Consider using 'satisfies' operator for better type checking (TS 4.9+)
 */
const TIME_THRESHOLDS = {
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
} as const;

/**
 * Template literal type for relative time format strings
 */
type TimeAgoFormat = `${number}${"s" | "m" | "h" | "d"} ago` | ">7d ago";

/**
 * Formats time difference as a human-readable relative time string
 *
 * @param {number} diffInSeconds - Time difference in seconds (absolute value is used)
 * @returns {TimeAgoFormat} Formatted relative time string
 *
 * @example
 * formatDisplayTime(30)
 * // Returns: "30s ago"
 *
 * @example
 * formatDisplayTime(3600)
 * // Returns: "1h ago"
 *
 * @example
 * formatDisplayTime(86400 * 8)
 * // Returns: ">7d ago"
 *
 * @todo For i18n, consider using Intl.RelativeTimeFormat
 */
export const formatDisplayTime = (diffInSeconds: number): TimeAgoFormat => {
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < TIME_THRESHOLDS.MINUTE) {
    return `${Math.floor(absDiff)}s ago`;
  }
  if (absDiff < TIME_THRESHOLDS.HOUR) {
    return `${Math.floor(absDiff / TIME_THRESHOLDS.MINUTE)}m ago`;
  }
  if (absDiff < TIME_THRESHOLDS.DAY) {
    return `${Math.floor(absDiff / TIME_THRESHOLDS.HOUR)}h ago`;
  }
  if (absDiff < TIME_THRESHOLDS.WEEK) {
    return `${Math.floor(absDiff / TIME_THRESHOLDS.DAY)}d ago`;
  }

  return ">7d ago";
};
