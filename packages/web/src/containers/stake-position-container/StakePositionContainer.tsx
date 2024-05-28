import StakePosition from "@components/stake/stake-position/StakePosition";
import { useLoading } from "@hooks/common/use-loading";
import { usePositionData } from "@hooks/common/use-position-data";
import { useSubmitPositionModal } from "@hooks/earn/use-submit-position-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import useRouter from "@hooks/common/use-custom-router";
import React, { useCallback, useState, useEffect, useMemo } from "react";

const StakePositionContainer: React.FC = () => {
  const router = useRouter();
  const { account, connected, connectAccount } = useWallet();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const {
    positions: allPositionData,
    getPositionsByPoolId,
    isFetchedPosition: isFetched,
    loadingPositionById,
  } = usePositionData();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { openModal } = useSubmitPositionModal({
    positions: positions,
    selectedIds: checkedList,
  });
  const { isLoading: isLoadingCommon } = useLoading();

  const checkedAll = useMemo(() => {
    if (positions.length === 0) {
      return false;
    }
    return positions.length === checkedList.length;
  }, [positions, checkedList]);

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
    const checkedList = positions.map(position => position.id);
    setCheckedList(checkedList);
  }, [checkedAll, positions]);

  const submitPosition = useCallback(() => {
    if (!connected) {
      connectAccount();
    } else {
      openModal();
    }
  }, [openModal, connected, connectAccount]);

  useEffect(() => {
    // For this domain only show `closed = false` && `staked = false` position
    const poolPath = router.query["pool-path"] as string;
    if (!account?.address) {
      return;
    }
    if (!poolPath) {
      setPositions(
        allPositionData.filter(item => !item.staked && !item.closed),
      );
      return;
    }
    setPositions(
      getPositionsByPoolId(poolPath).filter(
        item => !item.staked && !item.closed,
      ),
    );
  }, [account?.address, getPositionsByPoolId, allPositionData, router.query]);

  const isEmpty = useMemo(() => {
    if (!connected) return true;
    return positions.length === 0 && isFetched;
  }, [connected, isFetched, positions]);

  return (
    <StakePosition
      unstakedPositions={positions}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      submitPosition={submitPosition}
      isEmpty={isEmpty}
      isLoading={isLoadingCommon || loadingPositionById}
      connected={connected}
    />
  );
};

export default StakePositionContainer;
