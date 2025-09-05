export interface MyDelegationInfo2 {
  availableBalance: string;
  claimableRewards: ClaimableRewards2[];
  claimableRewardUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  votingWeight: string;
}

export interface ClaimableRewards2 {
  amount: string;
  path: string;
}

export const nullMyDelegationInfo2: MyDelegationInfo2 = {
  availableBalance: "0",
  claimableRewards: [],
  claimableRewardUsd: "0",
  unDelegatedAmount: "0",
  withdrawableAmount: "0",
  votingWeight: "0",
};
