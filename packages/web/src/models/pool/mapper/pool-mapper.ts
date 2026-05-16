import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { PoolResponse } from "@repositories/pool";
import { formatOtherPrice } from "@utils/new-number-utils";
import { IncentivizePoolCardInfo } from "../info/pool-card-info";
import { PoolListInfo } from "../info/pool-list-info";
import { PoolSelectItemInfo } from "../info/pool-select-item-info";
import { PoolDetailModel } from "../pool-detail-model";
import { IncentivizePoolModel, PoolModel } from "../pool-model";

export class PoolMapper {
  public static toListInfo(poolModel: PoolModel): PoolListInfo {
    const {
      id,
      incentivized,
      currentTick,
      price,
      tokenA,
      tokenB,
      volume24h,
      tvl,
      fee,
      apr,
      rewardTokens,
      feeUsd24h,
      liquidity,
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(info => info.fee.toString() === fee);

    return {
      poolId: id,
      incentivized,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: apr,
      liquidity: liquidity,
      volume24h: volume24h.toString(),
      fees24h: feeUsd24h.toString(),
      rewardTokens,
      currentTick,
      price,
      tvl: tvl,
      tokenAPriceGrade: "NONE",
      tokenBPriceGrade: "NONE",
    };
  }

  public static toPoolSelectItemInfo(pool: PoolModel): PoolSelectItemInfo {
    const feeRate = Object.values(SwapFeeTierInfoMap).find(info => info.fee.toString() === pool.fee)?.rateStr || "-";

    return {
      poolId: pool.id,
      liquidityAmount: pool.tvl,
      feeRate,
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      fee: pool.fee.toString(),
    };
  }

  public static toCardInfo(poolModel: IncentivizePoolModel): IncentivizePoolCardInfo {
    const {
      id,
      currentTick,
      incentivized,
      hasStakedPosition,
      price,
      tokenA,
      tokenB,
      tvl,
      volume24h,
      fee,
      apr,
      stakingApr,
      poolPath,
      rewardTokens,
      feeUsd24h,
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(info => `${info.fee}` === fee.toString());

    return {
      poolId: id,
      incentivized,
      hasStakedPosition,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: apr,
      stakingApr,
      liquidity: formatOtherPrice(tvl),
      volume24h: formatOtherPrice(volume24h),
      fees24h: formatOtherPrice(feeUsd24h),
      rewardTokens,
      currentTick,
      price,
      poolPath: poolPath,
      tvl: tvl.toString(),
    };
  }

  public static fromResponse(pool: PoolResponse): PoolModel {
    const id = pool.id ?? pool.poolPath;
    // The pool list APIs do not return stakingApr separately, so fall back to totalApr.
    const stakingApr = pool.stakingApr ?? pool.totalApr ?? "";
    return {
      ...pool,
      id,
      incentivized: pool.incentivized,
      hasStakedPosition: pool.hasStakedPosition,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.totalApr,
      stakingApr,
      liquidity: pool.liquidity,
      allTimeVolumeUsd: pool.allTimeVolumeUsd,
      price: Number(pool.price),
      tokenAPriceGrade: "NONE",
      tokenBPriceGrade: "NONE",
    };
  }

  public static toIncentivePool(pool: PoolResponse): IncentivizePoolModel {
    const id = pool.id ?? pool.poolPath;
    const stakingApr = pool.stakingApr ?? pool.totalApr ?? "";
    return {
      ...pool,
      id,
      incentivized: pool.incentivized,
      hasStakedPosition: pool.hasStakedPosition,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.totalApr,
      stakingApr,
      liquidity: pool.liquidity,
      allTimeVolumeUsd: pool.allTimeVolumeUsd,
      price: Number(pool.price),
      tokenAPriceGrade: "NONE",
      tokenBPriceGrade: "NONE",
    };
  }

  public static detailFromResponse(pool: PoolResponse): PoolDetailModel {
    const id = pool.id ?? pool.poolPath;
    const stakingApr = pool.stakingApr ?? pool.totalApr ?? "";
    return {
      ...pool,
      id,
      incentivized: pool.incentivized,
      hasStakedPosition: pool.hasStakedPosition,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.totalApr ?? "",
      stakingApr,
      totalApr: pool.totalApr,
      allTimeVolumeUsd: pool.allTimeVolumeUsd,
      price: Number(pool.price),
      tokenAPriceGrade: "NONE",
      tokenBPriceGrade: "NONE",
    };
  }
}
