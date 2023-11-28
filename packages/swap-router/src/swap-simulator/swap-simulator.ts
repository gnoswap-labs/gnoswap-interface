import BigNumber from "bignumber.js";
import { multipliedToBigint } from "../common/bigint.util";
import {
  MAX_PRICE_X96,
  MAX_TICK,
  MIN_PRICE_X96,
  MIN_TICK,
} from "../constants/swap.constant";
import { Pool, SwapResult } from "./swap-simulator.types";
import {
  computeSwapStep,
  sqrtPriceX96ToTick,
  nextInitializedTickWithinOneWord,
  tickToSqrtPriceX96,
} from "./utility";
import { makeCacheKey } from "./utility/cache.util";

export class SwapSimulator {
  private isCache;

  private _cache: { [key in string]: SwapResult | null };

  constructor() {
    this.isCache = false;
    this._cache = {};
  }

  public getSwapCache(
    pool: Pool,
    swapAmount: bigint,
    exactType: "EXACT_IN" | "EXACT_OUT",
    zeroForOne: boolean,
  ): SwapResult | null {
    if (!this.isCache) {
      return null;
    }
    const cacheKey = makeCacheKey(pool, exactType, zeroForOne);
    const cachedSwapResult = this._cache[cacheKey];
    if (!cachedSwapResult) {
      return null;
    }
    let compareAmount =
      (exactType === "EXACT_IN") === zeroForOne
        ? cachedSwapResult.amountA
        : cachedSwapResult.amountB;
    compareAmount = compareAmount >= 0 ? compareAmount : compareAmount * -1n;

    if (swapAmount > compareAmount) {
      return null;
    }

    return cachedSwapResult;
  }

  public swap(
    pool: Pool,
    fromTokenPath: string,
    swapAmount: bigint,
    exactType: "EXACT_IN" | "EXACT_OUT",
  ): SwapResult {
    const zeroForOne = pool.tokenAPath === fromTokenPath;
    const cacheKey = makeCacheKey(pool, exactType, zeroForOne);

    const cachedSwapResult = this.getSwapCache(
      pool,
      swapAmount,
      exactType,
      zeroForOne,
    );
    if (cachedSwapResult) {
      return this.estimateCacheSwap(
        cachedSwapResult,
        swapAmount,
        exactType,
        zeroForOne,
      );
    }
    const swapResult = this.estimateSwap(
      pool,
      swapAmount,
      exactType,
      zeroForOne,
    );
    this._cache[cacheKey] = swapResult;
    return swapResult;
  }

  public estimateCacheSwap(
    cachedSwapResult: SwapResult,
    swapAmount: bigint,
    exactType: "EXACT_IN" | "EXACT_OUT",
    zeroForOne: boolean,
  ) {
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
          : multipliedToBigint(amountIn, quote.rate);
      } else {
        const remained = amountRemaining - quote.amountOut > 0;
        amountOut = remained ? quote.amountOut : amountRemaining;

        const tickRemainedAll = amountOut === quote.amountOut;
        amountIn = tickRemainedAll
          ? quote.amountIn
          : multipliedToBigint(amountOut, quote.rate);
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

  public estimateSwap(
    pool: Pool,
    swapAmount: bigint,
    exactType: "EXACT_IN" | "EXACT_OUT",
    zeroForOne: boolean,
  ): SwapResult {
    const amount = exactType === "EXACT_IN" ? swapAmount : -1n * swapAmount;
    const exactIn = amount >= 0;
    const swapState = {
      amountSpecifiedRemaining: amount,
      amountCalculated: 0n,
      sqrtPriceX96: BigInt(pool.sqrtPriceX96),
      tick: pool.tick,
      feeGrowthGlobalX128: 0n,
      protocolFee: 0n,
      liquidity: pool.liquidity,
    };

    const sqrtPriceLimitX96 = zeroForOne ? MIN_PRICE_X96 : MAX_PRICE_X96;

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
      const { initialized, tickNext } = nextInitializedTickWithinOneWord(
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

      const quoteAmountSpecified = exactIn
        ? step.amountIn + step.feeAmount
        : step.amountOut * -1n;
      const quoteAmountCalculated = exactIn
        ? step.amountOut * -1n
        : step.amountIn + step.feeAmount;
      if (exactIn === zeroForOne) {
        quote.amountIn = quoteAmountSpecified;
        quote.amountOut = quoteAmountCalculated;
      } else {
        quote.amountIn = quoteAmountCalculated;
        quote.amountOut = quoteAmountSpecified;
      }
      quote.rate = BigNumber(quote.amountOut.toString())
        .dividedBy(quote.amountIn.toString())
        .toNumber();
      quotes.push(quote);
    }

    let amountA, amountB;
    if (exactIn === zeroForOne) {
      amountA = amount - swapState.amountSpecifiedRemaining;
      amountB = swapState.amountCalculated;
    } else {
      amountA = swapState.amountCalculated;
      amountB = amount - swapState.amountSpecifiedRemaining;
    }

    if (zeroForOne) {
      if (pool.tokenBBalance + amountB < 0) {
        amountB = pool.tokenBBalance;
      }
    } else {
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
