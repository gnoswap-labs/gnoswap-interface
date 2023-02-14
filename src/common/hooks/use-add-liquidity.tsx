import { ChartTick, PoolChartModel } from "@/models/pool/pool-chart-model";
import { SwapConfirmModel } from "@/models/swap/swap-confirm-model";
import { TokenPairModel } from "@/models/token/token-pair-model";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";

interface Props {
	liquidity: TokenPairModel;
	options: {
		rangeType: "ACTIVE" | "PASSIVE" | "CUSTOM";
		feeRate: number;
		minRate: number;
		maxRate: number;
	};
}

export const useAddLiquidity = ({ liquidity, options }: Props) => {
	const { poolService, liquidityService } = useGnoswapContext();

	const [chartData, setChartData] = useState<PoolChartModel>();
	const [inRange, setInRange] = useState<boolean>(false);

	const currnetTick = chartData?.current;

	useEffect(() => {
		updateChartData();
	}, [liquidity]);

	useEffect(() => {
		updateInRange();
	}, [chartData]);

	const updateInRange = () => {
		if (!currnetTick) {
			return false;
		}
		const { minRate, maxRate } = options;
		const inRange = currnetTick <= minRate && currnetTick >= maxRate;
		setInRange(inRange);
	};

	const addLiquidity = () => {
		liquidityService.addLiquidity(liquidity, options);
	};

	const updateChartData = () => {
		poolService
			.getPoolChartByTokenPair(liquidity)
			.then(response => response && setChartData(response));
	};

	return {
		inRange,
		currnetTick,
		addLiquidity,
	};
};
