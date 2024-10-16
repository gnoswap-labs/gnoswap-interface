import React, { useCallback, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import { useWallet } from "@hooks/wallet/use-wallet";

import RemoveLiquidity from "../../components/remove-liquidity/RemoveLiquidity";
import { useRemovePositionModal } from "../../hooks/use-remove-position-modal";

const RemoveLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  const { connected } = useWallet();
  const [isGetWGNOT, setIsGetWGNOT] = useState(false);
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const [checkedList, setCheckedList] = useState<number[]>(
    positionId ? [Number(positionId)] : [],
  );
  const {
    positions,
    loading: isLoadingPositions,
    refetch: refetchPositions,
  } = usePositionData({
    isClosed: false,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const { openModal } = useRemovePositionModal({
    positions: positions,
    selectedIds: checkedList,
    isGetWGNOT,
    refetchPositions: async () => {
      await refetchPositions();
    },
  });

  const stakedPositions = useMemo(() => {
    if (!connected) return [];
    return positions.filter(position => position.staked);
  }, [positions, connected]);

  const unstakedPositions = useMemo(() => {
    if (!connected) return [];
    return positions.filter(position => !position.staked);
  }, [positions, connected]);

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
