export interface MyDelegationInfo {
  availableBalance: string;
  claimableGovernanceRewards: ClaimableRewards[];
  claimableGovernanceRewardUsd: string;
  claimableLaunchpadRewards: ClaimableRewards[];
  claimableLaunchpadRewardUsd: string;
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
  claimableGovernanceRewards: [],
  claimableGovernanceRewardUsd: "0",
  claimableLaunchpadRewards: [],
  claimableLaunchpadRewardUsd: "0",
  unDelegatedAmount: "0",
  withdrawableAmount: "0",
  votingWeight: "0",
};
