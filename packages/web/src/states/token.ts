import { ExchangeRateToBigNumType } from "@models/token/exchange-rate-model";
import { TokenMeta } from "@repositories/token";
import BigNumber from "bignumber.js";
import { atom } from "jotai";

export const standardTokenMeta = atom<TokenMeta | null>(null);

export const tokenMetas = atom<Array<TokenMeta>>([]);

export const exchangeRates = atom<Array<ExchangeRateToBigNumType>>([]);

export const usdRate = atom<BigNumber | null>(null);
