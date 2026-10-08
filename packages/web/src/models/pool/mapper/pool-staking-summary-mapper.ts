import { STAKING_PERIOD_INFO, STAKING_PERIOS } from "@constants/option.constant";
import { PoolStakingSummaryResponse } from "@repositories/pool/response/pool-staking-summary-response";

import { PoolStakingSummaryModel } from "../pool-staking-summary";

export class PoolStakingSummaryMapper {
  public static fromResponse(response: PoolStakingSummaryResponse): PoolStakingSummaryModel {
    const totalStakedUsd = Number(response.totalStakedUsd) || 0;

    const tiers = STAKING_PERIOS.map(period => {
      const warmupPercent = Math.round(STAKING_PERIOD_INFO[period].rate * 100);
      const tier = response.tiers?.find(item => item.warmupPercent === warmupPercent);
      const stakedUsd = Number(tier?.stakedUsd) || 0;

      return {
        period,
        stakedUsd,
        positionCount: tier?.stakedCount || 0,
        stakedRatio: totalStakedUsd > 0 ? stakedUsd / totalStakedUsd : 0,
      };
    });

    return {
      totalStakedUsd,
      totalPositionCount: response.totalStakedCount || 0,
      tiers,
    };
  }
}
