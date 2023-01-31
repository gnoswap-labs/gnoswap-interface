export interface PoolInfoResposne {
	token_pair_logo: Array<string>;

	token_pair_name: Array<string>;

	fee: "0.01%" | "0.05%" | "0.3%" | "1%";

	label: "Incentivized" | "Non-incentivized" | "External Incentivized";
}
