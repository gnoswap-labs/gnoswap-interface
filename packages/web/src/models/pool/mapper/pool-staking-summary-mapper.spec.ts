import { PoolStakingSummaryMapper } from "./pool-staking-summary-mapper";

describe("PoolStakingSummaryMapper", () => {
  it("maps warmup tiers to staking periods with staked ratios", () => {
    const result = PoolStakingSummaryMapper.fromResponse({
      poolPath: "gno.land/r/demo/wugnot:gno.land/r/gnoswap/gns:3000",
      totalStakedUsd: "1000",
      totalStakedCount: 10,
      tiers: [
        { warmupPercent: 100, stakedUsd: "600", stakedCount: 4 },
        { warmupPercent: 30, stakedUsd: "100", stakedCount: 3 },
        { warmupPercent: 50, stakedUsd: "100", stakedCount: 1 },
        { warmupPercent: 70, stakedUsd: "200", stakedCount: 2 },
      ],
    });

    expect(result.totalStakedUsd).toBe(1000);
    expect(result.totalPositionCount).toBe(10);
    expect(result.tiers).toEqual([
      { period: "5D", stakedUsd: 100, positionCount: 3, stakedRatio: 0.1 },
      { period: "10D", stakedUsd: 100, positionCount: 1, stakedRatio: 0.1 },
      { period: "30D", stakedUsd: 200, positionCount: 2, stakedRatio: 0.2 },
      { period: "MAX", stakedUsd: 600, positionCount: 4, stakedRatio: 0.6 },
    ]);
  });

  it("fills missing tiers with zero values", () => {
    const result = PoolStakingSummaryMapper.fromResponse({
      poolPath: "gno.land/r/demo/wugnot:gno.land/r/gnoswap/gns:3000",
      totalStakedUsd: "0",
      totalStakedCount: 0,
      tiers: [],
    });

    expect(result.tiers.map(tier => tier.period)).toEqual(["5D", "10D", "30D", "MAX"]);
    expect(result.tiers.every(tier => tier.stakedUsd === 0 && tier.positionCount === 0 && tier.stakedRatio === 0)).toBe(
      true,
    );
  });
});
