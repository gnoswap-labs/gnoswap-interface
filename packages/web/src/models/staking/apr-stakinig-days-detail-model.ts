import { TokenPairInfo } from "@models/token/token-pair-info";
import { StakedOptions } from "@common/values/data-constant";

export interface AprStakingDaysDetailModel {
  stakingDays: Array<AprStakingDaysDetailType>;
}

interface AprStakingDaysDetailType {
  stakingId: string;
  period: number;
  stakeType: StakedOptions;
  unstakedAt: string | null;
  tokenPair: TokenPairInfo;
}
