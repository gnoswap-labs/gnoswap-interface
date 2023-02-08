export type FeeOptions = "0.01%" | "0.05%" | "0.3%" | "1%";
export type StakedOptions = "NONE" | "STAKED" | "UNSTAKING" | "UNSTAKED";
export type LiquidityProvideOptions = "NONE" | "PROVIDED";
export type IncentivizedOptions =
	| "INCENTIVIZED"
	| "NON_INCENTIVIZED"
	| "EXTERNAL_INCENTIVIZED";
export type StatusOptions = "SUCCESS" | "PENDING" | "FAILED";
export type ActiveStatusOptions = "ACTIVE" | "IN_ACTIVE";
export type TokenTableSelectType = "NATIVE" | "GRC20" | "ALL";
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
