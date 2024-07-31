import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { atom } from "jotai";
import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import dayjs from "dayjs";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

export interface PoolInfoQuery {
  isLoading: boolean;
}

const DefaultDate = (() => {
  const date = dayjs().add(1, "day");

  return {
    year: date.get("year"),
    month: date.get("month") + 1,
    date: date.get("date"),
  };
})();

export const isOneClick = atom<boolean>(false);
export const isEarnAdd = atom<boolean>(false);
export const currentPoolPath = atom<string | null>(null);
export const currentCompareToken = atom<TokenModel | null>(null);
export const period = atom<number>(90);
export const dataModal = atom<TokenAmountInputModel | null>(null);
export const date = atom<DistributionPeriodDate>(DefaultDate);
export const pool = atom<PoolModel | null>(null);
export const poolInfoQuery = atom<PoolInfoQuery>({
  isLoading: false,
});

export const initialDataData = atom<{
  length: number;
  status: boolean;
  loadingCall: boolean;
}>({ length: -1, status: false, loadingCall: false });

export const isViewMorePositions = atom<boolean>(false);
