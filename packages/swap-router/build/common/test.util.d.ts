import { EstimatedRoute } from "../swap-router";
import { Pool } from "../swap-simulator";
export declare function printEstimateRouteInfo(routes: EstimatedRoute[]): {
    routes: {
        key: string;
        quote: number;
    }[];
    amount: bigint;
};
export declare function printPoolInfo(pools: Pool[]): void;
