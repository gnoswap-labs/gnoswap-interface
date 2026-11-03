import BigNumber from "bignumber.js";

import { TokenModel } from "@models/token/token-model";

import { formatPrice } from "./new-number-utils";
import { makeDisplayTokenAmount, makeDisplayTokenAmountString, makeRawTokenAmount } from "./token-utils";

/**
 * Regression test for the swap "Max" flow.
 *
 * Reproduction (dev.gnoswap, address g17290cwvmrapvp869xfnhhawa8sm9edpufzat7d):
 * - on-chain USDC balance: 62667447936264477 (raw, 6 decimals)
 * - the raw value exceeds Number.MAX_SAFE_INTEGER, so `Number(amount)` rounds it up to ...480
 * - clicking Max then requested 3 raw units more than the wallet held and the router
 *   rejected the swap with "[GNOSWAP-ROUTER-018] insufficient balance for swap".
 */
const USDC = { decimals: 6 } as TokenModel;
const ON_CHAIN_RAW_BALANCE = "62667447936264477";

/** Mirrors the "Max" button: formatted balance -> input value -> raw amount sent on-chain. */
function maxAmountRaw(displayBalance: string | number | null) {
  const formattedBalance = formatPrice(displayBalance, { isKMB: false, usd: false, greaterThan1Decimals: 6 });
  const inputValue = BigNumber(formattedBalance.replace(/,/g, "")).toFixed();
  return makeRawTokenAmount(USDC, inputValue);
}

describe("swap Max with a balance above Number.MAX_SAFE_INTEGER", () => {
  it("raw balance is outside the safe integer range", () => {
    expect(BigNumber(ON_CHAIN_RAW_BALANCE).isGreaterThan(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it("reproduces the bug: the number-based display amount requests more than the balance", () => {
    const displayBalance = makeDisplayTokenAmount(USDC, Number(ON_CHAIN_RAW_BALANCE));

    // parseFloat/Number rounding pushes the balance up to ...480
    expect(BigNumber(maxAmountRaw(displayBalance)!).isGreaterThan(ON_CHAIN_RAW_BALANCE)).toBe(true);
  });

  it("string-based display amount keeps every digit of the raw balance", () => {
    expect(makeDisplayTokenAmountString(USDC, ON_CHAIN_RAW_BALANCE)).toBe("62667447936.264477");
  });

  it("fixed flow: Max never requests more than the on-chain balance", () => {
    const displayBalance = makeDisplayTokenAmountString(USDC, ON_CHAIN_RAW_BALANCE);
    const requested = maxAmountRaw(displayBalance);

    expect(BigNumber(requested!).isLessThanOrEqualTo(ON_CHAIN_RAW_BALANCE)).toBe(true);
    expect(requested).toBe(ON_CHAIN_RAW_BALANCE);
  });

  it("parseFloat on the formatted balance loses precision, BigNumber does not", () => {
    const formatted = "62,667,447,936.264477";

    expect(parseFloat(formatted.replace(/,/g, "")).toString()).not.toBe("62667447936.264477");
    expect(BigNumber(formatted.replace(/,/g, "")).toFixed()).toBe("62667447936.264477");
  });

  it("makeDisplayTokenAmountString handles empty and invalid input", () => {
    expect(makeDisplayTokenAmountString(USDC, null)).toBeNull();
    expect(makeDisplayTokenAmountString(USDC, "")).toBeNull();
    expect(makeDisplayTokenAmountString(USDC, "abc")).toBeNull();
    expect(makeDisplayTokenAmountString(USDC, 1000000)).toBe("1");
  });
});
