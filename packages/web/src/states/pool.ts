import { PoolModel } from "@models/pool/pool-model";
import { atom } from "jotai";

export const pools = atom<PoolModel[]>([]);
