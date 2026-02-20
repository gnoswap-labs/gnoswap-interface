/* eslint-disable @typescript-eslint/no-explicit-any */
import { tickToSqrtPriceX96 } from "./math.utils";
import {
  BroadcastMessageData,
  feeBoostByPrices,
  feeBoostRateByPrices,
  getSwappedTokenData,
  isEndTickBy,
  priceToNearTick,
  priceToSqrtX96,
  priceToTick,
  SwapResponse,
  tickToPrice,
} from "./swap-utils";

describe("tick convert to price", () => {
  test("0 to 1", () => {
    const tick = 0;
    expect(tickToPrice(tick)).toBe(1);
  });

  test("10000 to 2.718145926825225", () => {
    const tick = 10000;
    expect(tickToPrice(tick)).toBe(2.718145926825225);
  });

  test("10001 to 2.7184177414179076", () => {
    const tick = 10001;
    expect(tickToPrice(tick)).toBe(2.7184177414179076);
  });

  test("100000 to 22015.456048552198", () => {
    const tick = 100000;
    expect(tickToPrice(tick)).toBe(22015.456048552198);
  });
});

describe("tick convert to sqrtPriceX96", () => {
  test("-5120 to 61334630738499455555414115609", () => {
    const tick = -5120;
    expect(tickToSqrtPriceX96(tick).toString()).toBe("61334630738499455555414115609");
  });

  test("10000 to 2.718145926825225", () => {
    const tick = 10000;
    expect(tickToPrice(tick)).toBe(2.718145926825225);
  });

  test("10001 to 2.7184177414179076", () => {
    const tick = 10001;
    expect(tickToPrice(tick)).toBe(2.7184177414179076);
  });

  test("100000 to 22015.456048552198", () => {
    const tick = 100000;
    expect(tickToPrice(tick)).toBe(22015.456048552198);
  });
});

describe("price convert to tick", () => {
  test("1 to 0", () => {
    const price = 1;
    expect(priceToTick(price)).toBe(0);
  });

  test("1.6486800559311758 to 5000", () => {
    const price = 1.6486800559311758;
    expect(priceToTick(price)).toBe(5000);
  });

  test("1.6487624878732252 to 5001", () => {
    const price = 1.6487624878732252;
    expect(priceToTick(price)).toBe(5001);
  });

  test("0.60651549714 to -5001", () => {
    const price = 0.60651549714;
    expect(priceToTick(price)).toBe(-5001);
  });

  test("priceToTick(0) returns 0 instead of -Infinity", () => {
    expect(priceToTick(0)).toBe(0);
    expect(Number.isFinite(priceToTick(0))).toBe(true);
  });

  test("priceToTick(-1) returns 0 instead of NaN", () => {
    expect(priceToTick(-1)).toBe(0);
    expect(Number.isNaN(priceToTick(-1))).toBe(false);
  });
});

describe("price convert to near tick", () => {
  test("1 to 0", () => {
    const price = 1;
    const tickSpacing = 1;
    expect(priceToNearTick(price, tickSpacing)).toBe(0);
  });

  test("1.6486800559311758 to 5002", () => {
    const price = 1.6489273641220126;
    const tickSpacing = 1;
    expect(priceToNearTick(price, tickSpacing)).toBe(5002);
  });

  test("0.60651549714 to -5001", () => {
    const price = 0.60651549714;
    const tickSpacing = 1;
    expect(priceToNearTick(price, tickSpacing)).toBe(-5001);
  });

  test("0.60651549714 to -5004", () => {
    const price = 0.60651549714;
    const tickSpacing = 4;
    expect(priceToNearTick(price, tickSpacing)).toBe(-5000);
  });
});

