import { atom } from "jotai";

import { TokenAmountInputModel } from "@hooks/token/data/use-token-amount-input";
import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";

export interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

export interface PoolInfoQuery {
  isLoading: boolean;
}

const SECONDS_PER_DAY = 24 * 60 * 60;

export const getMinimumIncentiveStartDate = (now = Date.now()): DistributionPeriodDate => {
  const currentTimestamp = Math.floor(now / 1000);
  const minimumStartTimestamp = Math.ceil((currentTimestamp + SECONDS_PER_DAY) / SECONDS_PER_DAY) * SECONDS_PER_DAY;
  const date = new Date(minimumStartTimestamp * 1000);

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    date: date.getUTCDate(),
  };
};

export const DefaultDate = getMinimumIncentiveStartDate();

export const isOneClick = atom<boolean>(false);
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
