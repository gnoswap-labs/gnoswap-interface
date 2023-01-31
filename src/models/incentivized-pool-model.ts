import { FeeOptions } from "./../common/values/data-constant";
export interface IncentivizedPoolModel {
	tokenPairLogo: Array<string>;
	tokenPairName: Array<string>;
	fee: FeeOptions;
	liquidity: number;
	apr: number;
	tradingVolumn24h: number;
	fees24h: number;
}
