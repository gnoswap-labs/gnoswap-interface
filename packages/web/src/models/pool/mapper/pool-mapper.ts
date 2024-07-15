import BigNumber from "bignumber.js";
import { PoolListInfo } from "../info/pool-list-info";
import { IncentivizePoolModel, PoolModel } from "../pool-model";
import { INCENTIVE_TYPE, SwapFeeTierInfoMap } from "@constants/option.constant";
import { IncentivizePoolCardInfo } from "../info/pool-card-info";
import { PoolSelectItemInfo } from "../info/pool-select-item-info";
import { PoolResponse } from "@repositories/pool";
import { makeId } from "@utils/common";
import { PoolDetailModel } from "../pool-detail-model";
import { formatOtherPrice } from "@utils/new-number-utils";

export class PoolMapper {
  public static toListInfo(poolModel: PoolModel): PoolListInfo {
    const {
      id,
      incentiveType,
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
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => info.fee.toString() === fee,
    );

    return {
      poolId: id,
      incentiveType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: apr,
      liquidity: liquidity,
      volume24h: volume24h.toString(),
      fees24h: feeUsd24h.toString(),
      // liquidity: formatOtherPrice(liquidity, { isKMB: false, decimals: 0 }),
      // volume24h: formatOtherPrice(volume24h, { isKMB: false, decimals: 0 }),
      // fees24h: formatOtherPrice(feeUsd24h, { isKMB: false, decimals: 0 }),
      rewardTokens,
      currentTick,
      price,
      tvl: tvl,
    };
  }

  public static toPoolSelectItemInfo(pool: PoolModel): PoolSelectItemInfo {
    console.log("🚀 ~ PoolMapper ~ toPoolSelectItemInfo ~ pool:", pool.tvl);
    console.log(
      "🚀 ~ PoolMapper ~ toPoolSelectItemInfo ~ pool:",
      BigNumber(pool.tvl).toFixed(),
    );
    const feeRate =
      Object.values(SwapFeeTierInfoMap).find(
        info => info.fee.toString() === pool.fee,
      )?.rateStr || "-";

    return {
      poolId: pool.id,
      liquidityAmount: pool.tvl,
      feeRate,
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      fee: pool.fee.toString(),
    };
  }

  public static toCardInfo(
    poolModel: IncentivizePoolModel,
  ): IncentivizePoolCardInfo {
    const {
      id,
      currentTick,
      incentiveType,
      price,
      tokenA,
      tokenB,
      tvl,
      volume24h,
      fee,
      apr,
      poolPath,
      rewardTokens,
      feeUsd24h,
      bins40,
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => `${info.fee}` === fee.toString(),
    );

    return {
      poolId: id,
      incentiveType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: apr,
      liquidity: formatOtherPrice(tvl),
      volume24h: formatOtherPrice(volume24h),
      fees24h: formatOtherPrice(feeUsd24h),
      rewardTokens,
      currentTick,
      price,
      bins40: bins40,
      poolPath: poolPath,
      tvl: tvl.toString(),
    };
  }

  public static fromResponse(pool: PoolResponse): PoolModel {
    const id = pool.id ?? makeId(pool.poolPath);
    return {
      ...pool,
      id,
      incentiveType: pool.incentiveType as INCENTIVE_TYPE,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.totalApr,
      liquidity: pool.liquidity,
      allTimeVolumeUsd: pool.allTimeVolumeUsd,
      price: Number(pool.price),
    };
  }

  public static toIncentivePool(pool: PoolResponse): IncentivizePoolModel {
    const id = pool.id ?? makeId(pool.poolPath);
    return {
      ...pool,
      id,
      incentiveType: pool.incentiveType as INCENTIVE_TYPE,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.totalApr,
      bins40: pool.bins40,
      liquidity: pool.liquidity,
      allTimeVolumeUsd: pool.allTimeVolumeUsd,
      price: Number(pool.price),
    };
  }

  public static detailFromResponse(pool: PoolResponse): PoolDetailModel {
    const id = pool.id ?? makeId(pool.poolPath);
    return {
      ...pool,
      id,
      incentiveType: pool.incentiveType as INCENTIVE_TYPE,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.totalApr ?? "",
      totalApr: pool.totalApr,
      allTimeVolumeUsd: pool.allTimeVolumeUsd,
      price: Number(pool.price),
    };
  }
}
