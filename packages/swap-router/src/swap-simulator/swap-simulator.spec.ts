import { SwapSimulator } from "./swap-simulator";
import { Pool } from "./swap-simulator.types";

const pools: Pool[] = [
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
    feeGrowthGlobal0X128: 0,
    feeGrowthGlobal1X128: 0,
    tokenAProtocolFee: 0,
    tokenBProtocolFee: 0,
    liquidity: 291453167n,
    ticks: [4000, 6000, 5000],
    tickBitmaps: {
      "1":
        "28269553036454149273332760011908996998438272973151439048218347582187896832",
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
];

describe("swap simulator", () => {
  test("exanct_in, 100000 is 166367", async () => {
    const swap = new SwapSimulator();
    const exactType = "EXACT_IN";
    const amount = 100000n;

    const result = swap.swap(pools[0], amount, exactType, true);
    expect(result?.amountA).toBe(100000n);
    expect(result?.amountB).toBe(-166367n);
  });

  test("exanct_out, 100000 is 60097", async () => {
    const swap = new SwapSimulator();
    const exactType = "EXACT_OUT";
    const amount = 100000n;

    const result = swap.swap(pools[0], amount, exactType, true);
    expect(result?.amountA).toBe(60097n);
    expect(result?.amountB).toBe(-99999n);
  });
});
