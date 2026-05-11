export interface CollectExternalIncentivePenaltyRequest {
  poolPath: string;

  incentiveID: string;

  gasFee?: string;

  gasUsed?: string;
}
