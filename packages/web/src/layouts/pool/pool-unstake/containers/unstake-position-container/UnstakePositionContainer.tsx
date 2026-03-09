import React, { useCallback, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionConverter } from "@services/converters/position";

import { useUnstakePositionModal } from "@hooks/pool/ui/use-unstake-position-modal";
import UnstakeLiquidity from "../../components/unstake-liquidity/UnstakeLiquidity";

const UnstakeLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const { positions: allPosition, loading: isPositionsLoading, refetch: refetchPositions } = usePositionData({
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const positionList: PoolPositionModel[] = useMemo(() => {
    return PositionConverter.convertPositions(allPosition);
  }, [allPosition]);

  const [checkedList, setCheckedList] = useState<number[]>(positionId ? [Number(positionId)] : []);

  const stakedPositions = useMemo(() => positionList.filter(item => item.staked), [positionList]);

  const { openModal } = useUnstakePositionModal({
    positions: stakedPositions,
    selectedIds: checkedList,
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
    />
  );
};

export default UnstakeLiquidityContainer;
