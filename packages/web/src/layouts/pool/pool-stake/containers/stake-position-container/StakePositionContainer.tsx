import React, { useCallback, useEffect, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionConverter } from "@services/converters/position";

import { useStakePositionModal } from "@hooks/pool/ui/use-stake-position-modal";
import StakePosition from "../../components/stake-position/StakePosition";

const StakePositionContainer: React.FC = () => {
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const { connected, connectAccount } = useWallet();
  const {
    positions: allPosition,
    isFetchedPosition: isFetched,
    loading: isLoadingAllPositions,
    refetch: refetchPositions,
  } = usePositionData({
    isClosed: false,
    poolPath: poolPath || undefined,
    withAvailableStake: true,
  });
  const [checkedList, setCheckedList] = useState<number[]>(positionId ? [Number(positionId)] : []);

  const positionList: PoolPositionModel[] = useMemo(() => {
    return PositionConverter.convertPositions(allPosition);
  }, [allPosition]);

  // For this domain only show `closed = false` && `staked = false` position
  const unstakedPositions = useMemo(() => {
    const baseList = positionList.filter(position => !position.staked);
    if (!poolPath) {
      return baseList;
    }
    return baseList.filter(position => position.poolPath === poolPath);
  }, [positionList, poolPath]);

  // Drop ids no longer present in the current unstakedPositions list.
  useEffect(() => {
    setCheckedList(prev => {
      const validIds = new Set(unstakedPositions.map(position => position.id));
      const next = prev.filter(id => validIds.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [unstakedPositions]);

  // Source of truth for what will be staked. The modal/toast aggregates token amounts
  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position => checkedList.includes(position.id));
  }, [unstakedPositions, checkedList]);

  // Enforce same-pool selection: the first selected position fixes the active pool,
  // and any item from a different pool is non-selectable until the user clears.
  const activePoolPath = useMemo(() => {
    return selectedPositions[0]?.poolPath ?? null;
  }, [selectedPositions]);

  const { openModal } = useStakePositionModal({
    positions: selectedPositions,
    selectedIds: checkedList,
    refetchPositions: async () => {
      await refetchPositions();
    },
  });

  const selectablePositions = useMemo(() => {
    if (!activePoolPath) {
      return unstakedPositions;
    }
    return unstakedPositions.filter(position => position.poolPath === activePoolPath);
  }, [unstakedPositions, activePoolPath]);

  const checkedAll = useMemo(() => {
    if (selectablePositions.length === 0) {
      return false;
    }
    return selectablePositions.length === selectedPositions.length;
  }, [selectablePositions.length, selectedPositions.length]);

  const onCheckedItem = useCallback(
    (isChecked: boolean, id: number) => {
      if (isChecked) {
        const target = unstakedPositions.find(position => position.id === id);
        if (!target) return;
        if (activePoolPath && target.poolPath !== activePoolPath) return;
        return setCheckedList(prev => (prev.includes(id) ? prev : [...prev, id]));
      }
      return setCheckedList(prev => prev.filter(el => el !== id));
    },
    [unstakedPositions, activePoolPath],
  );

  const onCheckedAll = useCallback(() => {
    if (checkedAll) {
      setCheckedList([]);
      return;
    }
    setCheckedList(selectablePositions.map(position => position.id));
  }, [checkedAll, selectablePositions]);

  const submitPosition = useCallback(() => {
    if (!connected) {
      connectAccount();
      return;
    }
    if (selectedPositions.length === 0) {
      return;
    }
    openModal();
  }, [openModal, connected, connectAccount, selectedPositions.length]);

  const isEmpty = useMemo(() => {
    if (!connected) return true;
    return unstakedPositions.length === 0 && isFetched;
  }, [connected, isFetched, unstakedPositions.length]);

  return (
    <StakePosition
      unstakedPositions={unstakedPositions}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      submitPosition={submitPosition}
      isEmpty={isEmpty}
      isLoading={isLoadingAllPositions}
      connected={connected}
    />
  );
};

export default StakePositionContainer;
