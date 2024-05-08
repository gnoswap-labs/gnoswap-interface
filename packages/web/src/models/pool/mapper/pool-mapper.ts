import BigNumber from "bignumber.js";
import { PoolListInfo } from "../info/pool-list-info";
import { PoolModel } from "../pool-model";
import { INCENTIVE_TYPE, SwapFeeTierInfoMap } from "@constants/option.constant";
import { PoolCardInfo } from "../info/pool-card-info";
import { PoolSelectItemInfo } from "../info/pool-select-item-info";
import { PoolResponse } from "@repositories/pool";
import { makeId } from "@utils/common";
import { PoolDetailModel } from "../pool-detail-model";
import { convertToKMB, convertToMB } from "@utils/stake-position-utils";
import { REGEX_NUMBER_FORMAT } from "@utils/regex";

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
      bins,
      rewardTokens,
      feeUsd24h,
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => `${info.fee}` === fee,
    );

    return {
      poolId: id,
      incentiveType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: !apr ? "-" : `${BigNumber(apr || 0).toFormat(2)}%`,
      liquidity: `$${BigNumber(tvl).toFormat(0)}`,
      volume24h: `$${Math.floor(Number(volume24h || 0)).toLocaleString()}`,
      fees24h: `$${Math.floor(Number(feeUsd24h || 0)).toLocaleString()}`,
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
      fee: pool.fee,
    };
  }

  public static toCardInfo(poolModel: PoolModel): PoolCardInfo {
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
      bins,
      poolPath,
      rewardTokens,
      bins40,
      feeUsd24h,
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => `${info.fee}` === fee,
    );
    const customVolume = convertToMB(Number(volume24h).toString(), 2);
    return {
      poolId: id,
      incentiveType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: !apr ? "-" : `${BigNumber(apr || 0).toFormat(2)}%`,
      liquidity: `${convertToKMB(Math.round(tvl).toString(), { maximumFractionDigits: 2 })}`,
      volume24h: `${customVolume.replace(REGEX_NUMBER_FORMAT, "$1")}`,
      fees24h: `${convertToMB(Number(feeUsd24h).toString(), 2)}`,
      rewardTokens,
      currentTick,
      price,
      bins,
      bins40,
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
      incentiveType: pool.incentiveType as INCENTIVE_TYPE,
      bins,
      rewardTokens: pool.rewardTokens || [],
      apr: !pool.apr ? Number(pool.apr) : null,
      bins40: pool.bins40,
      liquidity: pool.liquidity,
    };
  }

  public static detailFromResponse(pool: PoolResponse): PoolDetailModel {
    // const bins = pool.bins.map(bin => ({
    //   ...bin,
    // }));
    const id = pool.id ?? makeId(pool.poolPath);
    return {
      ...pool,
      id,
      path: pool.poolPath,
      incentiveType: pool.incentiveType as INCENTIVE_TYPE,
      bins: [],
      rewardTokens: pool.rewardTokens || [],
      apr: !pool.apr ? Number(pool.apr) : null,
      totalApr: !pool.totalApr ? Number(pool.totalApr) : null,
    };
  }
}