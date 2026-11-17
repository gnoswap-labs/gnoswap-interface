import { atom } from "jotai";
import { PoolPositionModel } from "@models/position/pool-position-model";

// Keep token and reward amounts in raw units across position-management routes.
export const selectedPosition = atom<PoolPositionModel | null>(null);
