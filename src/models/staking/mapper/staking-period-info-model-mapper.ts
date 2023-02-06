import {
	StakingPeriodInfo,
	StakingPeriodListResponse,
} from "@/repositories/staking";
import {
	StakingPeriodInfoListModel,
	StakingPeriodInfoModel,
} from "../staking-period-info-model";

export class StakingPeriodInfoModelMapper {
	public static fromResponse(
		resopnse: StakingPeriodInfo,
	): StakingPeriodInfoModel {
		const { apr, period, benefits } = resopnse;

		return {
			apr,
			benefits,
			period,
		};
	}

	public static fromListResponse(
		resopnse: StakingPeriodListResponse,
	): StakingPeriodInfoListModel {
		const periods = resopnse.periods;

		return {
			periods: periods.map(StakingPeriodInfoModelMapper.fromResponse),
		};
	}
}
