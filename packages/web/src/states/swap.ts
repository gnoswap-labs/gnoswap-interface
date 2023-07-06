import { atom } from "jotai";
import { TokenSwapModel } from "@models/token/token-swap-model";

export const swap = atom<TokenSwapModel>({
  token0: null,
  token1: null,
  type: "EXACT_IN",
});
