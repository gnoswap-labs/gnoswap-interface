import { Pool } from "../swap-simulator.types";
export declare function makeCacheKey(pool: Pool, exactType: "EXACT_IN" | "EXACT_OUT", zeroForOne: boolean): string;
