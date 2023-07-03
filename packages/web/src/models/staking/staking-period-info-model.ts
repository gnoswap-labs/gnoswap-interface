export interface StakingPeriodInfoListModel {
  periods: Array<StakingPeriodInfoModel>;
}

export interface StakingPeriodInfoModel {
  period: number;

  apr: number;

  benefits: Array<string>;
}
