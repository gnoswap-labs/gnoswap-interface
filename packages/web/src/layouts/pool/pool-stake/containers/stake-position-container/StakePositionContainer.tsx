import React, { useCallback, useMemo, useState } from "react";

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

  const { openModal } = useStakePositionModal({
    positions: unstakedPositions,
    selectedIds: checkedList,
    refetchPositions: async () => {
      await refetchPositions();
    },
  });

  const checkedAll = useMemo(() => {
    if (unstakedPositions.length === 0) {
      return false;
    }
    return unstakedPositions.length === checkedList.length;
  }, [unstakedPositions.length, checkedList.length]);

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
    const checkedList = unstakedPositions.map(unstakedPosition => unstakedPosition.id);
    setCheckedList(checkedList);
  }, [checkedAll, unstakedPositions]);

  const submitPosition = useCallback(() => {
    if (!connected) {
      connectAccount();
    } else {
      openModal();
    }
  }, [openModal, connected, connectAccount]);

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
