import { atom } from "jotai";
import { TokenSwapModel } from "@models/token/token-swap-model";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";

export type SwapValue = TokenSwapModel & {
  tokenAAmount?: string;
  tokenBAmount?: string;
  isEarnChanged?: boolean;
  isReverted?: boolean;
  isKeepToken?: boolean;
};

export const swap = atom<SwapValue>({
  tokenA: null,
  tokenB: null,
  type: "EXACT_IN",
  tokenBAmount: "",
  tokenAAmount: "",
  isEarnChanged: false,
  isReverted: false,
  isKeepToken: false,
});

export type SwapConfirmModalState =
  | {
      status: "idle";
    }
  | {
      status: "ready";
      swapTokenInfo: SwapTokenInfo;
      swapSummaryInfo: SwapSummaryInfo;
      isRefetching: boolean;
      estimatedAmount: string | null;
      tokenAmountLimit: number;
    };

export const swapConfirmModalState = atom<SwapConfirmModalState>({
  status: "idle",
});
