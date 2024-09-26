export interface MyDelegationInfo {
  availableBalance: number;
  votingWeight: number;
  undelegatedAmount: number;
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
  undelegatedAmount: 0,
  claimableRewardsUsd: 0,
  delegations: [],
};

export const nullDelegationItemInfo: DelegationItemInfo = {
  name: "",
  address: "",
  logoUrl: "",
  amount: 0,
  updatedDate: "",
  unlockDate: null,
};