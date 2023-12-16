import BigNumber from "bignumber.js";
import { PoolListInfo } from "../info/pool-list-info";
import { PoolModel } from "../pool-model";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { PoolRewardInfo } from "../info/pool-reward-info";
import { PoolCardInfo } from "../info/pool-card-info";
import { PoolSelectItemInfo } from "../info/pool-select-item-info";
import { PoolResponse } from "@repositories/pool";
import { IncentivizedOptions } from "@common/values";
import { makeId } from "@utils/common";
import { toUnitFormat } from "@utils/number-utils";
import { PoolDetailModel } from "../pool-detail-model";

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
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => `${info.fee}` === fee,
    );

    const defaultReward: PoolRewardInfo = {
      token: {
        chainId: "dev",
        createdAt: "2023-10-12T06:56:12+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gns",
        decimals: 4,
        symbol: "GNS",
        logoURI: "/gnos.svg",
        type: "grc20",
        priceId: "gno.land/r/gns",
      },
      amount: 10,
    };

    return {
      poolId: id,
      incentivizedType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: `${BigNumber(apr).toFormat(2)}%`,
      liquidity: `$${Math.floor(Number(tvl || 0)).toLocaleString()}`,
      volume24h: `$${Math.floor(Number(volume || 0)).toLocaleString()}`,
      fees24h: `$${Math.floor(Number(feeVolume || 0)).toLocaleString()}`,
      rewards: [defaultReward],
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
      liquidityAmount: BigNumber(pool.price).toFixed(),
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
    } = poolModel;
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(
      info => `${info.fee}` === fee,
    );

    const defaultReward: PoolRewardInfo = {
      token: {
        chainId: "dev",
        createdAt: "2023-10-12T06:56:12+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gns",
        decimals: 4,
        symbol: "GNS",
        logoURI: "/gnos.svg",
        type: "grc20",
        priceId: "gno.land/r/gns",
      },
      amount: 10,
    };

    return {
      poolId: id,
      incentivizedType,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      apr: `${BigNumber(apr).toFormat(2)}%`,
      liquidity: toUnitFormat(tvl, true),
      volume24h: toUnitFormat(volume, true),
      fees24h: toUnitFormat(feeVolume, true),
      rewards: [defaultReward],
      currentTick,
      price,
      bins,
      poolPath: poolPath,
    };
  }

  public static fromResponse(pool: PoolResponse): PoolModel {
    const bins = pool.bins.map(bin => ({
      ...bin,
    }));
    const id = pool.id ?? makeId(pool.poolPath);
    const incentivizedTypeStr = pool.incentivizedType?.toUpperCase() || "";
    const incentivizedType: IncentivizedOptions =
      incentivizedTypeStr !== "INCENTIVIZED"
        ? incentivizedTypeStr === "EXTERNAL_INCENTIVIZED"
          ? "EXTERNAL_INCENTIVIZED"
          : "INCENTIVIZED"
        : "NON_INCENTIVIZED";
    return {
      ...pool,
      id,
      path: pool.poolPath,
      incentivizedType,
      bins,
      rewardTokens: pool.rewardTokens || [],
    };
  }

  public static detailFromResponse(pool: PoolResponse): PoolDetailModel {
    const bins = pool.bins.map(bin => ({
      ...bin,
    }));
    const id = pool.id ?? makeId(pool.poolPath);
    const incentivizedTypeStr = pool.incentivizedType?.toUpperCase() || "";
    const incentivizedType: IncentivizedOptions =
      incentivizedTypeStr !== "INCENTIVIZED"
        ? incentivizedTypeStr === "EXTERNAL_INCENTIVIZED"
          ? "EXTERNAL_INCENTIVIZED"
          : "INCENTIVIZED"
        : "NON_INCENTIVIZED";
    return {
      ...pool,
      id,
      path: pool.poolPath,
      incentivizedType,
      bins,
      rewardTokens: pool.rewardTokens || [],
    };
  }
}
