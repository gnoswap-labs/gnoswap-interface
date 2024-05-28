import BigNumber from "bignumber.js";
import { PoolListInfo } from "../info/pool-list-info";
import { IncentivizePoolModel, PoolModel } from "../pool-model";
import { INCENTIVE_TYPE, SwapFeeTierInfoMap } from "@constants/option.constant";
import { IncentivizePoolCardInfo } from "../info/pool-card-info";
import { PoolSelectItemInfo } from "../info/pool-select-item-info";
import { PoolResponse } from "@repositories/pool";
import { makeId } from "@utils/common";
import { PoolDetailModel } from "../pool-detail-model";
import { toUnitFormat } from "@utils/number-utils";

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
      liquidity: `$${BigNumber(liquidity).toFormat(0)}`,
      volume24h: toUnitFormat(volume24h || "0", true, true),
      fees24h: toUnitFormat(feeUsd24h || "0", true, true),
      rewardTokens,
      currentTick,
      price,
      tvl: toUnitFormat(tvl || "0", true, true),
    };
  }

  public static toPoolSelectItemInfo(pool: PoolModel): PoolSelectItemInfo {
    const feeRate =
      Object.values(SwapFeeTierInfoMap).find(
        info => info.fee.toString() === pool.fee,
      )?.rateStr || "-";

    return {
      poolId: pool.id,
      liquidityAmount: BigNumber(pool.tvl).toFixed(),
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
      liquidity: toUnitFormat(tvl || "0", true, true),
      volume24h: toUnitFormat(volume24h || "0", true, true),
      fees24h: toUnitFormat(feeUsd24h || "0", true, true),
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
      allTimeVolumeUsd: Number(pool.allTimeVolumeUsd),
      price: Number(pool.price),
    };
  }
}
