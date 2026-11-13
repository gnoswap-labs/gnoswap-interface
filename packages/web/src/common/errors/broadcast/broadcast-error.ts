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
};

/** Failures of the DCA realm the user can act on, keyed by its `[GNOSWAP-ORDER-DCA-0xx]` code. */
export const DCA_BROADCAST_ERROR_VALUE = {
  AMOUNT_TOO_LOW: {
    type: "DCA_AMOUNT_TOO_LOW",
    title: "Modal:confirm.dcaError.amountTooLow.title",
    description: "Modal:confirm.dcaError.amountTooLow.desc",
  },
  NO_ELIGIBLE_POOL: {
    type: "DCA_NO_ELIGIBLE_POOL",
    title: "Modal:confirm.dcaError.noEligiblePool.title",
    description: "Modal:confirm.dcaError.noEligiblePool.desc",
  },
  HALTED: {
    type: "DCA_HALTED",
    title: "Modal:confirm.dcaError.halted.title",
    description: "Modal:confirm.dcaError.halted.desc",
  },
  PAIR_NOT_SUPPORTED: {
    type: "DCA_PAIR_NOT_SUPPORTED",
    title: "Modal:confirm.dcaError.pairNotSupported.title",
    description: "Modal:confirm.dcaError.pairNotSupported.desc",
  },
};

const DCA_ERROR_CODE_PATTERN = /\[GNOSWAP-ORDER-DCA-(\d{3})\]/;

const DCA_ERROR_BY_CODE: Record<string, BroadcastErrorContent> = {
  // invalid amount: below max(global, per-token) minimum per execution
  "004": DCA_BROADCAST_ERROR_VALUE.AMOUNT_TOO_LOW,
  // no eligible pool
  "017": DCA_BROADCAST_ERROR_VALUE.NO_ELIGIBLE_POOL,
  // operation halted
  "021": DCA_BROADCAST_ERROR_VALUE.HALTED,
  // missing price limit: the direction is not orderable
  "027": DCA_BROADCAST_ERROR_VALUE.PAIR_NOT_SUPPORTED,
};

/**
 * The error to show for a failed DCA transaction, read from the realm's error
 * code in the wallet's message. Unknown or missing codes fall back to the default.
 */
export function getDcaBroadcastError(message: string | null | undefined): BroadcastErrorContent {
  const code = message?.match(DCA_ERROR_CODE_PATTERN)?.[1];
  return (code && DCA_ERROR_BY_CODE[code]) || BROADCAST_ERROR_VALUE.DEFAULT;
}
