import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { atom } from "jotai";
import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

export interface PoolInfoQuery {
  data: PoolDetailRPCModel | null | undefined;
  isLoading: boolean;
}

const DefaultDate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  date: new Date().getDate() + 1,
};

export const isOneClick = atom<boolean>(false);
export const isEarnAdd = atom<boolean>(false);
export const currentPoolPath = atom<string | null>(null);
export const currentCompareToken = atom<TokenModel | null>(null);
export const period = atom<number>(90);
export const dataModal = atom<TokenAmountInputModel | null>(null);
export const date = atom<DistributionPeriodDate>(DefaultDate);
export const pool = atom<PoolModel | null>(null);
export const poolInfoQuery = atom<PoolInfoQuery>({ data: null, isLoading: false });

export const initialDataData = atom<{
  length: number;
  status: boolean;
  loadingCall: boolean;
}>({ length: -1, status: false, loadingCall: false });
