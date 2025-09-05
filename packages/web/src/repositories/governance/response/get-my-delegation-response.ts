import { ClaimableRewards } from "../model";

export interface GetMyDelegation2Response {
  availableBalance: string;
  claimableRewards: ClaimableRewards[];
  claimableRewardUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  votingWeight: string;
}
