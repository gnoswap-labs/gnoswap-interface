import { atomWithStorage } from "jotai/utils";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenSwapModel } from "@models/token/token-swap-model";
import { atom } from "jotai";

const RECENT_KEY = "recents";
const RECENT_SELECT_KEY = "recentsSelect";

export const tokens = atom<TokenModel[]>([]);

export const tokenPrices = atom<Record<string, TokenPriceModel>>({});

export const balances = atom<Record<string, number | null>>({});

export const swap = atom<TokenSwapModel>({
  tokenA: null,
  tokenB: null,
  type: "EXACT_IN",
});

export const isLoading = atom<boolean>(true);

export const isLoadingBalances = atom<boolean>(true);
export const isChangeBalancesToken = atom<boolean>(false);

export const recents = atomWithStorage<string>(RECENT_KEY, "");

export const fromSelectToken = atom<boolean>(false);

export const selectRecents = atomWithStorage<string>(RECENT_SELECT_KEY, "");
