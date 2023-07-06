import {
  StakingPeriodInfo,
  StakingPeriodListResponse,
} from "@repositories/staking";
import {
  StakingPeriodInfoListModel,
  StakingPeriodInfoModel,
} from "@models/staking/staking-period-info-model";

export class StakingPeriodInfoModelMapper {
  public static fromResponse(
    response: StakingPeriodInfo,
  ): StakingPeriodInfoModel {
    const { apr, period, benefits } = response;

    return {
      apr,
      benefits,
      period,
    };
  }

  public static fromListResponse(
    response: StakingPeriodListResponse,
  ): StakingPeriodInfoListModel {
    const periods = response.periods;

    return {
      periods: periods.map(StakingPeriodInfoModelMapper.fromResponse),
    };
  }
}
