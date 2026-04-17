export interface RemoveExternalIncentiveRequest {
  poolPath: string;

  incentiveID: string;

  gasFee?: string;

  gasUsed?: string;
}
