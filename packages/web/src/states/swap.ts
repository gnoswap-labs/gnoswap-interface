import { atom } from "jotai";
import { TokenSwapModel } from "@models/token/token-swap-model";

export type SwapValue = TokenSwapModel & { tokenAAmount?: string, tokenBAmount?: string }

export const swap = atom<SwapValue>({
  tokenA: null,
  tokenB: null,
  type: "EXACT_IN",
  tokenBAmount: "",
  tokenAAmount: "",
});

export const memoryzeTokenSwap = atom<Record<string, string>>({});
