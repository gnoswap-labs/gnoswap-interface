import React, { useCallback, useMemo, useState } from "react";
import BigNumber from "bignumber.js";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";

import RemoveLiquidity from "../../components/remove-liquidity/RemoveLiquidity";
import { useRemovePositionModal } from "@hooks/pool/ui/use-remove-position-modal";

const RemoveLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  const { connected } = useWallet();
  const [isGetWGNOT, setIsGetWGNOT] = useState(false);
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const [checkedList, setCheckedList] = useState<number[]>(positionId ? [Number(positionId)] : []);
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

  const stakedPositions = useMemo(() => {
    if (!connected) return [];
    return positions.filter(position => position.poolPath === poolPath && position.staked);
  }, [positions, connected]);

  const unstakedPositions = useMemo(() => {
    if (!connected) return [];
    return positions.filter(position => position.poolPath === poolPath && !position.staked);
  }, [positions, connected, poolPath]);

  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position => checkedList.includes(position.id));
  }, [checkedList, unstakedPositions]);

  const calculatedLiquidity = useMemo(() => {
    return selectedPositions
      .reduce((total, position) => {
        return total.plus(BigNumber(position.liquidity.toString()));
      }, BigNumber(0))
      .toString();
  }, [selectedPositions]);

  const { openModal } = useRemovePositionModal({
    positions: positions,
    calculatedLiquidity,
    selectedIds: checkedList,
    isGetWGNOT,
    refetchPositions: async () => {
      await refetchPositions();
    },
  });

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
