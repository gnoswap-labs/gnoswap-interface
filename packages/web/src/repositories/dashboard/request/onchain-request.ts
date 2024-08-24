export enum ActivityType {
  ALL = "ALL",
  SWAP = "SWAP",
  ADD = "ADD",
  REMOVE = "REMOVE",
  STAKE = "STAKE",
  UNSTAKE = "UNSTAKE",
  CLAIM = "CLAIM",
};

export interface OnchainRequest {
  type: ActivityType;
}

