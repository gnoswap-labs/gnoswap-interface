import BigNumber from "bignumber.js";
import { MAX_TICK, MIN_PRICE_X96, MIN_TICK } from "../constants/swap.constant";
import { Pool, SwapResult } from "./swap-simulator.types";
import {
  computeSwapStep,
  sqrtPriceX96ToTick,
  tickBitmapNextInitializedTickWithInOneWord,
  tickToSqrtPriceX96,
} from "./utility";
import { makeCacheKey } from "./utility/cache.util";

export class SwapSimulator {
  private _cache: { [key in string]: SwapResult | null };

  constructor() {
    this._cache = {};
  }

  public swap(
    pool: Pool,
    swapAmount: bigint,
    exactType: "EXACT_IN" | "EXACT_OUT",
    zeroForOne: boolean,
  ): SwapResult {
    const cacheKey = makeCacheKey(pool, exactType, zeroForOne);
    const cachedSwapResult = this._cache[cacheKey];
    if (cachedSwapResult) {
      let amountRemaining = swapAmount;
      const quotes: {
        tick0: number;
        tick1: number;
        amountIn: bigint;
        amountOut: bigint;
        rate: number;
      }[] = [];
      let accumulateAmountIn = 0n;
      let accumulateAmountOut = 0n;
      for (const quote of cachedSwapResult.quotes) {
        const amountIn =
          amountRemaining - quote.amountIn > 0
            ? quote.amountIn
            : amountRemaining;
        const amountOut =
          quote.amountIn > 0
            ? quote.amountOut
            : BigInt(
                BigNumber(amountIn.toString())
                  .multipliedBy(quote.rate)
                  .toFixed(0),
              );
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
      };
    }

    const amount = exactType === "EXACT_IN" ? swapAmount : -1n * swapAmount;
    const exactIn = amount >= 0;
    const swapState = {
      amountSpecifiedRemaining: amount,
      amountCalculated: 0n,
      sqrtPriceX96: BigInt(pool.sqrtPriceX96),
      tick: pool.tick,
      feeGrowthGlobalX128: BigInt(
        exactIn ? pool.feeGrowthGlobal0X128 : pool.feeGrowthGlobal1X128,
      ),
      protocolFee: 0n,
      liquidity: pool.liquidity,
    };

    const sqrtPriceLimitX96 = MIN_PRICE_X96;

    const quotes: {
      tick0: number;
      tick1: number;
      amountIn: bigint;
      amountOut: bigint;
      rate: number;
    }[] = [];

    while (
      swapState.amountSpecifiedRemaining !== 0n &&
      swapState.amountSpecifiedRemaining !== -1n &&
      swapState.sqrtPriceX96 !== sqrtPriceLimitX96
    ) {
      const quote = {
        tick0: 0,
        tick1: 0,
        amountIn: 0n,
        amountOut: 0n,
        rate: 0,
      };
      const step: {
        sqrtPriceStartX96: bigint;
        tickNext: number;
        initialized: boolean;
        sqrtPriceNextX96: bigint;
        amountIn: bigint;
        amountOut: bigint;
        feeAmount: bigint;
      } = {
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
      const {
        initialized,
        tickNext,
      } = tickBitmapNextInitializedTickWithInOneWord(
        pool.tickBitmaps,
        swapState.tick,
        pool.tickSpacing,
        zeroForOne,
      );
      quote.tick1 = tickNext;
      step.tickNext = tickNext;
      step.initialized = initialized;

      if (step.tickNext < MIN_TICK) {
        step.tickNext = MIN_TICK;
      } else if (step.tickNext > MAX_TICK) {
        step.tickNext = MAX_TICK;
      }

      step.sqrtPriceNextX96 = tickToSqrtPriceX96(step.tickNext);
      let _sqrtRatioTarget = 0n;
      const isLower = step.sqrtPriceNextX96 < sqrtPriceLimitX96;
      const isHigher = step.sqrtPriceNextX96 > sqrtPriceLimitX96;
      if ((zeroForOne && isLower) || (!zeroForOne && isHigher)) {
        _sqrtRatioTarget = sqrtPriceLimitX96;
      } else {
        _sqrtRatioTarget = step.sqrtPriceNextX96;
      }

      const {
        amountIn: computedAmountIn,
        amountOut: computedAmountOut,
        feeAmount: computedFeeAmount,
        sqrtRatioNextX96: computedSqrtRatioNextX96,
      } = computeSwapStep(
        swapState.sqrtPriceX96,
        _sqrtRatioTarget,
        swapState.liquidity,
        swapState.amountSpecifiedRemaining,
        pool.fee,
      );
      step.amountIn = computedAmountIn;
      step.amountOut = computedAmountOut;
      step.feeAmount = computedFeeAmount;
      swapState.sqrtPriceX96 = computedSqrtRatioNextX96;

      if (swapState.sqrtPriceX96 === step.sqrtPriceNextX96) {
        if (zeroForOne) {
          swapState.tick = step.tickNext - 1;
        } else {
          swapState.tick = step.tickNext;
        }
      } else if (swapState.sqrtPriceX96 !== step.sqrtPriceStartX96) {
        swapState.tick = sqrtPriceX96ToTick(swapState.sqrtPriceX96);
      }

      if (exactIn) {
        swapState.amountSpecifiedRemaining -= step.amountIn + step.feeAmount;
        swapState.amountCalculated -= step.amountOut;
      } else {
        swapState.amountSpecifiedRemaining += step.amountOut;
        swapState.amountCalculated += step.amountIn + step.feeAmount;
      }

      // Caclulate accumulate quotes
      const previousQuote =
        quotes.length > 0
          ? quotes[quotes.length - 1]
          : {
              tick0: 0,
              tick1: 0,
              amountIn: 0n,
              amountOut: 0n,
              rate: 1,
            };
      const quoteAmountA =
        zeroForOne === exactIn
          ? step.amountIn + step.feeAmount
          : step.amountOut;
      const quoteAmountB =
        zeroForOne === exactIn
          ? step.amountOut
          : step.amountIn + step.feeAmount;
      quote.amountIn = previousQuote.amountIn + quoteAmountA;
      quote.amountOut = previousQuote.amountOut + quoteAmountB;
      quote.rate = BigNumber(quote.amountOut.toString())
        .dividedBy(quote.amountIn.toString())
        .toNumber();
      quotes.push(quote);
    }

    let amountA, amountB;
    if (zeroForOne === exactIn) {
      amountA = amount - swapState.amountSpecifiedRemaining;
      amountB = swapState.amountCalculated;
    } else {
      amountA = swapState.amountCalculated;
      amountB = amount - swapState.amountSpecifiedRemaining;
    }

    const swapResult: SwapResult = {
      amountA,
      amountB,
      quotes,
    };
    this._cache[cacheKey] = swapResult;
    return swapResult;
  }
}
