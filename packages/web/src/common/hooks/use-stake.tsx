import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { StakingPeriodInfo } from "@/repositories/staking";
import { AccountState } from "@/states";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useGnoswapContext } from "./use-gnoswap-context";

export const useStake = (poolId: string) => {
	const { liquidityService, stakingService } = useGnoswapContext();

	const [address] = useRecoilState(AccountState.address);

	const [periodInfos, setPeriodInfos] = useState<Array<StakingPeriodInfo>>([]);
	const [availStakeLiquidities, setAvailStakeLiquidities] = useState<
		Array<LiquidityDetailModel>
	>([]);

	useEffect(() => {
		updatePeriodInfo();
		updateAvailStakeLiquidities();
	}, [poolId]);

	const updatePeriodInfo = () => {
		stakingService
			.getPeriodInfos(poolId)
			.then(response => response && setPeriodInfos(response.periods));
	};

	const updateAvailStakeLiquidities = () => {
		if (!address) {
			return;
		}
		liquidityService
			.getAvailStakeLiquidities(address, poolId)
			.then(
				response => response && setAvailStakeLiquidities(response.liquidities),
			);
	};

	const getSummaryLiquiditiyTokens = (liquidityIds: Array<string>) => {
		if (!address) {
			return;
		}
		const selectedLiquidities = availStakeLiquidities.filter(liquidity =>
			liquidityIds.includes(liquidity.liquidityId),
		);
		return liquidityService.getSummaryPooledByLiquidities(selectedLiquidities);
	};

	const stake = (liquidityIds: Array<string>, period: number) => {
		return stakingService.stake(liquidityIds, period);
	};

	return {
		periodInfos,
		availStakeLiquidities,
		getSummaryLiquiditiyTokens,
		stake,
	};
};
