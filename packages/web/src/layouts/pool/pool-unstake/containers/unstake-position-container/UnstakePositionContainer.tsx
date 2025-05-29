import React, { useCallback, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";

import UnstakeLiquidity from "../../components/unstake-liquidity/UnstakeLiquidity";
import { useUnstakePositionModal } from "@hooks/pool/ui/use-unstake-position-modal";
import { makeDisplayTokenAmount } from "@utils/token-utils";

const UnstakeLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const {
    positions: allPosition,
    loading: isPositionsLoading,
    refetch: refetchPositions,
  } = usePositionData({
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

  const [checkedList, setCheckedList] = useState<number[]>(positionId ? [Number(positionId)] : []);
  const [isGetWGNOT, setIsGetWGNOT] = useState(false);

  const stakedPositions = useMemo(() => positionList.filter(item => item.staked), [positionList]);

  const { openModal } = useUnstakePositionModal({
    positions: stakedPositions,
    selectedIds: checkedList,
    isGetWGNOT: isGetWGNOT,
    refetchPositions: async () => {
      await refetchPositions();
    },
  });

  const checkedAll = useMemo(() => {
    if (stakedPositions.length === 0) {
      return false;
    }
    return stakedPositions.length === checkedList.length;
  }, [stakedPositions, checkedList]);

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
    const checkedList = stakedPositions.map(stakedPosition => stakedPosition.id);
    setCheckedList(checkedList);
  }, [checkedAll, stakedPositions]);

  const handleConfirmUnstake = useCallback(() => {
    openModal();
  }, [openModal]);

  return (
    <UnstakeLiquidity
      stakedPositions={stakedPositions}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      handleConfirmUnstake={handleConfirmUnstake}
      isLoading={isPositionsLoading}
      isGetWGNOT={isGetWGNOT}
      setIsGetWGNOT={() => setIsGetWGNOT(prev => !prev)}
    />
  );
};

export default UnstakeLiquidityContainer;
