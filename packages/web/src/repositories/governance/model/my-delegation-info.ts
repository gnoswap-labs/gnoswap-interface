/**
 * @deprecated
 */
export interface MyDelegationInfo {
  availableBalance: number;
  votingWeight: number;
  undelegatedAmount: number;
  claimableRewardsUsd: number;
  claimableRewards: ClaimableRewards[];
  delegations: DelegationItemInfo[];
}

/**
 * @deprecated
 */
export interface ClaimableRewards {
  amount: string;
  tokenPath: string;
}

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

export interface DelegationItemInfo {
  name: string;
  address: string;
  logoUrl: string;
  amount: number;
  updatedDate: string;
  unlockDate: string | null;
}

/**
 * @deprecated
 */
export const nullMyDelegationInfo: MyDelegationInfo = {
  availableBalance: 0,
  votingWeight: 0,
  undelegatedAmount: 0,
  claimableRewardsUsd: 0,
  claimableRewards: [],
  delegations: [],
};

export const nullMyDelegationInfo2: MyDelegationInfo2 = {
  availableBalance: "0",
  claimableRewards: [],
  claimableRewardUsd: "0",
  unDelegatedAmount: "0",
  withdrawableAmount: "0",
  votingWeight: "0",
};

export const nullDelegationItemInfo: DelegationItemInfo = {
  name: "",
  address: "",
  logoUrl: "",
  amount: 0,
  updatedDate: "",
  unlockDate: null,
};
