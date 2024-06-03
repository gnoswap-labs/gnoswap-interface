import { IPositionHistoryModel, PositionHistoryType } from "../position-history-model";
import { IPositionHistoryResponse } from "@repositories/position/response/position-history-response";

export class PositionHistoryMapper {
  public static from(res: IPositionHistoryResponse): IPositionHistoryModel {
    return {
      height: res.height,
      time: res.time,
      txHash: res.txHash, 
      type: res.type as PositionHistoryType,
      amountA: Number(res.amountA),
      amountB: Number(res.amountB),
      usdValue: Number(res.usdValue),
    };
  }

  public static fromList(res: IPositionHistoryResponse[]): IPositionHistoryModel[] {
    return res.map(PositionHistoryMapper.from);
  }
}
