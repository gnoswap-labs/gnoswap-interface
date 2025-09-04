import { ClaimableRewards2 } from "../model";

export interface GetMyDelegation2Response {
  availableBalance: string;
  claimableRewards: ClaimableRewards2[];
  claimableRewardUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  votingWeight: string;
}
