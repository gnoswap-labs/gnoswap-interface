export interface MyDelegationInfo {
  availableBalance: number;
  votingWeight: number;
  undeligatedAmount: number;
  claimableRewardsUsd: number;
  delegations: DelegationItemInfo[];
}

export interface DelegationItemInfo {
  name: string;
  address: string;
  logoUrl: string;
  amount: number;
  updatedDate: string;
  unlockDate: string | null;
}

export const nullMyDelegationInfo: MyDelegationInfo = {
  availableBalance: 0,
  votingWeight: 0,
  undeligatedAmount: 0,
  claimableRewardsUsd: 0,
  delegations: [],
};