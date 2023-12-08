import { atomWithStorage } from "jotai/utils";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenSwapModel } from "@models/token/token-swap-model";
import { atom } from "jotai";

const RECENT_KEY = "recents";

export const tokens = atom<TokenModel[]>([]);

export const tokenPrices = atom<Record<string, TokenPriceModel>>({});

export const balances = atom<Record<string, number | null>>({});

export const swap = atom<TokenSwapModel>({
  tokenA: null,
  tokenB: null,
  type: "EXACT_IN",
});

export const isLoading = atom<boolean>(true);

export const recents = atomWithStorage<string>(RECENT_KEY, "");
