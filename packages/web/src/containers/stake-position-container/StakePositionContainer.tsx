import StakePosition from "@components/stake/stake-position/StakePosition";
import { usePositionData } from "@hooks/common/use-position-data";
import { useStakePositionModal } from "@hooks/earn/use-stake-position-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import useCustomRouter from "@hooks/common/use-custom-router";
import React, { useCallback, useState, useMemo } from "react";
import { useGetPoolDetailByPath } from "@query/pools";

const StakePositionContainer: React.FC = () => {
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const { connected, connectAccount } = useWallet();
  const {
    positions: allPositionData,
    isFetchedPosition: isFetched,
    loading: isLoadingAllPositions,
  } = usePositionData({
    isClosed: false,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });
  const { data: poolDetail } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });
  const [checkedList, setCheckedList] = useState<string[]>([]);
  // For this domain only show `closed = false` && `staked = false` position
  const unstakedPositions = useMemo(
    () => allPositionData.filter(item => !item.staked),
    [allPositionData],
  );

  const { openModal } = useStakePositionModal({
    positions: unstakedPositions,
    selectedIds: checkedList,
  });

  const checkedAll = useMemo(() => {
    if (unstakedPositions.length === 0) {
      return false;
    }
    return unstakedPositions.length === checkedList.length;
  }, [unstakedPositions.length, checkedList.length]);

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
    const checkedList = unstakedPositions.map(
      unstakedPosition => unstakedPosition.id,
    );
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
      pool={poolDetail}
    />
  );
};

export default StakePositionContainer;
