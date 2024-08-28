
export interface GetMyDeligationResponse {
  availableBalance: number;
  votingWeight: number;
  undeligatedAmount: number;
  claimableRewardsUsd: number;
  delegations: DelegationItemResponse[];
}

interface DelegationItemResponse {
  delegatee: string;
  logoUrl: string;
  amount: number;
  updatedDate: string;
  unlockDate: string | null;
}