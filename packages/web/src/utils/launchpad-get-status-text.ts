import { PROJECT_STATUS_TYPE } from "@common/values";

export const getStatusText = (
  type: PROJECT_STATUS_TYPE,
  startTime?: string,
  endTime?: string,
  format: (key: string, options?: { [key: string]: string | number }) => string,
) => {
  if (!startTime || !endTime) return "-";

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  const getTimeDifference = (
    future: Date,
    now: Date,
  ): { days: number; hours: number; minutes: number } => {
    const diffMs = future.getTime() - now.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const formatTime = (days: number, hours: number, minutes: number) => {
    if (days > 0) {
      return format("Launchpad:common.time.inDaysHours", { days, hours });
    } else if (hours > 0) {
      return format("Launchpad:common.time.inHoursMinutes", {
        hours,
        minutes,
      });
    } else if (minutes > 0) {
      return format("Launchpad:common.time.inMinutes", { minutes });
    } else {
      return format("Launchpad:common.time.inOneMinute");
    }
  };

  switch (type) {
    case PROJECT_STATUS_TYPE.UPCOMING:
      const {
        days: upcomingDays,
        hours: upcomingHours,
        minutes: upcomingMinutes,
      } = getTimeDifference(start, now);
      return format("Launchpad:common.status.upcoming", {
        time: formatTime(upcomingDays, upcomingHours, upcomingMinutes),
      });
    case PROJECT_STATUS_TYPE.ONGOING:
      const {
        days: ongoingDays,
        hours: ongoingHours,
        minutes: ongoingMinutes,
      } = getTimeDifference(end, now);
      if (ongoingDays < 0 && ongoingHours < 0 && ongoingMinutes < 0) {
        return "Ends in 1 minute";
      }
      return format("Launchpad:common.status.ongoing", {
        time: formatTime(ongoingDays, ongoingHours, ongoingMinutes),
      });
    case PROJECT_STATUS_TYPE.ENDED:
      return format("Launchpad:common.status.ended");
  }
};
