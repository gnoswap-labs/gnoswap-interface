import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionConverter } from "@services/converters/position";

import { useRemovePositionModal } from "@hooks/pool/ui/use-remove-position-modal";
import RemoveLiquidity from "../../components/remove-liquidity/RemoveLiquidity";

const RemoveLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  const { connected } = useWallet();
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const [checkedList, setCheckedList] = useState<number[]>(positionId ? [Number(positionId)] : []);
  const { positions: allPosition, loading: isLoadingPositions, refetch: refetchPositions } = usePositionData({
    isClosed: false,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const positionList: PoolPositionModel[] = useMemo(() => {
    return PositionConverter.convertPositions(allPosition);
  }, [allPosition]);

  const stakedPositions = useMemo(() => {
    if (!connected) return [];
    return positionList.filter(position => position.poolPath === poolPath && position.staked);
  }, [positionList, connected, poolPath]);

  const unstakedPositions = useMemo(() => {
    if (!connected) return [];
    return positionList.filter(position => position.poolPath === poolPath && !position.staked);
  }, [positionList, connected, poolPath]);

  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position => checkedList.includes(position.id));
  }, [checkedList, unstakedPositions]);

  const positionLiquidities = useMemo(() => {
    const liquidityMap: { [key: string]: BigNumber } = {};

    selectedPositions.forEach(position => {
      liquidityMap[position.lpTokenId] = BigNumber(position.liquidity.toString());
    });
    return liquidityMap;
  }, [selectedPositions]);

  const { openModal } = useRemovePositionModal({
    positions: positionList,
    positionLiquidities,
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
    />
  );
};

export default RemoveLiquidityContainer;
