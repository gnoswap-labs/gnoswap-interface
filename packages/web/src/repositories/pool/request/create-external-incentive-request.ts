import { TokenModel } from "@models/token/token-model";

export interface CreateExternalIncentiveRequest {
  poolPath: string;

  rewardToken: TokenModel;

  rewardAmount: string;

  incentiveCreationDepositGnsAmount: string;

  startTime: number;

  endTime: number;

  gasFee?: string;

  gasUsed?: string;
}
