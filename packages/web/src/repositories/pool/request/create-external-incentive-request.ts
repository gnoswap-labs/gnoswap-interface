import { TokenModel } from "@models/token/token-model";

export interface CreateExternalIncentiveRequest {
  poolPath: string;

  rewardToken: TokenModel;
  gnsToken: TokenModel;
  wugnotToken: TokenModel;

  rewardAmount: string;

  incentiveCreationDepositGnsAmount: string;

  startTime: number;

  endTime: number;

  gasFee?: string;

  gasUsed?: string;
}
