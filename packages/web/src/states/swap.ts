import { atom } from "jotai";
import { TokenSwapModel } from "@models/token/token-swap-model";

export type SwapValue = TokenSwapModel & { tokenAAmount?: string, tokenBAmount?: string, isEarnChanged?: boolean, isReverted?: boolean }

export const swap = atom<SwapValue>({
  tokenA: null,
  tokenB: null,
  type: "EXACT_IN",
  tokenBAmount: "",
  tokenAAmount: "",
  isEarnChanged: false,
  isReverted: false,
});

export const memoryzeTokenSwap = atom<Record<string, string>>({});
