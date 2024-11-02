export const formatClaimableTime = (
  claimableTime: string,
  format: (key: string, options?: { [key: string]: string | number }) => string,
) => {
  const now = new Date();
  const claimableDate = new Date(claimableTime);

  if (claimableDate <= now) {
    return format("Launchpad:common.time.now");
  } else {
    const diffMs = claimableDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const formatTime = (days: number, hours: number, minutes: number) => {
      if (days > 0) {
        const dayString = format("Launchpad:common.time.days", { count: days });
        const hourString = format("Launchpad:common.time.hours", {
          count: hours,
        });

        return format("Launchpad:common.time.inTime", {
          time: `${dayString} ${hourString}`,
        });
      } else if (hours > 0) {
        const hourString = format("Launchpad:common.time.hours", {
          count: hours,
        });
        const minuteString = format("Launchpad:common.time.minutes", {
          count: minutes,
        });

        return format("Launchpad:common.time.inTime", {
          time: `${hourString} ${minuteString}`,
        });
      } else {
        return format("Launchpad:common.time.inOneMinute");
      }
    };

    return formatTime(diffDays, diffHours, diffMinutes);
  }
};
