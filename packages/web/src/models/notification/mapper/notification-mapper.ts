import { TransactionModel } from "@models/account/account-history-model";
import dayjs from "dayjs";
import { TransactionGroupsLabel, TransactionGroupsType } from "..";

export class NotificationMapper {
  static notificationGroupFromTransaction(
    transactions: TransactionModel[],
  ): TransactionGroupsType[] {
    const today = dayjs();
    const todayTransactions: TransactionModel[] = [];
    const pastWeekTransactions: TransactionModel[] = [];
    const pastMonthTransactions: TransactionModel[] = [];
    const olderTransactions: TransactionModel[] = [];

    for (const tx of transactions ?? []) {
      const transactionDate = dayjs(tx.createdAt);

      if (transactionDate.isSame(today, "day")) {
        todayTransactions.push(tx);
      } else if (transactionDate.isAfter(today.subtract(7, "day"))) {
        pastWeekTransactions.push(tx);
      } else if (transactionDate.isAfter(today.subtract(30, "day"))) {
        pastMonthTransactions.push(tx);
      } else {
        olderTransactions.push(tx);
      }
    }

    const res = [];

    if (todayTransactions.length !== 0) {
      res.push({
        type: TransactionGroupsLabel.TODAY,
        // title: "Today",
        txs: todayTransactions,
      });
    }

    if (pastWeekTransactions.length !== 0) {
      res.push({
        type: TransactionGroupsLabel.PASS_7_DAYS,
        txs: pastWeekTransactions,
      });
    }

    if (pastMonthTransactions.length !== 0) {
      res.push({
        type: TransactionGroupsLabel.PASS_30_DAYS,
        txs: pastMonthTransactions,
      });
    }

    if (olderTransactions.length !== 0) {
      res.push({
        type: TransactionGroupsLabel.GREATER_1_MONTH,
        txs: olderTransactions,
      });
    }

    return res;
  }
}
