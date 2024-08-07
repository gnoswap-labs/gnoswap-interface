import { DexEventType } from "@repositories/common";

export type PositionHistoryType = Omit<DexEventType, "SWAP" | "DEPOSIT" | "WITHDRAW" | "WRAP" | "UNWRAP">;

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
