export const formatClaimableTime = (claimableTime: string) => {
  const now = new Date();
  const claimableDate = new Date(claimableTime);

  if (claimableDate <= now) {
    return "Now";
  } else {
    const diffMs = claimableDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const formatTime = (days: number, hours: number, minutes: number) => {
      if (days > 0) {
        return `in ${days} day${days > 1 ? "s" : ""} ${
          hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""
        }`.trim();
      } else if (hours > 0) {
        return `in ${hours} hour${hours > 1 ? "s" : ""} ${
          minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : ""
        }`.trim();
      } else {
        return `in ${minutes} minute${minutes > 1 ? "s" : ""}`;
      }
    };

    return formatTime(diffDays, diffHours, diffMinutes);
  }
};
