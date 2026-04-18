import { AmountConverter } from "../common/amount";

import { initialDetailPool } from "@models/pool/pool-detail-model";
import { PoolModel } from "@models/pool/pool-model";
import { PoolStakingModel } from "@models/pool/pool-staking";

/**
 * Utility class responsible for converting pool model amounts
 * Convert raw token balances in pool model to display format using AmountConverter
 */
export class PoolConverter {
  /**
   * Convert raw token balances in a pool model to display format
   * Converts tokenA and tokenB balances using their respective decimals and returns as numbers
   */
  static convertPoolModel(pool: PoolModel | null | undefined): PoolModel {
    if (!pool) return initialDetailPool;

    return {
      ...pool,
      tokenABalance: Number(AmountConverter.convertSingle(pool.tokenA, pool.tokenABalance)),
      tokenBBalance: Number(AmountConverter.convertSingle(pool.tokenB, pool.tokenBBalance)),
    };
  }

  static convertPoolStakingModel(poolStaking: PoolStakingModel[]): PoolStakingModel[] {
    if (!poolStaking) return [];

    return poolStaking.map(data => {
      return {
        ...data,
        incentivizedAmount: AmountConverter.convertSingle(data.rewardToken, data.incentivizedAmount),
        distributableAmount: AmountConverter.convertSingle(data.rewardToken, data.distributableAmount),
      };
    });
  }
}
