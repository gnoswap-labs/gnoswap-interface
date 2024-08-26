import { generateTxHash } from "@test/generate-utils";

import {
  AddLiquidityResponse,
  ClaimRewardResponse,
  LiquidityRepository,
  RemoveLiquidityResponse,
} from ".";

export class LiquidityRepositoryMock implements LiquidityRepository {
  public addLiquidityBy = async (): Promise<AddLiquidityResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };

  public removeLiquiditiesBy = async (): Promise<RemoveLiquidityResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };

  public claimRewardByPoolId = async (): Promise<ClaimRewardResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };
}
