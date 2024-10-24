export type FeeOptions = "0.01%" | "0.05%" | "0.3%" | "1%";
export type StakedOptions = "NONE" | "STAKED" | "UNSTAKING" | "UNSTAKED";
export type LiquidityProvideOptions = "NONE" | "PROVIDED";
export type StatusOptions = "SUCCESS" | "PENDING" | "FAILED";
export type ActiveStatusOptions = "ACTIVE" | "IN_ACTIVE" | "NONE";
export type TokenTableSelectType = "NATIVE" | "GRC20" | "ALL";
export type SwapDirectionType = "EXACT_IN" | "EXACT_OUT";
export enum NotificationType {
  "Approve" = 0,
  "CreatePool" = 1,
  "AddLiquidity" = 2,
  "RemoveLiquidity" = 3,
  "Stake" = 4,
  "UnStake" = 5,
  "Claim" = 6,
  "AddIncentive" = 7,
  "Swap" = 8,
  "Wrap" = 9,
  "UnWrap" = 10,
}
export type MathSymbolType = "NEGATIVE" | "POSITIVE" | "NAN";

export const DEFAULT_TRANSACTION_DEADLINE = "7282571140" as const;
export const DEFAULT_CONTRACT_USE_FEE = 1000000 as const;
export const DEFAULT_GAS_FEE = 1 as const;
export const DEFAULT_GAS_WANTED = 100_000_000 as const;

export const MINIMUM_GNOT_SWAP_AMOUNT = 0.001;
