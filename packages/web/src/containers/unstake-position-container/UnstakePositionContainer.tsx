import React, { useCallback, useEffect, useMemo, useState } from "react";
import UnstakeLiquidity from "@components/unstake/unstake-liquidity/UnstakeLiquidity";
import { useUnstakePositionModal } from "@hooks/earn/use-unstake-position-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePositionData } from "@hooks/common/use-position-data";
import { useLoading } from "@hooks/common/use-loading";

const UnstakeLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const { account } = useWallet();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { getPositionsByPoolId, loadingPositionById } = usePositionData();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { openModal } = useUnstakePositionModal({
    positions,
    selectedIds: checkedList,
  });
  const { isLoading } = useLoading();

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

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (account?.address) {
      setPositions(getPositionsByPoolId(poolPath).filter(item => item.staked));
    }
  }, [account?.address, getPositionsByPoolId, router.query]);

  const handleConfirmUnstake = useCallback(() => {
    openModal();
  }, [openModal]);

  return (
    <UnstakeLiquidity
      stakedPositions={positions}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      onCheckedAll={onCheckedAll}
      checkedAll={checkedAll}
      handleConfirmUnstake={handleConfirmUnstake}
      isLoading={isLoading || loadingPositionById}
    />
  );
};

export default UnstakeLiquidityContainer;