describe("fee boost by prices", () => {
  test("0 ~ 2 tick price to 20001.50", () => {
    const minTick = 0;
    const maxTick = 2;
    const minPrice = tickToPrice(minTick);
    const maxPrice = tickToPrice(maxTick);
    const feeBoost = feeBoostRateByPrices(minPrice, maxPrice);
    expect(feeBoost).toBe("20001.50");
  });

  test("Active, 0.3050333395159978 ~ 0.9151000185479934 tick price to 4.16", () => {
    // current price: 0.6100666790319956
    const minPrice = 0.3050333395159978;
    const maxPrice = 0.9151000185479934;
    const feeBoost = feeBoostRateByPrices(minPrice, maxPrice);
    expect(feeBoost).toBe("4.16");
  });

  test("Passive, 0.3050333395159978 ~ 1.2201333580639913 tick price to 3.41", () => {
    // current price: 0.6100666790319956
    const minPrice = 0.3050333395159978;
    const maxPrice = 1.2201333580639913;
    const feeBoost = feeBoostRateByPrices(minPrice, maxPrice);
    expect(feeBoost).toBe("3.41");
  });

  test("0.8976, 1.1041 to 19.82", () => {
    const feeBoost = feeBoostRateByPrices(0.8976, 1.1041);
    expect(feeBoost).toBe("19.82");
  });

  test("feeBoostByPrices(1, 1) returns null (same min/max causes Infinity)", () => {
    expect(feeBoostByPrices(1, 1)).toBeNull();
  });

  test("feeBoostByPrices(0, 0) returns null", () => {
    expect(feeBoostByPrices(0, 0)).toBeNull();
  });
});

describe("priceToSqrtX96 edge cases", () => {
  test("priceToSqrtX96(0) returns 0n", () => {
    expect(priceToSqrtX96(0)).toBe(0n);
  });

  test("priceToSqrtX96(-1) returns 0n", () => {
    expect(priceToSqrtX96(-1)).toBe(0n);
  });
});

describe("determine end tick", () => {
  test("tick -887272 and fee 100 is end tick", () => {
    const tick = -887272;
    const fee = "100";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 887272 and fee 100 is end tick", () => {
    const tick = 887272;
    const fee = "100";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 0 and fee 100 is not end tick", () => {
    const tick = 0;
    const fee = "100";
    expect(isEndTickBy(tick, fee)).toBeFalsy();
  });

  test("tick -887270 and fee 500 is end tick", () => {
    const tick = -887270;
    const fee = "500";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 887270 and fee 500 is end tick", () => {
    const tick = 887270;
    const fee = "500";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 0 and fee 500 is not end tick", () => {
    const tick = 0;
    const fee = "500";
    expect(isEndTickBy(tick, fee)).toBeFalsy();
  });

  test("tick -887220 and fee 3000 is end tick", () => {
    const tick = -887220;
    const fee = "3000";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 887220 and fee 3000 is end tick", () => {
    const tick = 887220;
    const fee = "3000";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 0 and fee 3000 is not end tick", () => {
    const tick = 0;
    const fee = "3000";
    expect(isEndTickBy(tick, fee)).toBeFalsy();
  });

  test("tick -887200 and fee 10000 is end tick", () => {
    const tick = -887200;
    const fee = "10000";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 887200 and fee 10000 is end tick", () => {
    const tick = 887200;
    const fee = "10000";
    expect(isEndTickBy(tick, fee)).toBeTruthy();
  });

  test("tick 0 and fee 10000 is not end tick", () => {
    const tick = 0;
    const fee = "10000";
    expect(isEndTickBy(tick, fee)).toBeFalsy();
  });
});

