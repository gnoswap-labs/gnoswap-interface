import React, { useCallback, useMemo, useState } from "react";
import UnstakeLiquidity from "@components/unstake/unstake-liquidity/UnstakeLiquidity";
import { useUnstakePositionModal } from "@hooks/earn/use-unstake-position-modal";
import useRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import { encryptId } from "@utils/common";

const UnstakeLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const poolPath = (router.query["pool-path"] ?? "") as string;
  const { positions: allPosition, loading: isPositionsLoading } = usePositionData({
    poolPath: encryptId(poolPath),
    queryOption: {
      enabled: !!poolPath
    }
  });
  const [checkedList, setCheckedList] = useState<string[]>([]);

  const stakedPositions = useMemo(() => allPosition.filter(item => item.staked), [allPosition]);

  const { openModal } = useUnstakePositionModal({
    positions: stakedPositions,
    selectedIds: checkedList,
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
