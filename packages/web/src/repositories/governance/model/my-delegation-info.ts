export interface MyDelegationInfo {
  availableBalance: number;
  votingWeight: number;
  undeligatedAmount: number;
  claimableRewardsUsd: number;
}

export const dummyMyDelegationInfo: MyDelegationInfo = {
  availableBalance: 4225.12,
  votingWeight: 110102.23,
  undeligatedAmount: 422.12,
  claimableRewardsUsd: 4225.12,
};