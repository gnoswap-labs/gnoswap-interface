import { ClaimableRewards } from "../model";

export interface GetMyDelegationResponse {
  availableBalance: string;
  claimableRewards: ClaimableRewards[];
  claimableRewardUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  votingWeight: string;
}
