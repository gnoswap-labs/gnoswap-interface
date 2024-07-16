import { INCENTIVE_TYPE } from "@constants/option.constant";
import { PoolStakingResponse } from "@repositories/pool/response/pool-staking-response";
import { PoolStakingModel } from "../pool-staking";

export class PoolStakingMapper {
  public static fromListResponse(poolStakings: PoolStakingResponse[]) {
    return poolStakings.map(PoolStakingMapper.fromResponse);
  }

  public static fromResponse(
    poolStaking: PoolStakingResponse,
  ): PoolStakingModel {
    return {
      ...poolStaking,
      incentiveType: poolStaking.incentiveType as INCENTIVE_TYPE,
    };
  }
}
