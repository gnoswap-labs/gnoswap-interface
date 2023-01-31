export interface AddLiquidityRequest {
	pair0: {
		symbol: string;
		logo: string;
		amount: number;
	};
	pair1: {
		symbol: string;
		logo: string;
		amount: number;
	};
	feeTier: "0.01%" | "0.05%" | "0.3%" | "1%";
	priceRange: "active" | "passive" | "custom";
	minPrice: number;
	maxPrice: number;
	apr: number;
}
