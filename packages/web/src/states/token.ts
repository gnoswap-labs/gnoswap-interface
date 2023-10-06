import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { atom } from "jotai";

export const tokens = atom<TokenModel[]>([]);

export const tokenPrices = atom<Record<string, TokenPriceModel>>({});

export const balances = atom<Record<string, number | null>>({});
