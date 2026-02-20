import { ActivityData, ActivityResponse } from "@repositories/activity/responses/activity-responses";

import { IPositionHistoryModel, PositionHistoryType } from "../position-history-model";

export class PositionHistoryMapper {
  public static from(res: ActivityData): IPositionHistoryModel {
    return {
      time: res.time,
      txHash: res.txHash,
      type: res.actionType as PositionHistoryType,
      tokenASymbol: res.tokenA.symbol,
      tokenBSymbol: res.tokenB?.symbol ?? "",
      amountA: Number(res.tokenAAmount ?? 0),
      amountB: Number(res.tokenBAmount ?? 0),
      usdValue: Number(res.totalUsd),
    };
  }

  public static fromList(res: ActivityResponse): IPositionHistoryModel[] {
    return res.map(PositionHistoryMapper.from);
  }
}
