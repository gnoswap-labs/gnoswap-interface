import dayjs from "dayjs";

// Type-safe time constants with const assertion
const TIME_UNITS = {
  DAY: 24 * 60 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  MINUTE: 60 * 1000,
  SECOND: 1000,
} as const;

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss" as const;
const EMPTY_DATE_PLACEHOLDER = "-" as const;

// Branded type for timezone offset hours
type TimezoneOffsetHours = number & { __brand: "TimezoneOffsetHours" };

// Type guard for date with timezone
// Note: Not used in the current implementation due to backward compatibility
// const isDateWithTimeZone = (date: string | Date): boolean => {
//   if (typeof date === "string" && date.includes("Z")) return true;
//   if (date instanceof Date && date.toISOString().includes("Z")) return true;
//   return false;
// };

// Return type with discriminated union for better type safety
type DateUtcToLocalResult =
  | { value: typeof EMPTY_DATE_PLACEHOLDER; offsetHours: TimezoneOffsetHours; isEmpty: true }
  | { value: string; offsetHours: TimezoneOffsetHours; isEmpty: false };

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

  // Note: The original implementation has a bug where it treats dates without timezone
  // the same as dates with timezone. This is preserved for backward compatibility.
  // dayjs automatically parses dates without timezone in local time, so both cases
  // end up with the same result.
  const currentDate = dayjs(date);

  return {
    value: currentDate.format(DATE_TIME_FORMAT),
    offsetHours,
    isEmpty: false,
  };
};

// Const assertion for sign
type Sign = "+" | "-";

export const getLocalDateString = (date: string | Date): string => {
  const result = getDateUtcToLocal(date);
  const sign: Sign = result.offsetHours > 0 ? "+" : "-";
  const offsetHoursString = result.offsetHours === 0 ? "UTC" : `UTC${sign}${Math.abs(result.offsetHours)}`;

  return `${result.value} (${offsetHoursString})`;
};

export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Explicit return type and parameter type
export const timeToDateStr = (time: number | string, measure: number = 1): string => {
  const datetime = Number(time) * measure;
  const date = dayjs(datetime);
  return date.format("YYYY/MM/DD HH:mm:ss");
};

// Structured return type
interface TimeComponents {
  readonly day: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

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

// Type-safe date input with overloads
export function getTimeDiffInSeconds(endDate: string | number | Date): number;
export function getTimeDiffInSeconds(endDate: string | number | Date, startDate: string | number | Date): number;
export function getTimeDiffInSeconds(endDate: string | number | Date, startDate?: string | number | Date): number {
  const end = new Date(endDate).getTime();
  const start = new Date(startDate ?? Date.now()).getTime();
  return (end - start) / 1000;
}

export function getTimeDiffInMilliseconds(endDate: string | number | Date): number;
export function getTimeDiffInMilliseconds(endDate: string | number | Date, startDate: string | number | Date): number;
export function getTimeDiffInMilliseconds(endDate: string | number | Date, startDate?: string | number | Date): number {
  const end = new Date(endDate).getTime();
  const start = new Date(startDate ?? Date.now()).getTime();
  return end - start;
}

// Type-safe time constants
const TIME_THRESHOLDS = {
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
} as const;

// Template literal type for time format
type TimeAgoFormat = `${number}${"s" | "m" | "h" | "d"} ago` | ">7d ago";

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