describe("getSwappedTokenData()", () => {
  const mockBroadcastMessage: BroadcastMessageData = {
    tokenASymbol: "GNOT",
    tokenBSymbol: "USDC",
    tokenAAmount: "100",
    tokenBAmount: "200",
  };

  describe("ExactInSwap", () => {
    it("should return original token order", () => {
      const response: SwapResponse = ["150", "300"];

      const result = getSwappedTokenData(mockBroadcastMessage, true, response);

      expect(result).toEqual({
        token0Symbol: "GNOT",
        token1Symbol: "USDC",
        token0Amount: "150",
        token1Amount: "300",
      });
    });
  });

  describe("ExactOutSwap", () => {
    it("should return swapped token order", () => {
      const response: SwapResponse = ["150", "300"];

      const result = getSwappedTokenData(mockBroadcastMessage, false, response);

      expect(result).toEqual({
        token0Symbol: "USDC",
        token1Symbol: "GNOT",
        token0Amount: "300",
        token1Amount: "150",
      });
    });

    it("should maintain correct symbol-amount relationship when swapped", () => {
      const response: SwapResponse = ["100", "200"];

      const result = getSwappedTokenData(mockBroadcastMessage, false, response);

      // When ExactOutSwap, token0 should be original tokenB
      expect(result.token0Symbol).toBe("USDC");
      expect(result.token0Amount).toBe("200"); // response[1]

      // And token1 should be original tokenA
      expect(result.token1Symbol).toBe("GNOT");
      expect(result.token1Amount).toBe("100"); // response[0]
    });
  });

  describe("edge cases", () => {
    it("should handle empty response array", () => {
      const response: SwapResponse = [];

      const result = getSwappedTokenData(mockBroadcastMessage, true, response);

      expect(result).toEqual({
        token0Symbol: "GNOT",
        token1Symbol: "USDC",
        token0Amount: "0", // default value
        token1Amount: "0", // default value
      });
    });

    it("should handle response array with only one element", () => {
      const response: SwapResponse = ["150"];

      const result = getSwappedTokenData(mockBroadcastMessage, true, response);

      expect(result).toEqual({
        token0Symbol: "GNOT",
        token1Symbol: "USDC",
        token0Amount: "150",
        token1Amount: "0", // default value for missing element
      });
    });

    it("should handle null/undefined response", () => {
      const result1 = getSwappedTokenData(mockBroadcastMessage, true, null as any);
      const result2 = getSwappedTokenData(mockBroadcastMessage, true, undefined as any);

      const expectedResult = {
        token0Symbol: "GNOT",
        token1Symbol: "USDC",
        token0Amount: "0",
        token1Amount: "0",
      };

      expect(result1).toEqual(expectedResult);
      expect(result2).toEqual(expectedResult);
    });

    it("should handle response with undefined elements", () => {
      const response: SwapResponse = [undefined as any, "300"];

      const result = getSwappedTokenData(mockBroadcastMessage, true, response);

      expect(result).toEqual({
        token0Symbol: "GNOT",
        token1Symbol: "USDC",
        token0Amount: "0", // default value for undefined
        token1Amount: "300",
      });
    });
  });

  describe("consistency validation", () => {
    it("should maintain token0/token1 relationship across different isExactIn values", () => {
      const response: SwapResponse = ["100", "200"];

      const exactInResult = getSwappedTokenData(mockBroadcastMessage, true, response);
      const exactOutResult = getSwappedTokenData(mockBroadcastMessage, false, response);

      // When isExactIn=true: token0 gets response[0], token1 gets response[1]
      expect(exactInResult.token0Amount).toBe("100"); // response[0]
      expect(exactInResult.token1Amount).toBe("200"); // response[1]

      // When isExactIn=false: token0 gets response[1], token1 gets response[0]
      expect(exactOutResult.token0Amount).toBe("200"); // response[1]
      expect(exactOutResult.token1Amount).toBe("100"); // response[0]

      // Symbols should be swapped accordingly
      expect(exactInResult.token0Symbol).toBe(mockBroadcastMessage.tokenASymbol);
      expect(exactInResult.token1Symbol).toBe(mockBroadcastMessage.tokenBSymbol);
      expect(exactOutResult.token0Symbol).toBe(mockBroadcastMessage.tokenBSymbol);
      expect(exactOutResult.token1Symbol).toBe(mockBroadcastMessage.tokenASymbol);
    });
  });
});
