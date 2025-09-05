type TimeInput = string | number | Date | null | undefined;

export const safeParseTime = (time: TimeInput): number | null => {
  if (time == null || time === "") return null;

  try {
    const date = new Date(time);
    if (isNaN(date.getTime())) return null;

    if (typeof time === "boolean" || (typeof time === "object" && !(time instanceof Date)) || Array.isArray(time)) {
      return null;
    }

    const utcTime = new Date(date.toUTCString()).getTime();
    return isNaN(utcTime) ? null : utcTime;
  } catch {
    return null;
  }
};
