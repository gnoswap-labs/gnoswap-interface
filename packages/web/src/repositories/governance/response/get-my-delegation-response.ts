import { ClaimableRewards } from "../model";

export interface GetMyDelegationResponse {
  availableBalance: string;
  claimableGovernanceRewards: ClaimableRewards[];
  claimableGovernanceRewardUsd: string;
  claimableLaunchpadRewards: ClaimableRewards[];
  claimableLaunchpadRewardUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  delegatedAmount: string;
  /** Active voting power delegated TO this address by others (incoming, not outgoing). */
  votingPower: string;
}
