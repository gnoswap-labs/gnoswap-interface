import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { TokenPairModel } from "@/models/token/token-pair-model";
import { AccountState } from "@/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
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

export const useRemoveLiquidity = (poolId: string) => {
	const { liquidityService } = useGnoswapContext();

	const [address] = useRecoilState(AccountState.address);

	const [liquidities, setLiquidities] = useState<Array<LiquidityDetailModel>>(
		[],
	);
	const [removableLiquidities, setRemovableLiquidities] = useState<
		Array<LiquidityDetailModel>
	>([]);

	useEffect(() => {
		updateLiquidities();
	}, [poolId]);

	useEffect(() => {
		updateRemovableLiquidities();
	}, [liquidities]);

	const getSummaryPooled = (selectedIds: Array<string>) => {
		const selectedLiquidities = liquidities.filter(liquidity =>
			selectedIds.includes(liquidity.liquidityId),
		);
		return liquidityService.getSummaryPooledByLiquidities(selectedLiquidities);
	};

	const getSummaryUnclaimed = (selectedIds: Array<string>) => {
		const selectedLiquidities = liquidities.filter(liquidity =>
			selectedIds.includes(liquidity.liquidityId),
		);
		return liquidityService.getSummaryUnclaimedByLiquidities(
			selectedLiquidities,
		);
	};

	const updateLiquidities = () => {
		if (!address) {
			return;
		}
		liquidityService
			.getLiquiditiesByAddressAndPoolId(address, poolId)
			.then(response => response && setLiquidities(response.liquidities));
	};

	const updateRemovableLiquidities = () => {
		const removableLiquidities = liquidities.filter(
			liquidity =>
				liquidity.liquidityType === "PROVIDED" &&
				["NONE", "UNSTAKED"].includes(liquidity.stakeType),
		);
		setRemovableLiquidities(removableLiquidities);
	};

	const removeLiquidities = (removeLiquidityIds: Array<string>) => {
		return liquidityService.removeLiquidities(removeLiquidityIds);
	};

	return {
		liquidities,
		removableLiquidities,
		removeLiquidities,
		getSummaryPooled,
		getSummaryUnclaimed,
	};
};
