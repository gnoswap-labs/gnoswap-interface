import { DexEventType } from "@repositories/common";

export type PositionHistoryType = Omit<
  DexEventType,
  "SWAP" | "ASSET_RECEIVE" | "ASSET_SEND" | "WRAP" | "UNWRAP"
>;

export interface IPositionHistoryModel {
  time: string;
  txHash: string;
  type: PositionHistoryType;
  tokenASymbol: string;
  tokenBSymbol: string;
  amountA: number;
  amountB: number;
  usdValue: number;
}
