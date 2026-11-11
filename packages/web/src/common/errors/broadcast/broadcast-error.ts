export interface BroadcastErrorContent {
  type: string;
  title: string;
  description?: string;
  content?: string;
  txHash?: string;
}

export const BROADCAST_ERROR_VALUE = {
  DEFAULT: {
    type: "DEFAULT",
    title: "Modal:confirm.general.failed.title",
    description: "Modal:confirm.general.failed.desc",
  },
  SLIPPAGE_EXCEEDED: {
    type: "SLIPPAGE_EXCEEDED",
    title: "Modal:confirm.slippage.exceeded.title",
    description: "Modal:confirm.slippage.exceeded.desc",
  },
  LIMIT_WITHDRAWALS_PAUSED: {
    type: "LIMIT_WITHDRAWALS_PAUSED",
    title: "Swap:order.withdrawalsPaused",
    description: "Swap:order.withdrawalsPausedDescription",
  },
};

/** CancelOrder can race a halt that changed after the last config refresh. */
export const getLimitCancelBroadcastError = (message: string | null | undefined): BroadcastErrorContent =>
  message?.includes("[GNOSWAP-ORDER-LIMIT-022]")
    ? BROADCAST_ERROR_VALUE.LIMIT_WITHDRAWALS_PAUSED
    : BROADCAST_ERROR_VALUE.DEFAULT;
