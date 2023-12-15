import { TokenModel } from "@models/token/token-model";

export interface CreateExternalIncentiveRequest {
  poolPath: string;

  rewardToken: TokenModel;

  rewardAmount: string;

  startTime: number;

  endTime: number;
}
