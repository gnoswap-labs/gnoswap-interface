import StakePosition from "@components/stake/stake-position/StakePosition";
import { useLoading } from "@hooks/common/use-loading";
import { usePositionData } from "@hooks/common/use-position-data";
import { useSubmitPositionModal } from "@hooks/earn/use-submit-position-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useRouter } from "next/router";
import React, { useCallback, useState, useEffect, useMemo } from "react";

const StakePositionContainer: React.FC = () => {
  const router = useRouter();
  const { account, connected, connectAccount } = useWallet();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { positions: positionData, getPositionsByPoolId, isFetchedPosition: isFetched, loadingPositionById } = usePositionData();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { openModal } = useSubmitPositionModal({
    positions: positions.filter(item => !item.closed),
    selectedIds: checkedList
  });
  const { isLoadingCommon } = useLoading();

  // const stakedPositions = useMemo(() => {
  //   if (!connected) return [];
  //   return positions.filter(position => position.staked);
  // }, [positions, connected]);

  const unstakedPositions = useMemo(() => {
    if (!connected) return [];
    return positions.filter(position => !position.staked && !position.closed);
  }, [positions, connected]);
  console.log("🚀 ~ unstakedPositions ~ unstakedPositions:", unstakedPositions);

  const checkedAll = useMemo(() => {
    if (unstakedPositions.length === 0) {
      return false;
    }
    return unstakedPositions.length === checkedList.length;
  }, [unstakedPositions, checkedList]);

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
    const checkedList = unstakedPositions.map(position => position.id);
    setCheckedList(checkedList);
  }, [checkedAll, unstakedPositions]);
  console.log("🚀 ~ onCheckedAll ~ checkedList:", checkedList);

  const submitPosition = useCallback(() => {
    if (!connected) {
      connectAccount();
    } else {
      openModal();
    }

  }, [openModal, connected, connectAccount]);

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!account?.address) {
      return;
    }
    if (!poolPath) {
      setPositions(positionData.filter(item => !item.staked));
      return;
    }
    setPositions(getPositionsByPoolId(poolPath));
  }, [account?.address, getPositionsByPoolId, router.query]);
  const isEmpty = useMemo(() => {
    if (!connected) return true;
    return unstakedPositions.filter(item => item.closed === false).length === 0 && isFetched;
  }, [connected, isFetched, unstakedPositions]);

  return (
    <StakePosition
      // stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
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
