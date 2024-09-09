
export interface GetMyDelegationResponse {
  availableBalance: number;
  votingWeight: number;
  undelegatedAmount: number;
  claimableRewardsUsd: number;
  delegations: DelegationItemResponse[];
}

interface DelegationItemResponse {
  name: string;
  address: string;
  logoUrl: string;
  amount: number;
  updatedDate: string;
  unlockDate: string | null;
}