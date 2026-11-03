import {
  applyLimitPricePreset,
  calculateAmountPerExecution,
  calculateMaxExecutionCount,
  calculateTakingAmount,
  clampExecutionCount,
  getAvailableDcaIntervals,
  getAvailableExpiryOptions,
  getDcaMinAmountPerExecution,
  getLimitMinMakingAmount,
  getOrderButtonState,
  isDcaAmountTooLow,
  isLimitAmountTooLow,
  isOrderButtonActionable,
  OrderButtonStateParams,
  stepLimitPrice,
  toLimitSlippageBps,
} from "./use-order-handler.utils";

const ready: OrderButtonStateParams = {
  connected: true,
  isSwitchNetwork: false,
  isPaused: false,
  hasTokens: true,
  amount: "100",
  balance: "1000",
  hasLiquidity: true,
  isAmountTooLow: false,
};

describe("use-order-handler.utils", () => {
  describe("getOrderButtonState", () => {
    it("places the order when every condition holds", () => {
      expect(getOrderButtonState(ready)).toBe("PLACE_ORDER");
    });

    it("checks the conditions in priority order", () => {
      const allFailing: OrderButtonStateParams = {
        connected: false,
        isSwitchNetwork: true,
        isPaused: true,
        hasTokens: false,
        amount: "",
        balance: "0",
        hasLiquidity: false,
        isAmountTooLow: true,
      };

      const expected = [
        ["connected", true, "SWITCH_NETWORK"],
        ["isSwitchNetwork", false, "ORDER_PAUSED"],
        ["isPaused", false, "SELECT_TOKEN"],
        ["hasTokens", true, "ENTER_AMOUNT"],
        ["amount", "10", "INSUFFICIENT_BALANCE"],
        ["balance", "100", "INSUFFICIENT_LIQUIDITY"],
        ["hasLiquidity", true, "AMOUNT_TOO_LOW"],
        ["isAmountTooLow", false, "PLACE_ORDER"],
      ] as const;

      let params = { ...allFailing };
      expect(getOrderButtonState(params)).toBe("WALLET_LOGIN");
      for (const [key, value, state] of expected) {
        params = { ...params, [key]: value };
        expect(getOrderButtonState(params)).toBe(state);
      }
    });

    it("treats zero and non-numeric amounts as missing", () => {
      expect(getOrderButtonState({ ...ready, amount: "0" })).toBe("ENTER_AMOUNT");
      expect(getOrderButtonState({ ...ready, amount: "0.000" })).toBe("ENTER_AMOUNT");
    });

    it("treats an unknown or comma-grouped balance correctly", () => {
      expect(getOrderButtonState({ ...ready, balance: "-" })).toBe("INSUFFICIENT_BALANCE");
      expect(getOrderButtonState({ ...ready, amount: "1500", balance: "1,541.5" })).toBe("PLACE_ORDER");
    });

    it("only lets the wallet states and the final state act", () => {
      expect(isOrderButtonActionable("WALLET_LOGIN")).toBe(true);
      expect(isOrderButtonActionable("SWITCH_NETWORK")).toBe(true);
      expect(isOrderButtonActionable("PLACE_ORDER")).toBe(true);
      expect(isOrderButtonActionable("AMOUNT_TOO_LOW")).toBe(false);
      expect(isOrderButtonActionable("ORDER_PAUSED")).toBe(false);
    });
  });

  describe("calculateMaxExecutionCount", () => {
    it("allows one execution per minAmountPerExecution raw units", () => {
      expect(calculateMaxExecutionCount("400", 1000, "100")).toBe(4);
      expect(calculateMaxExecutionCount("499", 1000, "100")).toBe(4);
      expect(calculateMaxExecutionCount("99", 1000, "100")).toBe(0);
    });

    it("never exceeds the contract's execution cap", () => {
      expect(calculateMaxExecutionCount("1000000", 1000)).toBe(1000);
      expect(calculateMaxExecutionCount("1000", 10)).toBe(10);
    });

    it("falls back to the cap without an amount", () => {
      expect(calculateMaxExecutionCount("", 1000)).toBe(1000);
      expect(calculateMaxExecutionCount("0", 1000)).toBe(1000);
    });
  });

  it("clamps Over into [2, max]", () => {
    expect(clampExecutionCount(1, 10)).toBe(2);
    expect(clampExecutionCount(20, 10)).toBe(10);
    expect(clampExecutionCount(5.7, 10)).toBe(5);
    expect(clampExecutionCount(5, 1)).toBe(2);
  });

  describe("calculateAmountPerExecution", () => {
    it("floors the per-execution amount and drops the remainder", () => {
      expect(calculateAmountPerExecution("1000", 3)).toBe("333");
      expect(calculateAmountPerExecution("150000000000", 200)).toBe("750000000");
    });

    it("keeps precision beyond 2^53", () => {
      expect(calculateAmountPerExecution("90071992547409930", 3)).toBe("30023997515803310");
    });

    it("returns zero for empty input", () => {
      expect(calculateAmountPerExecution("", 3)).toBe("0");
      expect(calculateAmountPerExecution("100", 0)).toBe("0");
    });
  });

  it("flags orders under the realms' raw minimums", () => {
    expect(isDcaAmountTooLow("1", "1")).toBe(false);
    expect(isDcaAmountTooLow("0", "1")).toBe(true);
    expect(isDcaAmountTooLow("99", "100")).toBe(true);
    expect(isLimitAmountTooLow("100", "1", "100")).toBe(false);
    expect(isLimitAmountTooLow("99", "1", "100")).toBe(true);
    expect(isLimitAmountTooLow("100", "0", "100")).toBe(true);
  });

  it("converts slippage to basis points capped at 10%", () => {
    expect(toLimitSlippageBps(0.5)).toBe(50);
    expect(toLimitSlippageBps(10)).toBe(1000);
    expect(toLimitSlippageBps(30)).toBe(1000);
    expect(toLimitSlippageBps(0)).toBe(0);
  });

  it("computes the taking amount in raw output units", () => {
    expect(calculateTakingAmount("3000000", "1.2716", { decimals: 6 }, { decimals: 6 })).toBe("3814800");
    expect(calculateTakingAmount("1000000", "0.5", { decimals: 6 }, { decimals: 8 })).toBe("50000000");
    expect(calculateTakingAmount("1", "0.5", { decimals: 0 }, { decimals: 0 })).toBe("0");
  });

  it("steps and presets the limit price", () => {
    expect(stepLimitPrice("1.2716", 1)).toBe("1.27287");
    expect(stepLimitPrice("1.2716", -1)).toBe("1.27032");
    expect(applyLimitPricePreset("2", 5)).toBe("2.1");
    expect(applyLimitPricePreset("2", 10)).toBe("2.2");
  });

  it("only offers intervals the config allows", () => {
    expect(getAvailableDcaIntervals([{ interval: 60 }, { interval: 86400 }]).map(item => item.unit)).toEqual([
      "minute",
      "day",
    ]);
    expect(getAvailableDcaIntervals(undefined)).toHaveLength(5);
  });

  it("filters expiry options by the configured duration range", () => {
    expect(getAvailableExpiryOptions(300, 2592000).map(item => item.key)).toEqual([
      "oneHour",
      "oneDay",
      "oneWeek",
      "thirtyDays",
    ]);
    expect(getAvailableExpiryOptions(7200, 604800).map(item => item.key)).toEqual(["oneDay", "oneWeek"]);
  });

  describe("native GNOT wrap minimum", () => {
    it("raises the limit minimum to the wrap minimum for native GNOT only", () => {
      expect(getLimitMinMakingAmount("100", true, 1000)).toBe("1000");
      expect(getLimitMinMakingAmount("5000", true, 1000)).toBe("5000");
      expect(getLimitMinMakingAmount("100", false, 1000)).toBe("100");
      expect(isLimitAmountTooLow("500", "500", getLimitMinMakingAmount("100", true, 1000))).toBe(true);
    });

    it("requires the native GNOT DCA deposit to reach the wrap minimum", () => {
      // 2 executions × 500 = 1000 is the smallest deposit that can be wrapped.
      expect(getDcaMinAmountPerExecution("1", true, 2, 1000)).toBe("500");
      expect(getDcaMinAmountPerExecution("1", true, 3, 1000)).toBe("334");
      expect(getDcaMinAmountPerExecution("1000", true, 3, 1000)).toBe("1000");
      expect(getDcaMinAmountPerExecution("1", false, 2, 1000)).toBe("1");
      expect(isDcaAmountTooLow("499", getDcaMinAmountPerExecution("1", true, 2, 1000))).toBe(true);
      expect(isDcaAmountTooLow("500", getDcaMinAmountPerExecution("1", true, 2, 1000))).toBe(false);
    });
  });
});
