import { IPositionHistoryModel } from "@models/position/position-history-model";

export interface GetPositionHistoryResult {
  history: IPositionHistoryModel[];
  totalCount: number;
}
