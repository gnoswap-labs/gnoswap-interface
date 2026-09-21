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
export const DEFAULT_GAS_WANTED = 2_000_000_000 as const;
export const DEFAULT_ALLOWANCE_LIMIT = 1_000_000_000_000_000_000 as const;
export const DEFAULT_TOKEN_PRICE_RATIO = 1 as const;
export const GAS_WANTED_BUFFER_MULTIPLIER = 1.1 as const;
export const GAS_WANTED_BUFFER_SAFE_MARGIN = 1.2 as const;

/** Reserve applied to a native MAX amount when the action cannot be simulated. */
export const DEFAULT_NATIVE_AMOUNT_RESERVE = 1_000_000 as const;
/** Absorbs state drift between the estimate and the broadcast. */
export const NATIVE_AMOUNT_RESERVE_BUFFER = 10_000 as const;
/** Storage deposit grows with the amount, so the measured value is padded. */
export const STORAGE_DEPOSIT_BUFFER_MULTIPLIER = 1.5 as const;
/**
 * Margin over the measured gas when pricing the fee to reserve. The wallet
 * re-prices the fee at the live gas price for a gas-wanted of gasUsed x 1.1,
 * so this has to clear that multiplier and the gas the amount still gains
 * between the probe and the final figure.
 */
export const GAS_FEE_RESERVE_MARGIN = 1.5 as const;
/**
 * Upper bound on the room held back while probing, in ugnot. Gas dominates a
 * swap — a heavy route can cost well over a GNOT — so this is far above the
 * storage deposit alone.
 */
export const PROBE_HEADROOM_CAP = 5_000_000 as const;
/**
 * The same room as a share of the balance, so a small balance is probed near
 * its own ceiling instead of at a fraction of it. Both costs fall with the
 * amount, so a proportional headroom stays representative at either end.
 */
export const PROBE_HEADROOM_RATIO = 0.1 as const;

export const MINIMUM_GNOT_SWAP_AMOUNT = 0.001;
export const DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT = "100000000000" as const;
