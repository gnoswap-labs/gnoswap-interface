import { PoolModel } from "@models/pool/pool-model";
import { PositionModel } from "@models/position/position-model";
import { atom } from "jotai";

export const isFetchedPools = atom<boolean>(false);

export const pools = atom<PoolModel[]>([]);

export const positions = atom<PositionModel[]>([]);

export const isLoading = atom<boolean>(true);
