import { TokenModel } from "@models/token/token-model";

export interface RemoveExternalIncentiveRequest {
  poolPath: string;

  rewardToken: TokenModel;
}
