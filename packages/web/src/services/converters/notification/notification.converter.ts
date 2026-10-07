import { AmountConverter } from "@services/converters/common/amount";

import { emptyToken } from "@repositories/activity/responses/activity-responses";

import { TransactionGroupsType } from "@models/notification";
import { TransactionModel } from "@models/account/account-history-model";

/**
 * Classes responsible for converting notification-related data
 * Primarily converts the token amount of a trading group into a form that can be displayed to the user
 */
export class NotificationConverter {
  /**
   * Convert all token amounts in a transaction group array to display format
   *
   * @param txs - Array of transaction groups to convert (accepts null/undefined)
   * @returns an array of converted transaction groups (empty array if input is null/undefined)
   *
   * @description
   * Convert tokenAAmount, tokenBAmount from raw to display values for each transaction
   * Returns a new object without changing the original data (preserving immutability)
   * Safely return an empty array for null/undefined inputs
   **/
  static convertTransactionGroups(txs: TransactionGroupsType[] | null | undefined): TransactionGroupsType[] {
    if (!txs || !Array.isArray(txs)) return [];

    return [...txs].map((txGroup: TransactionGroupsType) => {
      return {
        ...txGroup,
        txs:
          txGroup.txs.map((tx: TransactionModel) => {
            return {
              ...tx,
              rawValue: {
                ...tx.rawValue,
                tokenAAmount: AmountConverter.convertSingle(tx.rawValue.tokenA, tx.rawValue.tokenAAmount),
                tokenBAmount: AmountConverter.convertSingle(tx.rawValue.tokenB ?? emptyToken, tx.rawValue.tokenBAmount),
              },
            };
          }) || [],
      };
    });
  }
}
