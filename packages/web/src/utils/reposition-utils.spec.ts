import BigNumber from "bignumber.js";

import { TokenModel } from "@models/token/token-model";

import { tickToSqrtPriceX96 } from "./math.utils";
import {
  getRepositionAmountsByPriceRange,
  getRepositionAmountsWithSwapSimulation,
  makeRepositionSwapAmounts,
  makeRepositionSwapEstimateRequest,
} from "./reposition-utils";
import { priceToTick } from "./swap-utils";
import { makeDisplayTokenAmountString, makeRawTokenAmount } from "./token-utils";

const createToken = (symbol: string, decimals = 6): TokenModel => ({
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  type: "GRC20",
  chainId: "dev.gnoswap",
  name: symbol,
  symbol,
  displaySymbol: symbol,
  decimals,
  logoURI: "",
  createdAt: "2026-05-19T00:00:00Z",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
});

const tokenA = createToken("USDC");
const tokenB = createToken("ATOM");

// On-chain USDC balance (raw 62667447936264477, 6 decimals) that exceeds Number.MAX_SAFE_INTEGER
const LARGE_RAW_BALANCE = "62667447936264477";
const LARGE_BALANCE = "62667447936.264477";

const currentPrice = 1;
const sqrtPriceX96 = tickToSqrtPriceX96(priceToTick(currentPrice));

describe("reposition amounts precision", () => {
  it("Number() rounds the reported balance (why the string path is required)", () => {
    expect(Number(LARGE_BALANCE).toString()).not.toBe(LARGE_BALANCE);
  });

  it("getRepositionAmountsByPriceRange keeps a large balance exact when the range is unchanged", () => {
    const amounts = getRepositionAmountsByPriceRange(currentPrice, sqrtPriceX96, 0.5, 2, 0.5, 2, LARGE_BALANCE, "10");

    expect(amounts.amountA).toBe(LARGE_BALANCE);
    expect(amounts.amountB).toBe("10");
  });

  it("route request carries the exact remainder of a large balance", () => {
    const currentAmounts = {
      amountA: makeDisplayTokenAmountString(tokenA, LARGE_RAW_BALANCE)!,
      amountB: "0",
    };
    // The new range needs 1 raw unit less of token A than the current position holds
    const target = { amountA: "62667447936.264476", amountB: "0" };

    const request = makeRepositionSwapEstimateRequest(tokenA, tokenB, currentAmounts, target);

    expect(request.inputToken).toBe(tokenA);
    expect(request.exactType).toBe("EXACT_IN");
    expect(request.tokenAmount).toBe("0.000001");
    expect(makeRawTokenAmount(tokenA, request.tokenAmount!)).toBe("1");
  });

  it("route request carries the exact large balance when everything must be swapped", () => {
    const currentAmounts = { amountA: LARGE_BALANCE, amountB: "0" };
    const target = { amountA: "0", amountB: "1" };

    const request = makeRepositionSwapEstimateRequest(tokenA, tokenB, currentAmounts, target);

    expect(request.tokenAmount).toBe(LARGE_BALANCE);
    expect(makeRawTokenAmount(tokenA, request.tokenAmount!)).toBe(LARGE_RAW_BALANCE);
  });

  it("returns null when there is nothing to swap", () => {
    const amounts = { amountA: "1", amountB: "1" };

    expect(makeRepositionSwapEstimateRequest(tokenA, tokenB, amounts, amounts).tokenAmount).toBeNull();
  });

  it("swap request uses the exact large balance and string limits", () => {
    const currentAmounts = { amountA: LARGE_BALANCE, amountB: "0" };
    const estimated = { amountA: "0", amountB: "1" };

    const exactIn = makeRepositionSwapAmounts(
      { inputToken: tokenA, outputToken: tokenB, exactType: "EXACT_IN" },
      true,
      currentAmounts,
      estimated,
      0.5,
    );
    expect(exactIn.tokenAmount).toBe(LARGE_BALANCE);
    expect(makeRawTokenAmount(tokenA, exactIn.tokenAmount)).toBe(LARGE_RAW_BALANCE);
    expect(exactIn.tokenAmountLimit).toBe("0.995");

    const exactOut = makeRepositionSwapAmounts(
      { inputToken: tokenA, outputToken: tokenB, exactType: "EXACT_OUT" },
      true,
      currentAmounts,
      { amountA: "0", amountB: "0.000001" },
      0.5,
    );
    expect(exactOut.tokenAmount).toBe("0.000001");
    // maximum input is rounded up: 62667447936.264477 * 1.005 = 62980785175.945799385
    expect(exactOut.tokenAmountLimit).toBe("62980785175.9458");
  });

  it("swap simulation adds the swap output to a large balance without number rounding", () => {
    const currentAmounts = { amountA: "0", amountB: LARGE_BALANCE };
    const initial = { amountA: "0", amountB: "1" };

    const amounts = getRepositionAmountsWithSwapSimulation(
      currentPrice,
      sqrtPriceX96,
      0.5,
      2,
      tokenA,
      tokenB,
      currentAmounts,
      initial,
      tokenA,
      "1",
    );

    expect(amounts.amountA).toBe("0");
    expect(amounts.amountB).toBe(BigNumber(LARGE_BALANCE).plus("0.000001").toFixed());
  });
});
