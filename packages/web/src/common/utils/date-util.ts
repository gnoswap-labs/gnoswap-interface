import dayjs from "dayjs";

const DAY_TIME = 24 * 60 * 60 * 1000;
const HOUR_TIME = 60 * 60 * 1000;
const MIN_TIME = 60 * 1000;
const SEC_TIME = 1000;

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const EMPTY_DATE_PLACEHOLDER = "-";

const isDateWithTimeZone = (date: string | Date) => {
  if (date.toString().includes("Z")) return true;

  if (date instanceof Date && date.toISOString().includes("Z")) return true;

  return false;
};

export const getDateUtcToLocal = (date: string | Date | null | undefined) => {
  const timezoneOffset = new Date().getTimezoneOffset();
  const offsetHours = -timezoneOffset / 60;

  if (!date) {
    return {
      value: EMPTY_DATE_PLACEHOLDER,
      offsetHours,
    };
  }

  const hasTimezone = isDateWithTimeZone(date);
  let currentDate = dayjs(date);

  if (!hasTimezone) {
    currentDate = currentDate.subtract(timezoneOffset, "minutes");
  }
  return {
    value: currentDate.format(DATE_TIME_FORMAT),
    offsetHours,
  };
};

export const getLocalDateString = (d: string | Date) => {
  const { value, offsetHours } = getDateUtcToLocal(d);
  const sign = offsetHours > 0 ? "+" : "-";
  const offsetHoursString = offsetHours === 0 ? "UTC" : `UTC${sign}${Math.abs(offsetHours)}`;
  return `${value} (${offsetHoursString})`;
};

export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function timeToDateStr(time: number | string, measure = 1) {
  const datetime = Number(time) * measure;
  const date = dayjs(datetime);
  return date.format("YYYY/MM/DD HH:mm:ss");
}

export function calculateRemainTime(time: number) {
  let remainTime = time;
  const day = Math.floor(remainTime / DAY_TIME);
  remainTime = remainTime % DAY_TIME;
  const hours = Math.floor(remainTime / HOUR_TIME);
  remainTime = remainTime % HOUR_TIME;
  const minutes = Math.floor(remainTime / MIN_TIME);
  remainTime = remainTime % MIN_TIME;
  const seconds = Math.floor(remainTime / SEC_TIME);
  return {
    day,
    hours,
    minutes,
    seconds,
  };
}

export function secondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return dayjs()
    .startOf("day")
    .add(hours, "hour")
    .add(minutes, "minute")
    .add(remainingSeconds, "second")
    .format("HH:mm:ss");
}

export function getTimeDiffInSeconds(endDate: string | number | Date, startDate?: string | number | Date) {
  return (new Date(endDate).getTime() - new Date(startDate || Date.now()).getTime()) / 1000;
}

export function getTimeDiffInMilliseconds(endDate: string | number | Date, startDate?: string | number | Date) {
  return new Date(endDate).getTime() - new Date(startDate || Date.now()).getTime();
}

const TIME_CONSTANTS = {
  SECONDS_IN_MINUTE: 60,
  SECONDS_IN_HOUR: 60 * 60, // 3,600
  SECONDS_IN_DAY: 60 * 60 * 24, // 86,400
  SECONDS_IN_WEEK: 60 * 60 * 24 * 7, // 604,800
} as const;

export function formatDisplayTime(diffInSeconds: number) {
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < TIME_CONSTANTS.SECONDS_IN_MINUTE) return `${Math.floor(absDiff)}s ago`;
  if (absDiff < TIME_CONSTANTS.SECONDS_IN_HOUR) return `${Math.floor(absDiff / TIME_CONSTANTS.SECONDS_IN_MINUTE)}m ago`;
  if (absDiff < TIME_CONSTANTS.SECONDS_IN_DAY) return `${Math.floor(absDiff / TIME_CONSTANTS.SECONDS_IN_HOUR)}h ago`;
  if (absDiff < TIME_CONSTANTS.SECONDS_IN_WEEK) return `${Math.floor(absDiff / TIME_CONSTANTS.SECONDS_IN_DAY)}d ago`;
  return ">7d ago";
}
