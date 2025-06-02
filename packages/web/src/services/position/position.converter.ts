import { AmountConverter } from "@services/converters";

import { PoolPositionModel } from "@models/position/pool-position-model";

/**
 * Utility class responsible for converting pool position amounts
 * Convert raw amounts in pool positions to display format using AmountConverter
 */
export class PositionConverter {
  /**
   * Convert raw amounts in multiple pool positions to display format
   *
   * @param positions - array of pool positions to convert (can be null/undefined)
   * @returns array of positions with converted amounts (empty array if input is invalid)
   *
   * @example
   * // Convert multiple positions
   * const displayPositions = PositionConverter.convertPositions(rawPositions);
   *
   * // Handle null/undefined input safely
   * const safePositions = PositionConverter.convertPositions(null); // returns []
   */
  static convertPositions(positions: PoolPositionModel[] | null | undefined): PoolPositionModel[] {
    if (!positions || !Array.isArray(positions)) return [];

    return [...positions].map((position: PoolPositionModel) => this.convertSinglePosition(position));
  }

  /**
   * Convert raw amounts in a single pool position to display format
   * Converts tokenA/tokenB balances and all reward amounts using AmountConverter
   *
   * @param position - pool position to convert
   * @returns position with all amounts converted to display format
   *
   */
  private static convertSinglePosition(position: PoolPositionModel): PoolPositionModel {
    if (!position) return position;

    return {
      ...position,
      tokenABalance: AmountConverter.convertSingle(position.pool?.tokenA, position.tokenABalance || 0),
      tokenBBalance: AmountConverter.convertSingle(position.pool?.tokenB, position.tokenBBalance || 0),

      claimedRewards:
        position.claimedRewards?.map(reward => ({
          ...reward,
          claimedAmount: AmountConverter.convertSingle(reward.rewardToken, reward.claimedAmount || 0),
        })) || [],

      rewards:
        position.rewards?.map(reward => ({
          ...reward,
          accuReward1D: AmountConverter.convertSingle(reward.rewardToken, reward.accuReward1D || 0),
          claimableAmount: AmountConverter.convertSingle(reward.rewardToken, reward.claimableAmount || 0),
          totalAmount: AmountConverter.convertSingle(reward.rewardToken, reward.totalAmount || 0),
        })) || [],
    };
  }
}
