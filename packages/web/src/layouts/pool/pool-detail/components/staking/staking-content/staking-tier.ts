import { PoolDetailModel } from "@models/pool/pool-detail-model";

const DAY_SECONDS = 24 * 60 * 60;

export type StakingTierKind = "warmup" | "max";

export interface StakingTier {
  key: string;
  kind: StakingTierKind;
  period: number;
  endPeriod: number;
  rate: number;
  durationSeconds: number;
  endDurationSeconds: number;
}

const secondsToDays = (seconds: number) => Number((seconds / DAY_SECONDS).toFixed(2));

export const buildStakingTiers = (pool: PoolDetailModel | null): StakingTier[] => {
  const warmupConfigs = [...(pool?.warmupConfigs ?? [])].sort((left, right) => left.percentage - right.percentage);
  const warmupTierConfigs = warmupConfigs.filter(config => config.percentage < 100 && config.durationSeconds > 0);
  const maxTierConfig = warmupConfigs.find(config => config.percentage >= 100);
  let endDurationSeconds = 0;

  const warmupTiers = warmupTierConfigs.map((config, index): StakingTier => {
    endDurationSeconds += config.durationSeconds;

    return {
      key: `warmup-${index}-${config.percentage}`,
      kind: "warmup",
      period: secondsToDays(config.durationSeconds),
      endPeriod: secondsToDays(endDurationSeconds),
      rate: config.percentage / 100,
      durationSeconds: config.durationSeconds,
      endDurationSeconds,
    };
  });

  return [
    ...warmupTiers,
    {
      key: "max",
      kind: "max",
      period: endDurationSeconds > 0 ? secondsToDays(endDurationSeconds) : 0,
      endPeriod: -1,
      rate: (maxTierConfig?.percentage ?? 100) / 100,
      durationSeconds: maxTierConfig?.durationSeconds ?? 0,
      endDurationSeconds,
    },
  ];
};

export const getStakingTierKey = (tiers: StakingTier[], stakedAt: string) => {
  const differenceSeconds = (new Date().getTime() - new Date(stakedAt).getTime()) / 1000;
  const maxTier = tiers.find(tier => tier.kind === "max") ?? tiers[tiers.length - 1];

  for (const tier of tiers) {
    if (tier.kind === "max") {
      continue;
    }

    if (tier.endDurationSeconds > 0 && differenceSeconds < tier.endDurationSeconds) {
      return tier.key;
    }
  }

  return maxTier.key;
};
