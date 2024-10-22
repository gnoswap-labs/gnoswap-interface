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

    if (diffDays > 0 || diffHours > 0) {
      return `in ${diffDays} days ${diffHours} hours`;
    } else {
      return "in 0 days 0 hours";
    }
  }
};
