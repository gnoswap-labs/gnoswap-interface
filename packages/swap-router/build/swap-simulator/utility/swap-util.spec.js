"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swap_util_1 = require("./swap.util");
describe("getAmountADeltaHelper", () => {
    test("101729702841318637793976746270 102239599540632204908365252323 291453167 to 1132044", () => {
        const sqrtRatioAX96 = 101729702841318637793976746270n;
        const sqrtRatioBX96 = 102239599540632204908365252323n;
        const liquidity = 291453167n;
        const amountADelta = (0, swap_util_1.getAmountADeltaHelper)(sqrtRatioAX96, sqrtRatioBX96, liquidity);
        expect(amountADelta).toBe(1132044n);
    });
    test("102238694644218148006501407317 102239599540632204908365252323 291453167 to 1999", () => {
        const sqrtRatioAX96 = 102238694644218148006501407317n;
        const sqrtRatioBX96 = 102239599540632204908365252323n;
        const liquidity = 291453167n;
        const amountADelta = (0, swap_util_1.getAmountADeltaHelper)(sqrtRatioAX96, sqrtRatioBX96, liquidity);
        expect(amountADelta).toBe(1999n);
    });
    test("102194374333486824640548361395 102239599540632204908365252323 291453167 to 99950", () => {
        const sqrtRatioAX96 = 102194374333486824640548361395n;
        const sqrtRatioBX96 = 102239599540632204908365252323n;
        const liquidity = 291453167n;
        const amountADelta = (0, swap_util_1.getAmountADeltaHelper)(sqrtRatioAX96, sqrtRatioBX96, liquidity);
        expect(amountADelta).toBe(99950n);
    });
    test("102212415700658949672612901089 102239599540632204908365252323 291453167 to 99950", () => {
        const sqrtRatioAX96 = 102212415700658949672612901089n;
        const sqrtRatioBX96 = 102239599540632204908365252323n;
        const liquidity = 291453167n;
        const amountADelta = (0, swap_util_1.getAmountADeltaHelper)(sqrtRatioAX96, sqrtRatioBX96, liquidity);
        expect(amountADelta).toBe(60067n);
    });
});
describe("getAmountBDeltaHelper", () => {
    test("101729702841318637793976746270 102239599540632204908365252323 291453167 to 1875734", () => {
        const sqrtRatioAX96 = 101729702841318637793976746270n;
        const sqrtRatioBX96 = 102239599540632204908365252323n;
        const liquidity = 291453167n;
        const amountADelta = (0, swap_util_1.getAmountBDeltaHelper)(sqrtRatioAX96, sqrtRatioBX96, liquidity);
        expect(amountADelta).toBe(1875734n);
    });
    test("102212415700658949672612901089 102239599540632204908365252323 291453167 to 99999", () => {
        const sqrtRatioAX96 = 102212415700658949672612901089n;
        const sqrtRatioBX96 = 102239599540632204908365252323n;
        const liquidity = 291453167n;
        const amountADelta = (0, swap_util_1.getAmountBDeltaHelper)(sqrtRatioAX96, sqrtRatioBX96, liquidity);
        expect(amountADelta).toBe(99999n);
    });
});
describe("getNextSqrtPriceFromInput", () => {
    test("102239599540632204908365252323 291453167 99950 is 102194374333486824640548361395", async () => {
        const sqrtRatioAX96 = 102239599540632204908365252323n;
        const sqrtRatioBX96 = 291453167n;
        const liquidity = 99950n;
        const zeroForOne = true;
        const result = (0, swap_util_1.getNextSqrtPriceFromInput)(sqrtRatioAX96, sqrtRatioBX96, liquidity, zeroForOne);
        expect(result).toBe(102194374333486824640548361395n);
    });
});
describe("getNextSqrtPriceFromOutput", () => {
    test("102239599540632204908365252323 291453167 99950 is 102194374333486824640548361395", async () => {
        const sqrtRatioAX96 = 102239599540632204908365252323n;
        const sqrtRatioBX96 = 291453167n;
        const liquidity = 100000n;
        const zeroForOne = true;
        const result = (0, swap_util_1.getNextSqrtPriceFromOutput)(sqrtRatioAX96, sqrtRatioBX96, liquidity, zeroForOne);
        expect(result).toBe(102212415700658949672612901089n);
    });
});
describe("computeSwapStep", () => {
    test("exanct_out, 100000 is 60067", async () => {
        const sqrtRatioCurrentX96 = 102239599540632204908365252323n;
        const sqrtRatioTargetX96 = 101729702841318637793976746270n;
        const liquidity = 291453167n;
        const amountRemaining = -100000n;
        const fee = 500;
        const result = (0, swap_util_1.computeSwapStep)(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, fee);
        expect(result.amountIn).toBe(60067n);
        expect(result.amountOut).toBe(99999n);
        expect(result.sqrtRatioNextX96).toBe(102212415700658949672612901089n);
        expect(result.feeAmount).toBe(30n);
    });
});
