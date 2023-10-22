import { PoolModel } from "@models/pool/pool-model";
import { PositionModel } from "@models/position/position-model";
import { atom } from "jotai";

export const isFetchedPools = atom<boolean>(false);

export const pools = atom<PoolModel[]>([]);

export const isFetchedPositions = atom<boolean>(false);

export const positions = atom<PositionModel[]>([]);
