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
  /**
   * @deprecated Legacy field kept for API/response compatibility only. Despite its name,
   * this is the OUTGOING amount delegated away by this address (same value as
   * `delegatedAmount`), not the address's actual voting power. It misrepresents voting
   * power for delegate recipients and MUST NOT be used by new consumers — use
   * `incomingVotingWeight` for the address's active received voting power instead.
   */
  votingWeight: string;
  /** Active voting power delegated TO this address by others (incoming, not outgoing). */
  incomingVotingWeight: string;
}
