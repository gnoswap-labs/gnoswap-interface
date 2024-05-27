export declare function tickToPrice(tick: number): number;
export declare function tickToSqrtPriceX96(tick: number): bigint;
export declare function nextInitializedTickWithinOneWord(tickBitmaps: {
    [key in number]: string;
}, tick: number, tickSpacing: number, isTickToLeft: boolean): {
    tickNext: number;
    initialized: boolean;
};
export declare function sqrtPriceX96ToTick(sqrtPriceX96: bigint): number;
