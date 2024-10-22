export const getClaimableTime = (threshold?: number) => {
  if (threshold == null) return;

  return new Date(Date.now() + threshold);
};
