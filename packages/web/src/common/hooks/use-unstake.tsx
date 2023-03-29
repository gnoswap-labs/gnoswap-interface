import { useState } from "react";
import { useRecoilState } from "recoil";
import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { AccountState } from "@/states";
import { useGnoswapContext } from "./use-gnoswap-context";

export const useUnstake = (poolId: string) => {
  const { liquidityService, stakingService } = useGnoswapContext();

  const [address] = useRecoilState(AccountState.address);

  const [availUnstakeLiquidities, setAvailUnstakeLiquidities] = useState<
    Array<LiquidityDetailModel>
  >([]);

  const updateAvailUnstakeLiquidities = () => {
    if (!address) {
      return;
    }
    liquidityService
      .getAvailUnstakeLiquidities(address, poolId)
      .then(
        response =>
          response && setAvailUnstakeLiquidities(response.liquidities),
      );
  };

  const getSummaryLiquiditiyTokens = (liquidityIds: Array<string>) => {
    if (!address) {
      return;
    }
    const selectedLiquidities = availUnstakeLiquidities.filter(liquidity =>
      liquidityIds.includes(liquidity.liquidityId),
    );
    return liquidityService.getSummaryPooledByLiquidities(selectedLiquidities);
  };

  const getSummaryRewardTokens = (liquidityIds: Array<string>) => {
    if (!address) {
      return;
    }
    const selectedLiquidities = availUnstakeLiquidities.filter(liquidity =>
      liquidityIds.includes(liquidity.liquidityId),
    );
    return liquidityService.getSummaryUnclaimedByLiquidities(
      selectedLiquidities,
    );
  };

  const unstake = (liquidityIds: Array<string>) => {
    return stakingService.unstake(liquidityIds);
  };

  return {
    availUnstakeLiquidities,
    getSummaryLiquiditiyTokens,
    getSummaryRewardTokens,
    updateAvailUnstakeLiquidities,
    unstake,
  };
};
