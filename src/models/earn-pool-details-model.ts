import { StakedOptions } from "@/common/values/data-constant";
import {
	FeeOptions,
	IncentivizedOptions,
} from "./../common/values/data-constant";
export interface EarnPoolDetailsModel {
	tokenPairLogo: Array<string>;
	tokenPairName: Array<string>;
	fee: FeeOptions;
	label: IncentivizedOptions;
	liquidity: EarnPoolLiquidity;
	volumn24H: EarnPoolVolumn;
	apr: EarnPoolApr;
	myLiquidity: EarnPoolMyLiquidity;
}

interface EarnPoolLiquidity {
	usdValue: number;
	changed24h: number;
}

interface EarnPoolVolumn {
	fiatValue: number;
	changed24h: number;
}

interface EarnPoolApr {
	fiatValue: number; // fees + rewards = fiat_value
	fees: number;
	rewards: number;
}

interface EarnPoolMyLiquidity {
	totalBalance: number;
	dailyEarnings: number;
	claimableRewards: number;
	details: EarnPoolDetails;
}

interface EarnPoolDetails {
	status: StakedOptions;
	inRange: boolean;
	minPrice: number;
	maxPrice: number;
	swapFees: number;
	balance: number;
	totalRewards: number;
	stakingRewards: number;
	estimatedApr: number;
	tokenPairA: {}; // 보류
	tokenPairB: {}; // 보류
}
