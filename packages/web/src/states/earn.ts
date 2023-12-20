import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { atom } from "jotai";
import { PoolModel } from "@models/pool/pool-model";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

const DefaultDate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  date: new Date().getDate() + 1,
};

export const isOneClick = atom<boolean>(false);
export const currentPoolPath = atom<string | null>(null);
export const period = atom<number>(90);
export const dataModal = atom<TokenAmountInputModel | null>(null);
export const date = atom<DistributionPeriodDate>(DefaultDate);
export const pool = atom<PoolModel | null>(null);
