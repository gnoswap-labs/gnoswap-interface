import { ActivityData, ActivityResponse } from "@repositories/activity/responses/activity-responses";

import { IPositionHistoryModel, PositionHistoryType } from "../position-history-model";

export class PositionHistoryMapper {
  public static from(res: ActivityData): IPositionHistoryModel {
    const replaceToken = (symbol: string) => {
      if (symbol === "wugnot") return "GNOT";
      return symbol;
    };

    return {
      time: res.time,
      txHash: res.txHash,
      type: res.actionType as PositionHistoryType,
      tokenASymbol: replaceToken(res.tokenA.symbol),
      tokenBSymbol: replaceToken(res.tokenB.symbol),
      amountA: Number(res.tokenAAmount),
      amountB: Number(res.tokenBAmount),
      usdValue: Number(res.totalUsd),
    };
  }

  public static fromList(
    res: ActivityResponse,
  ): IPositionHistoryModel[] {
    return res.map(PositionHistoryMapper.from);
  }
}
