import { PROJECT_STATUS_TYPE } from "@common/values";

export const getStatusText = (
  type: PROJECT_STATUS_TYPE,
  startTime: string,
  endTime: string,
  format: (key: string, options?: { [key: string]: string | number }) => string,
) => {
  if (!startTime || !endTime) return "-";

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  const getTimeDifference = (future: Date, now: Date): { days: number; hours: number; minutes: number } => {
    const diffMs = future.getTime() - now.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const formatTime = (days: number, hours: number, minutes: number) => {
    if (days > 0) {
      const dayString = format("Launchpad:common.time.days", { count: days });
      const hourString = format("Launchpad:common.time.hours", {
        count: hours,
      });
      return format("Launchpad:common.time.daysHoursOrHoursMinutes", {
        time1: dayString,
        time2: hourString,
      });
    } else if (hours > 0) {
      const hourString = format("Launchpad:common.time.hours", {
        count: hours,
      });
      const minuteString = format("Launchpad:common.time.minutes", {
        count: minutes,
      });
      return format("Launchpad:common.time.daysHoursOrHoursMinutes", {
        time1: hourString,
        time2: minuteString,
      });
    } else if (minutes > 0) {
      const minuteString = format("Launchpad:common.time.minutes", {
        count: minutes,
      });
      return format("Launchpad:common.time.minutesOnly", {
        time: minuteString,
      });
    } else {
      return format("Launchpad:common.time.inOneMinute");
    }
  };

  switch (type) {
    case PROJECT_STATUS_TYPE.UPCOMING:
      const { days: upcomingDays, hours: upcomingHours, minutes: upcomingMinutes } = getTimeDifference(start, now);
      return format("Launchpad:common.status.upcoming", {
        time: formatTime(upcomingDays, upcomingHours, upcomingMinutes),
      });
    case PROJECT_STATUS_TYPE.ONGOING:
      const { days: ongoingDays, hours: ongoingHours, minutes: ongoingMinutes } = getTimeDifference(end, now);
      return format("Launchpad:common.status.ongoing", {
        time: formatTime(ongoingDays, ongoingHours, ongoingMinutes),
      });
    case PROJECT_STATUS_TYPE.ENDED:
      return format("Launchpad:common.status.ended");
  }
};
