export interface PoolListModel {
	tokenPairLogo: Array<string>;
	tokenPairName: Array<string>;
	contractAddress: string;
	liquidity: number;
	volumn24h: number;
	fees24h: number;
	apr: number;
	rewards: Array<string | null>;
}
