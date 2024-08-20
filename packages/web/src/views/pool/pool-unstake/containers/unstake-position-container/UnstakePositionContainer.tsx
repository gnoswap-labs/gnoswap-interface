import React, { useCallback, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";

import UnstakeLiquidity from "../../components/unstake-liquidity/UnstakeLiquidity";
import { useUnstakePositionModal } from "../../hooks/use-unstake-position-modal";

const UnstakeLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const { positions: allPosition, loading: isPositionsLoading } =
    usePositionData({
      poolPath,
      queryOption: {
        enabled: !!poolPath,
      },
    });
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isGetWGNOT, setIsGetWGNOT] = useState(false);

  const stakedPositions = useMemo(
    () => allPosition.filter(item => item.staked),
    [allPosition],
  );

  const { openModal } = useUnstakePositionModal({
    positions: stakedPositions,
    selectedIds: checkedList,
    isGetWGNOT: isGetWGNOT,
  });

  const checkedAll = useMemo(() => {
    if (stakedPositions.length === 0) {
      return false;
    }
    return stakedPositions.length === checkedList.length;
  }, [stakedPositions, checkedList]);

  const onCheckedItem = useCallback(
    (isChecked: boolean, path: string) => {
      if (isChecked) {
        return setCheckedList((prev: string[]) => [...prev, path]);
      }
      if (!isChecked && checkedList.includes(path)) {
        return setCheckedList(checkedList.filter(el => el !== path));
      }
    },
    [checkedList],
  );

  const onCheckedAll = useCallback(() => {
    if (checkedAll) {
      setCheckedList([]);
      return;
    }
    const checkedList = stakedPositions.map(
      stakedPosition => stakedPosition.id,
    );
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
