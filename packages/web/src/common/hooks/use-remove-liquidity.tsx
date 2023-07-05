import { useCallback, useState } from "react";
import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useAtom } from "jotai";
import { AccountAtom } from "@atoms/index";

export const useRemoveLiquidity = (poolId: string) => {
  const { liquidityService } = useGnoswapContext();

  const [address] = useAtom(AccountAtom.address);

  const [liquidities, setLiquidities] = useState<Array<LiquidityDetailModel>>(
    [],
  );
  const [removableLiquidities, setRemovableLiquidities] = useState<
    Array<LiquidityDetailModel>
  >([]);

  const getSummaryPooled = useCallback(
    (selectedIds: Array<string>) => {
      const selectedLiquidities = liquidities.filter(liquidity =>
        selectedIds.includes(liquidity.liquidityId),
      );
      return liquidityService.getSummaryPooledByLiquidities(
        selectedLiquidities,
      );
    },
    [liquidities, liquidityService],
  );

  const getSummaryUnclaimed = useCallback(
    (selectedIds: Array<string>) => {
      const selectedLiquidities = liquidities.filter(liquidity =>
        selectedIds.includes(liquidity.liquidityId),
      );
      return liquidityService.getSummaryUnclaimedByLiquidities(
        selectedLiquidities,
      );
    },
    [liquidities, liquidityService],
  );

  const updateLiquidities = useCallback(() => {
    if (!address) {
      return;
    }
    liquidityService
      .getLiquiditiesByAddressAndPoolId(address, poolId)
      .then(response => response && setLiquidities(response.liquidities));
  }, [address, poolId, liquidityService]);

  const updateRemovableLiquidities = useCallback(() => {
    const removableLiquidities = liquidities.filter(
      liquidity =>
        liquidity.liquidityType === "PROVIDED" &&
        ["NONE", "UNSTAKED"].includes(liquidity.stakeType),
    );
    setRemovableLiquidities(removableLiquidities);
  }, [liquidities]);

  const removeLiquidities = useCallback(
    (removeLiquidityIds: Array<string>) => {
      return liquidityService.removeLiquidities(removeLiquidityIds);
    },
    [liquidityService],
  );

  return {
    liquidities,
    updateLiquidities,
    updateRemovableLiquidities,
    removableLiquidities,
    removeLiquidities,
    getSummaryPooled,
    getSummaryUnclaimed,
  };
};
