export type PositionHistoryType = "Create" | "Remove" | "Unstake" | "Stake" | "Decrease" | "Increase";

export interface IPositionHistoryModel {
  height: number
  time: string
  txHash: string
  type: PositionHistoryType
  amountA: number
  amountB: number
  usdValue: number
}