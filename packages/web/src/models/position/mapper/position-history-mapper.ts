import { IPositionHistoryModel, PositionHistoryType } from "../position-history-model";
import { IPositionHistoryResponse } from "@repositories/position/response/position-history-response";

export class PositionHistoryMapper {
  public static from(res: IPositionHistoryResponse): IPositionHistoryModel {
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
    res: IPositionHistoryResponse[],
  ): IPositionHistoryModel[] {
    return res.map(PositionHistoryMapper.from);
  }
}
