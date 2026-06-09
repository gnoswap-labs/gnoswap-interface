export interface MyDelegationInfo {
  availableBalance: string;
  claimableRewards: ClaimableRewards[];
  claimableRewardUsd: string;
  launchpadProtocolFees: ClaimableRewards[];
  launchpadProtocolFeeUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  votingWeight: string;
}

export interface ClaimableRewards {
  amount: string;
  path: string;
}

export const nullMyDelegationInfo: MyDelegationInfo = {
  availableBalance: "0",
  claimableRewards: [],
  claimableRewardUsd: "0",
  launchpadProtocolFees: [],
  launchpadProtocolFeeUsd: "0",
  unDelegatedAmount: "0",
  withdrawableAmount: "0",
  votingWeight: "0",
};
