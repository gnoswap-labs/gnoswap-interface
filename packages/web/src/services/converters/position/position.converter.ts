import { AmountConverter } from "@services/converters/common/amount";

import { PoolPositionModel } from "@models/position/pool-position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { TokenModel } from "@models/token/token-model";

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
          claimableAmount: AmountConverter.convertSingle(reward.rewardToken, reward.claimableAmount || 0),
          totalAmount: AmountConverter.convertSingle(reward.rewardToken, reward.totalAmount || 0),
        })) || [],
    };
  }

  /**
   * Convert raw amounts in position history items to display format
   * Converts amountA and amountB using provided token models and returns as numbers
   *
   * @param historyList - array of position history items to convert (can be null/undefined)
   * @param tokenA - token model for amountA conversion
   * @param tokenB - token model for amountB conversion
   * @returns array of history items with converted amounts (empty array if input is invalid)
   */
  static convertPositionHistory(
    historyList: IPositionHistoryModel[] | null | undefined,
    tokenA: TokenModel | null | undefined,
    tokenB: TokenModel | null | undefined,
  ): IPositionHistoryModel[] {
    if (!historyList || !tokenA || !tokenB) return [];

    return [...historyList].map((history: IPositionHistoryModel) => {
      if (!history) return history;

      return {
        ...history,
        amountA: Number(AmountConverter.convertSingle(tokenA, history.amountA)),
        amountB: Number(AmountConverter.convertSingle(tokenB, history.amountB)),
      };
    });
  }
}
