import { ExchangeRateToBigNumType } from "@/models/token/exchange-rate-model";
import { TokenMeta } from "@/repositories/token";
import BigNumber from "bignumber.js";
import { atom } from "recoil";

export const standard = atom<TokenMeta | null>({
  key: "token/standard",
  default: null,
});

export const tokenMetas = atom<Array<TokenMeta>>({
  key: "token/token-metas",
  default: [],
});

export const exchangeRates = atom<Array<ExchangeRateToBigNumType>>({
  key: "token/exchange-rates",
  default: [],
});

export const usdRate = atom<BigNumber | null>({
  key: "token/usd-rate",
  default: null,
});
