import BigNumber from "bignumber.js";

import { safeParseTime } from "./time.utils";

interface LaunchpadParticipationClaimState {
  claimableTime: string;
  claimableRewardAmount: number;
  depositAmount: number;
  withdrawn?: boolean;
}

const CLAIMED_AMOUNT_THRESHOLD = 0.01;

export const isLaunchpadParticipationClaimed = ({
  claimableRewardAmount,
  depositAmount,
  withdrawn,
}: Omit<LaunchpadParticipationClaimState, "claimableTime">) => {
  const isClaimedReward = BigNumber(claimableRewardAmount).isLessThan(CLAIMED_AMOUNT_THRESHOLD);
  const isClaimedDeposit = !!withdrawn || BigNumber(depositAmount).isLessThan(CLAIMED_AMOUNT_THRESHOLD);

  return isClaimedReward && isClaimedDeposit;
};

export const isLaunchpadParticipationClaimable = ({
  claimableTime,
  claimableRewardAmount,
  depositAmount,
  withdrawn,
}: LaunchpadParticipationClaimState) => {
  const claimableTimestamp = safeParseTime(claimableTime);

  if (claimableTimestamp == null) return false;

  return (
    !isLaunchpadParticipationClaimed({ claimableRewardAmount, depositAmount, withdrawn }) &&
    Date.now() >= claimableTimestamp
  );
};
