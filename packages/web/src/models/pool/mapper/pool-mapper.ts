import BigNumber from "bignumber.js";
import { PoolListInfo } from "../info/pool-list-info";
import { PoolModel } from "../pool-model";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { PoolCardInfo } from "../info/pool-card-info";
import { PoolSelectItemInfo } from "../info/pool-select-item-info";
import { PoolResponse } from "@repositories/pool";
import { IncentivizedOptions } from "@common/values";
import { makeId } from "@utils/common";
import { PoolDetailModel } from "../pool-detail-model";
import { convertLargePrice } from "@utils/stake-position-utils";

export class PoolMapper {
  public static toListInfo(poolModel: PoolModel): PoolListInfo {
    const {
      id,
      incentivizedType,
      currentTick,
      price,
      tokenA,
      tokenB,
      volume,
      tvl,
      fee,
      feeVolume,
      apr,
      bins,
      rewardTokens,
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => `${info.fee}` === fee,
    );
      
    return {
      poolId: id,
      incentivizedType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: !apr ? "-" : `${BigNumber(apr || 0).toFormat(2)}%`,
      liquidity: `$${Math.floor(Number(tvl || 0)).toLocaleString()}`,
      volume24h: `$${Math.floor(Number(volume || 0)).toLocaleString()}`,
      fees24h: `$${Math.floor(Number(feeVolume || 0)).toLocaleString()}`,
      rewardTokens,
      currentTick,
      price,
      bins,
    };
  }

  public static toPoolSelectItemInfo(pool: PoolModel): PoolSelectItemInfo {
    const feeRate =
      Object.values(SwapFeeTierInfoMap).find(info => `${info.fee}` === pool.fee)
        ?.rateStr || "-";

    return {
      poolId: pool.id,
      liquidityAmount: BigNumber(pool.tvl).toFixed(),
      feeRate,
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
    };
  }

  public static toCardInfo(poolModel: PoolModel): PoolCardInfo {
    const {
      id,
      currentTick,
      incentivizedType,
      price,
      tokenA,
      tokenB,
      tvl,
      volume,
      fee,
      feeVolume,
      apr,
      bins,
      poolPath,
      rewardTokens,
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => `${info.fee}` === fee,
    );

    return {
      poolId: id,
      incentivizedType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: !apr ? "-" : `${BigNumber(apr || 0).toFormat(2)}%`,
      liquidity: `${convertLargePrice(tvl.toString(), 2)}`,
      volume24h: `${convertLargePrice(volume.toString(), 2)}`,
      fees24h: `${convertLargePrice(feeVolume.toString(), 2)}`,
      rewardTokens,
      currentTick,
      price,
      bins,
      poolPath: poolPath,
      tvl: tvl,
    };
  }

  public static fromResponse(pool: PoolResponse): PoolModel {
    const bins = pool.bins.map(bin => ({
      ...bin,
    }));
    const id = pool.id ?? makeId(pool.poolPath);
    return {
      ...pool,
      id,
      path: pool.poolPath,
      incentivizedType: pool.incentiveType as IncentivizedOptions,
      bins,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.apr !== "" ? Number(pool.apr) : null,
    };
  }

  public static detailFromResponse(pool: PoolResponse): PoolDetailModel {
    const bins = pool.bins.map(bin => ({
      ...bin,
    }));
    const id = pool.id ?? makeId(pool.poolPath);
    return {
      ...pool,
      id,
      path: pool.poolPath,
      incentivizedType: pool.incentiveType as IncentivizedOptions,
      bins,
      rewardTokens: pool.rewardTokens || [],
      apr: pool.apr !== "" ? Number(pool.apr) : null,
    };
  }
}
