
export interface GetMyDeligationResponse {
  availableBalance: number;
  votingWeight: number;
  undeligatedAmount: number;
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