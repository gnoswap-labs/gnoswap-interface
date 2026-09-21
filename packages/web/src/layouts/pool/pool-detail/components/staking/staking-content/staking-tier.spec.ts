import { PoolDetailModel } from "@models/pool/pool-detail-model";

import { buildStakingTiers } from "./staking-tier";

describe("buildStakingTiers", () => {
  it("sorts configuration and accumulates segment durations", () => {
    const pool = {
      warmupConfigs: [
        { percentage: 100, durationSeconds: Number.MAX_SAFE_INTEGER },
        { percentage: 70, durationSeconds: 30 * 86400 },
        { percentage: 30, durationSeconds: 5 * 86400 },
        { percentage: 50, durationSeconds: 10 * 86400 },
      ],
    } as PoolDetailModel;

    expect(buildStakingTiers(pool)).toEqual([
      expect.objectContaining({ kind: "warmup", rate: 0.3, period: 5, endPeriod: 5 }),
      expect.objectContaining({ kind: "warmup", rate: 0.5, period: 10, endPeriod: 15 }),
      expect.objectContaining({ kind: "warmup", rate: 0.7, period: 30, endPeriod: 45 }),
      expect.objectContaining({ kind: "max", rate: 1, endDurationSeconds: 45 * 86400 }),
    ]);
  });
});
