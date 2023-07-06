import { useCallback, useState } from "react";
import { LiquidityDetailModel } from "@models/liquidity/liquidity-detail-model";
import { useAtom } from "jotai";
import { AccountState } from "@states/index";
import { useRepository } from "@hooks/repository/use-repository";
import { TokenDefaultModel } from "@models/token/token-default-model";
import { LiquidityModelMapper } from "@models/liquidity/mapper/liquildity-model-mapper";
import { TransactionHashModelMapper } from "@models/common/mapper/transaction-hash-model-mapper";

function addAllTokenAmounts(
  total: TokenDefaultModel,
  current: TokenDefaultModel,
) {
  {
    if (total.amount && current.amount) {
      total.amount.value = total.amount.value.plus(current.amount.value);
      return total;
    }
    return total;
  }
}

export const useRemoveLiquidity = (poolId: string) => {
  const { liquidityRepository } = useRepository();

  const [address] = useAtom(AccountState.address);

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
      const token0 = selectedLiquidities
        .map(liquidity => liquidity.liquidity.token0)
        .reduce(addAllTokenAmounts);
      const token1 = selectedLiquidities
        .map(liquidity => liquidity.liquidity.token1)
        .reduce(addAllTokenAmounts);

      return [token0, token1];
    },
    [liquidities],
  );

  const getSummaryUnclaimed = useCallback(
    (selectedIds: Array<string>) => {
      const selectedLiquidities = liquidities.filter(liquidity =>
        selectedIds.includes(liquidity.liquidityId),
      );
      const rewardSwapFeeToken0 = selectedLiquidities
        .map(liquidity => liquidity.reward.swap.token0)
        .reduce(addAllTokenAmounts);
      const rewardSwapFeeToken1 = selectedLiquidities
        .map(liquidity => liquidity.reward.swap.token1)
        .reduce(addAllTokenAmounts);

      return [rewardSwapFeeToken0, rewardSwapFeeToken1];
    },
    [liquidities],
  );

  const updateLiquidities = useCallback(async () => {
    if (!address) {
      return;
    }
    const liquidities = await liquidityRepository
      .getLiquiditiesByAddressAndPoolId(address, poolId)
      .then(LiquidityModelMapper.fromDetailListResponse);
    setLiquidities(liquidities.liquidities);
  }, [address, poolId, liquidityRepository]);

  const updateRemovableLiquidities = useCallback(() => {
    const removableLiquidities = liquidities.filter(
      liquidity =>
        liquidity.liquidityType === "PROVIDED" &&
        ["NONE", "UNSTAKED"].includes(liquidity.stakeType),
    );
    setRemovableLiquidities(removableLiquidities);
  }, [liquidities]);

  const removeLiquidities = useCallback(
    (liquidityIds: Array<string>) => {
      return liquidityRepository
        .removeLiquiditiesBy({ liquidityIds })
        .then(TransactionHashModelMapper.fromResponse);
    },
    [liquidityRepository],
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
