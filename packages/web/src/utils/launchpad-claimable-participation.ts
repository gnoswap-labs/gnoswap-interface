import BigNumber from "bignumber.js";

import { safeParseTime } from "./time.utils";

interface LaunchpadParticipationClaimState {
  claimableTime: string;
  claimableRewardAmount: number;
  depositAmount: number;
}

const CLAIMED_AMOUNT_THRESHOLD = 0.01;

export const isLaunchpadParticipationClaimed = ({
  claimableRewardAmount,
  depositAmount,
}: Omit<LaunchpadParticipationClaimState, "claimableTime">) => {
  const isClaimedReward = BigNumber(claimableRewardAmount).isLessThan(CLAIMED_AMOUNT_THRESHOLD);
  const isClaimedDeposit = BigNumber(depositAmount).isLessThan(CLAIMED_AMOUNT_THRESHOLD);

  return isClaimedReward && isClaimedDeposit;
};

export const isLaunchpadParticipationClaimable = ({
  claimableTime,
  claimableRewardAmount,
  depositAmount,
}: LaunchpadParticipationClaimState) => {
  const claimableTimestamp = safeParseTime(claimableTime);

  if (claimableTimestamp == null) return false;

  return !isLaunchpadParticipationClaimed({ claimableRewardAmount, depositAmount }) && Date.now() >= claimableTimestamp;
};
