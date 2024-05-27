"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swap_simulator_1 = require("./swap-simulator");
const pools = [
    {
        poolPath: "gno.land/r/bar:gno.land/r/baz:500",
        tokenAPath: "gno.land/r/bar",
        tokenBPath: "gno.land/r/baz",
        fee: 500,
        tokenABalance: 9937690n,
        tokenBBalance: 10943746n,
        tickSpacing: 10,
        maxLiquidityPerTick: 103951672670308,
        price: 1.2904451607773892,
        sqrtPriceX96: 102239599540632204908365252323n,
        tick: 5099,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 291453167n,
        ticks: [4000, 6000, 5000],
        tickBitmaps: {
            "1": "28269553036454149273332760011908996998438272973151439048218347582187896832",
            "2": "309485009821345068724781056",
        },
        positions: [
            {
                liquidity: 144812895n,
                owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
                tickLower: 4000,
                tickUpper: 6000,
                tokenAOwed: 0n,
                tokenBOwed: 0n,
            },
            {
                liquidity: 146640272n,
                owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
                tickLower: 5000,
                tickUpper: 6000,
                tokenAOwed: 0n,
                tokenBOwed: 0n,
            },
        ],
    },
    {
        poolPath: "gno.land/r/bar:gno.land/r/baz:500",
        tokenAPath: "gno.land/r/bar",
        tokenBPath: "gno.land/r/baz",
        fee: 500,
        tokenABalance: 14999998n,
        tokenBBalance: 7928816n,
        tickSpacing: 10,
        maxLiquidityPerTick: 103951672670308,
        price: 61395992977183231206166123286,
        sqrtPriceX96: 61395992977183231206166123286n,
        tick: -5101,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 150155071n,
        ticks: [-7000, -3000, -6000, -4000],
        tickBitmaps: {
            "-2": "6582018229284824168619876730234594316789478290162849949723656192",
            "-3": "374144419156711147060143317175663600937098083827712",
        },
        positions: [
            {
                owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
                tickLower: -7000,
                tickUpper: -3000,
                liquidity: 77748624n,
                tokenAOwed: 0n,
                tokenBOwed: 0n,
            },
            {
                owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
                tickLower: -6000,
                tickUpper: -4000,
                liquidity: 72406447n,
                tokenAOwed: 0n,
                tokenBOwed: 0n,
            },
        ],
    },
];
describe("estimateSwap - positive ticks", () => {
    test("exanct_in, zerForOne, 10000 is -16643", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_IN";
        const amount = 10000n;
        const result = swap.estimateSwap(pools[0], amount, exactType, true);
        expect(result?.amountA).toBe(10000n);
        expect(result?.amountB).toBe(-16643n);
    });
    test("exanct_out, zerForOne, 10000 is -9999n", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_OUT";
        const amount = 10000n;
        const result = swap.estimateSwap(pools[0], amount, exactType, true);
        expect(result?.amountA).toBe(6008n);
        expect(result?.amountB).toBe(-9999n);
    });
    test("exanct_in, not zerForOne, 10000 is 10000, -6001", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_IN";
        const amount = 10000n;
        const result = swap.estimateSwap(pools[0], amount, exactType, false);
        expect(result?.amountA).toBe(-6001n);
        expect(result?.amountB).toBe(10000n);
    });
    test("exanct_out, not zerForOne, 10000 is 16661, -9999", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_OUT";
        const amount = 10000n;
        const result = swap.estimateSwap(pools[0], amount, exactType, false);
        expect(result?.amountA).toBe(-9999n);
        expect(result?.amountB).toBe(16661n);
    });
});
describe("estimateSwap - negative ticks", () => {
    const pool = pools[1];
    test("exanct_in, zerForOne, 10000 is -6001n", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_IN";
        const amount = 10000n;
        const result = swap.estimateSwap(pool, amount, exactType, true);
        expect(result?.amountA).toBe(10000n);
        expect(result?.amountB).toBe(-6001n);
    });
    test("exanct_out, zerForOne, 10000 is -9999n", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_OUT";
        const amount = 10000n;
        const result = swap.estimateSwap(pool, amount, exactType, true);
        expect(result?.amountA).toBe(16661n);
        expect(result?.amountB).toBe(-9999n);
    });
    test("exanct_in, not zerForOne, 10000 is 10000, -16642", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_IN";
        const amount = 10000n;
        const result = swap.estimateSwap(pool, amount, exactType, false);
        expect(result?.amountA).toBe(-16642n);
        expect(result?.amountB).toBe(10000n);
    });
    test("exanct_out, not zerForOne, 10000 is 16661, -9999", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_OUT";
        const amount = 10000n;
        const result = swap.estimateSwap(pool, amount, exactType, false);
        expect(result?.amountA).toBe(-9999n);
        expect(result?.amountB).toBe(6008n);
    });
});
describe("swap - positive ticks", () => {
    const pool = pools[0];
    test("exanct_in, zerForOne, 10000 is -16643", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_IN";
        const amount = 10000n;
        const result = swap.swap(pool, pool.tokenAPath, amount, exactType);
        expect(result?.amountA).toBe(10000n);
        expect(result?.amountB).toBe(-16643n);
    });
    test("exanct_out, zerForOne, 10000 is -9999n", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_OUT";
        const amount = 10000n;
        const result = swap.swap(pool, pool.tokenAPath, amount, exactType);
        expect(result?.amountA).toBe(6008n);
        expect(result?.amountB).toBe(-9999n);
    });
    test("exanct_in, not zerForOne, 10000 is 10000, -6001", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_IN";
        const amount = 10000n;
        const result = swap.swap(pool, pool.tokenBPath, amount, exactType);
        expect(result?.amountA).toBe(-6001n);
        expect(result?.amountB).toBe(10000n);
    });
    test("exanct_out, not zerForOne, 10000 is 16661, -9999", async () => {
        const swap = new swap_simulator_1.SwapSimulator();
        const exactType = "EXACT_OUT";
        const amount = 10000n;
        const result = swap.swap(pool, pool.tokenBPath, amount, exactType);
        expect(result?.amountA).toBe(-9999n);
        expect(result?.amountB).toBe(16661n);
    });
});
