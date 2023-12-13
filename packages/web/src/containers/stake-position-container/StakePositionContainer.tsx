import StakePosition from "@components/stake/stake-position/StakePosition";
import { usePositionData } from "@hooks/common/use-position-data";
import { useSubmitPositionModal } from "@hooks/earn/use-submit-position-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useRouter } from "next/router";
import React, { useCallback, useState, useEffect, useMemo } from "react";

const StakePositionContainer: React.FC = () => {
  const router = useRouter();
  const { account } = useWallet();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { getPositionsByPoolId } = usePositionData();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { openModal } = useSubmitPositionModal({
    positions,
    selectedIds: checkedList
  });

  const stakedPositions = useMemo(() => {
    return positions.filter(position => position.staked);
  }, [positions]);

  const unstakedPositions = useMemo(() => {
    return positions.filter(position => !position.staked);
  }, [positions]);

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

  const submitPosition = useCallback(() => {
    openModal();
  }, [openModal]);

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (account?.address) {
      getPositionsByPoolId(poolPath).then(setPositions);
    }
  }, [account?.address, getPositionsByPoolId, router.query]);

  return (
    <StakePosition
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      submitPosition={submitPosition}
    />
  );
};

export default StakePositionContainer;
