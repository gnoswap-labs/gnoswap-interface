import { ExactTypeOption } from "@/common/values/data-constant";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import { atom } from "recoil";

export const token0 = atom<TokenDefaultModel | null>({
  key: "swap/token0",
  default: null,
});

export const token1 = atom<TokenDefaultModel | null>({
  key: "swap/token1",
  default: null,
});

export const swapType = atom<ExactTypeOption>({
  key: "swap/swap-type",
  default: "EXACT_IN",
});
