import RemoveLiquidity from "@components/remove/remove-liquidity/RemoveLiquidity";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRemovePositionModal } from "@hooks/earn/use-remove-position-modal";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePositionData } from "@hooks/common/use-position-data";
import useRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useLoading } from "@hooks/common/use-loading";

const RemoveLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const { account, connected } = useWallet();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { getPositionsByPoolId, loadingPositionById } = usePositionData();
  const { openModal } = useRemovePositionModal({
    positions: positions,
    selectedIds: checkedList,
  });
  const { isLoading: isLoadingCommon } = useLoading();

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
    // For this domain only show `closed = false` position
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (account?.address) {
      const postions_ = getPositionsByPoolId(poolPath).filter(
        item => !item.closed,
      );
      setPositions(postions_);
      return;
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
      isLoading={isLoadingCommon || loadingPositionById}
    />
  );
};

export default RemoveLiquidityContainer;
