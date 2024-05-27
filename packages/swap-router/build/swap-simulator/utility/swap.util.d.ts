export declare function getNextSqrtPriceFromAmountARoundingUp(sqrtPriceX96: bigint, liquidity: bigint, amount: bigint, added: boolean): bigint;
export declare function getNextSqrtPriceFromAmountBRoundingDown(sqrtPriceX96: bigint, liquidity: bigint, amount: bigint, added: boolean): bigint;
export declare function getNextSqrtPriceFromInput(sqrtPriceX96: bigint, liquidity: bigint, amountIn: bigint, zeroForOne: boolean): bigint;
export declare function getNextSqrtPriceFromOutput(sqrtPriceX96: bigint, liquidity: bigint, amountOut: bigint, zeroForOne: boolean): bigint;
export declare function getAmountADeltaHelper(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, liquidity: bigint): bigint;
export declare function getAmountBDeltaHelper(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, liquidity: bigint): bigint;
export declare function getAmountADelta(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, liquidity: bigint): bigint;
export declare function getAmountBDelta(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, liquidity: bigint): bigint;
export declare function computeSwapStep(sqrtRatioCurrentX96: bigint, sqrtRatioTargetX96: bigint, liquidity: bigint, amountRemaining: bigint, fee: number): {
    sqrtRatioNextX96: bigint;
    amountIn: bigint;
    amountOut: bigint;
    feeAmount: bigint;
};
