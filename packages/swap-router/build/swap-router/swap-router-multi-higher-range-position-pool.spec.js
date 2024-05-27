"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_util_1 = require("../common/array.util");
const mapper_1 = require("../common/mapper");
const swap_router_1 = require("./swap-router");
const multiPositionPools = (0, mapper_1.makePoolsByRPC)([
    {
        pool_path: "gno.land/r/bar:gno.land/r/baz:500",
        token0_path: "gno.land/r/bar",
        token1_path: "gno.land/r/baz",
        fee: 500,
        token0_balance: 10002942,
        token1_balance: 7999,
        tick_spacing: 10,
        max_liquidity_per_tick: 103951672670308,
        sqrt_price_x96: 130621891405341611593710811006,
        tick: 9999,
        fee_protocol: 0,
        token0_protocol_fee: 0,
        token1_protocol_fee: 0,
        liquidity: 50992,
        ticks: [8000, 12000, 14000, 16000],
        tick_bitmaps: {
            "3": 4294967296,
            "4": 95780971304118053647396689196894323976171195136475136,
            "5": 1329227995784915872903807060280344576,
            "6": 18446744073709551616,
        },
        positions: [
            {
                owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
                tick_lower: 8000,
                tick_upper: 12000,
                liquidity: 50992,
                token0_owed: 0,
                token1_owed: 0,
            },
            {
                owner: "g1htpxzv2dkplvzg50nd8fswrneaxmdpwn459thx",
                tick_lower: 14000,
                tick_upper: 16000,
                liquidity: 211614473,
                token0_owed: 0,
                token1_owed: 0,
            },
        ],
    },
]);
describe("swap router of higher range positions pool", () => {
    describe("gno.land/r/bar to gno.land/r/baz", () => {
        test("EXANCT_IN, 100000", async () => {
            const swapRouter = new swap_router_1.SwapRouter(multiPositionPools);
            const estimatedRoutes = swapRouter.estimateSwapRoute("gno.land/r/bar", "gno.land/r/baz", 10000n, "EXACT_IN");
            const sumAmount = (0, array_util_1.sumBigInts)(estimatedRoutes.map(route => route.amountOut));
            expect(estimatedRoutes).toHaveLength(1);
            expect(estimatedRoutes[0].routeKey).toBe("gno.land/r/bar:gno.land/r/baz:500");
            expect(estimatedRoutes[0].quote).toBe(100);
            expect(sumAmount).toBe(7999n);
        });
        test("EXACT_OUT, 100000", async () => {
            const swapRouter = new swap_router_1.SwapRouter(multiPositionPools);
            const estimatedRoutes = swapRouter.estimateSwapRoute("gno.land/r/bar", "gno.land/r/baz", 10000n, "EXACT_OUT");
            const sumAmount = (0, array_util_1.sumBigInts)(estimatedRoutes.map(route => route.amountOut));
            expect(estimatedRoutes).toHaveLength(1);
            expect(estimatedRoutes[0].routeKey).toBe("gno.land/r/bar:gno.land/r/baz:500");
            expect(estimatedRoutes[0].quote).toBe(100);
            expect(sumAmount).toBe(3253n);
        });
    });
    describe("gno.land/r/baz to gno.land/r/bar", () => {
        test("EXANCT_IN, 100000", async () => {
            const swapRouter = new swap_router_1.SwapRouter(multiPositionPools);
            const estimatedRoutes = swapRouter.estimateSwapRoute("gno.land/r/baz", "gno.land/r/bar", 10000n, "EXACT_IN");
            const sumAmount = (0, array_util_1.sumBigInts)(estimatedRoutes.map(route => route.amountOut));
            expect(estimatedRoutes).toHaveLength(1);
            expect(estimatedRoutes[0].routeKey).toBe("gno.land/r/bar:gno.land/r/baz:500");
            expect(estimatedRoutes[0].quote).toBe(100);
            expect(sumAmount).toBe(3285n);
        });
        test("EXACT_OUT, 100000", async () => {
            const swapRouter = new swap_router_1.SwapRouter(multiPositionPools);
            const estimatedRoutes = swapRouter.estimateSwapRoute("gno.land/r/baz", "gno.land/r/bar", 10000n, "EXACT_OUT");
            const sumAmount = (0, array_util_1.sumBigInts)(estimatedRoutes.map(route => route.amountOut));
            expect(estimatedRoutes).toHaveLength(1);
            expect(estimatedRoutes[0].routeKey).toBe("gno.land/r/bar:gno.land/r/baz:500");
            expect(estimatedRoutes[0].quote).toBe(100);
            expect(sumAmount).toBe(40204n);
        });
    });
});
