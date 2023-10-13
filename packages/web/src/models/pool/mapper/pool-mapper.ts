import BigNumber from "bignumber.js";
import { PoolListInfo } from "../info/pool-list-info";
import { PoolModel } from "../pool-model";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { PoolRewardInfo } from "../info/pool-reward-info";
import { PoolCardInfo } from "../info/pool-card-info";

export class PoolMapper {
  public static toListInfo(poolModel: PoolModel): PoolListInfo {
    const {
      id,
      price,
      tokenA,
      tokenB,
      volume,
      totalVolume,
      fee,
      feeVolume,
      apr,
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
      liquidity: `$${BigNumber(totalVolume.amount).toFormat()}`,
      apr: `${BigNumber(apr).toFormat(2)}%`,
      volume24h: `$${BigNumber(volume.amount).toFormat()}`,
      fees24h: `$${BigNumber(feeVolume).toFormat()}`,
      rewards: [defaultReward],
      incentiveType: "Incentivized",
      tickInfo: {
        currentTick: price,
        ticks: [],
      },
    };
  }

  public static toCardInfo(poolModel: PoolModel): PoolCardInfo {
    const {
      id,
      price,
      tokenA,
      tokenB,
      volume,
      totalVolume,
      fee,
      feeVolume,
      apr,
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
      liquidity: `$${BigNumber(totalVolume.amount).toFormat()}`,
      apr: `${BigNumber(apr).toFormat(2)}%`,
      volume24h: `$${BigNumber(volume.amount).toFormat()}`,
      fees24h: `$${BigNumber(feeVolume).toFormat()}`,
      rewards: [defaultReward],
      incentiveType: "Incentivized",
      tickInfo: {
        currentTick: price,
        ticks: [],
      },
    };
  }
}
