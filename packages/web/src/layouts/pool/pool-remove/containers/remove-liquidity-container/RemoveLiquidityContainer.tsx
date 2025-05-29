import React, { useCallback, useMemo, useState } from "react";
import BigNumber from "bignumber.js";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";

import RemoveLiquidity from "../../components/remove-liquidity/RemoveLiquidity";
import { useRemovePositionModal } from "@hooks/pool/ui/use-remove-position-modal";

const RemoveLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  const { connected } = useWallet();
  const [isGetWGNOT, setIsGetWGNOT] = useState(false);
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const [checkedList, setCheckedList] = useState<number[]>(positionId ? [Number(positionId)] : []);
  const {
    positions: allPosition,
    loading: isLoadingPositions,
    refetch: refetchPositions,
  } = usePositionData({
    isClosed: false,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const positionList: PoolPositionModel[] = useMemo(() => {
    if (!allPosition) return [];

    return allPosition.map((position: PoolPositionModel) => {
      return {
        ...position,
        tokenABalance: String(makeDisplayTokenAmount(position.pool.tokenA, position.tokenABalance || 0)),
        tokenBBalance: String(makeDisplayTokenAmount(position.pool.tokenB, position.tokenBBalance || 0)),

        claimedRewards: position.claimedRewards.map(reward => {
          return {
            ...reward,
            claimedAmount: String(makeDisplayTokenAmount(reward.rewardToken, reward.claimedAmount || 0) ?? 0),
          };
        }),
        rewards: position.rewards.map(reward => {
          const rewardToken = reward.rewardToken;

          return {
            ...reward,
            accuReward1D: String(makeDisplayTokenAmount(rewardToken, reward.accuReward1D || 0) ?? 0),
            claimableAmount: String(makeDisplayTokenAmount(rewardToken, reward.claimableAmount || 0) ?? 0),
            totalAmount: String(makeDisplayTokenAmount(rewardToken, reward.totalAmount || 0) ?? 0),
          };
        }),
      };
    });
  }, [allPosition]);

  const stakedPositions = useMemo(() => {
    if (!connected) return [];
    return positionList.filter(position => position.poolPath === poolPath && position.staked);
  }, [positionList, connected]);

  const unstakedPositions = useMemo(() => {
    if (!connected) return [];
    return positionList.filter(position => position.poolPath === poolPath && !position.staked);
  }, [positionList, connected, poolPath]);

  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position => checkedList.includes(position.id));
  }, [checkedList, unstakedPositions]);

  const positionLiquidities = useMemo(() => {
    const liquidityMap: { [key: string]: BigNumber } = {};

    selectedPositions.forEach(position => {
      liquidityMap[position.lpTokenId] = BigNumber(position.liquidity.toString());
    });
    return liquidityMap;
  }, [selectedPositions]);

  const { openModal } = useRemovePositionModal({
    positions: positionList,
    positionLiquidities,
    selectedIds: checkedList,
    isGetWGNOT,
    refetchPositions: async () => {
      await refetchPositions();
    },
  });

  const checkedAll = useMemo(() => {
    if (unstakedPositions.length === 0) {
      return false;
    }
    return unstakedPositions.length === checkedList.length;
  }, [unstakedPositions, checkedList]);

  const onCheckedItem = useCallback(
    (isChecked: boolean, id: number) => {
      if (isChecked) {
        return setCheckedList((prev: number[]) => [...prev, id]);
      }
      if (!isChecked && checkedList.includes(id)) {
        return setCheckedList(checkedList.filter(el => el !== id));
      }
    },
    [checkedList],
  );

  const onCheckedAll = useCallback(() => {
    if (checkedAll) {
      setCheckedList([]);
      return;
    }
    const checkedList = unstakedPositions.map(position => position.id);
    setCheckedList(checkedList);
  }, [checkedAll, unstakedPositions]);

  const removeLiquidity = useCallback(() => {
    openModal();
  }, [openModal]);

  return (
    <RemoveLiquidity
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      removeLiquidity={removeLiquidity}
      isLoading={isLoadingPositions}
      isGetWGNOT={isGetWGNOT}
      setIsGetWGNOT={() => setIsGetWGNOT(prev => !prev)}
    />
  );
};

export default RemoveLiquidityContainer;
