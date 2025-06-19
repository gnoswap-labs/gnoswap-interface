export interface StakePositionsRequest {
  lpTokenIds: string[];

  caller: string;

  referrerAddress: string | null;

  gasFee?: string;

  gasUsed?: string;
}
