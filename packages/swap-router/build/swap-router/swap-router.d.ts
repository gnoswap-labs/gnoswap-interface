import { CandidatePoolsSelections, Pool } from "../swap-simulator/swap-simulator.types";
import { EstimatedRoute, Route } from "./swap-router.types";
export declare const TOP_N = 2;
export declare const TOP_N_DIRECT_SWAPS = 2;
export declare const TOP_N_TOKEN_IN_OUT = 3;
export declare const TOP_N_SECOND_HOP = 1;
export declare const TOP_N_WITH_EACH_BASE_TOKEN = 3;
export declare const TOP_N_WITH_BASE_TOKEN = 5;
export declare class SwapRouter {
    private _pools;
    constructor(pools: Pool[]);
    get pools(): Pool[];
    setPools(pools: Pool[]): void;
    filteredCandidatePools(pools: Pool[], inputTokenPath: string, outputTokenPath: string): CandidatePoolsSelections;
    findCandidateRoutesBy(pools: Pool[], inputTokenPath: string, outputTokenPath: string, routeSize?: number): Route[];
    estimateSwapRoute: (inputTokenPath: string, outputTokenPath: string, amount: bigint, exactType: "EXACT_IN" | "EXACT_OUT", distributionRatio?: number, hopSize?: number) => EstimatedRoute[];
}
