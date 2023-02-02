import { TokenPairModel } from "./../token/token-pair-model";
import { StakedOptions } from "@/common/values/data-constant";

export interface AprStakingDaysDetailModel {
	staking_days: Array<AprStakingDaysDetailType>;
}

interface AprStakingDaysDetailType {
	staking_id: string;
	period: number;
	stake_type: StakedOptions;
	unstaked_at: string | null;
	token_pair: TokenPairModel;
}
