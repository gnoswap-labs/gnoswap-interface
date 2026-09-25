export interface MyDelegationInfo {
  availableBalance: string;
  claimableGovernanceRewards: ClaimableRewards[];
  claimableGovernanceRewardUsd: string;
  claimableLaunchpadRewards: ClaimableRewards[];
  claimableLaunchpadRewardUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  delegatedAmount: string;
  votingWeight: string;
}

export const ClaimableRewardType = {
  EMISSION: "EMISSION",
  PROTOCOL_FEE: "PROTOCOL_FEE",
} as const;

export type ClaimableRewardType = (typeof ClaimableRewardType)[keyof typeof ClaimableRewardType];

export interface ClaimableRewards {
  amount: string;
  path: string;
  type: ClaimableRewardType;
}

export const nullMyDelegationInfo: MyDelegationInfo = {
  availableBalance: "0",
  claimableGovernanceRewards: [],
  claimableGovernanceRewardUsd: "0",
  claimableLaunchpadRewards: [],
  claimableLaunchpadRewardUsd: "0",
  unDelegatedAmount: "0",
  withdrawableAmount: "0",
  delegatedAmount: "0",
  votingWeight: "0",
};
