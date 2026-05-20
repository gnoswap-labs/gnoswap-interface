import { INCENTIVE_TYPE } from "@constants/option.constant";
import { PoolStakingResponse } from "@repositories/pool/response/pool-staking-response";
import { formatDisplayTokenSymbol } from "@utils/token-utils";
import { PoolStakingModel } from "../pool-staking";

export class PoolStakingMapper {
  public static fromListResponse(poolStakings: PoolStakingResponse[]) {
    return poolStakings.map(PoolStakingMapper.fromResponse);
  }

  public static fromResponse(poolStaking: PoolStakingResponse): PoolStakingModel {
    return {
      ...poolStaking,
      incentiveId: poolStaking?.incentiveId || null,
      unvestedAmount: poolStaking.unvestedAmount || "0",
      claimableUnvestedAmount: poolStaking.claimableUnvestedAmount || "0",
      isRefunded: poolStaking.isRefunded,
      incentiveType: poolStaking.incentiveType as INCENTIVE_TYPE,
      rewardToken: {
        ...poolStaking.rewardToken,
        displaySymbol: formatDisplayTokenSymbol(poolStaking.rewardToken.symbol),
      },
    };
  }
}
