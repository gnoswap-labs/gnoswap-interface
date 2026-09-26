export interface MyDelegationInfo {
  availableBalance: string;
  claimableGovernanceRewards: ClaimableRewards[];
  claimableGovernanceRewardUsd: string;
  claimableLaunchpadRewards: ClaimableRewards[];
  claimableLaunchpadRewardUsd: string;
  unDelegatedAmount: string;
  withdrawableAmount: string;
  delegatedAmount: string;
  /**
   * @deprecated Legacy field kept for API/response compatibility only (external wire-format
   * contract with the governance API). Despite its name, this is the OUTGOING amount
   * delegated away by this address (same value as `delegatedAmount`), not the address's
   * actual voting power. It misrepresents voting power for delegate recipients and MUST NOT
   * be used by new consumers — use `votingPower` for the address's active received
   * voting power instead.
   */
  votingWeight: string;
  /** Active voting power delegated TO this address by others (incoming, not outgoing). */
  votingPower: string;
}

export const ClaimableRewardType = {
  EMISSION: "EMISSION",
  PROTOCOL_FEE: "PROTOCOL_FEE",
} as const;

export type ClaimableRewardType = (typeof ClaimableRewardType)[keyof typeof ClaimableRewardType];

export interface ClaimableRewards {
  amount: string;
  path: string;
  type: ClaimableRewardType;
}

export const nullMyDelegationInfo: MyDelegationInfo = {
  availableBalance: "0",
  claimableGovernanceRewards: [],
  claimableGovernanceRewardUsd: "0",
  claimableLaunchpadRewards: [],
  claimableLaunchpadRewardUsd: "0",
  unDelegatedAmount: "0",
  withdrawableAmount: "0",
  delegatedAmount: "0",
  votingWeight: "0",
  votingPower: "0",
};
