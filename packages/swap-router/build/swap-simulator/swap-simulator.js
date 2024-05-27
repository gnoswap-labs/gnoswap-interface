"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapSimulator = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const bigint_util_1 = require("../common/bigint.util");
const swap_constant_1 = require("../constants/swap.constant");
const utility_1 = require("./utility");
const cache_util_1 = require("./utility/cache.util");
class SwapSimulator {
    constructor() {
        this.isCache = false;
        this._cache = {};
    }
    getSwapCache(pool, swapAmount, exactType, zeroForOne) {
        if (!this.isCache) {
            return null;
        }
        const cacheKey = (0, cache_util_1.makeCacheKey)(pool, exactType, zeroForOne);
        const cachedSwapResult = this._cache[cacheKey];
        if (!cachedSwapResult) {
            return null;
        }
        let compareAmount = (exactType === "EXACT_IN") === zeroForOne
            ? cachedSwapResult.amountA
            : cachedSwapResult.amountB;
        compareAmount = compareAmount >= 0 ? compareAmount : compareAmount * -1n;
        if (swapAmount > compareAmount) {
            return null;
        }
        return cachedSwapResult;
    }
    swap(pool, fromTokenPath, swapAmount, exactType) {
        const zeroForOne = pool.tokenAPath === fromTokenPath;
        const cacheKey = (0, cache_util_1.makeCacheKey)(pool, exactType, zeroForOne);
        const cachedSwapResult = this.getSwapCache(pool, swapAmount, exactType, zeroForOne);
        if (cachedSwapResult) {
            return this.estimateCacheSwap(cachedSwapResult, swapAmount, exactType, zeroForOne);
        }
        const swapResult = this.estimateSwap(pool, swapAmount, exactType, zeroForOne);
        this._cache[cacheKey] = swapResult;
        return swapResult;
    }
    estimateCacheSwap(cachedSwapResult, swapAmount, exactType, zeroForOne) {
        let amountRemaining = swapAmount;
        const quotes = [];
        let accumulateAmountIn = 0n;
        let accumulateAmountOut = 0n;
        const orderd = (exactType === "EXACT_IN") === zeroForOne;
        for (const quote of cachedSwapResult.quotes) {
            let amountIn = 0n;
            let amountOut = 0n;
            if (orderd) {
                const remained = amountRemaining - quote.amountIn > 0;
                amountIn = remained ? quote.amountIn : amountRemaining;
                const tickRemainedAll = amountIn === quote.amountIn;
                amountOut = tickRemainedAll
                    ? quote.amountOut
                    : (0, bigint_util_1.multipliedToBigint)(amountIn, quote.rate);
            }
            else {
                const remained = amountRemaining - quote.amountOut > 0;
                amountOut = remained ? quote.amountOut : amountRemaining;
                const tickRemainedAll = amountOut === quote.amountOut;
                amountIn = tickRemainedAll
                    ? quote.amountIn
                    : (0, bigint_util_1.multipliedToBigint)(amountOut, quote.rate);
            }
            quotes.push({
                ...quote,
                amountIn,
                amountOut,
            });
            accumulateAmountIn += amountIn;
            accumulateAmountOut += amountOut;
        }
        return {
            amountA: accumulateAmountIn,
            amountB: accumulateAmountOut,
            quotes: quotes,
            cached: true,
        };
    }
    estimateSwap(pool, swapAmount, exactType, zeroForOne) {
        const exactIn = exactType === "EXACT_IN";
        let amount = swapAmount;
        if (!exactIn) {
            const amountLimit = zeroForOne ? pool.tokenBBalance : pool.tokenABalance;
            if (amount > amountLimit) {
                amount = amountLimit;
            }
            amount *= -1n;
        }
        const swapState = {
            amountSpecifiedRemaining: amount,
            amountCalculated: 0n,
            sqrtPriceX96: BigInt(pool.sqrtPriceX96),
            tick: pool.tick,
            feeGrowthGlobalX128: 0n,
            protocolFee: 0n,
            liquidity: pool.liquidity,
        };
        const sqrtPriceLimitX96 = zeroForOne ? swap_constant_1.MIN_PRICE_X96 : swap_constant_1.MAX_PRICE_X96;
        const quotes = [];
        while (swapState.amountSpecifiedRemaining !== 0n &&
            swapState.amountSpecifiedRemaining !== -1n &&
            swapState.sqrtPriceX96 !== sqrtPriceLimitX96) {
            const quote = {
                tick0: 0,
                tick1: 0,
                amountIn: 0n,
                amountOut: 0n,
                rate: 0,
            };
            const step = {
                sqrtPriceStartX96: 0n,
                tickNext: 0,
                initialized: false,
                sqrtPriceNextX96: 0n,
                amountIn: 0n,
                amountOut: 0n,
                feeAmount: 0n,
            };
            step.sqrtPriceStartX96 = BigInt(swapState.sqrtPriceX96);
            quote.tick0 = swapState.tick;
            const { initialized, tickNext } = (0, utility_1.nextInitializedTickWithinOneWord)(pool.tickBitmaps, swapState.tick, pool.tickSpacing, zeroForOne);
            quote.tick1 = tickNext;
            step.tickNext = tickNext;
            step.initialized = initialized;
            if (step.tickNext < swap_constant_1.MIN_TICK) {
                step.tickNext = swap_constant_1.MIN_TICK;
            }
            else if (step.tickNext > swap_constant_1.MAX_TICK) {
                step.tickNext = swap_constant_1.MAX_TICK;
            }
            step.sqrtPriceNextX96 = (0, utility_1.tickToSqrtPriceX96)(step.tickNext);
            let _sqrtRatioTarget = 0n;
            const isLower = step.sqrtPriceNextX96 < sqrtPriceLimitX96;
            const isHigher = step.sqrtPriceNextX96 > sqrtPriceLimitX96;
            if ((zeroForOne && isLower) || (!zeroForOne && isHigher)) {
                _sqrtRatioTarget = sqrtPriceLimitX96;
            }
            else {
                _sqrtRatioTarget = step.sqrtPriceNextX96;
            }
            const { amountIn: computedAmountIn, amountOut: computedAmountOut, feeAmount: computedFeeAmount, sqrtRatioNextX96: computedSqrtRatioNextX96, } = (0, utility_1.computeSwapStep)(swapState.sqrtPriceX96, _sqrtRatioTarget, swapState.liquidity, swapState.amountSpecifiedRemaining, pool.fee);
            step.amountIn = computedAmountIn;
            step.amountOut = computedAmountOut;
            step.feeAmount = computedFeeAmount;
            swapState.sqrtPriceX96 = computedSqrtRatioNextX96;
            const quoteAmountSpecified = exactIn
                ? step.amountIn + step.feeAmount
                : step.amountOut * -1n;
            const quoteAmountCalculated = exactIn
                ? step.amountOut * -1n
                : step.amountIn + step.feeAmount;
            if (swapState.sqrtPriceX96 === step.sqrtPriceNextX96) {
                if (zeroForOne) {
                    swapState.tick = step.tickNext - 1;
                }
                else {
                    swapState.tick = step.tickNext;
                }
            }
            else if (swapState.sqrtPriceX96 !== step.sqrtPriceStartX96) {
                swapState.tick = (0, utility_1.sqrtPriceX96ToTick)(swapState.sqrtPriceX96);
            }
            if (quoteAmountSpecified === 0n || quoteAmountCalculated === 0n) {
                break;
            }
            if (exactIn) {
                swapState.amountSpecifiedRemaining -= step.amountIn + step.feeAmount;
                swapState.amountCalculated -= step.amountOut;
            }
            else {
                swapState.amountSpecifiedRemaining += step.amountOut;
                swapState.amountCalculated += step.amountIn + step.feeAmount;
            }
            if (exactIn === zeroForOne) {
                quote.amountIn = quoteAmountSpecified;
                quote.amountOut = quoteAmountCalculated;
            }
            else {
                quote.amountIn = quoteAmountCalculated;
                quote.amountOut = quoteAmountSpecified;
            }
            quote.rate = (0, bignumber_js_1.default)(quote.amountOut.toString())
                .dividedBy(quote.amountIn.toString())
                .toNumber();
            quotes.push(quote);
        }
        let amountA, amountB;
        if (exactIn === zeroForOne) {
            amountA = amount - swapState.amountSpecifiedRemaining;
            amountB = swapState.amountCalculated;
        }
        else {
            amountA = swapState.amountCalculated;
            amountB = amount - swapState.amountSpecifiedRemaining;
        }
        if (zeroForOne) {
            if (pool.tokenBBalance + amountB < 0) {
                amountB = pool.tokenBBalance;
            }
        }
        else {
            if (pool.tokenABalance + amountA < 0) {
                amountA = pool.tokenABalance;
            }
        }
        return {
            amountA,
            amountB,
            quotes,
            cached: false,
        };
    }
}
exports.SwapSimulator = SwapSimulator;
