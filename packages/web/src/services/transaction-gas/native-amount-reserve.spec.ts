import {
  bisectToward,
  cappedSpendable,
  describeWithheld,
  fallbackMaxNativeAmount,
  gasFeeFloor,
  isSubFeeBalance,
  OFFERED_GAS_FEE,
  planProbes,
  priceReserve,
  spendableUnder,
} from "./native-amount-reserve";
import { NativeAmountReserve } from "./transaction-gas-service";

const GAS_PRICE = 0.001;
const GAS_WANTED = 2_000_000_000;
/** The realistic fee for that ceiling: 2e9 gas at 1ugnot/1000gas. */
const REALISTIC_GAS_FEE = "2000000";
const RESERVE_BUFFER = "10000";

const plan = (balance: number) => planProbes(`${balance}`, OFFERED_GAS_FEE, GAS_WANTED, GAS_PRICE);

const reserve = (gasFee: string, storageDeposit = "0"): NativeAmountReserve => ({
  gasFee,
  storageDeposit,
  buffer: RESERVE_BUFFER,
  total: `${Number(gasFee) + Number(storageDeposit) + Number(RESERVE_BUFFER)}`,
});

describe("OFFERED_GAS_FEE", () => {
  it("is the flat fee a send path offers, in ugnot", () => {
    expect(OFFERED_GAS_FEE).toBe("1000000");
  });
});

describe("isSubFeeBalance", () => {
  it("separates a balance that could not even pay the offered fee", () => {
    expect(isSubFeeBalance("999999", OFFERED_GAS_FEE)).toBe(true);
    expect(isSubFeeBalance("1000000", OFFERED_GAS_FEE)).toBe(true);
    expect(isSubFeeBalance("1000001", OFFERED_GAS_FEE)).toBe(false);
  });
});

describe("planProbes", () => {
  it("measures a balance over the fee just below its ceiling, holding back a tenth", () => {
    // 10% of 20 GNOT is under the 5 GNOT cap, so the share applies.
    expect(plan(20_000_000)).toEqual([{ amount: "18000000", gasFee: REALISTIC_GAS_FEE }]);
  });

  it("caps the hold-back on a large balance, and keeps the wider share as a retry", () => {
    expect(plan(10_000_000_000)).toEqual([
      { amount: "9995000000", gasFee: REALISTIC_GAS_FEE },
      { amount: "9000000000", gasFee: REALISTIC_GAS_FEE },
    ]);
  });

  it("measures a balance at or under the fee at a hundredth of itself", () => {
    expect(plan(500_000)).toEqual([{ amount: "5000", gasFee: "495000" }]);
    expect(plan(1_000_000)).toEqual([{ amount: "10000", gasFee: "990000" }]);
  });

  it("offers the whole hold-back as the fee when the realistic one exceeds it", () => {
    // 10% of 3 GNOT is 0.3 GNOT, under the 2 GNOT a 2e9 ceiling would cost.
    expect(plan(3_000_000)).toEqual([{ amount: "2700000", gasFee: "300000" }]);
  });

  it("plans nothing for a balance too small to leave an amount", () => {
    expect(plan(50)).toEqual([]);
  });
});

describe("gasFeeFloor", () => {
  it("holds the offered fee as the floor once the balance can bear it", () => {
    expect(gasFeeFloor("2000000", OFFERED_GAS_FEE)).toBe(OFFERED_GAS_FEE);
  });

  it("drops the floor for a balance that could never pay it", () => {
    expect(gasFeeFloor("500000", OFFERED_GAS_FEE)).toBe("0");
  });
});

describe("priceReserve", () => {
  it("prices the fee from the measured gas, above the floor", () => {
    // 1e9 gas x 1.5 margin x 0.001 = 1_500_000 ugnot.
    const priced = priceReserve({ gasUsed: 1_000_000_000, storageDeposit: 0 }, GAS_PRICE, OFFERED_GAS_FEE);

    expect(priced.gasFee).toBe("1500000");
    expect(priced.total).toBe("1510000");
  });

  it("keeps the floor when the measured gas prices under it", () => {
    const priced = priceReserve({ gasUsed: 1_000_000, storageDeposit: 0 }, GAS_PRICE, OFFERED_GAS_FEE);

    expect(priced.gasFee).toBe(OFFERED_GAS_FEE);
  });

  it("pads the storage deposit and adds it on top", () => {
    const priced = priceReserve({ gasUsed: 1_000_000_000, storageDeposit: 200_000 }, GAS_PRICE, OFFERED_GAS_FEE);

    expect(priced.storageDeposit).toBe("300000");
    expect(priced.total).toBe("1810000");
  });
});

describe("spendableUnder", () => {
  it("is the balance less the whole reserve", () => {
    expect(spendableUnder("100000000", reserve("1500000"))).toBe("98490000");
  });
});

describe("bisectToward", () => {
  it("retreats halfway back to the amount that worked", () => {
    expect(bisectToward("95000000", "98490000")).toBe("96745000");
  });
});

describe("cappedSpendable", () => {
  it("takes the priced bound when the measurement reached higher", () => {
    // A light action on a 2 GNOT balance: the measurement held back a tenth,
    // but the floored fee leaves room for less than that.
    expect(cappedSpendable("2000000", "1800000", reserve(OFFERED_GAS_FEE))).toBe("990000");
  });

  it("takes the measured bound when the reserve would allow more", () => {
    expect(cappedSpendable("100000000", "95000000", reserve("1500000"))).toBe("95000000");
  });
});

describe("describeWithheld", () => {
  it("reports the measured costs when they account for the whole hold-back", () => {
    const described = describeWithheld("100000000", "98490000", reserve("1500000"));

    expect(described.total).toBe("1510000");
    expect(described.buffer).toBe(RESERVE_BUFFER);
  });

  it("books the unexplained remainder as buffer when the search stopped short", () => {
    const described = describeWithheld("100000000", "95000000", reserve("1500000"));

    expect(described.total).toBe("5000000");
    expect(described.buffer).toBe("3500000");
  });
});

describe("fallbackMaxNativeAmount", () => {
  it("holds back only the reserve it was given", () => {
    const fallback = fallbackMaxNativeAmount("100000000", OFFERED_GAS_FEE);

    expect(fallback).toEqual({
      amount: "99000000",
      reserve: { gasFee: "1000000", storageDeposit: "0", buffer: "0", total: "1000000" },
      simulated: false,
    });
  });

  it("offers nothing when the reserve exhausts the balance", () => {
    expect(fallbackMaxNativeAmount("500000", OFFERED_GAS_FEE).amount).toBe("0");
  });
});
