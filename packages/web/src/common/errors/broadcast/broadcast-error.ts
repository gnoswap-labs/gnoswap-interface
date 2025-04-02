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
