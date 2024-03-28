import { atom } from "jotai";
import { PoolPositionModel } from "@models/position/pool-position-model";

export const selectedPosition = atom<PoolPositionModel | null>(null);
