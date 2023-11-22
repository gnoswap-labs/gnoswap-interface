import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenSwapModel } from "@models/token/token-swap-model";
import { atom } from "jotai";

export const tokens = atom<TokenModel[]>([]);

export const tokenPrices = atom<Record<string, TokenPriceModel>>({});

export const balances = atom<Record<string, number | null>>({});

export const swap = atom<TokenSwapModel>({
  tokenA: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gnos",
    decimals: 4,
    symbol: "GNOS",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    priceId: "gno.land/r/gnos",
  },
  tokenB: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gnos",
    decimals: 4,
    symbol: "GNOS",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    priceId: "gno.land/r/gnos",
  },
  type: "EXACT_IN",
});

export const isLoading = atom<boolean>(true);