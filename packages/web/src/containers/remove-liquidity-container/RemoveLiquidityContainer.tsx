import RemoveLiquidity from "@components/remove/remove-liquidity/RemoveLiquidity";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRemovePositionModal } from "@hooks/earn/use-remove-position-modal";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePositionData } from "@hooks/common/use-position-data";
import { useRouter } from "next/router";
import { useWallet } from "@hooks/wallet/use-wallet";

const RemoveLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const { account } = useWallet();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { getPositionsByPoolId } = usePositionData();
  const { openModal } = useRemovePositionModal({
    positions,
    selectedIds: checkedList,
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

  const removeLiquidity = useCallback(() => {
    openModal();
  }, [openModal]);

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (account?.address) {
      setPositions(getPositionsByPoolId(poolPath));
    } else {
      setPositions([]);
    }
  }, [account?.address, getPositionsByPoolId, router.query]);

  return (
    <RemoveLiquidity
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      removeLiquidity={removeLiquidity}
    />
  );
};

export default RemoveLiquidityContainer;
