import { Pool, SwapResult } from "./swap-simulator.types";
export declare class SwapSimulator {
    private isCache;
    private _cache;
    constructor();
    getSwapCache(pool: Pool, swapAmount: bigint, exactType: "EXACT_IN" | "EXACT_OUT", zeroForOne: boolean): SwapResult | null;
    swap(pool: Pool, fromTokenPath: string, swapAmount: bigint, exactType: "EXACT_IN" | "EXACT_OUT"): SwapResult;
    estimateCacheSwap(cachedSwapResult: SwapResult, swapAmount: bigint, exactType: "EXACT_IN" | "EXACT_OUT", zeroForOne: boolean): {
        amountA: bigint;
        amountB: bigint;
        quotes: {
            tick0: number;
            tick1: number;
            amountIn: bigint;
            amountOut: bigint;
            rate: number;
        }[];
        cached: boolean;
    };
    estimateSwap(pool: Pool, swapAmount: bigint, exactType: "EXACT_IN" | "EXACT_OUT", zeroForOne: boolean): SwapResult;
}
