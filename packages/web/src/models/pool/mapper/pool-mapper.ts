import BigNumber from "bignumber.js";
import { PoolListInfo } from "../info/pool-list-info";
import { PoolModel } from "../pool-model";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { PoolRewardInfo } from "../info/pool-reward-info";
import { PoolCardInfo } from "../info/pool-card-info";
import { PoolSelectItemInfo } from "../info/pool-select-item-info";

export class PoolMapper {
  public static toListInfo(poolModel: PoolModel): PoolListInfo {
    const {
      id,
      currentTick,
      price,
      tokenA,
      tokenB,
      volume,
      totalVolume,
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
        path: "gno.land/r/gnos",
        decimals: 4,
        symbol: "GNOS",
        logoURI: "/gnos.svg",
        priceId: "gno.land/r/gnos",
      },
      amount: 10,
    };

    return {
      poolId: id,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      liquidity: `$${BigNumber(totalVolume).toFormat()}`,
      apr: `${BigNumber(apr).toFormat(2)}%`,
      volume24h: `$${BigNumber(volume).toFormat()}`,
      fees24h: `$${BigNumber(feeVolume).toFormat()}`,
      rewards: [defaultReward],
      incentiveType: "Incentivized",
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
      price,
      tokenA,
      tokenB,
      volume,
      totalVolume,
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
        path: "gno.land/r/gnos",
        decimals: 4,
        symbol: "GNOS",
        logoURI: "/gnos.svg",
        priceId: "gno.land/r/gnos",
      },
      amount: 10,
    };

    return {
      poolId: id,
      tokenA,
      tokenB,
      feeTier: feeTierInfo?.type || "NONE",
      liquidity: `$${BigNumber(totalVolume).toFormat()}`,
      apr: `${BigNumber(apr).toFormat(2)}%`,
      volume24h: `$${BigNumber(volume).toFormat()}`,
      fees24h: `$${BigNumber(feeVolume).toFormat()}`,
      rewards: [defaultReward],
      incentiveType: "Incentivized",
      currentTick,
      price,
      bins,
    };
  }

  public static fromResponse(poolModel: PoolModel): PoolModel {
    const bins = poolModel.bins.map(bin => ({
      ...bin,
    }));
    return {
      ...poolModel,
      bins,
    };
  }
}
