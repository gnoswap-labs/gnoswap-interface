import { atom } from "jotai";
import { TokenSwapModel } from "@models/token/token-swap-model";

export const swap = atom<TokenSwapModel & { tokenAAmount?: string, tokenBAmount?: string }>({
  tokenA: null,
  tokenB: null,
  type: "EXACT_IN",
  tokenBAmount: "",
  tokenAAmount: "",
});
